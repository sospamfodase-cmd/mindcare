import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runUpdate = async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'updates.sql'), 'utf8');
    await pool.query(sql);
    console.log('Updates applied successfully!');
  } catch (error) {
    console.error('Error applying updates:', error);
  } finally {
    await pool.end();
  }
};

runUpdate();
