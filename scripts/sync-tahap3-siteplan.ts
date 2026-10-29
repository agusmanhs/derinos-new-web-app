import 'dotenv/config';
import prisma from '../src/lib/prisma';
import { execSync } from 'child_process';

const NAMI_PROJECT_ID = '59e8cd0a-3dd0-4584-a6a2-19d810c3b4c8';
const PHASE_3_ID = '1845a65f-1957-409b-a9c5-b99f6ec7bcf4';

async function main() {
  const isApply = process.argv.includes('--apply');
  console.log(`=== SYNC TAHAP 3 SITEPLAN & BOOKING DATA (${isApply ? 'APPLY MODE' : 'DRY-RUN MODE'}) ===\n`);

  // 1. Fetch PropertyStatuses in Postgres
  const pgStatuses = await prisma.propertyStatus.findMany();
  const statusMap = new Map<string, string>(); // name_lower -> id
  for (const s of pgStatuses) {
    statusMap.set(s.name.toLowerCase().trim(), s.id);
  }

  // 2. Fetch MarketingAgencies in Postgres
  const pgAgencies = await prisma.marketingAgency.findMany();
  const agencyMap = new Map<string, string>(); // name_lower -> id
  for (const a of pgAgencies) {
    agencyMap.set(a.name.toLowerCase().trim(), a.id);
  }

  // 3. Fetch Customers in Postgres
  const pgCustomers = await prisma.customer.findMany();
  const custByNik = new Map<string, any>();
  const custByName = new Map<string, any>();
  for (const c of pgCustomers) {
    if (c.ktpNumber) custByNik.set(c.ktpNumber.trim(), c);
    if (c.name) custByName.set(c.name.toLowerCase().trim(), c);
  }

  // 4. Fetch MySQL data
  const mysqlCustOut = execSync('mysql -u derinos-db-user -phLEYEHT7B9JzBZMVU -h 127.0.0.1 -e "SELECT id, nama, nik, telepon, marketing_id FROM derinos.customers;"', { encoding: 'utf-8' });
  const mysqlCustomers = new Map<number, any>();
  for (const l of mysqlCustOut.trim().split('\n').slice(1)) {
    const [id, nama, nik, telepon, marketingId] = l.split('\t');
    mysqlCustomers.set(Number(id), { id: Number(id), nama: nama?.trim(), nik: nik?.trim(), telepon: telepon?.trim(), marketingId: marketingId ? Number(marketingId) : null });
  }

  const mysqlMktOut = execSync('mysql -u derinos-db-user -phLEYEHT7B9JzBZMVU -h 127.0.0.1 -e "SELECT id, nama FROM derinos.marketing;"', { encoding: 'utf-8' });
  const mysqlMarketing = new Map<number, string>();
  for (const l of mysqlMktOut.trim().split('\n').slice(1)) {
    const [id, nama] = l.split('\t');
    mysqlMarketing.set(Number(id), nama?.trim());
  }

  const mysqlTxOut = execSync('mysql -u derinos-db-user -phLEYEHT7B9JzBZMVU -h 127.0.0.1 -e "SELECT blok_id, count, transaction, transaction_date, bukti_transfer FROM derinos.transactions WHERE perumahan_id = 6 ORDER BY blok_id, count ASC;"', { encoding: 'utf-8' });
  const mysqlTransactionsByBlok = new Map<number, any[]>();
  for (const l of mysqlTxOut.trim().split('\n').slice(1)) {
    const [blokId, count, amount, txDate, bukti] = l.split('\t');
    const bId = Number(blokId);
    if (!mysqlTransactionsByBlok.has(bId)) mysqlTransactionsByBlok.set(bId, []);
    mysqlTransactionsByBlok.get(bId)!.push({
      count: Number(count),
      amount: Number(amount),
      date: txDate,
      bukti: bukti || null
    });
  }

  const mysqlTmOut = execSync('mysql -u derinos-db-user -phLEYEHT7B9JzBZMVU -h 127.0.0.1 -e "SELECT blok_id, marketing_id FROM derinos.transaction_marketing WHERE perumahan_id = 6;"', { encoding: 'utf-8' });
  const mysqlTmByBlok = new Map<number, number>();
  for (const l of mysqlTmOut.trim().split('\n').slice(1)) {
    const [blokId, mId] = l.split('\t');
    mysqlTmByBlok.set(Number(blokId), Number(mId));
  }

  const mysqlBloksOut = execSync('mysql -u derinos-db-user -phLEYEHT7B9JzBZMVU -h 127.0.0.1 -e "SELECT id, kode, luas, harga_jual, status_blok_id, customer_id, status_bayar, keterangan, created_at FROM derinos.bloks WHERE perumahan_id = 6;"', { encoding: 'utf-8' });
  const mysqlBloks = mysqlBloksOut.trim().split('\n').slice(1).map(l => {
    const p = l.split('\t');
    return {
      id: Number(p[0]),
      kode: p[1].toLowerCase().trim(),
      luas: Number(p[2]) || 0,
      hargaJual: Number(p[3]) || 0,
      statusBlokId: Number(p[4]),
      customerId: p[5] && p[5] !== 'NULL' ? Number(p[5]) : null,
      statusBayar: p[6],
      keterangan: p[7] !== 'NULL' ? p[7] : null,
      createdAt: p[8] && p[8] !== 'NULL' ? new Date(p[8]) : new Date('2024-11-11'),
    };
  });

  // Map old status_blok_id to new status name
  function getStatusName(statusId: number): string {
    switch (statusId) {
      case 1: return 'Available';
      case 2: return 'Booking';
      case 3: return 'Proses Berkas';
      case 4: return 'Sudah Akad';
      case 5: return 'Cash/Lunas';
      case 6: return 'SP3K';
      default: return 'Available';
    }
  }

  // 5. Existing Postgres PropertyUnits in Tahap 3
  const pgUnits = await prisma.propertyUnit.findMany({
    where: { phaseId: PHASE_3_ID },
    include: { bookings: true }
  });
  const pgUnitMap = new Map<string, any>();
  for (const u of pgUnits) {
    pgUnitMap.set(u.unitNumber.toLowerCase().trim(), u);
  }

  console.log(`Found ${pgUnits.length} existing units in Postgres Tahap 3.`);
  console.log(`Found ${mysqlBloks.length} bloks in MySQL Tahap 3.`);

  let updatedUnits = 0;
  let createdUnits = 0;
  let updatedBookings = 0;
  let createdBookings = 0;
  let clearedBookings = 0;

  for (const ob of mysqlBloks) {
    // Only process units belonging to Tahap 3 siteplan (exclude c1-*, b1-*, d1-*)
    if (ob.kode.startsWith('c1-') || ob.kode.startsWith('b1-') || ob.kode.startsWith('d1-')) {
      continue;
    }

    const targetStatusName = getStatusName(ob.statusBlokId);
    const targetStatusId = statusMap.get(targetStatusName.toLowerCase()) || statusMap.get('available')!;

    // Resolve Customer
    let targetCustomerId: string | null = null;
    let custName = 'None';
    if (ob.customerId && targetStatusName !== 'Available') {
      const mc = mysqlCustomers.get(ob.customerId);
      if (mc) {
        custName = mc.nama;
        const pgC = (mc.nik && custByNik.get(mc.nik)) || custByName.get(mc.nama.toLowerCase());
        if (pgC) {
          targetCustomerId = pgC.id;
        }
      }
    }

    // Resolve Agency
    let targetAgencyId: string | null = null;
    const mktId = mysqlTmByBlok.get(ob.id) || (ob.customerId ? mysqlCustomers.get(ob.customerId)?.marketingId : null);
    if (mktId && mysqlMarketing.has(mktId)) {
      const mktName = mysqlMarketing.get(mktId)!;
      targetAgencyId = agencyMap.get(mktName.toLowerCase().trim()) || null;
    }

    // Resolve Real Transaction
    const txList = mysqlTransactionsByBlok.get(ob.id) || [];
    const firstTx = txList.find(t => t.count === 1) || txList[0];
    const realBookingFee = firstTx ? firstTx.amount : (targetStatusName !== 'Available' ? 5000000 : 0);
    const realDate = firstTx && firstTx.date ? new Date(firstTx.date) : ob.createdAt;
    const realPaymentStatus = ob.statusBayar === 'ya' || txList.length > 0 ? 'Paid' : 'Pending';

    let unit = pgUnitMap.get(ob.kode);

    if (!unit) {
      console.log(`[CREATE UNIT] Unit '${ob.kode}' not found in Postgres. Creating now (Status: ${targetStatusName}, Customer: ${custName})...`);
      if (isApply) {
        unit = await prisma.propertyUnit.create({
          data: {
            projectId: NAMI_PROJECT_ID,
            phaseId: PHASE_3_ID,
            projectTitle: 'Nami Land Barombong',
            unitNumber: ob.kode,
            typeName: 'type 45',
            landSize: ob.luas > 0 ? ob.luas : 75,
            buildingSize: 45,
            bedrooms: 2,
            bathrooms: 1,
            carports: 1,
            price: ob.hargaJual > 0 ? ob.hargaJual : 350000000,
            statusId: targetStatusId,
            customerId: targetCustomerId,
            floorPlanImage: '/images/default-floorplan.png',
          },
          include: { bookings: true }
        });
      }
      createdUnits++;
    } else {
      // Update existing unit
      if (isApply) {
        unit = await prisma.propertyUnit.update({
          where: { id: unit.id },
          data: {
            statusId: targetStatusId,
            customerId: targetCustomerId,
            price: ob.hargaJual > 0 ? ob.hargaJual : unit.price,
            landSize: ob.luas > 0 ? ob.luas : unit.landSize,
          },
          include: { bookings: true }
        });
      }
      updatedUnits++;
    }

    // Handle Bookings for this unit
    if (targetStatusName === 'Available') {
      // If unit is available, remove or cancel any lingering bookings
      if (unit && unit.bookings && unit.bookings.length > 0) {
        console.log(`[CLEAR BOOKING] Unit '${ob.kode}' is Available. Removing ${unit.bookings.length} dummy bookings.`);
        if (isApply) {
          await prisma.booking.deleteMany({
            where: { propertyUnitId: unit.id }
          });
        }
        clearedBookings++;
      }
    } else if (targetCustomerId) {
      // Unit is Booked / Berkas / Akad / Cash / SP3K with Customer
      const existingBooking = unit?.bookings?.[0];
      if (existingBooking) {
        if (isApply) {
          await prisma.booking.update({
            where: { id: existingBooking.id },
            data: {
              customerId: targetCustomerId,
              agencyId: targetAgencyId || existingBooking.agencyId,
              price: ob.hargaJual > 0 ? ob.hargaJual : unit.price,
              bookingFee: realBookingFee,
              date: realDate,
              paymentStatus: realPaymentStatus,
              status: 'Confirmed',
              createdAt: realDate,
            }
          });
        }
        updatedBookings++;
      } else {
        console.log(`[CREATE BOOKING] Unit '${ob.kode}' (${custName}): Booking fee Rp ${realBookingFee.toLocaleString()} on ${realDate.toISOString().slice(0, 10)}`);
        if (isApply && unit) {
          await prisma.booking.create({
            data: {
              customerId: targetCustomerId,
              projectId: NAMI_PROJECT_ID,
              projectTitle: 'Nami Land Barombong',
              agencyId: targetAgencyId,
              propertyUnitId: unit.id,
              unitNumber: ob.kode,
              price: ob.hargaJual > 0 ? ob.hargaJual : unit.price,
              bookingFee: realBookingFee,
              paymentStatus: realPaymentStatus,
              status: 'Confirmed',
              date: realDate,
              createdAt: realDate,
            }
          });
        }
        createdBookings++;
      }
    }
  }

  console.log('\n=== REKAP HASIL SINKRONISASI TAHAP 3 ===');
  console.log(`- Unit baru dibuat (misal h3, h4): ${createdUnits}`);
  console.log(`- Unit diperbarui status & customer: ${updatedUnits}`);
  console.log(`- Booking fee & tanggal riil diperbarui: ${updatedBookings}`);
  console.log(`- Booking baru dibuat untuk unit bertuan: ${createdBookings}`);
  console.log(`- Booking dummy dibersihkan dari kavling Kosong: ${clearedBookings}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
