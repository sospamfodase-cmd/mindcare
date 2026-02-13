import { Router, type Response } from 'express';
import pool from '../db.js';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get personalized feed
router.get('/feed', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // Architecture: "Collaborative filtering + Content-based"
    // Implementation: Simplified SQL query prioritizing recent posts + popular posts
    
    const result = await pool.query(`
      SELECT p.*, u.username, u.avatar_url,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
        (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.visibility = 'public'
      ORDER BY 
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) DESC, 
        p.created_at DESC
      LIMIT 20
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Rec feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get similar looks
router.get('/similar/:lookId', async (req: Request, res: Response) => {
    // Architecture: "Visual similarity (ML)"
    // Implementation: Return random looks for now as we don't have ML engine
    try {
        const result = await pool.query(`
            SELECT * FROM looks 
            WHERE is_public = true 
            ORDER BY RANDOM() 
            LIMIT 5
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Trending
router.get('/trending', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT p.*, 
            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count
            FROM posts p
            WHERE p.created_at > NOW() - INTERVAL '7 days'
            ORDER BY likes_count DESC
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
