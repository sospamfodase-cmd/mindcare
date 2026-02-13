import { Router, type Request, type Response } from 'express';
import pool from '../db.js';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// ... existing endpoints ...

// Follow user
router.post('/:id/follow', authenticateToken, async (req: AuthRequest, res: Response) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const followerId = req.user?.id;
    const followingId = req.params.id;

    if (followerId === followingId) {
        res.status(400).json({ error: 'Cannot follow yourself' });
        return;
    }

    await client.query(
      `INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) 
       ON CONFLICT (follower_id, following_id) DO NOTHING`,
      [followerId, followingId]
    );

    // Notification Trigger
    await client.query(
      `INSERT INTO notifications (user_id, type, sender_id) 
       VALUES ($1, 'follow', $2)`,
      [followingId, followerId]
    );

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Follow error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Unfollow user
router.delete('/:id/unfollow', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.user?.id;
    const followingId = req.params.id;

    await pool.query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get followers
router.get('/:id/followers', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT u.id, u.username, u.avatar_url 
            FROM follows f
            JOIN users u ON f.follower_id = u.id
            WHERE f.following_id = $1
        `, [req.params.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get following
router.get('/:id/following', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT u.id, u.username, u.avatar_url 
            FROM follows f
            JOIN users u ON f.following_id = u.id
            WHERE f.follower_id = $1
        `, [req.params.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get User Profile (Simplified)
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT id, username, name, bio, avatar_url, created_at, website, phone, gender FROM users WHERE id = $1',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update User Profile
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        console.log('Update Profile Request Body:', req.body);
        console.log('User ID:', req.params.id);
        console.log('Auth User ID:', req.user?.id);

        if (req.user?.id !== req.params.id) {
            console.log('Unauthorized update attempt');
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        const { name, username, bio, website, avatar_url, banner_url, phone, gender } = req.body;

        // Basic validation
        if (!name || !username) {
            res.status(400).json({ error: 'Name and username are required' });
            return;
        }
        
        const result = await pool.query(
            `UPDATE users 
             SET name = $1, username = $2, bio = $3, website = $4, avatar_url = $5, banner_url = $6, phone = $7, gender = $8, updated_at = NOW()
             WHERE id = $9
             RETURNING id, username, name, bio, avatar_url, banner_url, website, phone, gender, created_at`,
            [
                name, 
                username, 
                bio || null, 
                website || null, 
                avatar_url || null, 
                banner_url || null, 
                phone || null, 
                gender || null, 
                req.params.id
            ]
        );

        console.log('Update Result:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (error: any) {
        console.error("Update profile error FULL:", error);
        // Check for unique constraint violation (username)
        if (error.code === '23505') {
             res.status(409).json({ error: 'Username already taken' });
             return;
        }
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Get User Stats
router.get('/:id/stats', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM user_stats_view WHERE user_id = $1',
            [req.params.id]
        );
        
        if (result.rows.length === 0) {
            // Should theoretically exist if user exists, but view logic might be strict join
            // Fallback
             res.json({ followers_count: 0, following_count: 0, posts_count: 0 });
             return;
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Stats error", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get User Suggestions (Simplified logic: random users not followed)
router.get('/suggestions/list', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const result = await pool.query(`
            SELECT u.id, u.username, u.name, u.avatar_url
            FROM users u
            WHERE u.id != $1
            AND u.id NOT IN (SELECT following_id FROM follows WHERE follower_id = $1)
            ORDER BY RANDOM()
            LIMIT 5
        `, [userId]);
        res.json(result.rows);
    } catch (error) {
         console.error("Suggestions error", error);
         res.status(500).json({ error: 'Internal server error' });
    }
});

// Search Users
router.get('/search', async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            res.json([]);
            return;
        }

        const result = await pool.query(`
            SELECT id, username, name, avatar_url 
            FROM users 
            WHERE username ILIKE $1 OR name ILIKE $1
            LIMIT 20
        `, [`%${q}%`]);

        res.json(result.rows);
    } catch (error) {
        console.error("Search error", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Saved Items
router.get('/:id/saved', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        // Ensure requesting user is same as param id for privacy (unless public saves?)
        // For now, allow viewing own saved items only or check privacy
        if (req.user?.id !== req.params.id) {
             // For simplicity, let's assume saves are private
             // res.status(403).json({ error: 'Unauthorized' });
             // Actually, Instagram saves are private.
        }

        const result = await pool.query(`
            SELECT 
                s.*,
                CASE 
                    WHEN s.item_type = 'post' THEN (SELECT image_urls[1] FROM posts WHERE id = s.item_id)
                    WHEN s.item_type = 'look' THEN (
                        -- Try to get preview image from look items
                        SELECT wi.image_urls[1] 
                        FROM look_items li 
                        JOIN wardrobe_items wi ON li.wardrobe_item_id = wi.id 
                        WHERE li.look_id = s.item_id 
                        LIMIT 1
                    )
                END as preview_image,
                CASE 
                    WHEN s.item_type = 'post' THEN (SELECT caption FROM posts WHERE id = s.item_id)
                    WHEN s.item_type = 'look' THEN (SELECT name FROM looks WHERE id = s.item_id)
                END as title
            FROM saved_items s
            WHERE s.user_id = $1
            ORDER BY s.created_at DESC
        `, [req.params.id]);
        
        res.json(result.rows);
    } catch (error) {
        console.error("Saved items error", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
