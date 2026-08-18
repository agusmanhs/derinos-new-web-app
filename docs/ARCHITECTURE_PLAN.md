# Architecture Plan: Derinos Group

## Rekomendasi Technology Stack
Karena repository masih kosong, berikut adalah rekomendasi stack terbaik untuk aplikasi *production-ready* skala besar ini:

- **Frontend & Backend Framework:** **Next.js (App Router)** + **TypeScript**.
  *Alasan:* Next.js mendukung Server-Side Rendering (SSR) untuk SEO website publik yang optimal, dan Client-Side Rendering (CSR) untuk Admin Dashboard yang dinamis.
- **Styling:** **Vanilla CSS / CSS Modules**.
  *Alasan:* Sesuai instruksi untuk menghindari TailwindCSS jika tidak diminta, Vanilla CSS memberikan fleksibilitas maksimal, desain yang sepenuhnya *custom*, dan performa tinggi tanpa utilitas berlebih.
- **Database & ORM:** **PostgreSQL** + **Prisma ORM**.
  *Alasan:* Struktur data aplikasi ini sangat relasional (Project -> Unit -> Lead -> Sales). PostgreSQL sangat tangguh, dan Prisma memberikan *type-safety* dari database hingga ke frontend.
- **Authentication:** **NextAuth.js (Auth.js)**.
  *Alasan:* Standar industri untuk Next.js, aman, dan mudah diintegrasikan dengan Prisma untuk *role-based access*.
- **State Management:** **Zustand** (untuk client state) & **React Server Components** (untuk server state).
- **Form Validation:** **React Hook Form** + **Zod**.
  *Alasan:* Performa tinggi untuk form kompleks (tidak sering re-render) dan validasi Zod bisa di-share ke API untuk keamanan berlapis.

---

## 1. Frontend Architecture
- Berbasis komponen modular (*Atomic Design* atau *Feature-Sliced Design* ringan).
- Pemisahan ketat antara *Server Components* (untuk fetch data cepat & SEO) dan *Client Components* (untuk interaktivitas seperti form & chart).

## 2. Backend Architecture
- Menggunakan arsitektur *Monolith Serverless* di dalam Next.js.
- Memanfaatkan **Next.js Route Handlers (`/api/*`)** dan **Server Actions** untuk operasi mutasi data yang lebih cepat dan aman langsung dari *Server Components*.

## 3. Database Architecture
- Relasional dengan *Foreign Keys* yang ketat (Cascading deletes untuk data yang relevan, atau Soft Deletes untuk data sensitif seperti Sales/Lead).

## 4. Authentication Architecture
- Menggunakan *Session-based authentication* via *HTTP-only Secure Cookies*.
- JWT token disimpan dengan aman dan divalidasi pada setiap request ke rute terlindungi.

## 5. Authorization / RBAC
- Pengecekan *Role* dilakukan di dua tingkat:
  1. **Middleware (Edge):** Mencegah akses halaman admin jika bukan admin.
  2. **Server Actions / API (Node):** Mengecek apakah agen sales berhak mengedit data spesifik (misal: hanya lead miliknya sendiri).

## 6. File/Media Storage
- Menggunakan **AWS S3** atau penyedia S3-compatible (seperti Supabase Storage / Cloudflare R2).
- URL gambar disimpan di database PostgreSQL. Ini wajib karena menyimpan file besar langsung di database atau server lokal (Vercel) akan merusak skalabilitas.

## 7. API Structure
- Sebagian besar data internal ditarik menggunakan *Server Components* secara langsung tanpa perlu API `fetch`.
- Endpoint RESTful (`/api/...`) diekspos untuk interaksi dari *Client Components* (misal: filter unit secara *real-time*).

## 8. Public Website Routing
- `/` - Homepage (SSG/ISR untuk kecepatan load maksimal)
- `/projects` - Daftar Proyek (SSG/ISR)
- `/projects/[slug]` - Detail Proyek (SSG/ISR, slug SEO-friendly)
- `/properties` - Listing semua unit dari berbagai proyek (SSR)
- `/properties/[id]` - Detail Unit Spesifik (SSR/SSG)
- `/construction`, `/gallery`, `/about`, `/contact` (Static)

## 9. Admin Routing
*(Semua berada di bawah Next.js route group `(admin)` dan dilindungi Middleware)*
- `/admin` - Dashboard Overview
- `/admin/projects` (CRUD Proyek & Masterplan)
- `/admin/units` (Manajemen inventori properti)
- `/admin/construction` (Update progress berkala)
- `/admin/leads` (CRM & Kanban board)
- `/admin/sales` (Booking & Transaksi)
- `/admin/settings` (CMS & Role Management)

## 10. State Management
- Global state dihindari sebisa mungkin menggunakan URL query params (untuk search/filter) agar bisa di-share.
- *Zustand* hanya digunakan untuk state yang sangat kompleks melintas komponen (misalnya sistem *Cart* atau drag-and-drop Kanban Leads).

## 11. Error Handling
- **Server:** Centralized Try/Catch di Server Actions.
- **Client:** React `ErrorBoundary` (`error.tsx`) untuk mencegah *white screen of death*.
- **UI:** Penggunaan *Toaster* untuk feedback sukses/gagal operasi.

## 12. SEO
- Implementasi Next.js Metadata API.
- Open Graph dinamis dan tag Schema.org / JSON-LD otomatis per proyek/properti untuk rich snippet Google.

## 13. Image Optimization
- Menggunakan komponen `next/image` untuk konversi otomatis ke WebP/AVIF, lazy loading, dan *responsive layout shift prevention*.

## 14. Testing Strategy
- **Unit Testing:** Jest & React Testing Library (Fokus pada utility functions dan reusable UI).
- **E2E Testing:** Playwright (Menguji flow kritikal: Pengisian form Lead, Login Admin, dan Update status Unit).

---

## Folder Structure (Next.js 14+)

```text
/
├── src/
│   ├── app/
│   │   ├── (public)/              # Rute Website Publik
│   │   │   ├── projects/[slug]/
│   │   │   ├── properties/[id]/
│   │   │   ├── layout.tsx         # Navbar & Footer Publik
│   │   │   └── page.tsx           # Homepage
│   │   ├── (admin)/               # Rute Dashboard Admin
│   │   │   ├── admin/
│   │   │   │   ├── projects/
│   │   │   │   ├── units/
│   │   │   │   └── page.tsx       # Admin Dashboard Overview
│   │   │   └── layout.tsx         # Sidebar & Header Admin
│   │   ├── api/                   # Route Handlers
│   ├── components/
│   │   ├── ui/                    # Reusable Button, Card, Modal (Desain Stitch)
│   │   ├── public/                # Komponen spesifik website (Hero, ProjCard)
│   │   └── admin/                 # Komponen spesifik admin (DataTable, Chart)
│   ├── lib/                       # Setup Prisma, AWS S3, Utils
│   ├── actions/                   # Server Actions (Mutations)
│   ├── types/                     # TypeScript Interfaces
│   └── styles/
│       ├── globals.css            # Base styles & CSS Reset
│       └── variables.css          # Design Tokens (Warna, Tipografi)
├── prisma/
│   └── schema.prisma              # Skema Database PostgreSQL
```

---

## Database ERD Konseptual & Entity Relationship

**Core Entities:**
1. **User**: ID, Name, Email, PasswordHash, RoleID
2. **Role**: ID, Name (SUPER_ADMIN, SALES_MANAGER, SALES)
3. **Project**: ID, Name, Slug, Status, Location, Description
4. **PropertyUnit**: ID, ProjectID, UnitNumber, Type, Price, Status, Size
5. **ConstructionPhase**: ID, ProjectID, Name, Progress, Status
6. **Lead**: ID, Name, Phone, Email, ProjectID, Status, AssignedTo (UserID)
7. **Booking/Sale**: ID, LeadID, UnitID, Amount, Status, Date

**Relationships:**
- `Project` **1-to-Many** `PropertyUnit`
- `Project` **1-to-Many** `ConstructionPhase`
- `User (Sales)` **1-to-Many** `Lead`
- `Lead` **1-to-Many** `Booking`
- `PropertyUnit` **1-to-1** `Booking` (Satu unit hanya bisa memiliki satu booking aktif)

---

## API Endpoint List (Internal via Actions/Handlers)
- `GET /api/public/projects` - Get all projects for homepage
- `GET /api/public/properties?type=36&project=xyz` - Filter property units
- `POST /api/leads` - Webhook/Submit form contact/inquire
- `POST /api/admin/projects` - Create new project
- `PATCH /api/admin/units/[id]` - Ubah status unit (Misal: Available -> Reserved)
- `POST /api/upload` - Upload image ke AWS S3, return URL

---

## Authentication Flow
1. Admin mengakses `/admin/login`.
2. Sistem mengecek session di cookies. Jika tidak ada, wajib login.
3. Submit kredensial. `NextAuth` memverifikasi hash password di PostgreSQL menggunakan adapter Prisma.
4. Jika sukses, HTTP-only cookie dibuat.
5. User di-*redirect* ke `/admin`. Middleware Next.js akan membaca *role* dari token untuk mengizinkan akses menu spesifik.

---

## Role & Permission Matrix

| Fitur / Modul | SUPER_ADMIN | SALES_MANAGER | SALES_AGENT |
| :--- | :--- | :--- | :--- |
| **Manage Projects** | Full Access (CRUD) | View Only | View Only |
| **Manage Units** | Full Access | Full Access | View Only |
| **Manage Leads** | Full Access | Full Access (Bisa assign ke agent) | View / Edit Lead Miliknya |
| **Manage Sales/Booking**| Full Access | Full Access | Create Booking |
| **CMS / Content** | Full Access | No Access | No Access |
| **User & Role Mgt.** | Full Access | No Access | No Access |
