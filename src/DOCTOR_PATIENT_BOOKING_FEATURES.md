# Fitur Booking Dokter & Pasien - Health Hub 2.0

## Fitur yang Ditambahkan

### 1. **Profil Dokter yang Lengkap** (`/pages/doctor/DoctorProfile.tsx`)
- ✅ Tampilan profil dokter dengan spesialisasi (Kardiologi, Pediatri, dll)
- ✅ Fitur upload foto profil menggunakan input file
- ✅ Edit profil dengan informasi lengkap:
  - Nama lengkap
  - Email & Telepon
  - Spesialisasi (dropdown dengan 10+ pilihan)
  - Pengalaman (tahun)
  - Nomor Lisensi (SIP)
- ✅ Menampilkan jadwal praktek rutin
- ✅ Statistik dokter (rating, reviews, pengalaman)

### 2. **Kalender Dokter dengan Jadwal Pasien** (`/pages/doctor/DoctorCalendar.tsx`)
- ✅ Tampilan jadwal praktek rutin per hari
- ✅ Daftar janji temu mendatang (upcoming appointments)
- ✅ Filter berdasarkan hari dalam seminggu
- ✅ Menampilkan detail pasien yang akan dirawat:
  - Nama pasien
  - Nomor rekam medis
  - Tanggal & waktu
  - Jenis konsultasi
  - Catatan pasien
- ✅ Pengelompokan pasien per tanggal
- ✅ Statistik appointment (terjadwal, selesai, total)

### 3. **Riwayat Medis dengan Pencarian & Download JSON** (`/pages/doctor/MedicalHistory.tsx`)
- ✅ Pencarian berdasarkan:
  - Nama pasien
  - Nomor rekam medis (MR-YYYY-XXX)
  - Diagnosis
- ✅ Filter berdasarkan tipe tindakan
- ✅ Download individual record sebagai JSON
- ✅ Download semua filtered records sebagai JSON
- ✅ Format JSON dapat dibuka di Excel atau aplikasi spreadsheet lainnya

### 4. **Booking Pasien ke Dokter Spesifik** (`/pages/patient/SearchDoctors.tsx`)
- ✅ Tampilan daftar dokter dengan spesialisasi lengkap
- ✅ Dialog booking yang menampilkan:
  - Foto/avatar dokter
  - Nama & spesialisasi
  - Pengalaman dan jadwal tersedia
- ✅ Booking terhubung langsung ke dokter yang dipilih
- ✅ Menyimpan `doctorId` dan `patientId` untuk tracking yang tepat
- ✅ Toast notification dengan nama dokter saat booking berhasil

### 5. **My Appointments dengan Info Dokter Lengkap** (`/pages/patient/MyAppointments.tsx`)
- ✅ Menampilkan spesialisasi dokter pada setiap appointment
- ✅ Detail kontak dokter (email & phone)
- ✅ Icon dan visual yang lebih informatif
- ✅ Format tanggal dalam Bahasa Indonesia (hari, tanggal lengkap)

## Koneksi Data

### Appointment → Doctor
Setiap appointment sekarang menyimpan:
```typescript
{
  doctorId: string,      // ID dokter dari database
  doctorName: string,    // Nama dokter
  patientId: string,     // ID pasien
  patientName: string,   // Nama pasien
  date: string,
  time: string,
  type: string,
  status: string,
  notes: string
}
```

### Doctor Profile
Setiap dokter memiliki:
```typescript
{
  id: string,
  name: string,
  specialty: string,     // Spesialisasi (Kardiologi, Pediatri, dll)
  experience: number,    // Tahun pengalaman
  rating: number,
  reviews: number,
  availability: string[],
  schedule: DoctorSchedule[],
  avatar: string,        // URL foto profil (dapat diupload)
  email: string,
  phone: string,
  license: string        // Nomor SIP
}
```

## Cara Menggunakan

### Upload Foto Profil Dokter:
1. Login sebagai dokter
2. Buka menu "Profil Saya"
3. Hover pada foto profil
4. Klik icon kamera yang muncul
5. Pilih gambar dari komputer
6. Foto akan otomatis terupdate

### Melihat Jadwal Pasien:
1. Login sebagai dokter
2. Buka menu "Kalender Saya"
3. Lihat section "Janji Temu Mendatang"
4. Filter berdasarkan hari jika diperlukan
5. Scroll ke bawah untuk melihat "Daftar Pasien Per Tanggal"

### Download Riwayat Medis sebagai JSON:
1. Login sebagai dokter
2. Buka menu "Riwayat Medis"
3. Gunakan filter atau pencarian jika perlu
4. Klik tombol "Unduh" pada record yang diinginkan ATAU
5. Klik "Unduh Semua JSON" untuk download semua data yang terfilter
6. File JSON akan terdownload dan bisa dibuka di Excel

### Booking Dokter oleh Pasien:
1. Login sebagai pasien
2. Buka menu "Cari Dokter"
3. Cari berdasarkan nama atau spesialisasi
4. Klik "Buat Janji" pada dokter yang diinginkan
5. Pilih tanggal dan waktu
6. Isi catatan jika ada
7. Klik "Konfirmasi Booking"
8. Appointment akan muncul di "Janji Temu Saya" dan juga di kalender dokter

## Teknologi yang Digunakan

- **React + TypeScript** untuk type safety
- **Tailwind CSS** untuk styling
- **Motion/React** untuk animasi
- **Lucide React** untuk icons
- **LocalStorage** untuk persistensi data
- **Context API** untuk state management

## File yang Dimodifikasi

1. `/pages/doctor/DoctorProfile.tsx` - Profil dokter lengkap dengan upload foto
2. `/pages/doctor/DoctorCalendar.tsx` - Kalender dengan jadwal pasien
3. `/pages/doctor/MedicalHistory.tsx` - Riwayat medis dengan pencarian & download JSON
4. `/pages/patient/SearchDoctors.tsx` - Booking dokter dengan info lengkap
5. `/pages/patient/MyAppointments.tsx` - Appointments dengan detail dokter

## Data Flow

```
Pasien Booking → SearchDoctors
    ↓
Simpan Appointment (doctorId + patientId)
    ↓
Muncul di MyAppointments (Pasien) + DoctorCalendar (Dokter)
    ↓
Dokter dapat melihat jadwal pasien dan detail lengkapnya
```

## Fitur Spesialisasi yang Tersedia

1. Kardiologi
2. Pediatri
3. Bedah Umum
4. Dokter Gigi
5. Penyakit Dalam
6. Mata
7. THT
8. Kulit
9. Neurologi
10. Ortopedi

Setiap spesialisasi dapat dipilih saat edit profil dokter, dan akan ditampilkan di semua halaman terkait (search, appointments, schedule, dll).
