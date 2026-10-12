import prisma from '../src/lib/prisma';

async function main() {
  console.log('Seeding Landing Page Data...');

  // 1. Site Settings
  const settingsCount = await prisma.siteSettings.count();
  if (settingsCount === 0) {
    await prisma.siteSettings.create({
      data: {
        heroTitle: 'Build Your Future.<br/>Live Beyond Expectations.',
        heroSubtitle: 'Developing strategic, high quality modern residences in harmony with nature.',
        heroImage: '/mockups/hero_placeholder.jpg',
        introTitle: 'Experience Modern Living',
        introDescription: 'We design homes that blend aesthetic architecture with sustainable environments. Our commitment is to provide the best living spaces for you and your family.',
        contactEmail: 'info@derinos.com',
        contactPhone: '+62 812 3456 7890',
        contactAddress: 'Jl. Sudirman No.1, Jakarta',
      }
    });
    console.log('Created Site Settings');
  }

  // 2. Master Facilities
  const facilityCount = await prisma.masterFacility.count();
  if (facilityCount === 0) {
    await prisma.masterFacility.createMany({
      data: [
        { name: '24/7 Security', description: 'One gate system with CCTV', iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>', order: 1 },
        { name: 'Swimming Pool', description: 'Olympic size pool', iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M5 8v4"/><path d="M19 8v4"/><path d="M12 4v8"/></svg>', order: 2 },
        { name: 'Clubhouse', description: 'Exclusive community center', iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 7v14"/><path d="M21 7v14"/><path d="M3 7l9-5 9 5"/></svg>', order: 3 },
        { name: 'Playground', description: 'Safe kids playground', iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>', order: 4 },
      ]
    });
    console.log('Created Master Facilities');
  }

  // 3. Master Gallery
  const galleryCount = await prisma.masterGallery.count();
  if (galleryCount === 0) {
    await prisma.masterGallery.createMany({
      data: [
        { title: 'Front Facade', imageUrl: '/mockups/gallery_1.jpg', order: 1 },
        { title: 'Living Room', imageUrl: '/mockups/gallery_2.jpg', order: 2 },
        { title: 'Master Bedroom', imageUrl: '/mockups/gallery_3.jpg', order: 3 },
        { title: 'Garden Area', imageUrl: '/mockups/gallery_4.jpg', order: 4 },
      ]
    });
    console.log('Created Master Gallery');
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
