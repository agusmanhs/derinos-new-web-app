import prisma from '../src/lib/prisma';

async function main() {
  console.log("Starting data migration for Master Customers...");

  // Get unique names from Booking
  const bookings = await prisma.booking.findMany({
    where: { customerId: null }
  });

  const sales = await prisma.sale.findMany({
    where: { customerId: null }
  });

  const units = await prisma.propertyUnit.findMany({
    where: { customerId: null, buyerName: { not: null, not: '' } }
  });

  const customerMap = new Map<string, string>(); // name -> customerId

  const findOrCreateCustomer = async (name: string) => {
    if (!name || name.trim() === '') return null;
    const cleanName = name.trim();
    
    if (customerMap.has(cleanName)) {
      return customerMap.get(cleanName);
    }
    
    // Check if customer already exists in DB
    let customer = await prisma.customer.findFirst({
      where: { name: { equals: cleanName, mode: 'insensitive' } }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { name: cleanName }
      });
      console.log(`Created new Customer: ${cleanName} (ID: ${customer.id})`);
    }
    
    customerMap.set(cleanName, customer.id);
    return customer.id;
  };

  // Migrate Bookings
  for (const booking of bookings) {
    const cid = await findOrCreateCustomer(booking.customerName);
    if (cid) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { customerId: cid }
      });
      console.log(`Updated Booking ${booking.id} with Customer ID ${cid}`);
    }
  }

  // Migrate Sales
  for (const sale of sales) {
    const cid = await findOrCreateCustomer(sale.customerName);
    if (cid) {
      await prisma.sale.update({
        where: { id: sale.id },
        data: { customerId: cid }
      });
      console.log(`Updated Sale ${sale.id} with Customer ID ${cid}`);
    }
  }

  // Migrate Units
  for (const unit of units) {
    if (unit.buyerName) {
      const cid = await findOrCreateCustomer(unit.buyerName);
      if (cid) {
        await prisma.propertyUnit.update({
          where: { id: unit.id },
          data: { customerId: cid }
        });
        console.log(`Updated Unit ${unit.unitNumber} with Customer ID ${cid}`);
      }
    }
  }

  console.log("Migration complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
