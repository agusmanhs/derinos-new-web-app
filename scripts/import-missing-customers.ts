import 'dotenv/config';
import prisma from '../src/lib/prisma';

const missingCustomers = [
  {
    idLama: 333,
    name: "ANDINI KHASANAH",
    ktpNumber: "1234567891011132",
    address: "A",
    birthPlace: "MAKASSAR",
    birthDate: new Date("2012-12-12"),
    gender: "P",
    phone: "087748357127",
    email: "hallo@gmail.com",
    occupation: "A",
    ktpFile: null,
    createdAt: new Date("2026-01-24 15:00:27"),
    updatedAt: new Date("2026-05-02 09:23:30"),
  },
  {
    idLama: 340,
    name: "RESKY FEBRIANTO",
    ktpNumber: "1234567891011139",
    address: "a",
    birthPlace: "MAKASSAR",
    birthDate: new Date("2012-12-12"),
    gender: "L",
    phone: "087748357127",
    email: "hallo@gmail.com",
    occupation: "A",
    ktpFile: null,
    createdAt: new Date("2026-01-24 15:04:47"),
    updatedAt: new Date("2026-04-25 08:15:49"),
  },
  {
    idLama: 403,
    name: "ROSLINA",
    ktpNumber: "7371077112840075",
    address: "JL. SINASSARA KOMP YUKA",
    birthPlace: "UJUNG PANDANG",
    birthDate: new Date("1984-12-31"),
    gender: "P",
    phone: "081229222448",
    email: "derinosgroup@gmail.com",
    occupation: "WIRAUSAHA",
    ktpFile: null,
    createdAt: new Date("2026-09-03 10:36:42"),
    updatedAt: new Date("2026-09-03 10:37:06"),
  },
  {
    idLama: 404,
    name: "ARYA KARTIKA SAPUTRA MS",
    ktpNumber: "7371102506060009",
    address: "JL. USMAN SALENGKE 91",
    birthPlace: "SUNGGUMINASA",
    birthDate: new Date("2006-06-25"),
    gender: "L",
    phone: "085274559373",
    email: "derinosgroup@gmail.com",
    occupation: "KARYAWAN SWASTA",
    ktpFile: null,
    createdAt: new Date("2026-09-03 10:39:46"),
    updatedAt: new Date("2026-09-03 10:40:07"),
  },
  {
    idLama: 405,
    name: "IRFAN",
    ktpNumber: "7371100710950010",
    address: "JL. BAJI BARU NO. 15",
    birthPlace: "UJUNG PANDANG",
    birthDate: new Date("1995-10-07"),
    gender: "L",
    phone: "081247227144",
    email: "derinosgroup@gmail.com",
    occupation: "PELAUT",
    ktpFile: null,
    createdAt: new Date("2026-09-30 08:55:16"),
    updatedAt: new Date("2026-09-30 08:55:44"),
  },
  {
    idLama: 406,
    name: "MUH ALIF",
    ktpNumber: "7306182202040001",
    address: "ROMANGLOMPOA",
    birthPlace: "MAKASSAR",
    birthDate: new Date("2004-02-22"),
    gender: "L",
    phone: "085756284007",
    email: "derinosgroup@gmail.com",
    occupation: "KARYAWAN SWASTA",
    ktpFile: null,
    createdAt: new Date("2026-09-30 17:28:36"),
    updatedAt: new Date("2026-09-30 17:29:21"),
  },
  {
    idLama: 407,
    name: "RACHMAT HIDAYATULLAH IRFAN",
    ktpNumber: "7306022907980001",
    address: "JL. SARIBA TIRO DUSUN BONTORAMBA",
    birthPlace: "LIMBUNG",
    birthDate: new Date("1998-07-29"),
    gender: "L",
    phone: "081347225667",
    email: "derinosgroup@gmail.com",
    occupation: "KARYAWAN SWASTA",
    ktpFile: null,
    createdAt: new Date("2026-10-03 08:27:09"),
    updatedAt: new Date("2026-10-03 08:27:30"),
  },
  {
    idLama: 408,
    name: "FIRDAUS",
    ktpNumber: "7310040202930001",
    address: "JL FLAMBOYAN",
    birthPlace: "PANGKEP",
    birthDate: new Date("1993-02-02"),
    gender: "L",
    phone: "085255113094",
    email: "derinosgroup@gmail.com",
    occupation: "KARYAWAN SWASTA",
    ktpFile: null,
    createdAt: new Date("2026-10-14 12:40:44"),
    updatedAt: new Date("2026-10-14 12:41:31"),
  },
  {
    idLama: 409,
    name: "H MUH TAUFIK",
    ktpNumber: "7305040507850005",
    address: "BONTOWA",
    birthPlace: "MALOLO",
    birthDate: new Date("1986-07-05"),
    gender: "L",
    phone: "081347225667",
    email: "derinosgroup@gmail.com",
    occupation: "WIRAUSAHA",
    ktpFile: null,
    createdAt: new Date("2026-10-17 08:25:22"),
    updatedAt: new Date("2026-10-17 08:25:46"),
  },
  {
    idLama: 410,
    name: "HASNIAR",
    ktpNumber: "7371025307880003",
    address: "JL. RAJAWALI NO. 35 B ASR ZIDAM",
    birthPlace: "BAROMBONG",
    birthDate: new Date("1988-07-13"),
    gender: "P",
    phone: "081340700163",
    email: "derinosgroup@gmail.com",
    occupation: "PERAWAT",
    ktpFile: null,
    createdAt: new Date("2026-10-27 10:43:09"),
    updatedAt: new Date("2026-10-27 10:43:42"),
  },
];

async function run() {
  console.log("Memulai import 10 customer yang belum ada...");

  let insertedCount = 0;
  for (const c of missingCustomers) {
    // Check if exists
    const exists = await prisma.customer.findFirst({
      where: {
        OR: [
          { ktpNumber: c.ktpNumber },
          { name: { equals: c.name, mode: 'insensitive' } },
        ]
      }
    });

    if (exists) {
      console.log(`- Lewati: ${c.name} (sudah ada di DB dengan ID: ${exists.id})`);
      continue;
    }

    const created = await prisma.customer.create({
      data: {
        name: c.name,
        ktpNumber: c.ktpNumber,
        address: c.address,
        birthPlace: c.birthPlace,
        birthDate: c.birthDate,
        gender: c.gender,
        phone: c.phone,
        email: c.email,
        occupation: c.occupation,
        ktpFile: c.ktpFile,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }
    });

    console.log(`+ Berhasil diinput: [ID Lama: ${c.idLama}] ${c.name} -> ID Baru: ${created.id}`);
    insertedCount++;
  }

  const totalNow = await prisma.customer.count();
  console.log(`\nSelesai! ${insertedCount} data customer berhasil dimasukkan.`);
  console.log(`Total customer di web baru sekarang: ${totalNow} data.`);
}

run()
  .catch(err => {
    console.error("Gagal import:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
