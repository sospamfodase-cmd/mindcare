import pool from './db.js';

async function reproMissing() {
  const client = await pool.connect();
  try {
    const userRes = await client.query('SELECT id, username FROM users LIMIT 1');
    const userId = userRes.rows[0].id;
    const username = userRes.rows[0].username;

    console.log('Testing update with missing fields (like frontend)...');
    
    // Simulate what frontend sends (no phone, no gender)
    const bodyFromFrontend = {
      name: 'Frontend Test',
      username: username, // keep same to avoid unique error
      bio: 'Bio from frontend repro',
      website: '',
      avatar_url: '',
      banner_url: ''
      // phone and gender are MISSING
    };

    const { name, bio, website, avatar_url, banner_url, phone, gender } = bodyFromFrontend as any;

    console.log('Destructured values:', {
        name, username, bio, website, avatar_url, banner_url, phone, gender
    });

    const params = [
        name, 
        username, 
        bio || null, 
        website || null, 
        avatar_url || null, 
        banner_url || null, 
        phone || null, 
        gender || null, 
        userId
    ];

    console.log('Params for query:', params);
    
    await client.query(
        `UPDATE users 
         SET name = $1, username = $2, bio = $3, website = $4, avatar_url = $5, banner_url = $6, phone = $7, gender = $8, updated_at = NOW()
         WHERE id = $9
         RETURNING id`,
        params
    );
    console.log('Update successful');

  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

reproMissing();
