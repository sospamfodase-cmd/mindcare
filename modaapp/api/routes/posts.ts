import { Router, type Response } from 'express';
import pool from '../db.js';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get Feed (Public posts + Followers)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    // Basic feed: all public posts
    // TODO: Filter by following if user is logged in
    const result = await pool.query(`
      SELECT p.*, u.username, u.avatar_url,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
        (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.visibility = 'public'
      ORDER BY p.created_at DESC
      LIMIT 50
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Post
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { caption, image_urls, linked_look_id, linked_items, visibility } = req.body;

    if (!image_urls || image_urls.length === 0) {
       res.status(400).json({ error: 'At least one image is required' });
       return;
    }

    const result = await pool.query(
      `INSERT INTO posts (user_id, caption, image_urls, linked_look_id, linked_items, visibility) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [userId, caption, image_urls, linked_look_id, linked_items, visibility || 'public']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Single Post
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT p.*, u.username, u.avatar_url,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
                (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
