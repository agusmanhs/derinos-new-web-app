export interface LegalDocumentItem {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  customerNik: string;
  customerOccupation: string;
  projectName: string;
  unitNumber: string;
  unitType: string;
  price: number;
  paymentMethod: 'Mortgage' | 'Cash' | 'Installment';
  bankName: string;
  plafondAmount: number;
  interestRate?: string;
  
  // Document checklist
  docs: {
    ktpKK: boolean;
    npwp: boolean;
    slipGaji: boolean;
    rekKoran: boolean;
    skKerja: boolean;
    slikOjk: 'Kol-1' | 'Kol-2' | 'Review' | 'Pending';
  };
  
  // Bank & SP3K
  sp3kStatus: 'Draft' | 'Diajukan' | 'Review Bank' | 'SP3K Terbit' | 'Expired';
  sp3kDate?: string;
  sp3kExpiryDate?: string;
  
  // Unit Legal status
  unitLegality: {
    shmStatus: 'Pecah' | 'Proses BPN' | 'Induk';
    pbgStatus: 'Lengkap' | 'Proses';
    pbbStatus: 'Lunas' | 'Proses';
  };
  
  // Notary & Akad
  notaryStatus: 'Menunggu Berkas' | 'Siap Akad' | 'Selesai Akad';
  akadDate?: string;
  notaryName?: string;
  
  notes?: string;
  updatedAt: string;
}
