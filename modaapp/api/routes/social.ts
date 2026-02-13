import { Router, type Response } from 'express';
import pool from '../db.js';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// Like a post
router.post('/posts/:id/like', authenticateToken, async (req: AuthRequest, res: Response) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userId = req.user?.id;
    const postId = req.params.id;

    await client.query(
      'INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT (user_id, post_id) DO NOTHING',
      [userId, postId]
    );

    // Notification Trigger (Async simulation)
    const postOwner = await client.query('SELECT user_id FROM posts WHERE id = $1', [postId]);
    if (postOwner.rows.length > 0 && postOwner.rows[0].user_id !== userId) {
      await client.query(
        `INSERT INTO notifications (user_id, type, sender_id, resource_id) 
         VALUES ($1, 'like', $2, $3)`,
        [postOwner.rows[0].user_id, userId, postId]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Like error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Unlike a post
router.delete('/posts/:id/like', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const postId = req.params.id;

    await pool.query(
      'DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Unlike error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Comment on a post
router.post('/posts/:id/comments', authenticateToken, async (req: AuthRequest, res: Response) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userId = req.user?.id;
    const postId = req.params.id;
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Comment text is required' });
      return;
    }

    const result = await client.query(
      'INSERT INTO post_comments (user_id, post_id, text) VALUES ($1, $2, $3) RETURNING *',
      [userId, postId, text]
    );

    // Notification Trigger
    const postOwner = await client.query('SELECT user_id FROM posts WHERE id = $1', [postId]);
    if (postOwner.rows.length > 0 && postOwner.rows[0].user_id !== userId) {
      await client.query(
        `INSERT INTO notifications (user_id, type, sender_id, resource_id) 
         VALUES ($1, 'comment', $2, $3)`,
        [postOwner.rows[0].user_id, userId, postId]
      );
    }

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Get comments for a post
router.get('/posts/:id/comments', async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;

    const result = await pool.query(`
      SELECT c.*, u.username, u.avatar_url 
      FROM post_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
    `, [postId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save Post/Look
router.post('/posts/:id/save', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const itemId = req.params.id;
    const { type } = req.body; // 'post' or 'look'

    await pool.query(
      `INSERT INTO saved_items (user_id, item_id, item_type) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id, item_id, item_type) DO NOTHING`,
      [userId, itemId, type || 'post']
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
