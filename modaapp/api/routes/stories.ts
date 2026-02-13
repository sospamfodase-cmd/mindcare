import { Router, type Response } from 'express';
import pool from '../db.js';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// Create Story
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { image_url } = req.body;

    if (!image_url) {
       res.status(400).json({ error: 'Image URL is required' });
       return;
    }

    const result = await pool.query(
      `INSERT INTO stories (user_id, image_url) 
       VALUES ($1, $2) 
       RETURNING *`,
      [userId, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Active Stories Feed
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // Get active stories from followed users + own stories
    // Grouped by user
    const result = await pool.query(`
      SELECT 
        u.id as user_id, 
        u.username, 
        u.avatar_url,
        json_agg(
          json_build_object(
            'id', s.id, 
            'image_url', s.image_url, 
            'created_at', s.created_at
          ) ORDER BY s.created_at ASC
        ) as stories
      FROM stories s
      JOIN users u ON s.user_id = u.id
      WHERE s.expires_at > NOW()
      GROUP BY u.id
      ORDER BY MAX(s.created_at) DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
