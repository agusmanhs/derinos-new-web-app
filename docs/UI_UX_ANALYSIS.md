# UI/UX Reverse Engineering Analysis

Berdasarkan 5 gambar desain Google Stitch yang diberikan, berikut adalah hasil analisis *reverse engineering* untuk aplikasi **Derinos Group (Emerald Developments)**.

## A. Page Inventory

### Public Website
1. **Homepage** (Gambar 1)
   - Hero section dengan background image besar.
   - About/Intro section dengan statistik.
   - Property Discovery (Grid properti unggulan).
   - Call to Action (CTA) section (Schedule a Visit / Request Brochure).
2. **Project Detail Page** (Gambar 2)
   - Hero section dengan mini-nav dan *quick floating card* untuk tipe spesifik.
   - Quick Stats section (Lokasi, Luas, Total Unit, dll).
   - Masterplan & Types (Gambar siteplan + Grid tipe unit).
   - Construction Progress (Timeline / Stepper horizontal).
   - Premium Facilities & Strategic Location (Map).

### Admin Dashboard
3. **Overview / Main Dashboard** (Gambar 3)
   - High-level metrics (Total Projects, Active Construction, Total Units, Monthly Sales).
   - Sales Performance (Line Chart).
   - Unit Availability (Donut Chart).
   - Recent Activity & Project Progress.
4. **Unit Management Panel** (Gambar 4)
   - Filter bar (Search, Dropdown Projects, Status, House Type).
   - Data Table (ID, Project, Type, Size, Price, Status, Actions).
   - Pagination.

---

## B. Component Inventory

### Reusable Components
- **Navigation**:
  - Public Top Navbar (Transparent & Solid states).
  - Admin Sidebar (Dark theme, active states).
- **Buttons**:
  - Solid Primary (Green #064E3B)
  - Solid Secondary (Light Gray)
  - Solid Inverted (Dark Gray #2D2D2D)
  - Outlined (Bordered)
  - Icon Buttons (View, Edit, Delete)
- **Cards**:
  - Property Card (Image, Title, Price, Location, Features Badge).
  - Stat Card (Admin dashboard numbers).
  - Floating Quick Info Card (di Project Detail).
- **Data Display**:
  - Data Table dengan header dan baris hover.
  - Status Badges (Available: Green outline/text, Sold: Gray outline/text, Reserved: Gold/Yellow outline/text).
  - Stepper / Timeline (Construction progress).
- **Inputs**:
  - Search Input dengan icon (di Header dan Table Filter).
  - Dropdown Select (di Table Filter).
- **Charts**:
  - Line Chart (Sales Performance).
  - Donut Chart (Unit Availability).
  - Linear Progress Bar (Unit Sold %, Project Progress).

---

## C. Design System (Architectural Prestige)

### 1. Colors
- **Primary**: `#064E3B` (Emerald Green) - Digunakan untuk brand, primary buttons, header admin.
- **Secondary**: `#C5A059` (Gold/Sand) - Digunakan untuk aksen, active states, status Reserved.
- **Tertiary**: `#2D2D2D` (Dark Charcoal) - Digunakan untuk teks utama, admin sidebar, inverted buttons.
- **Neutral**: `#F9F7F2` (Warm Off-White) - Digunakan untuk background halaman, background card.
- **Danger**: Merah (dari icon trash) untuk aksi destruktif.

### 2. Typography
- **Headlines / Titles**: `Libre Caslon Text` (Serif) - Memberikan kesan premium, elegan, dan arsitektural.
- **Body & Labels**: `Inter` (Sans-Serif) - Sangat bersih dan mudah dibaca untuk data, UI element, dan paragraf.

### 3. Spacing & Layout
- Penggunaan *white-space* yang sangat lega (airy) untuk kesan mewah.
- Layout berbasis 12-column grid. Max-width container di public page sekitar 1200px - 1440px.

### 4. Radius & Shadows
- **Border Radius**: Desain sangat dominan menggunakan sudut tajam (sharp corners / `0px` radius) pada button, card, dan image. Ini menguatkan tema arsitektur dan maskulin. Hanya sedikit elemen (seperti status badge atau icon) yang memiliki radius sangat kecil.
- **Shadows**: Sangat minimalis (flat design). Drop shadow nyaris tidak terlihat, fokus pada garis (borders) dan kontras warna background.

---

## D. User Flow

### 1. Public / Visitor Flow (Visitor → Project → Property → Lead)
1. **Visitor** mendarat di **Homepage**. Melihat sekilas *brand identity* dan properti unggulan.
2. Mengklik "View Our Projects" atau salah satu properti, masuk ke **Project Detail Page**.
3. Di **Project Detail**, visitor mengeksplorasi masterplan, tipe unit (36, 45, dsb), fasilitas, dan progress pembangunan.
4. Visitor tertarik dan mengklik tombol *Schedule a Visit* atau *Inquire* / *Request Brochure*.
5. Data visitor tersimpan sebagai **Lead** di sistem.

### 2. Admin Flow (Admin → Management)
1. **Admin** login dan melihat **Overview Dashboard** (mendapat *birds-eye view* dari sales, progress, dan stok unit).
2. Admin mengeklik menu **Units** di sidebar untuk mengelola stok properti.
3. Di **Unit Management**, admin dapat melihat unit yang *Available*, mengubah status unit menjadi *Reserved* (jika ada *Booking* dari Lead), atau *Sold* (jika *Sales* selesai).
4. Alur relasional sistem:
   - *Projects* memiliki *Properties (Units)* dan *Construction Updates*.
   - *Leads* bisa melakukan *Booking* terhadap *Property*.
   - *Booking* yang terkonfirmasi menjadi *Sales*.

---

## E. Technical Requirements

Berdasarkan UI, berikut adalah fitur teknis esensial yang diperlukan:

1. **Database & API**:
   - Struktur relasional yang kompleks (Projects, Units, Leads, Sales, Construction).
   - RESTful API atau GraphQL untuk menyuplai data ke Frontend (terutama untuk SPA Admin).
2. **Authentication & Authorization**:
   - Sistem login untuk Admin Panel dengan Role (Super Admin, Sales, dll).
3. **Image & File Storage**:
   - Hero images, gallery, floor plans (resolusi tinggi butuh optimasi).
   - Brosur (PDF).
   - *Cloud storage* (seperti AWS S3 atau Firebase Storage).
4. **Search & Filtering**:
   - Fitur pencarian unit berdasarkan ID, filter berdasarkan Project, Status, dan Tipe Rumah (real-time atau server-side).
5. **Charts & Analytics**:
   - Library visualisasi data (seperti Recharts atau Chart.js) untuk Line chart dan Donut chart di dashboard.
6. **Maps**:
   - Integrasi Google Maps API atau Mapbox untuk bagian "Strategic Location" di Project Detail.
7. **Dynamic Content (CMS)**:
   - Data persentase progress konstruksi, status ketersediaan unit, harga "Starting from" harus terhitung secara otomatis atau mudah di-update.
