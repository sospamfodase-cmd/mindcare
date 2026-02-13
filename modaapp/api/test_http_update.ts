import axios from 'axios';
import pool from './db.js';

async function testHttpUpdate() {
  try {
    console.log('Fetching user for test...');
    const client = await pool.connect();
    const userRes = await client.query('SELECT email, password_hash, id FROM users LIMIT 1');
    client.release();
    pool.end();

    if (userRes.rows.length === 0) {
        console.log('No user found');
        return;
    }

    const user = userRes.rows[0];
    console.log('User found:', user.id);

    // We can't easily get the plain password to login via API unless we reset it or know it.
    // However, I can GENERATE a valid token if I use the same secret.
    // But `jwt` library is needed.
    // Alternatively, I can just create a new user with known password via the register endpoint.

    const testEmail = `test_${Date.now()}@example.com`;
    const testPass = 'password123';
    
    console.log('Registering new user:', testEmail);
    const registerRes = await axios.post('http://localhost:3001/api/auth/register', {
        name: 'Test Http',
        username: `testhttp_${Date.now()}`,
        email: testEmail,
        password: testPass
    });

    const { user: newUser, access_token } = registerRes.data;
    console.log('Registered user:', newUser.id);
    console.log('Token obtained');

    // Now try update
    console.log('Updating profile via HTTP...');
    const updateRes = await axios.put(`http://localhost:3001/api/users/${newUser.id}`, {
        name: 'Updated Name HTTP',
        username: newUser.username,
        bio: 'Updated Bio HTTP',
        // Missing phone, gender, etc.
    }, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });

    console.log('Update HTTP Response:', updateRes.status, updateRes.data);

  } catch (error: any) {
    console.error('HTTP Test Failed:', error.message);
    if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
    }
  }
}

testHttpUpdate();
