import { neon } from '@neondatabase/serverless';

// Ensure the environment variable is available
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL is not defined. Database functionality will be limited.');
}

export const sql = connectionString 
  ? neon(connectionString, {
      // @ts-ignore - this option exists in the recent version but types might be outdated
      disableWarningInBrowsers: true 
    })
  : (() => {
      console.error('Neon SQL client called without connection string');
      return async () => []; // Fallback empty result
    })() as any;

export async function initDatabase() {
  try {
    // Create posts table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        images TEXT[],
        pdf TEXT,
        author TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create subscribers table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS subscribers (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Add columns if they don't exist (manual migration for dev)
    try {
      await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS images TEXT[]`;
      await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS pdf TEXT`;
    } catch (e) {
      console.log('Columns likely exist or migration error ignored:', e);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}
