import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { LegalDocumentItem } from '@/types/legal';

const LEGAL_DATA_FILE = path.join(process.cwd(), 'data', 'legalDocuments.json');

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

function readSavedFile(): LegalDocumentItem[] {
  try {
    if (fs.existsSync(LEGAL_DATA_FILE)) {
      const raw = fs.readFileSync(LEGAL_DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading legalDocuments.json:', err);
  }
  return [];
}

function writeSavedFile(items: LegalDocumentItem[]): void {
  try {
    const dir = path.dirname(LEGAL_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LEGAL_DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing legalDocuments.json:', err);
  }
}

export const LegalService = {
  async getLegalDocuments(): Promise<LegalDocumentItem[]> {
    const savedItems = readSavedFile();
    const savedMap = new Map<string, LegalDocumentItem>();
    for (const item of savedItems) {
      savedMap.set(item.id, item);
    }

    try {
      // Query sales from DB
      const sales = await prisma.sale.findMany({
        where: { status: { not: 'Cancelled' } },
        include: {
          customer: true,
          booking: {
            include: {
              propertyUnit: true,
              project: true,
            },
          },
        },
        orderBy: { date: 'desc' },
      });

      const dbLegalItems: LegalDocumentItem[] = sales.map((sale, idx) => {
        const saved = savedMap.get(sale.id);
        const isKpr = sale.paymentMethod === 'Mortgage';
        const isCompleted = sale.status === 'Completed';

        // Default structure from Sale data
        const base: LegalDocumentItem = {
          id: sale.id,
          code: saved?.code || `KPR-2026-${String(idx + 1).padStart(4, '0')}`,
          customerName: sale.customer?.name || saved?.customerName || 'Konsumen Derinos',
          customerPhone: sale.customer?.phone || saved?.customerPhone || '+62 812-0000-0000',
          customerNik: sale.customer?.ktpNumber || saved?.customerNik || '3201xxxxxxxx0001',
          customerOccupation: sale.customer?.occupation || saved?.customerOccupation || 'Karyawan',
          projectName: sale.projectTitle || saved?.projectName || 'Proyek Derinos',
          unitNumber: sale.unitNumber || saved?.unitNumber || 'Blok 00',
          unitType: sale.booking?.propertyUnit?.typeName || saved?.unitType || 'Tipe Standar',
          price: sale.contractPrice || saved?.price || 650000000,
          paymentMethod: (sale.paymentMethod as any) || saved?.paymentMethod || 'Mortgage',
          bankName: saved?.bankName || (isKpr ? 'Bank BTN' : 'Cash Keras'),
          plafondAmount: saved?.plafondAmount !== undefined ? saved.plafondAmount : (isKpr ? Math.round(sale.contractPrice * 0.85) : 0),
          interestRate: saved?.interestRate || (isKpr ? '3.75% Fixed 3 Thn' : undefined),
          docs: saved?.docs || {
            ktpKK: true,
            npwp: !!sale.customer?.npwp,
            slipGaji: true,
            rekKoran: true,
            skKerja: true,
            slikOjk: 'Kol-1',
          },
          sp3kStatus: saved?.sp3kStatus || (isCompleted ? 'SP3K Terbit' : 'Review Bank'),
          sp3kDate: saved?.sp3kDate || (isCompleted ? sale.date.toISOString().split('T')[0] : undefined),
          sp3kExpiryDate: saved?.sp3kExpiryDate,
          unitLegality: saved?.unitLegality || {
            shmStatus: 'Pecah',
            pbgStatus: 'Lengkap',
            pbbStatus: 'Lunas',
          },
          notaryStatus: saved?.notaryStatus || (isCompleted ? 'Selesai Akad' : 'Menunggu Berkas'),
          akadDate: saved?.akadDate || (isCompleted ? sale.date.toISOString().split('T')[0] : undefined),
          notaryName: saved?.notaryName || 'Notaris Rekanan Derinos, SH.',
          notes: saved?.notes || sale.notes || 'Pemberkasan KPR berjalan sesuai tahapan perbankan.',
          updatedAt: saved?.updatedAt || sale.updatedAt.toISOString(),
        };

        return base;
      });

      // Include saved standalone/custom items that don't match any sale.id
      const dbIds = new Set(sales.map((s) => s.id));
      const customItems = savedItems.filter((item) => !dbIds.has(item.id));

      const combined = [...dbLegalItems, ...customItems];

      // If no DB sales and no custom items exist yet, initialize with clean mock data and save it
      if (combined.length === 0) {
        writeSavedFile(INITIAL_MOCK_LEGAL);
        return INITIAL_MOCK_LEGAL;
      }

      return combined;
    } catch (err) {
      console.error('Error fetching legal documents from DB:', err);
      // Fallback to saved items or initial mock
      if (savedItems.length > 0) {
        return savedItems;
      }
      return INITIAL_MOCK_LEGAL;
    }
  },

  async saveLegalDocument(doc: LegalDocumentItem): Promise<LegalDocumentItem> {
    const savedItems = readSavedFile();
    const updatedDoc: LegalDocumentItem = {
      ...doc,
      updatedAt: new Date().toISOString(),
    };

    const index = savedItems.findIndex((item) => item.id === doc.id);
    if (index >= 0) {
      savedItems[index] = updatedDoc;
    } else {
      savedItems.unshift(updatedDoc);
    }

    writeSavedFile(savedItems);

    // Also update notes on Sale model in DB if this document maps to a Sale
    try {
      const existingSale = await prisma.sale.findUnique({ where: { id: doc.id } });
      if (existingSale) {
        await prisma.sale.update({
          where: { id: doc.id },
          data: {
            notes: doc.notes || existingSale.notes,
          },
        });
      }
    } catch (dbErr) {
      console.warn('Could not sync legal notes to DB Sale model:', dbErr);
    }

    return updatedDoc;
  },

  async deleteLegalDocument(id: string): Promise<boolean> {
    const savedItems = readSavedFile();
    const filtered = savedItems.filter((item) => item.id !== id);
    writeSavedFile(filtered);
    return true;
  },
};
