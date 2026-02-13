
-- Update Users Table with Profile fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_status VARCHAR(50);

-- Create a view for User Stats (Followers, Following, Posts)
CREATE OR REPLACE VIEW user_stats_view AS
SELECT 
    u.id as user_id,
    (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as followers_count,
    (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
    (SELECT COUNT(*) FROM posts WHERE user_id = u.id) as posts_count
FROM users u;
