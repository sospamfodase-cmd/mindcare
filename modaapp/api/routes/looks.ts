import { Router, type Response } from 'express';
import pool from '../db.js';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get user's looks
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // Get looks with their items
    const result = await pool.query(`
      SELECT l.*, 
        (SELECT json_agg(wi.*) 
         FROM look_items li 
         JOIN wardrobe_items wi ON li.wardrobe_item_id = wi.id 
         WHERE li.look_id = l.id
        ) as items
      FROM looks l 
      WHERE l.creator_id = $1 
      ORDER BY l.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get looks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new look
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const userId = req.user?.id;
    const { name, description, is_public, items } = req.body; // items is array of wardrobe_item_ids

    if (!name || !items || !Array.isArray(items) || items.length === 0) {
       res.status(400).json({ error: 'Name and at least one item are required' });
       return;
    }

    // 1. Create Look
    const lookResult = await client.query(
      `INSERT INTO looks (creator_id, name, description, is_public) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userId, name, description, is_public ?? true]
    );
    const look = lookResult.rows[0];

    // 2. Add Items to Look
    // For simplicity, we assume all items belong to the user or are public (not checking permissions strictly for now)
    // We also need to fetch item owner to populate item_owner_id
    
    for (const itemId of items) {
      // Get item owner
      const itemRes = await client.query('SELECT user_id FROM wardrobe_items WHERE id = $1', [itemId]);
      if (itemRes.rows.length > 0) {
        const itemOwnerId = itemRes.rows[0].user_id;
        
        await client.query(
          `INSERT INTO look_items (look_id, wardrobe_item_id, item_owner_id) 
           VALUES ($1, $2, $3)`,
          [look.id, itemId, itemOwnerId]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(look);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create look error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Get single look
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT l.*, u.username as creator_name, u.avatar_url as creator_avatar,
        (SELECT json_agg(wi.*) 
         FROM look_items li 
         JOIN wardrobe_items wi ON li.wardrobe_item_id = wi.id 
         WHERE li.look_id = l.id
        ) as items
      FROM looks l 
      JOIN users u ON l.creator_id = u.id
      WHERE l.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Look not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get look error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
