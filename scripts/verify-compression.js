import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const sql = neon(connectionString);

async function verifyCompression() {
  console.log('Verifying PDF compression status...');
  try {
    const rows = await sql`
      SELECT 
        id, 
        title, 
        LENGTH(pdf) as pdf_len,
        substring(pdf, 1, 5) as pdf_prefix
      FROM posts
      WHERE pdf IS NOT NULL AND pdf != ''
    `;

    console.log('\nPDF Status:');
    let compressedCount = 0;
    let uncompressedCount = 0;

    rows.forEach(row => {
      const sizeMB = (Number(row.pdf_len) / 1024 / 1024).toFixed(2);
      const isCompressed = row.pdf_prefix === 'GZIP:';
      
      if (isCompressed) compressedCount++;
      else uncompressedCount++;

      console.log(`[${isCompressed ? 'COMPRESSED' : 'RAW'}] ${row.title.substring(0, 30)}...`);
      console.log(`  Size: ${sizeMB} MB`);
      console.log(`  ID: ${row.id}`);
      console.log('-------------------');
    });

    console.log(`\nSummary:`);
    console.log(`Compressed: ${compressedCount}`);
    console.log(`Uncompressed (Legacy): ${uncompressedCount}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

verifyCompression();
