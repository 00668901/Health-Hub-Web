# Fitur Dashboard Pasien - Health Hub 2.0

## Ringkasan Update
Telah ditambahkan beberapa fitur lengkap ke dashboard mode pasien untuk meningkatkan pengalaman pengguna.

## Fitur Baru yang Ditambahkan

### 1. Dashboard PatientHome yang Diperkaya
**File:** `/pages/patient/PatientHome.tsx`

#### A. Informasi Nomor Rekam Medis
- Menampilkan nomor rekam medis pasien di banner utama
- Format: MR-YYYY-XXX (contoh: MR-2024-001)
- Ditampilkan dengan style card yang menonjol

#### B. Daftar Dokter Rumah Sakit
- Menampilkan semua dokter yang tersedia di rumah sakit
- Design mirip dengan halaman Health Tips (card dengan gradient)
- Informasi yang ditampilkan:
  - Nama dan spesialisasi dokter
  - Rating dan jumlah review
  - Tahun pengalaman
  - Jadwal ketersediaan (hari)
- Gradient warna berdasarkan spesialisasi:
  - Kardiologi: Merah-Pink
  - Pediatri: Biru-Cyan
  - Bedah Umum: Ungu-Pink
  - Dokter Gigi: Hijau-Emerald
  - Penyakit Dalam: Indigo-Purple
  - Mata: Orange-Red

#### C. Cara Pembayaran
- Card untuk setiap metode pembayaran dengan gradient berbeda:
  - **Debit Card** (Biru): Bayar dengan kartu debit
  - **QRIS** (Ungu): Scan QR untuk bayar
  - **Cash** (Hijau): Bayar tunai di kasir
  - **KIS/BPJS** (Orange): Potongan hingga 70%
- Dialog info lengkap pembayaran

#### D. Cetak Invoice
- Input nomor rekam medis untuk cari invoice
- Tombol cetak untuk mencetak invoice
- Tombol "Lihat Semua" untuk membuka dialog dengan daftar invoice
- Dialog detail invoice dengan:
  - Informasi lengkap invoice
  - Rincian biaya per item
  - Total dan potongan (jika ada)
  - Status pembayaran
  - Tombol cetak yang siap print

### 2. Fitur Kamar Rawat Inap yang Ditingkatkan
**File:** `/pages/patient/SearchRooms.tsx`

#### A. Statistik Kamar
- Card statistik menampilkan:
  - Jumlah kamar tersedia (hijau)
  - Jumlah kamar terisi (merah)
  - Total kamar (biru)

#### B. Ketersediaan Berdasarkan Tipe
- Card untuk setiap tipe ruangan:
  - VIP (⭐ kuning-orange)
  - ICU (🏥 merah-pink)
  - Reguler (🏨 biru-cyan)
- Menampilkan jumlah tersedia vs total

#### C. Filter Pencarian yang Ditingkatkan
- Filter berdasarkan:
  - Tanggal
  - Waktu
  - Tipe ruangan (VIP/ICU/Reguler)

#### D. Tabs Kamar Tersedia/Terisi
- **Tab "Kamar Tersedia":**
  - Menampilkan semua kamar yang kosong
  - Badge hijau "Tersedia"
  - Harga per hari
  - Daftar fasilitas
  - Tombol booking aktif
  
- **Tab "Kamar Terisi":**
  - Menampilkan kamar yang sedang digunakan
  - Badge merah "Terisi"
  - Informasi pasien yang sedang menempati
  - Tombol booking disabled

#### E. Informasi Detail Kamar
- Nama dan nomor kamar
- Tipe ruangan dengan icon
- Kapasitas dan lantai
- Harga per hari (format Rupiah)
- Daftar fasilitas dengan badge

### 3. Navigasi yang Diperbaiki
**File:** `/layouts/PatientLayout.tsx`

- Menu navigation di bottom bar diupdate:
  - Home (akses langsung ke dashboard)
  - Booking
  - Dokter
  - Ruangan
  - Janji
  - Invoice
  - Kalender
  - Tips

### 4. Data Sample yang Diperkaya
**File:** `/contexts/DataContext.tsx`

#### A. Data Ruangan
- 12 ruangan total:
  - 3 ruangan VIP (1 terisi, 2 tersedia)
  - 3 ruangan ICU (1 terisi, 2 tersedia)
  - 6 ruangan Reguler (1 terisi, 5 tersedia)
- Setiap ruangan memiliki:
  - Harga per hari
  - Daftar fasilitas lengkap
  - Status real-time

#### B. Invoice Sample
- 2 invoice sample untuk demo:
  - INV-2025-001: Ahmad Fauzi (Konsultasi Kardiologi, Debit)
  - INV-2025-002: Siti Nurhaliza (Konsultasi Pediatri, BPJS)

## Integrasi dengan Sistem yang Ada

### Data Context
- Semua data tersimpan di localStorage
- Terintegrasi penuh dengan DataContext
- Mendukung operasi CRUD

### Autentikasi
- Menggunakan AuthContext untuk identifikasi user
- Mencocokkan patient dengan email/phone
- Menampilkan data spesifik untuk user yang login

### Styling
- Konsisten dengan tema aplikasi (biru dominan)
- Responsive design (mobile & desktop)
- Dark mode support
- Motion/Framer Motion animations

## Cara Penggunaan

### Untuk Pasien:
1. Login dengan role "patient"
2. Dashboard akan menampilkan:
   - Nomor rekam medis Anda
   - Daftar dokter yang tersedia
   - Cara pembayaran
   - Janji temu mendatang
3. Untuk cetak invoice:
   - Masukkan nomor rekam medis di field yang tersedia
   - Klik tombol "Cetak"
   - Invoice akan muncul dan siap di-print
4. Untuk cek kamar:
   - Klik menu "Ruangan" atau tombol "Cari Ruangan"
   - Lihat statistik dan ketersediaan
   - Filter berdasarkan tipe jika perlu
   - Switch antara tab "Tersedia" dan "Terisi"

## Teknologi yang Digunakan
- React + TypeScript
- Tailwind CSS
- Motion (Framer Motion)
- Shadcn/ui Components
- React Router
- Lucide Icons
- Sonner (Toast notifications)

## File yang Dimodifikasi
1. `/pages/patient/PatientHome.tsx` - Dashboard utama pasien
2. `/pages/patient/SearchRooms.tsx` - Halaman cari ruangan
3. `/layouts/PatientLayout.tsx` - Layout navigation
4. `/contexts/DataContext.tsx` - Data initial dan interface
