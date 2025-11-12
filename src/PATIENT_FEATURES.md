# Fitur Baru Mode Pasien - Health Hub 2.0

## 📋 Ringkasan Fitur

Telah ditambahkan fitur-fitur lengkap untuk mode pasien yang mencakup:

### 1. **Spesialisasi Dokter** 🩺
- Dokter dikelompokkan berdasarkan spesialisasi:
  - Kardiologi (Jantung)
  - Pediatri (Anak)
  - Bedah Umum
  - Dokter Gigi
  - Penyakit Dalam
  - Mata
- Pasien dapat memilih spesialisasi terlebih dahulu sebelum memilih dokter

### 2. **Jadwal Dokter Mingguan** 📅
- Halaman **Jadwal Dokter** (`/patient/doctor-schedule`) menampilkan:
  - Jadwal praktek setiap dokter per hari dalam seminggu
  - Waktu praktek (jam mulai - jam selesai)
  - Contoh: Dr. Siti Rahmawati (Dokter Gigi) bertugas Senin 08:00-14:00
  - Filter berdasarkan spesialisasi
  - Tab untuk melihat jadwal per hari (Senin - Minggu)

### 3. **Sistem Booking Appointment Lengkap** 🎯
- Halaman **Book Appointment** (`/patient/book-appointment`) dengan 6 langkah:
  1. **Pilih Spesialisasi** - Pilih jenis dokter yang dibutuhkan
  2. **Pilih Dokter** - Lihat dokter berdasarkan spesialisasi
  3. **Pilih Jadwal** - Lihat jadwal mingguan dokter dan pilih tanggal/waktu
  4. **Data Pasien** - Isi/validasi identitas pasien
  5. **Pembayaran** - Pilih metode pembayaran dan jaminan
  6. **Konfirmasi** - Review dan konfirmasi booking

### 4. **Metode Pembayaran** 💳
Pasien dapat memilih metode pembayaran:
- **Cash** (Tunai)
- **Debit Card** (Kartu Debit)
- **QRIS** (Quick Response Indonesian Standard)

### 5. **Jaminan Kesehatan** 🏥
Pasien dapat menggunakan jaminan:
- **KIS** (Kartu Indonesia Sehat)
- **BPJS** (Badan Penyelenggara Jaminan Sosial)
- **Tidak Ada** (Bayar mandiri)

**Benefit:** Dengan jaminan KIS/BPJS, pasien mendapat potongan 70% dari total biaya!

### 6. **Nomor Rekam Medis** 📝
- **Pasien Lama:** 
  - Sistem otomatis mendeteksi pasien yang sudah terdaftar
  - Menampilkan nomor rekam medis yang sudah ada
  - Data pasien tidak perlu diisi ulang
  
- **Pasien Baru:**
  - Sistem menampilkan peringatan bahwa pasien harus mengisi identitas
  - Nomor rekam medis baru dibuat otomatis (format: MR-YYYY-XXX)
  - Data lengkap harus diisi: nama, usia, jenis kelamin, telepon, dll.

### 7. **Invoice & Cetak Invoice** 🧾
- Halaman **My Invoices** (`/patient/invoices`) untuk melihat semua invoice
- Fitur cetak invoice profesional
- Informasi lengkap dalam invoice:
  - Nomor invoice (format: INV-YYYY-XXXX)
  - Nomor rekam medis pasien
  - Data dokter dan pasien
  - Rincian biaya detail
  - Metode pembayaran
  - Status jaminan kesehatan
  - Total pembayaran
  - Status: LUNAS
- Tombol **Cetak Invoice** untuk print langsung

## 🗂️ File-file Baru yang Ditambahkan

1. `/pages/patient/BookAppointment.tsx` - Halaman booking appointment lengkap
2. `/pages/patient/DoctorSchedule.tsx` - Halaman jadwal dokter mingguan
3. `/pages/patient/MyInvoices.tsx` - Halaman invoice dengan fitur cetak

## 🔄 File-file yang Diupdate

1. `/contexts/DataContext.tsx` - Tambah interface untuk Payment, Invoice, DoctorSchedule
2. `/layouts/PatientLayout.tsx` - Update menu navigasi
3. `/App.tsx` - Tambah routing untuk halaman baru
4. `/pages/patient/SearchDoctors.tsx` - Perbaikan properti
5. `/pages/patient/MyAppointments.tsx` - Perbaikan status
6. `/pages/patient/PatientHome.tsx` - Simplifikasi dan update

## 📊 Data yang Ditambahkan

### Dokter dengan Jadwal Lengkap:
- 6 dokter dengan berbagai spesialisasi
- Setiap dokter memiliki jadwal praktek mingguan
- Format jadwal: hari, jam mulai, jam selesai

### Contoh Data Dokter:
```javascript
{
  name: 'Dr. Siti Rahmawati',
  specialty: 'Dokter Gigi',
  schedule: [
    { day: 'Senin', startTime: '08:00', endTime: '14:00' },
    { day: 'Rabu', startTime: '08:00', endTime: '14:00' },
    { day: 'Jumat', startTime: '13:00', endTime: '17:00' },
  ]
}
```

## 💾 Persistent Storage

Semua data tersimpan di **localStorage**:
- `healthhub_payments` - Data pembayaran
- `healthhub_invoices` - Data invoice
- Data tidak hilang saat refresh atau ganti theme

## 🎨 User Experience

### Flow Booking:
1. Pasien login
2. Klik "Buat Janji Baru" di dashboard
3. Pilih spesialisasi dokter
4. Lihat daftar dokter dan jadwalnya
5. Pilih tanggal dan waktu
6. Sistem cek apakah pasien lama/baru
7. Isi/konfirmasi data pasien
8. Pilih metode pembayaran & jaminan
9. Review dan konfirmasi
10. Booking berhasil & invoice otomatis dibuat

### Rincian Biaya:
- Biaya Konsultasi: Rp 150.000
- Biaya Admin: Rp 10.000
- Subtotal: Rp 160.000
- Pajak (10%): Rp 16.000
- **Total Tanpa Jaminan: Rp 176.000**
- **Total Dengan KIS/BPJS: Rp 48.000** (potongan 70%)

## 🎯 Fitur Tambahan

- **Progress Indicator:** 6 step dengan visual yang jelas
- **Validation:** Form validation di setiap langkah
- **Auto-detection:** Sistem otomatis mendeteksi pasien lama
- **Responsive Design:** Bekerja di desktop dan mobile
- **Toast Notifications:** Feedback real-time untuk user actions
- **Print-friendly Invoice:** Layout khusus untuk print

## 📱 Navigasi Menu Baru

Menu navigasi patient telah diupdate:
1. Beranda
2. **Booking** (Baru)
3. **Jadwal Dokter** (Baru)
4. Janji Saya
5. **Invoice** (Baru)
6. Cari Dokter
7. Cari Ruang
8. Kalender

## ✅ Status Implementasi

✅ Spesialisasi dokter berdasarkan bagian (gigi, kardiologi, dll)
✅ Jadwal dokter mingguan dengan hari dan waktu
✅ Metode pembayaran (Debit, QRIS, Cash)
✅ Jaminan kesehatan (KIS, BPJS)
✅ Cetak invoice
✅ Nomor rekam medis (pasien lama vs baru)
✅ Sistem booking terintegrasi penuh
✅ Data persistence dengan localStorage

Semua fitur telah diimplementasi dan siap digunakan! 🎉
