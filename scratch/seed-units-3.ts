import prisma from '../src/lib/prisma';

const rawData = [
	['a1', 1000000, 'Sudah Akad', 'HUSSAIN HARIS', null],
	['a1-10', 535000000, 'Sudah Akad', 'ZULKIFLI', 'LANDMARK'],
	['a1-11', 535000000, 'Kosong', 'PUTRI ANDINI', 'AMANAH'],
	['a1-4', 535000000, 'Pembelian Cash/Lunas', 'kosong', 'ARU'],
	['a1-5', 515000000, 'Sudah Akad', 'SUAIB', 'AMANAH'],
	['a1-6', 515000000, 'Kosong', 'TEODORUS ITO OEMATAN', 'START 7'],
	['a1-7', 515000000, 'Sudah Akad', 'FANI ANDRIANI', 'JAGUAR'],
	['a1-8', 515000000, 'Kosong', 'risda', 'AMANAH'],
	['a1-9', 515000000, 'Proses Berkas', 'YAYAT HIDAYATULLAH', 'AMANAH'],
	['a2', 1000000, 'Sudah Akad', 'IRMA DWIANTI', null],
	['a3', 1000000, 'Sudah Akad', 'ARDIANSYAH RISWIN', 'WIN GOLD PROPERTY'],
	['a4', 1000000, 'Sudah Akad', 'CECILIA TANIJAYA', null],
	['a5', 1000000, 'Sudah Akad', 'Muh Haikal', 'WIN GOLD PROPERTY'],
	['a6', 1000000, 'Sudah Akad', 'MUH RIZAL AKBAR', 'WIN GOLD PROPERTY'],
	['a7', 1000000, 'Sudah Akad', 'AB ZULFIQAR', null],
	['a8', 1000000, 'Pembelian Cash/Lunas', 'MUH. RIFAI RAMLI', 'ARU'],
	['b1', 1000000, 'Sudah Akad', 'AKBAR J', 'LANDMARK'],
	['b1-1', 515000000, 'Proses Berkas', 'risda', 'AMANAH'],
	['b1-10', 515000000, 'Kosong', 'risda', 'AMANAH'],
	['b1-11', 515000000, 'Kosong', null, null],
	['b1-12', 515000000, 'Kosong', null, null],
	['b1-13', 515000000, 'Kosong', null, null],
	['b1-14', 515000000, 'Kosong', null, null],
	['b1-15', 515000000, 'Sudah Akad', 'SUHARDI', 'DEV MIKAENA'],
	['b1-2', 515000000, 'Proses Berkas', 'ISMAYA', 'BY DEVELOPER'],
	['b1-3', 515000000, 'Sudah Akad', 'ERNIWATI', 'AMANAH'],
	['b1-4', 515000000, 'Booking', 'risda', 'AMANAH'],
	['b1-5', 515000000, 'Kosong', null, null],
	['b1-6', 515000000, 'Kosong', null, null],
	['b1-7', 515000000, 'Kosong', null, null],
	['b1-8', 515000000, 'Kosong', 'WIRDAH JANUARNI ROSMADY', 'AJH PROPERTY'],
	['b1-9', 515000000, 'Sudah Akad', 'NYOMAN WIJA SEDANA', 'LANDMARK'],
	['b10', 1000000, 'Sudah Akad', 'Irnawati', 'LANDMARK'],
	['b11', 1000000, 'Sudah Akad', 'M. Fikri Hamsah Huma', 'SKY PROPERTY'],
	['b12', 1000000, 'Sudah Akad', 'Asriani', 'LANDMARK'],
	['b13', 1000000, 'Sudah Akad', 'Andi Sakti. S', 'LANDMARK'],
	['b14', 1000000, 'Sudah Akad', 'DEFI MELLIANTI', null],
	['b15', 1000000, 'Proses Berkas', 'INDAH HARDIYANTI B', 'LANDMARK'],
	['b16', 1000000, 'Proses Berkas', 'Hartina', 'LANDMARK'],
	['b17', 1000000, 'Sudah Akad', 'ISMAWATI BASRI', null],
	['b18', 1000000, 'Sudah Akad', 'Rosniaty Rostin', 'LANDMARK'],
	['b19', 1000000, 'Proses Berkas', 'Ariza Taufik', null],
	['b2', 1000000, 'Sudah Akad', 'ADRIANUS', 'LANDMARK'],
	['b20', 305000000, 'Sudah Akad', 'Yasser Yulianandra', null],
	['b3', 1000000, 'Sudah Akad', 'IRSAN', 'LANDMARK'],
	['b4', 1000000, 'Sudah Akad', 'HENGKY KURNIAWAN', 'LANDMARK'],
	['b5', 1000000, 'Sudah Akad', 'Muhammad Fajrin S', 'LANDMARK'],
	['b6', 1000000, 'Sudah Akad', 'Supiansyah', 'LANDMARK'],
	['b7', 1000000, 'Sudah Akad', 'MUH. RUSLI, SE', 'LANDMARK'],
	['b8', 1000000, 'Sudah Akad', 'ARDIANSA', 'LANDMARK'],
	['b9', 1000000, 'Sudah Akad', 'MUHAMMAD SYADIQ SYAKIR', 'ARU'],
	['c1', 1000000, 'Sudah Akad', 'MILAWATY', null],
	['c1-1', 440000000, 'Sudah Akad', 'FUJA IRIANTO', 'AMANAH'],
	['c1-10', 440000000, 'Sudah Akad', 'ABU AZWAR', 'AMANAH'],
	['c1-11', 440000000, 'Proses Berkas', 'risda', 'AMANAH'],
	['c1-12', 440000000, 'Sudah Akad', 'VELIANSYAH', 'AMANAH'],
	['c1-13', 440000000, 'Sudah Akad', 'AISYAH MELY KHAILA', 'LANDMARK'],
	['c1-14', 410000000, 'Pembelian Cash/Lunas', 'SYAMSURIZAL', 'LANDMARK'],
	['c1-2', 440000000, 'Sudah Akad', 'WIDYA EKA ZORAYA PUTRI NAIM', 'CAPTAIN'],
	['c1-3', 440000000, 'Sudah Akad', 'DEDY FAUZY EL HAKIM', 'AMANAH'],
	['c1-4', 440000000, 'Sudah Akad', 'MEGAWATI', 'AMANAH'],
	['c1-5', 440000000, 'Sudah Akad', 'IRWAN', 'DEV MEIKA'],
	['c1-6', 440000000, 'Sudah Akad', 'JERI ALEX CAHYONO', 'AMANAH'],
	['c1-7', 450000000, 'Sudah Akad', 'PRATIWI SULASWATI ARYUMUS', 'DEV MEIKA'],
	['c1-8', 440000000, 'Pembelian Cash/Lunas', 'SRI WAHYUNI', 'AMANAH'],
	['c1-9', 440000000, 'Kosong', 'ALDAYANTI', 'AMANAH'],
	['c10', 1000000, 'Kosong', 'Yasser Yulianandra', null],
	['c11', 1000000, 'Kosong', 'Muh Haikal', 'WIN GOLD PROPERTY'],
	['c12', 1000000, 'Sudah Akad', 'ABDULLAH', null],
	['c13', 1000000, 'Sudah Akad', 'FITA TUMENGKOL', null],
	['c14', 1000000, 'Kosong', 'Fachrul Maulana', 'RATU KENCANA PROPERTY'],
	['c15', 1000000, 'Pembelian Cash/Lunas', 'Ahmad Sidiq', 'WIN GOLD PROPERTY'],
	['c16', 1000000, 'Sudah Akad', 'ABID PRADATA', 'RATU KENCANA PROPERTY'],
	['c17', 1000000, 'Kosong', 'Nurman', 'SKY PROPERTY'],
	['c18', 1000000, 'Sudah Akad', 'Arman', 'LANDMARK'],
	['c19', 1000000, 'Sudah Akad', 'Rinda Passolon', 'RCA PROPERTY'],
	['c2', 1000000, 'Sudah Akad', 'Sri Wahyuni', null],
	['c20', 1000000, 'Sudah Akad', 'Muhammad Aswar', null],
	['c21', 1000000, 'Pembelian Cash/Lunas', 'FRANSISKUS CORNEL MOTE', 'RCA PROPERTY'],
	['c3', 1000000, 'Pembelian Cash/Lunas', 'M. Fikri Hamsah Huma', 'SKY PROPERTY'],
	['c4', 1000000, 'Sudah Akad', 'DINUL RIFKY HAMDU', null],
	['c5', 1000000, 'Sudah Akad', 'ANGGRIANI', null],
	['c6', 1000000, 'Booking', 'Muh Fardi Arianto ', null],
	['c7', 1000000, 'Proses Berkas', 'RAHMAT PASANRI', null],
	['c8', 1000000, 'Proses Berkas', 'RAHMAT PASANRI', null],
	['c9', 1000000, 'Sudah Akad', 'DELLA INDAH LESTARI', 'LANDMARK'],
	['d1', 326000000, 'Pembelian Cash/Lunas', null, null],
	['d1-1', 580000000, 'Proses Berkas', 'MUH ARIL SAPUTRA', 'AMANAH'],
	['d1-10', 475000000, 'SP3K', 'ARFAN TINANDE', 'ARU'],
	['d1-11', 475000000, 'Kosong', null, null],
	['d1-12', 475000000, 'Sudah Akad', 'MUH FACHRI EFENDI', 'AMANAH'],
	['d1-2', 440000000, 'Sudah Akad', 'risda', 'AMANAH'],
	['d1-3', 440000000, 'Sudah Akad', 'ARFAN', 'AMANAH'],
	['d1-4', 440000000, 'Sudah Akad', 'SRI ASTUTI', 'LANDMARK'],
	['d1-5', 481000000, 'Sudah Akad', 'MUHAMWALUDIN ARMIN', 'HELLOTA PROPERTY'],
	['d1-6', 475000000, 'Sudah Akad', 'ASYFA VIONA ANDARA ISWANDI', 'AMANAH'],
	['d1-7', 475000000, 'Sudah Akad', 'ARFAN', 'AMANAH'],
	['d1-8', 475000000, 'Sudah Akad', 'LAURENTIA ELSARA', '46 PROPERTY'],
	['d1-9', 475000000, 'Kosong', 'ANANDA ZAHIRA ZAHRA', 'DEV MEIKA'],
	['d10', 326000000, 'Sudah Akad', 'HERU PATMONO', 'LANDMARK'],
	['d11', 326000000, 'Sudah Akad', 'PUTRI', 'LANDMARK'],
	['d12', 326000000, 'Sudah Akad', 'NURJANNAH', 'LANDMARK'],
	['d13', 326000000, 'Sudah Akad', 'NUR AKBAR', 'RCA PROPERTY'],
	['d14', 326000000, 'Sudah Akad', 'ANNI IWAN ARIFIN', 'LANDMARK'],
	['d15', 326000000, 'Sudah Akad', 'FITA ANDRIYANI', 'RCA PROPERTY'],
	['d16', 326000000, 'Sudah Akad', 'MUH FIQRI HAIKAL', 'BY DEVELOPER'],
	['d17', 326000000, 'Sudah Akad', 'SYAMSIR ANHAR', '46 PROPERTY'],
	['d18', 326000000, 'Sudah Akad', 'NURUL INAYAH', 'HELLOTA PROPERTY'],
	['d19', 326000000, 'Sudah Akad', 'AHMADI', 'BY DEVELOPER'],
	['d2', 326000000, 'Sudah Akad', 'HASMIRA', 'LANDMARK'],
	['d20', 325000000, 'Pembelian Cash/Lunas', 'HJ ZAHRAH', 'LANDMARK'],
	['d3', 326000000, 'Sudah Akad', 'ST. RACHMATIAH SALEH', 'LANDMARK'],
	['d4', 326000000, 'Sudah Akad', 'PANDU SATRYA MAHARDIKA', 'RCA PROPERTY'],
	['d5', 326000000, 'Sudah Akad', 'NURSIDA, A.Md.Kep', 'LANDMARK'],
	['d6', 326000000, 'Sudah Akad', 'NURTINI', 'BY DEVELOPER'],
	['d7', 341000000, 'Sudah Akad', 'RATNA PARAMITA SARI', 'LANDMARK'],
	['d8', 326000000, 'Sudah Akad', 'ADITIA SAKTI WIJAYA', 'WIN GOLD PROPERTY'],
	['d9', 326000000, 'Sudah Akad', 'FITRIANI', 'RATU KENCANA PROPERTY'],
	['e1', 1, 'Proses Berkas', 'APRILIYA SUCI LISTARI', 'BY DEVELOPER'],
	['e10', 346000000, 'Sudah Akad', 'SYAWAL KUSUMA PITRA', 'AJH PROPERTY'],
	['e11', 346000000, 'Sudah Akad', 'INDAH DAMAYANTI', 'LANDMARK'],
	['e12', 326000000, 'Sudah Akad', 'ANDI INDAH PRATIWI', 'LANDMARK'],
	['e13', 326000000, 'Sudah Akad', 'PATAHUDDIN', 'RCA PROPERTY'],
	['e14', 341000000, 'Sudah Akad', 'MARIA YESICHA YOLANDA', 'LANDMARK'],
	['e15', 326000000, 'Sudah Akad', 'SARIPUDDIN. J', 'BY DEVELOPER'],
	['e16', 326000000, 'Sudah Akad', 'ABDUL RAHMAN', 'LANDMARK'],
	['e17', 326000000, 'Sudah Akad', 'ARGA RIPKIANSYA', 'LANDMARK'],
	['e18', 326000000, 'Sudah Akad', 'AKBAR', 'LANDMARK'],
	['e2', 326000000, 'Sudah Akad', 'NURNINGSIH', 'LANDMARK'],
	['e3', 326000000, 'Sudah Akad', 'RAFFENDA RAISYA ARIFIN', 'LANDMARK'],
	['e4', 326000000, 'Sudah Akad', 'REZKI FEBRIANTI', 'WIN GOLD PROPERTY'],
	['e5', 326000000, 'Sudah Akad', 'AKBAR', 'BY DEVELOPER'],
	['e6', 320000000, 'Pembelian Cash/Lunas', 'JONY ISKANDAR BASO', 'BY DEVELOPER'],
	['e7', 337900000, 'Sudah Akad', 'HENRA WIJAYA', 'LANDMARK'],
	['e8', 326000000, 'Sudah Akad', 'DINA WAHYUNI DG TE\'NE', 'WIN GOLD PROPERTY'],
	['e9', 341000000, 'Sudah Akad', 'DYAN RAHEDI', 'HELLOTA PROPERTY'],
	['f1', 342900000, 'Sudah Akad', 'RIKA PUTRI NIRWANA, A.Md.Kep', 'LANDMARK'],
	['f10', 341000000, 'Sudah Akad', 'M RUSLAN DAHLAN, S.Sos', 'WIN GOLD PROPERTY'],
	['f11', 337900000, 'Sudah Akad', 'NUR FATWA', 'BY DEVELOPER'],
	['f12', 337900000, 'Sudah Akad', 'HJ. MANTASIAH, A.Md. Kep', 'LANDMARK'],
	['f13', 341000000, 'Sudah Akad', 'MUH. MUQTADIR AMAL, S.Kep.NS', 'LANDMARK'],
	['f14', 341000000, 'Sudah Akad', 'FERINA HASTUTUI', 'LANDMARK'],
	['f15', 337900000, 'Sudah Akad', 'FIRDAYANTI RAMADHANI', 'LANDMARK'],
	['f16', 341000000, 'Sudah Akad', 'NUR ANISHA PUTRI', 'LANDMARK'],
	['f17', 341000000, 'Sudah Akad', 'MUH. RAFLI', 'LANDMARK'],
	['f18', 342900000, 'Pembelian Cash/Lunas', 'FIRMA SARI', 'RATU KENCANA PROPERTY'],
	['f2', 321000000, 'Pembelian Cash/Lunas', 'SITTINURJANNA', 'BY DEVELOPER'],
	['f3', 336000000, 'Sudah Akad', 'RINAWATI. R', 'LANDMARK'],
	['f4', 341000000, 'Sudah Akad', 'BELLAVIA ANISA FITRIA', 'LANDMARK'],
	['f5', 341000000, 'Sudah Akad', 'ANDHINI PRAMUDIAH ASIS', 'RCA PROPERTY'],
	['f6', 341000000, 'Sudah Akad', 'SARDA AYU ASGARI', 'LANDMARK'],
	['f7', 326000000, 'Sudah Akad', 'WAHYUDDIN', 'HELLOTA PROPERTY'],
	['f8', 346000000, 'Sudah Akad', 'FITRIYANI YUDDIN', 'LANDMARK'],
	['f9', 326000000, 'Sudah Akad', 'ARMAYANTI', 'LANDMARK'],
	['g1', 325000000, 'Pembelian Cash/Lunas', 'SRI INDAH LESTARI', 'LANDMARK'],
	['g10', 341000000, 'Sudah Akad', 'SUHARTO', 'LANDMARK'],
	['g11', 1, 'Sudah Akad', 'ARNIATI HASMISN, S.Pd', 'ARU'],
	['g12', 326000000, 'Sudah Akad', 'IRNANINGSIH.S', 'ARU'],
	['g13', 337900000, 'Sudah Akad', 'HERU', 'LANDMARK'],
	['g14', 341000000, 'Sudah Akad', 'Dr. ANDI SETIAWAN DARWIN', 'LANDMARK'],
	['g15', 341000000, 'Sudah Akad', 'RUDIANTO', 'LANDMARK'],
	['g16', 337900000, 'Sudah Akad', 'FAISAL', 'LANDMARK'],
	['g17', 326000000, 'Sudah Akad', 'MICHAEL MASANG', 'LANDMARK'],
	['g18', 336000000, 'Sudah Akad', 'PUTRI APRILIANI', 'LANDMARK'],
	['g19', 337900000, 'Sudah Akad', 'M DAKWAN', 'AJH PROPERTY'],
	['g2', 326000000, 'Sudah Akad', 'ICA NURJANNAH', 'WIN GOLD PROPERTY'],
	['g20', 326000000, 'Pembelian Cash/Lunas', 'JUNAEDI', 'LANDMARK'],
	['g3', 321000000, 'Pembelian Cash/Lunas', 'SITI NURHALIZA', 'LANDMARK'],
	['g4', 341000000, 'Sudah Akad', 'M DAKWAN', 'AJH PROPERTY'],
	['g5', 341000000, 'Sudah Akad', 'RUDDIN', 'HELLOTA PROPERTY'],
	['g6', 336000000, 'Sudah Akad', 'SUGIANTO', 'LANDMARK'],
	['g7', 341000000, 'Sudah Akad', 'ARNIATI HASMISN, S.Pd', 'ARU'],
	['g8', 337900000, 'Sudah Akad', 'ROLLAND ROMARIO WAER', 'HELLOTA PROPERTY'],
	['g9', 337900000, 'Sudah Akad', 'PAISAH', 'LANDMARK'],
	['h1', 385000000, 'Sudah Akad', 'FADLI ASHARI', 'AMANAH'],
	['h10', 385000000, 'Sudah Akad', 'MUH YUSRI BIN YUSUF', 'AMANAH'],
	['h11', 385000000, 'Sudah Akad', 'SYAHRIR', 'RCA PROPERTY'],
	['h12', 385000000, 'Proses Berkas', 'SRI SISKA AMELIA', 'AMANAH'],
	['h13', 335000000, 'Sudah Akad', 'HERMAN', 'AMANAH'],
	['h14', 375000000, 'Sudah Akad', 'ANDINI', 'LANDMARK'],
	['h15', 381000000, 'Sudah Akad', 'ABD HALIM, A.M S.T', '46 PROPERTY'],
	['h16', 375000000, 'Sudah Akad', 'DEWI WULANDARI', 'AJH PROPERTY'],
	['h17', 330000000, 'Sudah Akad', 'ALIMUDDIN', 'LANDMARK'],
	['h18', 385000000, 'Sudah Akad', 'RUSLAINA', 'RATU KENCANA PROPERTY'],
	['h19', 385000000, 'Sudah Akad', 'ANDI NABILA FADLI', 'AMANAH'],
	['h2', 385000000, 'Sudah Akad', 'MUHAMMAD YUSRIL IRIANTO MA\'RUF', 'MAX87'],
	['h20', 385000000, 'Sudah Akad', 'MUH. ALIF ANWARI', 'AMANAH'],
	['h21', 385000000, 'Proses Berkas', 'NUR IKHSAN KADIR', 'AMANAH'],
	['h22', 385000000, 'Sudah Akad', 'NAJWA DWI NOVIANTY', 'AMANAH'],
	['h23', 385000000, 'Sudah Akad', 'MUH HABIBI', 'RATU KENCANA PROPERTY'],
	['h24', 385000000, 'Sudah Akad', 'M R RAMADHAN M S', 'RATU KENCANA PROPERTY'],
	['h25', 385000000, 'Sudah Akad', 'SAHARA.K', 'DEV MIKAENA'],
	['h26', 385000000, 'Sudah Akad', 'ANDI NUR FAUZAN', 'ARU'],
	['h27', 375000000, 'Sudah Akad', 'SRI WAHYUNI SEHUDDIN', 'LANDMARK'],
	['h28', 375000000, 'Sudah Akad', 'NUNI', 'LANDMARK'],
	['h29', 375000000, 'Sudah Akad', 'IHYA ULUMMUDIN', 'AMANAH'],
	['h30', 375000000, 'Sudah Akad', 'ILHAMSYAH', 'ARU'],
	['h31', 375000000, 'Pembelian Cash/Lunas', 'ARMAWATI', 'AMANAH'],
	['h6', 350000000, 'Pembelian Cash/Lunas', 'RAHMAT HIDAYAT M, YUSUF', 'AMANAH'],
	['h7', 385000000, 'Sudah Akad', 'MUH BASRAH JAYA NUR', '46 PROPERTY'],
	['h8', 385000000, 'Kosong', 'RISQA DIAN WIJAYA', 'DEV MEIKA'],
	['h9', 385000000, 'Sudah Akad', 'PARAMITA K', 'DEV MEIKA'],
	['i1', 380000000, 'Sudah Akad', 'MURSYDUN HIDAYAH HAYAT', 'AMANAH'],
	['i2', 375000000, 'Sudah Akad', 'YULIANTI', 'DEV MIKAENA'],
	['i3', 375000000, 'Kosong', 'RIDWAN BASIR', 'ARU'],
	['i4', 375000000, 'Sudah Akad', 'AMALIAH PUTRI KHAERATI ISMAIL', 'AMANAH'],
	['i5', 375000000, 'Proses Berkas', 'ANDI FAIQAH ASWAN', 'AMANAH'],
	['i6', 375000000, 'Sudah Akad', 'HJ RATNAINIS', 'RCA PROPERTY'],
	['j1', 375000000, 'Proses Berkas', 'ALFA RESA GAHIWU', 'AMANAH'],
	['j2', 375000000, 'Sudah Akad', 'KELVIN', 'LANDMARK'],
	['j3', 375000000, 'Proses Berkas', 'OKTOMARIOS DAPALA', 'LANDMARK'],
	['k1', 375000000, 'Sudah Akad', 'ANRIANI', 'AMANAH'],
	['k10', 360000000, 'Sudah Akad', 'AGUS SALIM', 'AMANAH'],
	['k11', 335000000, 'Sudah Akad', 'FADIA FAHRANI', 'AMANAH'],
	['k12', 375000000, 'Sudah Akad', 'PUTRI NUR AI\'SYAH', 'RCA PROPERTY'],
	['k13', 330000000, 'Sudah Akad', 'MUH. AKHDIYAT FAHRUL FAHMI', 'GRIYA MEDIA'],
	['k14', 330000000, 'Sudah Akad', 'GILANG RAMADHAN', 'GRIYA MEDIA'],
	['k15', 375000000, 'Sudah Akad', 'MUH FADLI NUR', 'HELLOTA PROPERTY'],
	['k16', 335000000, 'Sudah Akad', 'DEASTY AYU SAPUTRI', 'LANDMARK'],
	['k17', 375000000, 'Sudah Akad', 'ISMIKAL', 'ANPRO'],
	['k18', 335000000, 'Sudah Akad', 'BELINDA LYDIA SIRAPANJI', 'LANDMARK'],
	['k19', 335000000, 'Sudah Akad', 'SYAMSUL RIJAL', 'LANDMARK'],
	['k2', 375000000, 'Sudah Akad', 'FARADILA', 'DEV MIKAENA'],
	['k20', 360000000, 'Sudah Akad', 'SYAMSUL BAHRI', 'LANDMARK'],
	['k21', 335000000, 'Sudah Akad', 'YUNIKA ARYANI KARO KARO', 'LANDMARK'],
	['k22', 320000000, 'Pembelian Cash/Lunas', 'ARSAM ASDAR', 'AMANAH'],
	['k23', 370000000, 'Sudah Akad', 'GHUFRAN AL QADRI GINSAGHI', 'ARU'],
	['k24', 333000000, 'Sudah Akad', 'MUH SADHAR IBRAHIM', '46 PROPERTY'],
	['k25', 370000000, 'Sudah Akad', 'ARFANDY', 'AJH PROPERTY'],
	['k26', 375000000, 'Sudah Akad', 'HUMAIRAH NUR FADILAH', 'DEV MIKAENA'],
	['k27', 335000000, 'Sudah Akad', 'MUSRAT', 'START 7'],
	['k28', 321000000, 'Pembelian Cash/Lunas', 'JULY ARDIAN M. JAMAL', 'AMANAH'],
	['k29', 335000000, 'Sudah Akad', 'R AYU LESTARI MUTMAINNA', 'GRIYA MEDIA'],
	['k3', 375000000, 'Sudah Akad', 'AKBAR TANJUNG', 'AMANAH'],
	['k30', 335000000, 'Sudah Akad', 'BRIAN ARISTA MARZUQ', 'LANDMARK'],
	['k31', 330000000, 'Sudah Akad', 'NUR ILHAM SYARIF IZANULLAH', 'AMANAH'],
	['k32', 360000000, 'Sudah Akad', 'YULIANA', 'START 7'],
	['k33', 360000000, 'Sudah Akad', 'AGUS IRSAN', 'HELLOTA PROPERTY'],
	['k4', 360000000, 'Sudah Akad', 'ISYIAMI SIREGAR', 'ARU'],
	['k5', 370000000, 'Sudah Akad', 'IHWAN SAMSUDIN', 'RCA PROPERTY'],
	['k6', 335000000, 'Sudah Akad', 'SUKMAWATI', 'AMANAH'],
	['k7', 375000000, 'Sudah Akad', 'BEBY BELLINA', 'AMANAH'],
	['k8', 335000000, 'Sudah Akad', 'ARMAWATI', 'AMANAH'],
	['k9', 335000000, 'Sudah Akad', 'FEBRIYANTI', 'LANDMARK'],
	['l1', 360000000, 'Sudah Akad', 'FLORIANUS KAMI', 'HELLOTA PROPERTY'],
	['l10', 36000000, 'Sudah Akad', 'SRI WAHYUNI NATSIR', 'AMANAH'],
	['l2', 330000000, 'Sudah Akad', 'MUSDARYANTO', 'AJH PROPERTY'],
	['l3', 375000000, 'Sudah Akad', 'SAADIYAH AL HABSYI', 'LANDMARK'],
	['l4', 375000000, 'Booking', 'risda', 'AMANAH'],
	['l5', 335000000, 'Sudah Akad', 'FADLILA AZZAHRA', 'LANDMARK'],
	['l6', 335000000, 'Sudah Akad', 'MIRWAN', 'DEV MEIKA'],
	['l7', 360000000, 'Sudah Akad', 'WARDA SRIPUTRI', 'DEV MEIKA'],
	['l8', 375000000, 'Sudah Akad', 'HADIANTO', 'RATU KENCANA PROPERTY'],
	['l9', 330000000, 'Sudah Akad', 'NUR FITRAH RAMADANI H', '46 PROPERTY']
];

async function main() {
  const NAMI_PROJECT_ID = '59e8cd0a-3dd0-4584-a6a2-19d810c3b4c8';
  
  const unitNumbers = rawData.map(r => r[0] as string);
  console.log(`[+] Found ${unitNumbers.length} units to process. Cleaning up old records...`);
  
  // Safe cleanup sequence to avoid FK violations
  for (const no of unitNumbers) {
    const existing = await prisma.propertyUnit.findFirst({
        where: { projectId: NAMI_PROJECT_ID, unitNumber: { equals: no, mode: 'insensitive' } },
        include: { bookings: true }
    });
    
    if (existing) {
        // 1. Delete dependent Commission & Sale records linked to bookings
        for (const booking of existing.bookings) {
             await prisma.commission.deleteMany({ where: { bookingId: booking.id } });
             await prisma.sale.deleteMany({ where: { bookingId: booking.id } });
        }
        // 2. Delete Bookings
        await prisma.booking.deleteMany({ where: { propertyUnitId: existing.id } });
        // 3. Delete PropertyUnit (which cascades to UnitStatusHistory & UnitConstructionUpdate)
        await prisma.propertyUnit.delete({ where: { id: existing.id } });
    }
  }
  console.log('[+] Cleanup complete. Starting fresh insert.');

  const allStatuses = await prisma.propertyStatus.findMany();
  const allCustomers = await prisma.customer.findMany();
  const allAgencies = await prisma.marketingAgency.findMany();
  
  const statusMap = new Map(allStatuses.map(s => [s.name.toLowerCase(), s]));
  const customerMap = new Map(allCustomers.map(c => [c.name.toLowerCase(), c]));
  const agencyMap = new Map(allAgencies.map(a => [a.name.toLowerCase(), a]));

  let insertedCount = 0;

  for (const row of rawData) {
    let [unitNo, priceRaw, rawStatus, rawCustomer, rawAgency] = row as [string, number, string, string | null, string | null];
    
    let price = priceRaw;
    if (price <= 1000000) {
      price = 350000000;
    }
    
    let statusName = rawStatus.toLowerCase();
    if (statusName === 'kosong') statusName = 'available';
    if (statusName === 'pembelian cash/lunas') statusName = 'cash/lunas';

    const statusObj = statusMap.get(statusName);
    if (!statusObj) {
      console.log(`[!] Status not found: ${rawStatus}`);
      continue;
    }

    let customerId = null;
    if (rawCustomer && rawCustomer.toLowerCase() !== 'kosong' && statusName !== 'available') {
      const customerStr = rawCustomer.trim().toLowerCase();
      let customerObj = customerMap.get(customerStr);
      
      if (!customerObj) {
         customerObj = await prisma.customer.create({
            data: {
               name: rawCustomer.trim(),
               phone: '000000000000',
               email: `${customerStr.replace(/\s/g, '')}@example.com`,
               address: '-'
            }
         });
         customerMap.set(customerStr, customerObj);
      }
      customerId = customerObj.id;
    }

    let agencyId = null;
    if (rawAgency) {
      const agencyStr = rawAgency.trim().toLowerCase();
      let agencyObj = agencyMap.get(agencyStr);
      
      if (!agencyObj) {
          agencyObj = await prisma.marketingAgency.create({
              data: {
                  name: rawAgency.trim(),
                  phone: '000000000000',
                  email: `${agencyStr.replace(/\s/g, '')}@example.com`,
                  commissionRate: 0,
                  address: '-'
              }
          });
          agencyMap.set(agencyStr, agencyObj);
      }
      agencyId = agencyObj.id;
    }

    const unit = await prisma.propertyUnit.create({
      data: {
        projectId: NAMI_PROJECT_ID,
        phaseId: '1845a65f-1957-409b-a9c5-b99f6ec7bcf4',
        projectTitle: 'Nami Land Barombong',
        unitNumber: unitNo,
        typeName: 'type 45',
        landSize: 75,
        buildingSize: 70,
        bedrooms: 2,
        bathrooms: 1,
        carports: 1,
        price: price,
        statusId: statusObj.id,
        customerId: customerId,
        floorPlanImage: '/images/default-floorplan.png',
      }
    });

    await prisma.unitStatusHistory.create({
      data: {
        propertyUnitId: unit.id,
        statusId: statusObj.id,
        statusName: statusObj.name,
        customerId: customerId,
        agencyId: agencyId,
        notes: "Migrasi data final beserta agency"
      }
    });

    if (agencyId && customerId && statusName !== 'available') {
       await prisma.booking.create({
          data: {
             customerId: customerId,
             projectId: NAMI_PROJECT_ID,
             projectTitle: 'Nami Land Barombong',
             agencyId: agencyId,
             propertyUnitId: unit.id,
             unitNumber: unitNo,
             price: price,
             bookingFee: 5000000,
             paymentStatus: 'Paid',
             status: 'Confirmed'
          }
       });
    }

    insertedCount++;
  }

  console.log(`\n🎉 Successfully recreated and inserted ${insertedCount} units.`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
