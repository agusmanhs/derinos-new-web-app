import 'dotenv/config';
import { Pool } from 'pg';

async function update() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  console.log('Connecting to PostgreSQL...');

  const query = `
    ALTER TABLE "Sale" 
      ADD COLUMN IF NOT EXISTS "notes" TEXT;
  `;

  await pool.query(query);
  console.log('Successfully added notes column to Sale table!');
  await pool.end();
}

update().catch(err => {
  console.error('Failed to update table:', err);
  process.exit(1);
});
