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
    ALTER TABLE "Booking" 
      ADD COLUMN IF NOT EXISTS "cancellationReason" TEXT,
      ADD COLUMN IF NOT EXISTS "cancellationNotes" TEXT,
      ADD COLUMN IF NOT EXISTS "refundDecision" TEXT,
      ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3);
  `;

  await pool.query(query);
  console.log('Successfully added cancellation columns to Booking table!');
  await pool.end();
}

update().catch(err => {
  console.error('Failed to update table:', err);
  process.exit(1);
});
