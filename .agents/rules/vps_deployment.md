# VPS Deployment & Prisma Migration Rules

## 1. DILARANG Menjalankan Prisma CLI Engine di VPS
VPS tidak memiliki akses/sering mengalami timeout saat mengunduh binary engine Rust dari `https://binaries.prisma.sh/` (`schema-engine` / `debian-openssl-3.0.x`).
Oleh karena itu:
- **JANGAN PERNAH** menyuruh user menjalankan `npx prisma db push`, `npx prisma migrate`, atau `npx prisma generate` di VPS.

## 2. Prosedur Perubahan Skema Database (Prisma / PostgreSQL)
Jika terjadi penambahan model, tabel, atau kolom di database:
1. **Jalankan secara lokal:**
   - `npx prisma db push` (lokal)
   - `npx prisma generate` (lokal)
2. **Buat Script Migrasi Mandiri:**
   - Buat script migrasi di folder `scripts/` menggunakan koneksi langsung `pg` (`Pool` dari `'pg'`), contoh: `scripts/update-*.ts` yang mengeksekusi `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...;`.
3. **Instruksi Upload via SFTP:**
   - Selalu sertakan folder `generated/prisma/` dalam daftar upload SFTP agar VPS langsung memakai TypeScript client yang sudah digenerate di lokal tanpa perlu generate ulang di VPS.
   - Sertakan file script migrasi `scripts/update-*.ts`.
4. **Instruksi di VPS Hanya:**
   - `npx tsx scripts/update-*.ts` (hanya jika ada perubahan skema)
   - `npm run build`
   - `pm2 restart all`

## 3. Deployment SFTP Saja
- VPS tidak menggunakan `git pull`. Semua pembaruan kode ditransfer melalui SFTP.
