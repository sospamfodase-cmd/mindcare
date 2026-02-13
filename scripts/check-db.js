import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

// Load connection string from env
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL not found in environment');
  process.exit(1);
}

const sql = neon(connectionString);

async function checkDatabase() {
  console.log('Connecting to Neon database...');
  try {
    // 1. Check version
    const version = await sql`SELECT version()`;
    console.log('✅ Connected! Database version:', version[0].version);

    // 2. Check table existence
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('\n📊 Tables found:', tables.map(t => t.table_name));

    // 3. List posts
    const posts = await sql`SELECT id, title, created_at FROM posts ORDER BY created_at DESC`;
    console.log(`\n📝 Found ${posts.length} posts:`);
    posts.forEach(post => {
      console.log(`- [${post.id}] ${post.title} (${post.created_at})`);
    });

  } catch (error) {
    console.error('❌ Error connecting to database:', error);
  }
}

checkDatabase();
