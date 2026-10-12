import 'dotenv/config';
import { Pool } from 'pg';

async function setup() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not defined in .env');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  console.log('Connecting to PostgreSQL...');

  const query = `
    CREATE TABLE IF NOT EXISTS "SiteSettings" (
        "id" TEXT NOT NULL,
        "heroTitle" TEXT NOT NULL DEFAULT 'Build Your Future.<br/>Live Beyond Expectations.',
        "heroSubtitle" TEXT NOT NULL DEFAULT 'Developing strategic, high quality modern residences in harmony with nature.',
        "heroImage" TEXT NOT NULL DEFAULT '/mockups/hero_placeholder.jpg',
        "introTitle" TEXT NOT NULL DEFAULT 'Experience Modern Living',
        "introDescription" TEXT NOT NULL DEFAULT 'We design homes that blend aesthetic architecture with sustainable environments.',
        "contactEmail" TEXT,
        "contactPhone" TEXT,
        "contactAddress" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "MasterFacility" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "iconSvg" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "MasterFacility_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "MasterGallery" (
        "id" TEXT NOT NULL,
        "title" TEXT,
        "imageUrl" TEXT NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "MasterGallery_pkey" PRIMARY KEY ("id")
    );
  `;

  await pool.query(query);
  console.log('Tables created or already exist.');

  // Check if SiteSettings has rows
  const settingsRes = await pool.query('SELECT COUNT(*) FROM "SiteSettings"');
  if (parseInt(settingsRes.rows[0].count, 10) === 0) {
    await pool.query(`
      INSERT INTO "SiteSettings" ("id", "heroTitle", "heroSubtitle", "heroImage", "introTitle", "introDescription", "contactEmail", "contactPhone", "contactAddress", "updatedAt")
      VALUES (
        gen_random_uuid(),
        'Build Your Future.<br/>Live Beyond Expectations.',
        'Developing strategic, high quality modern residences in harmony with nature.',
        '/mockups/hero_placeholder.jpg',
        'Experience Modern Living',
        'We design homes that blend aesthetic architecture with sustainable environments. Our commitment is to provide the best living spaces for you and your family.',
        'info@derinos.com',
        '+62 812 3456 7890',
        'Jl. Sudirman No.1, Jakarta',
        CURRENT_TIMESTAMP
      );
    `);
    console.log('Seeded SiteSettings.');
  }

  // Check if MasterFacility has rows
  const facRes = await pool.query('SELECT COUNT(*) FROM "MasterFacility"');
  if (parseInt(facRes.rows[0].count, 10) === 0) {
    await pool.query(`
      INSERT INTO "MasterFacility" ("id", "name", "description", "iconSvg", "order", "isActive", "updatedAt")
      VALUES
      (gen_random_uuid(), '24/7 Security', 'One gate system with CCTV', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>', 1, true, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'Swimming Pool', 'Olympic size pool', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M5 8v4"/><path d="M19 8v4"/><path d="M12 4v8"/></svg>', 2, true, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'Clubhouse', 'Exclusive community center', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 7v14"/><path d="M21 7v14"/><path d="M3 7l9-5 9 5"/></svg>', 3, true, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'Playground', 'Safe kids playground', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>', 4, true, CURRENT_TIMESTAMP);
    `);
    console.log('Seeded MasterFacility.');
  }

  // Check if MasterGallery has rows
  const galRes = await pool.query('SELECT COUNT(*) FROM "MasterGallery"');
  if (parseInt(galRes.rows[0].count, 10) === 0) {
    await pool.query(`
      INSERT INTO "MasterGallery" ("id", "title", "imageUrl", "order", "isActive", "updatedAt")
      VALUES
      (gen_random_uuid(), 'Modern Architecture Living', '/mockups/gallery_1.jpg', 1, true, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'Interior Elegance Design', '/mockups/gallery_2.jpg', 2, true, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'Master Bedroom Ambience', '/mockups/gallery_3.jpg', 3, true, CURRENT_TIMESTAMP),
      (gen_random_uuid(), 'Serene Backyard Sanctuary', '/mockups/gallery_4.jpg', 4, true, CURRENT_TIMESTAMP);
    `);
    console.log('Seeded MasterGallery.');
  }

  await pool.end();
  console.log('Setup completed successfully!');
}

setup().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
