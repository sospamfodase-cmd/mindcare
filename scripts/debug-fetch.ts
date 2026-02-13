import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

// Mock DB connection for script execution context
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}
const sql = neon(connectionString);

async function testFetch() {
  try {
    console.log('Fetching posts...');
    const posts = await sql`
        SELECT id, title, excerpt, date, category, image, author, created_at 
        FROM posts 
        ORDER BY created_at DESC
      `;
    console.log(`Found ${posts.length} posts.`);
    if (posts.length > 0) {
      console.log('Sample post keys:', Object.keys(posts[0]));
    }
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

testFetch();
