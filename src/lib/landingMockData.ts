export interface MockProjectCard {
  id: string;
  slug: string;
  title: string;
  badge?: string;
  badgeColor?: 'terlaris' | 'terbaru' | 'unggulan';
  location: string;
  startingPrice: string;
  image: string;
  specs: {
    bedrooms: number;
    bathrooms: number;
    carports: number;
    buildingArea: number;
    landArea: number;
  };
}

export interface MockHouseType {
  id: string;
  name: string;
  typeCode: string;
  badge?: string;
  isPopular?: boolean;
  description: string;
  image: string;
  startingPrice: string;
  installment: string;
  specs: {
    bedrooms: number;
    bathrooms: number;
    carports: number;
    landArea: number;
    buildingArea: number;
  };
}

export interface MockTestimonial {
  id: string;
  name: string;
  role: string;
  unitPurchased: string;
  avatar: string;
  rating: number;
  content: string;
}

export interface MockArticle {
  id: string;
  slug: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  image: string;
  readTime: string;
}

export const landingMockData = {
  stats: [
    {
      value: '10+',
      label: 'Tahun Pengalaman',
      desc: 'Sejak 2014 berkarya dalam industri properti Indonesia',
    },
    {
      value: '5+',
      label: 'Proyek Terselesaikan',
      desc: 'Cluster perumahan terpadu di kawasan strategis berkembang',
    },
    {
      value: '1.000+',
      label: 'Unit Terjual',
      desc: 'Keluarga yang telah mempercayakan hunian impian mereka',
    },
    {
      value: '95%',
      label: 'Kepuasan Pelanggan',
      desc: 'Testimoni positif terhadap kualitas bangunan & legalitas',
    },
  ],

  trustBadges: [
    { label: 'Legalitas Jelas & SHM', icon: 'shield' },
    { label: 'Fasilitas Komplit', icon: 'check-circle' },
    { label: 'Lokasi Strategis Bebas Banjir', icon: 'map-pin' },
  ],

  featuredProjects: [
    {
      id: 'prj-mock-1',
      slug: 'cluster-titanium-residence',
      title: 'Cluster Titanium Residence',
      badge: 'TERLARIS',
      badgeColor: 'terlaris',
      location: 'Kawasan Parahyangan, Bandung Barat',
      startingPrice: 'Rp 567 Juta',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      specs: {
        bedrooms: 3,
        bathrooms: 2,
        carports: 2,
        buildingArea: 72,
        landArea: 120,
      },
    },
    {
      id: 'prj-mock-2',
      slug: 'grand-hill-residence-2',
      title: 'Grand Hill Residence Tahap 2',
      badge: 'PROMO DP 0%',
      badgeColor: 'unggulan',
      location: 'Barombong, Gowa - Makassar',
      startingPrice: 'Rp 687 Juta',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
      specs: {
        bedrooms: 3,
        bathrooms: 2,
        carports: 2,
        buildingArea: 80,
        landArea: 105,
      },
    },
    {
      id: 'prj-mock-3',
      slug: 'harmoni-gardenia-villa',
      title: 'Harmoni Gardenia Villa',
      badge: 'TERBARU',
      badgeColor: 'terbaru',
      location: 'Tanjung Bunga Waterfront',
      startingPrice: 'Rp 812 Juta',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
      specs: {
        bedrooms: 4,
        bathrooms: 3,
        carports: 2,
        buildingArea: 110,
        landArea: 140,
      },
    },
  ] as MockProjectCard[],

  highlightCluster: {
    badge: 'NILAI KEUNGGULAN KAMI',
    title: 'Tinggal Nyaman, Bertumbuh Bersama Keluarga',
    description: 'Dirancang dengan konsep arsitektur modern tropis yang memperhatikan pencahayaan alami, sirkulasi udara optimal, dan ruang terbuka hijau yang ramah anak.',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop',
    floatingCardText: 'Cluster Grand Harmony',
    floatingCardSub: 'Siap Huni • Cicilan Mulai 4 Jt/bln',
    features: [
      {
        icon: 'trees',
        title: 'Lingkungan Asri',
        desc: 'Udara segar, taman hijau terawat, dan area bermain terbuka ramah anak.',
      },
      {
        icon: 'map',
        title: 'Akses Strategis',
        desc: 'Dekat stasiun, gerbang tol utama, sekolah unggulan, dan pusat belanja.',
      },
      {
        icon: 'shield-check',
        title: 'Keamanan Terjamin',
        desc: 'Sistem one gate system dengan security 24 jam & pemantauan kamera CCTV.',
      },
      {
        icon: 'home',
        title: 'Desain Modern & Fungsional',
        desc: 'Tata ruang efisien, material berkualitas premium, dan plafon tinggi.',
      },
    ],
  },

  valuePillars: {
    tag: 'LEBIH DARI SEKADAR RUMAH',
    title: 'Komitmen Kualitas & Kenyamanan untuk Hidup Anda',
    description: 'Kami tidak sekadar membangun hunian fisik, tetapi menciptakan lingkungan kehidupan di mana kebahagiaan keluarga Anda dapat berkembang seutuhnya.',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop',
    imageBadge: '98% Kepuasan Konsumen',
    pillars: [
      {
        icon: 'compass',
        title: 'Lokasi Strategis',
        desc: 'Dipilih di kawasan sunrise properti dengan potensi kenaikan nilai investasi yang tinggi setiap tahunnya.',
      },
      {
        icon: 'award',
        title: 'Kualitas Bangunan Teruji',
        desc: 'Struktur beton bertulang dengan pengawasan mutu ketat dan garansi purna jual terpercaya.',
      },
      {
        icon: 'file-check',
        title: 'Legalitas Jelas & Aman',
        desc: 'Sertifikat Hak Milik (SHM) dan Izin Mendirikan Bangunan (PBG) sudah split per unit.',
      },
      {
        icon: 'smile',
        title: 'Lingkungan Nyaman & Harmonis',
        desc: 'Kawasan pemukiman tenang dengan tatanan vegetasi alami serta tata kelola kebersihan profesional.',
      },
      {
        icon: 'activity',
        title: 'Fasilitas Lengkap Terpadu',
        desc: 'Mulai dari clubhouse, tempat ibadah, jogging track, hingga area komersial di gerbang utama.',
      },
      {
        icon: 'trending-up',
        title: 'Nilai Investasi Prospektif',
        desc: 'Pertumbuhan modal terbukti stabil di atas rata-rata berkat pertumbuhan infrastruktur sekitar.',
      },
    ],
  },

  houseTypes: [
    {
      id: 'type-36',
      name: 'Tipe 36 / The Minimalist',
      typeCode: 'Type 36/72',
      badge: 'TERJANGKAU',
      isPopular: false,
      description: 'Pilihan tepat untuk keluarga muda yang mengutamakan efisiensi tata ruang dengan sisa halaman luas untuk pengembangan.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
      startingPrice: 'Rp 350 Juta',
      installment: 'Mulai 2,3 Jt/bln',
      specs: {
        bedrooms: 2,
        bathrooms: 1,
        carports: 1,
        landArea: 72,
        buildingArea: 36,
      },
    },
    {
      id: 'type-45',
      name: 'Tipe 45 / The Comfort',
      typeCode: 'Type 45/90',
      badge: 'PALING POPULER',
      isPopular: true,
      description: 'Hunian ideal dengan ruang keluarga lapang, dapur terpisah, serta area carport yang lebih leluasa untuk mobilitas Anda.',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
      startingPrice: 'Rp 465 Juta',
      installment: 'Mulai 3,1 Jt/bln',
      specs: {
        bedrooms: 2,
        bathrooms: 1,
        carports: 2,
        landArea: 90,
        buildingArea: 45,
      },
    },
    {
      id: 'type-60',
      name: 'Tipe 60 / The Prestige',
      typeCode: 'Type 60/120',
      badge: '2 LANTAI',
      isPopular: false,
      description: 'Kemewahan hunian 2 lantai dengan master bedroom eksklusif, pencahayaan alami maksimal, dan taman depan-belakang.',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
      startingPrice: 'Rp 745 Juta',
      installment: 'Mulai 4,8 Jt/bln',
      specs: {
        bedrooms: 3,
        bathrooms: 2,
        carports: 2,
        landArea: 120,
        buildingArea: 60,
      },
    },
  ] as MockHouseType[],

  amenities: {
    tag: 'FASILITAS PREMIUM',
    title: 'Dirancang untuk Kehidupan yang Lebih Nyaman',
    subtitle: 'Semua kemudahan dan kebutuhan keluarga terintegrasi langsung di dalam kawasan perumahan Anda.',
    mainImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&auto=format&fit=crop',
    mainImageTitle: 'Clubhouse & Swimming Pool Area',
    mainImageSubtitle: 'Tempat relaksasi, rekreasi, dan olahraga keluarga di akhir pekan tanpa harus keluar kawasan.',
    list: [
      { id: '1', name: 'Clubhouse Mewah', desc: 'Pusat pertemuan & gym komunitas resident' },
      { id: '2', name: 'Kolam Renang', desc: 'Kolam dewasa dan anak berstandar higienis' },
      { id: '3', name: 'Keamanan 24/7', desc: 'One gate system & pemantauan CCTV 24 jam' },
      { id: '4', name: 'Taman Hijau & RTH', desc: 'Area teduh dengan pepohonan rindang' },
      { id: '5', name: 'Jogging Track', desc: 'Lintasan lari santai mengelilingi taman' },
      { id: '6', name: 'Children Playground', desc: 'Area bermain anak yang aman & edukatif' },
      { id: '7', name: 'Tempat Ibadah', desc: 'Masjid/Musholla bersih di dalam kawasan' },
      { id: '8', name: 'One Gate Card System', desc: 'Akses barrier gate RFID otomatis' },
    ],
  },

  locationAccess: {
    tag: 'LOKASI DAN AKSES',
    title: 'Lokasi Strategis, Aktivitas Lebih Mudah',
    subtitle: 'Nikmati kemudahan mobilitas setiap hari dengan akses cepat ke berbagai fasilitas publik penting.',
    mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop',
    accessPoints: [
      { time: '5 Menit', destination: 'Gerbang Tol Utama', icon: 'car' },
      { time: '10 Menit', destination: 'Stasiun KRL & Transportasi Publik', icon: 'train' },
      { time: '15 Menit', destination: 'Pusat Perbelanjaan & Mall', icon: 'shopping-bag' },
      { time: '10 Menit', destination: 'Rumah Sakit & Sekolah Internasional', icon: 'heart-pulse' },
    ],
  },

  testimonials: [
    {
      id: 'testi-1',
      name: 'Budi Prasetyo & Keluarga',
      role: 'Wiraswasta',
      unitPurchased: 'Pemilik Tipe 45 - Grand Harmony',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      content: 'Proses akad dan serah terima kunci berjalan sangat lancar. Mutu bangunannya kokoh, tata ruangnya adem, dan fasilitas tamannya benar-benar dinikmati anak-anak setiap sore.',
    },
    {
      id: 'testi-2',
      name: 'dr. Sarah Amanda',
      role: 'Dokter Umum',
      unitPurchased: 'Pemilik Tipe 60 - Titanium Residence',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      content: 'Lokasinya sangat strategis untuk mobilitas kerja saya. Akses tol dekat dan lingkungannya tenang sekali. Legalitas SHM juga sudah saya terima tanpa kendala.',
    },
    {
      id: 'testi-3',
      name: 'Rudi Hartono',
      role: 'Professional IT',
      unitPurchased: 'Pemilik Tipe 36 - Green Hill',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      content: 'Sebagai pembeli rumah pertama, saya sangat terbantu dengan tim sales Derinos yang ramah menjelaskan simulasi KPR hingga approval bank berhasil. Sangat memuaskan!',
    },
  ] as MockTestimonial[],

  articles: [
    {
      id: 'art-1',
      slug: 'tips-memilih-rumah-pertama',
      category: 'Tips Properti',
      date: '12 Okt 2026',
      readTime: '4 min baca',
      title: 'Tips Memilih Rumah Pertama untuk Generasi Muda',
      summary: 'Ketahui aspek krusial mulai dari legalitas developer, rasio cicilan terhadap penghasilan, hingga potensi pertumbuhan kawasan sekitar.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'art-2',
      slug: 'panduan-kpr-syarat-dan-tips',
      category: 'Panduan KPR',
      date: '08 Okt 2026',
      readTime: '5 min baca',
      title: 'Panduan KPR Pemula: Syarat & Tips Pengajuan Cepat Disetujui',
      summary: 'Langkah taktis mempersiapkan skor kredit BI checking, kelengkapan berkas slip gaji, dan memilih skema bunga flat vs floating.',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'art-3',
      slug: 'update-perkembangan-proyek-tahap-2',
      category: 'Progres Proyek',
      date: '01 Okt 2026',
      readTime: '3 min baca',
      title: 'Update Perkembangan Proyek: Pembangunan Tahap 2 Berjalan Sesuai Target',
      summary: 'Simak dokumentasi pengecoran struktur utama, pemasangan jaringan utilitas bawah tanah, dan penghijauan boulevard perumahan.',
      image: 'https://images.unsplash.com/photo-1541888086925-0c1448b11a5e?q=80&w=600&auto=format&fit=crop',
    },
  ] as MockArticle[],
};
