import { Router, type Response } from 'express';
import pool from '../db.js';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get user's wardrobe items
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { category } = req.query;

    let query = 'SELECT * FROM wardrobe_items WHERE user_id = $1';
    const params: any[] = [userId];

    if (category) {
      query += ' AND category = $2';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get wardrobe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new item to wardrobe
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, category, color, brand, season, style_tags, image_urls, is_public } = req.body;

    if (!name || !category) {
       res.status(400).json({ error: 'Name and category are required' });
       return;
    }

    const result = await pool.query(
      `INSERT INTO wardrobe_items 
      (user_id, name, category, color, brand, season, style_tags, image_urls, is_public) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [userId, name, category, color, brand, season, style_tags, image_urls, is_public ?? true]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add wardrobe item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete item
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const itemId = req.params.id;

    const result = await pool.query(
      'DELETE FROM wardrobe_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [itemId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Item not found or unauthorized' });
      return;
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete wardrobe item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Public Wardrobe of a User
router.get('/users/:userId', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const result = await pool.query(
            'SELECT * FROM wardrobe_items WHERE user_id = $1 AND is_public = true ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Get public wardrobe error", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
