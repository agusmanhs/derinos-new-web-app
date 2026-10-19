import prisma from '@/lib/prisma';
import { LegalDocumentItem } from '@/types/legal';

const INITIAL_MOCK_LEGAL: LegalDocumentItem[] = [
  {
    id: 'leg-01',
    code: 'KPR-BTN-8819',
    customerName: 'Raden Surya Wicaksono',
    customerPhone: '+62 812-9843-1122',
    customerNik: '3201294819200001',
    customerOccupation: 'Karyawan Swasta BUMN',
    projectName: 'Cluster Titanium Residence',
    unitNumber: 'Blok A-08',
    unitType: 'Tipe 36/72 Bougenville',
    price: 650000000,
    paymentMethod: 'Mortgage',
    bankName: 'Bank BTN',
    plafondAmount: 585000000,
    interestRate: '3.75% Fixed 3 Thn',
    docs: {
      ktpKK: true,
      npwp: true,
      slipGaji: true,
      rekKoran: true,
      skKerja: true,
      slikOjk: 'Kol-1',
    },
    sp3kStatus: 'SP3K Terbit',
    sp3kDate: '2026-10-12',
    sp3kExpiryDate: '2026-11-12',
    unitLegality: {
      shmStatus: 'Pecah',
      pbgStatus: 'Lengkap',
      pbbStatus: 'Lunas',
    },
    notaryStatus: 'Siap Akad',
    akadDate: '2026-10-28',
    notaryName: 'Notaris Hj. Farida, SH., M.Kn.',
    notes: 'Kolektibilitas SLIK OJK Lancar (Kol-1). Menunggu jadwal penandatanganan akad kredit.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'leg-02',
    code: 'KPR-MDR-8794',
    customerName: 'Bambang Trihatmojo',
    customerPhone: '+62 821-4433-9081',
    customerNik: '3201884719300004',
    customerOccupation: 'Wiraswasta / Pemilik Usaha',
    projectName: 'Grand Hill Residence',
    unitNumber: 'Blok B-14',
    unitType: 'Tipe 45/90 Comfort',
    price: 980000000,
    paymentMethod: 'Mortgage',
    bankName: 'Bank Mandiri',
    plafondAmount: 850000000,
    interestRate: '4.25% Fixed 3 Thn',
    docs: {
      ktpKK: true,
      npwp: true,
      slipGaji: true,
      rekKoran: true,
      skKerja: true,
      slikOjk: 'Kol-1',
    },
    sp3kStatus: 'Review Bank',
    sp3kDate: undefined,
    sp3kExpiryDate: undefined,
    unitLegality: {
      shmStatus: 'Pecah',
      pbgStatus: 'Lengkap',
      pbbStatus: 'Lunas',
    },
    notaryStatus: 'Menunggu Berkas',
    notaryName: 'Notaris Ahmad Fauzi, SH.',
    notes: 'Penilaian appraisal unit sudah selesai 100%. Menunggu komite kredit Mandiri mengeluarkan SP3K.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'leg-03',
    code: 'KPR-BCA-8824',
    customerName: 'Dr. Amanda Larasati',
    customerPhone: '+62 811-2394-8811',
    customerNik: '3171092817300002',
    customerOccupation: 'Dokter Spesialis',
    projectName: 'Harmoni Gardenia Villa',
    unitNumber: 'Blok A-01',
    unitType: 'Tipe 60/120 Signature',
    price: 1850000000,
    paymentMethod: 'Mortgage',
    bankName: 'BCA Prioritas',
    plafondAmount: 1400000000,
    interestRate: '3.99% Fixed 2 Thn',
    docs: {
      ktpKK: true,
      npwp: true,
      slipGaji: false,
      rekKoran: true,
      skKerja: true,
      slikOjk: 'Kol-1',
    },
    sp3kStatus: 'Diajukan',
    sp3kDate: undefined,
    unitLegality: {
      shmStatus: 'Pecah',
      pbgStatus: 'Lengkap',
      pbbStatus: 'Lunas',
    },
    notaryStatus: 'Menunggu Berkas',
    notes: 'Kekurangan slip gaji legalisir bulan September dari pihak RS Hermina. Form KPR sudah ditandatangani.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'leg-04',
    code: 'KPR-BSY-8805',
    customerName: 'Maya Indriani',
    customerPhone: '+62 856-1182-3904',
    customerNik: '3201192837400005',
    customerOccupation: 'PNS Guru',
    projectName: 'Cluster Titanium Residence',
    unitNumber: 'Blok C-08',
    unitType: 'Tipe 36/72 Minimalist',
    price: 520000000,
    paymentMethod: 'Mortgage',
    bankName: 'BTN Syariah',
    plafondAmount: 480000000,
    interestRate: 'Bagi Hasil 4.5% Eq.',
    docs: {
      ktpKK: true,
      npwp: true,
      slipGaji: true,
      rekKoran: false,
      skKerja: true,
      slikOjk: 'Kol-1',
    },
    sp3kStatus: 'Draft',
    unitLegality: {
      shmStatus: 'Proses BPN',
      pbgStatus: 'Lengkap',
      pbbStatus: 'Lunas',
    },
    notaryStatus: 'Menunggu Berkas',
    notes: 'Menunggu print rekening koran Bank Syariah 3 bulan terakhir. SHM sedang proses pemecahan di BPN.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'leg-05',
    code: 'CSH-NOT-8780',
    customerName: 'Hendra Setiawan',
    customerPhone: '+62 813-8822-1920',
    customerNik: '3201449281700003',
    customerOccupation: 'Pengusaha Kontraktor',
    projectName: 'Cluster Titanium Residence',
    unitNumber: 'Blok A-09',
    unitType: 'Tipe 45/84 Bougenville Deluxe',
    price: 720000000,
    paymentMethod: 'Cash',
    bankName: 'Cash Keras (BCA Transfer)',
    plafondAmount: 0,
    docs: {
      ktpKK: true,
      npwp: true,
      slipGaji: true,
      rekKoran: true,
      skKerja: true,
      slikOjk: 'Kol-1',
    },
    sp3kStatus: 'SP3K Terbit',
    unitLegality: {
      shmStatus: 'Pecah',
      pbgStatus: 'Lengkap',
      pbbStatus: 'Lunas',
    },
    notaryStatus: 'Selesai Akad',
    akadDate: '2026-10-05',
    notaryName: 'Notaris Hj. Farida, SH., M.Kn.',
    notes: 'Pelunasan 100% lunas. Akta Jual Beli (AJB) dan balik nama sertifikat ke pembeli selesai ditandatangani.',
    updatedAt: new Date().toISOString(),
  }
];

export const LegalService = {
  async getLegalDocuments(): Promise<LegalDocumentItem[]> {
    try {
      // Query sales and bookings from DB
      const sales = await prisma.sale.findMany({
        where: { status: { not: 'Cancelled' } },
        include: {
          customer: true,
          booking: {
            include: {
              propertyUnit: true,
              project: true
            }
          }
        },
        orderBy: { date: 'desc' }
      });

      if (!sales || sales.length === 0) {
        return INITIAL_MOCK_LEGAL;
      }

      // Map existing DB sales deals to Legal items
      const dbLegalItems: LegalDocumentItem[] = sales.map((sale, idx) => {
        const isKpr = sale.paymentMethod === 'Mortgage';
        const isCompleted = sale.status === 'Completed';

        return {
          id: sale.id,
          code: `KPR-2026-${String(idx + 1).padStart(4, '0')}`,
          customerName: sale.customer?.name || 'Konsumen Derinos',
          customerPhone: sale.customer?.phone || '+62 812-0000-0000',
          customerNik: sale.customer?.ktpNumber || '3201xxxxxxxx0001',
          customerOccupation: sale.customer?.occupation || 'Karyawan',
          projectName: sale.projectTitle,
          unitNumber: sale.unitNumber,
          unitType: sale.booking?.propertyUnit?.typeName || 'Tipe Standar',
          price: sale.contractPrice,
          paymentMethod: (sale.paymentMethod as any) || 'Mortgage',
          bankName: isKpr ? 'Bank BTN' : 'Cash Keras',
          plafondAmount: isKpr ? Math.round(sale.contractPrice * 0.85) : 0,
          interestRate: isKpr ? '3.75% Fixed 3 Thn' : undefined,
          docs: {
            ktpKK: true,
            npwp: !!sale.customer?.npwp,
            slipGaji: true,
            rekKoran: true,
            skKerja: true,
            slikOjk: 'Kol-1',
          },
          sp3kStatus: isCompleted ? 'SP3K Terbit' : 'Review Bank',
          sp3kDate: isCompleted ? sale.date.toISOString().split('T')[0] : undefined,
          unitLegality: {
            shmStatus: 'Pecah',
            pbgStatus: 'Lengkap',
            pbbStatus: 'Lunas',
          },
          notaryStatus: isCompleted ? 'Selesai Akad' : 'Menunggu Berkas',
          akadDate: isCompleted ? sale.date.toISOString().split('T')[0] : undefined,
          notaryName: 'Notaris Rekanan Derinos, SH.',
          notes: sale.notes || 'Pemberkasan KPR berjalan sesuai tahapan perbankan.',
          updatedAt: sale.updatedAt.toISOString(),
        };
      });

      // Combine with mock if few DB records exist for complete demonstration
      if (dbLegalItems.length < 4) {
        return [...dbLegalItems, ...INITIAL_MOCK_LEGAL.slice(dbLegalItems.length)];
      }

      return dbLegalItems;
    } catch (err) {
      console.error('Error fetching legal documents:', err);
      return INITIAL_MOCK_LEGAL;
    }
  }
};
