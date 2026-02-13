import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const sql = neon(connectionString);

async function checkSizes() {
  console.log('Checking column sizes...');
  try {
    const rows = await sql`
      SELECT 
        id, 
        title, 
        LENGTH(content) as content_len,
        LENGTH(image) as image_len,
        LENGTH(pdf) as pdf_len,
        array_length(images, 1) as images_count,
        (SELECT SUM(LENGTH(i)) FROM unnest(images) i) as images_total_len
      FROM posts
    `;

    console.log('\nPost Sizes (in bytes):');
    rows.forEach(row => {
      const contentLen = Number(row.content_len) || 0;
      const imageLen = Number(row.image_len) || 0;
      const pdfLen = Number(row.pdf_len) || 0;
      const imagesTotalLen = Number(row.images_total_len) || 0;
      
      const total = contentLen + imageLen + pdfLen + imagesTotalLen;
      
      if (pdfLen > 0) {
        console.log(`ID: ${row.id} | Title: ${row.title}`);
        console.log(`  - PDF Size: ${(pdfLen/1024/1024).toFixed(2)} MB`);
        console.log(`  - Total Post Size: ${(total/1024/1024).toFixed(2)} MB`);
        console.log('-------------------');
      }
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

checkSizes();
