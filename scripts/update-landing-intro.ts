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
    ALTER TABLE "SiteSettings" 
      ADD COLUMN IF NOT EXISTS "introImageMain" TEXT DEFAULT '/mockups/gallery_1.jpg',
      ADD COLUMN IF NOT EXISTS "introImageSecondary" TEXT DEFAULT 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2067&auto=format&fit=crop',
      ADD COLUMN IF NOT EXISTS "yearsExperience" TEXT DEFAULT '15+',
      ADD COLUMN IF NOT EXISTS "completedProjects" TEXT DEFAULT '24';

    UPDATE "SiteSettings"
    SET 
      "introImageMain" = COALESCE("introImageMain", '/mockups/gallery_1.jpg'),
      "introImageSecondary" = COALESCE("introImageSecondary", 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2067&auto=format&fit=crop'),
      "yearsExperience" = COALESCE("yearsExperience", '15+'),
      "completedProjects" = COALESCE("completedProjects", '24')
    WHERE "introImageMain" IS NULL 
       OR "introImageSecondary" IS NULL 
       OR "yearsExperience" IS NULL 
       OR "completedProjects" IS NULL;
  `;

  await pool.query(query);
  console.log('Successfully updated SiteSettings table columns and defaults!');
  await pool.end();
}

update().catch(err => {
  console.error('Failed to update table:', err);
  process.exit(1);
});
