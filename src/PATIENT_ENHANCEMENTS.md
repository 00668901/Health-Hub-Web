# Patient Enhancements - Health Hub 2.0

## 🎯 Fitur Baru yang Ditambahkan

### 1. **Dashboard Button di Header** ✅

**Lokasi:** Pojok kanan atas, di bawah logo "Health Hub"

**Fitur:**
- Button "Dashboard" dengan icon LayoutDashboard
- Warna border emerald (hijau) sesuai tema pasien
- Hover effect dengan background emerald-50
- Dapat diakses dari **SEMUA halaman** mode pasien
- Quick access kembali ke dashboard dari mana saja

**Implementasi:**
```tsx
<Button
  variant="outline"
  onClick={() => navigate('/patient/dashboard')}
  className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
>
  <LayoutDashboard className="w-4 h-4" />
  Dashboard
</Button>
```

**Manfaat:**
- ✅ Tidak perlu ke Home dulu untuk akses Dashboard
- ✅ Navigasi cepat dari menu Cari Ruangan → Dashboard → Home
- ✅ Consistent navigation di semua halaman
- ✅ One-click access

---

### 2. **Halaman Profil Pasien Lengkap** ✅

**Path:** `/patient/profile`

**Fitur Utama:**

#### A. Auto-Detection Pasien
- Cek apakah pasien sudah terdaftar (by email/phone/name)
- Jika **sudah ada**: Tampilkan profil lengkap
- Jika **belum ada**: Tampilkan form registrasi

#### B. Form Registrasi untuk Pasien Baru

**Informasi Pribadi:**
- Nama Lengkap * (required)
- Email * (required)
- Nomor Telepon * (required)
- Tanggal Lahir
- Jenis Kelamin (dropdown: Laki-laki, Perempuan)
- Golongan Darah (dropdown: A, B, AB, O, A+, A-, B+, B-, AB+, AB-, O+, O-)
- Alamat (textarea)

**Kontak Darurat:**
- Nama Kontak Darurat
- Nomor Telepon Darurat
- Asuransi Kesehatan (BPJS, KIS, Swasta)

**Informasi Medis:**
- Alergi (obat, makanan, dll)
- Obat yang Sedang Dikonsumsi
- Riwayat Penyakit/Operasi

#### C. Profil Header Card (untuk pasien terdaftar)
- Avatar besar dengan icon user
- Gradient emerald-to-green background
- Menampilkan:
  - Nama lengkap
  - Email
  - Nomor telepon
  - Nomor rekam medis (auto-generated)
  - Status (Active badge)

#### D. Mode Edit
- Button "Edit Profil" di kanan atas
- Saat edit: Semua field menjadi editable
- Button "Simpan" dan "Batal"
- Validasi input sebelum save

#### E. Quick Stats
Grid 4 kolom dengan info:
1. **Terdaftar Sejak** - Tanggal registrasi
2. **Kunjungan Terakhir** - Last visit date
3. **No. Rekam Medis** - Medical record number
4. **Status** - Active badge

#### F. Avatar Clickable
- Avatar di header dapat diklik
- Langsung navigate ke `/patient/profile`
- Quick access tanpa menu

**Auto-Generated:**
- Patient ID: `PAT{timestamp}`
- Medical Record Number: `MR{timestamp}`
- Registration Date: Tanggal saat ini
- Status: Active

**Validasi:**
- Nama, email, dan phone wajib diisi
- Toast error jika ada field required yang kosong
- Toast success setelah berhasil save

**Alert untuk Pasien Baru:**
```
⚠️ Selamat datang! Silakan lengkapi profil Anda untuk dapat 
   menggunakan semua fitur Health Hub.
```

---

### 3. **Halaman Cara Pembayaran** ✅

**Path:** `/patient/payment-methods`

**4 Metode Pembayaran:**

#### A. 💳 Kartu Debit

**Features:**
- Pilih Bank dari dropdown (8 bank tersedia)
- Input nomor kartu (auto-format setiap 4 digit)
- Input nama pemegang kartu (auto uppercase)
- Input tanggal kadaluarsa (MM/YY format)
- Input CVV (3 digit, password masked)

**Bank yang Tersedia:**
1. 🏦 Bank Central Asia (BCA)
2. 🏦 Bank Negara Indonesia (BNI)
3. 🏦 Bank Rakyat Indonesia (BRI)
4. 🏦 Bank Mandiri
5. 🏦 CIMB Niaga
6. 🏦 Bank Danamon
7. 🏦 Bank Permata
8. 🏦 Bank Tabungan Negara (BTN)

**Form Validasi:**
- Nomor kartu: maksimal 16 digit, format otomatis dengan spasi
- Expiry: format MM/YY otomatis
- CVV: 3 digit, hidden
- Semua field required

**Demo Mode Alert:**
```
⚠️ Demo Mode: Data kartu tidak akan disimpan. 
   Ini hanya untuk demonstrasi fitur pembayaran.
```

**Dialog Features:**
- Clean modal design
- Real-time input formatting
- Validasi sebelum submit
- Toast success setelah "pembayaran"

#### B. 📱 QRIS (Quick Response Code Indonesian Standard)

**Features:**
- QR Code demo yang bisa di-scan
- Menggunakan QR Server API untuk generate QR
- Data QRIS lengkap dengan merchant info
- Kompatibel dengan semua e-wallet

**E-Wallet yang Didukung:**
- 💙 GoPay
- 💜 OVO
- 💚 DANA
- ❤️ LinkAja
- 🧡 ShopeePay
- Dan semua e-wallet QRIS lainnya

**QR Code:**
```
QR berisi data QRIS standar:
- Merchant: HEALTH HUB HOSPITAL
- Location: JAKARTA
- QRIS ID
- Amount (dynamic)
```

**Cara Pembayaran (Step-by-Step):**
1. Buka aplikasi e-wallet favorit
2. Pilih menu "Scan QR" atau "Bayar"
3. Scan QR Code yang ditampilkan
4. Konfirmasi pembayaran di aplikasi

**Demo Alert:**
```
✅ Demo QRIS: QR Code ini adalah contoh untuk demonstrasi. 
   Dapat di-scan oleh semua aplikasi e-wallet yang mendukung QRIS.
```

**QR Code Generation:**
- Real QR code using QR Server API
- Scannable dengan aplikasi real
- Data QRIS sesuai standar Indonesia
- 200x200 pixels, centered

#### C. 💵 Tunai (Cash)

**Features:**
- Bayar langsung di loket kasir
- Tersedia 24/7
- Langsung terverifikasi
- Toast notification saat klik

**Info:**
```
ℹ️ Silakan datang ke loket kasir untuk pembayaran tunai
```

#### D. 🛡️ Asuransi/BPJS

**Features:**
- Gunakan kartu asuransi
- Potongan hingga 70%
- Proses 1-3 hari kerja
- Support: BPJS Kesehatan, KIS, Asuransi Swasta

**Info:**
```
ℹ️ Tunjukkan kartu asuransi/BPJS Anda ke petugas
```

---

### 4. **Payment Method Cards Design**

**Setiap Card Menampilkan:**
- Icon dengan gradient background unik
- Nama metode pembayaran
- Deskripsi singkat
- Badge untuk fee/discount info
- List fitur dengan checkmark
- Processing time
- Hover effect dengan border primary
- Clickable dengan cursor pointer

**Color Coding:**
- **Debit Card**: Blue gradient (from-blue-500 to-blue-600)
- **QRIS**: Purple gradient (from-purple-500 to-purple-600)
- **Cash**: Green gradient (from-green-500 to-green-600)
- **Insurance**: Orange gradient (from-orange-500 to-orange-600)

**Processing Times:**
- Debit Card: Instan
- QRIS: Instan
- Cash: Instan
- Insurance: 1-3 hari kerja

**Fees:**
- Debit Card: Gratis
- QRIS: Gratis
- Cash: Gratis
- Insurance: Potongan 70%

---

## 🔐 Security Features

### Payment Security Card
```
🛡️ Pembayaran Aman & Terenkripsi

Semua transaksi pembayaran dilindungi dengan enkripsi SSL 256-bit. 
Data kartu Anda tidak akan disimpan di server kami. Kami bekerja sama 
dengan payment gateway terpercaya untuk menjamin keamanan transaksi Anda.
```

---

## 📱 Mobile Bottom Navigation Update

**New Menu Items (6 total):**
1. 🏠 Home
2. 📊 Dashboard
3. ➕ Booking
4. 🔍 Dokter
5. 📅 Janji
6. 👤 Profil (NEW!)

**Removed from mobile nav** (accessible via header/dashboard):
- Ruangan
- Invoice
- Kalender
- Tips

---

## 🎨 UI/UX Improvements

### 1. Dashboard Button
- **Position**: Right side of header, below logo
- **Style**: Outlined with emerald border
- **Visibility**: All patient pages
- **Responsive**: Desktop only (mobile uses bottom nav)

### 2. Profile Avatar
- **Clickable**: Yes
- **Action**: Navigate to profile
- **Tooltip**: (optional) "Lihat Profil"
- **Color**: Emerald background

### 3. Payment Dialogs
- **Modal size**: max-w-md
- **Close on backdrop**: Yes
- **ESC to close**: Yes
- **Responsive**: Full width on mobile

### 4. Form Inputs
- **Auto-formatting**: Card number, expiry date
- **Validation**: Real-time
- **Error messages**: Toast notifications
- **Disabled state**: When not editing

---

## 🔄 Data Flow

### Profile Registration Flow:
```
User clicks Profile Avatar / Menu
    ↓
Check if patient exists in DataContext
    ↓
If NOT exists:
  - Show registration form
  - isNewPatient = true
  - isEditing = true
  - Show alert message
    ↓
User fills form
    ↓
Click "Simpan & Daftar"
    ↓
Validate required fields
    ↓
addPatient() to DataContext
    ↓
Save to localStorage
    ↓
Toast success
    ↓
Show complete profile
```

### Profile Edit Flow:
```
User in Profile page (existing patient)
    ↓
Click "Edit Profil"
    ↓
isEditing = true
    ↓
All fields become editable
    ↓
User modifies data
    ↓
Click "Simpan"
    ↓
Validate
    ↓
updatePatient(id, data)
    ↓
Save to localStorage
    ↓
Toast success
    ↓
isEditing = false
```

### Payment Method Flow:
```
User clicks payment card
    ↓
Open respective dialog
    ↓
If Debit:
  - Show bank selection
  - Show card form
  - Validate input
  - Demo payment success
    ↓
If QRIS:
  - Show QR code
  - Show instructions
  - List supported e-wallets
    ↓
If Cash/Insurance:
  - Show toast with instructions
```

---

## 💾 LocalStorage Updates

### New Data Stored:

**Patient Profile:**
```json
{
  "id": "PAT1234567890",
  "medicalRecordNumber": "MR1234567890",
  "name": "John Doe",
  "email": "john@email.com",
  "phone": "08123456789",
  "dateOfBirth": "1990-01-01",
  "gender": "Laki-laki",
  "bloodType": "O+",
  "address": "Jl. Example No. 123",
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "08987654321",
  "allergies": "Penisilin",
  "medications": "Vitamin C",
  "medicalHistory": "Operasi usus buntu 2020",
  "insurance": "BPJS Kesehatan",
  "registrationDate": "2025-01-01T00:00:00.000Z",
  "lastVisit": "2025-01-15T00:00:00.000Z",
  "status": "Active",
  "age": 35
}
```

---

## 🧪 Testing Checklist

### Dashboard Button:
- [x] Visible di header semua halaman pasien
- [x] Klik navigate ke /patient/dashboard
- [x] Hover effect bekerja
- [x] Responsive (desktop only)
- [x] Icon dan text aligned

### Profile Page:
- [x] Deteksi pasien baru vs existing
- [x] Form registrasi untuk pasien baru
- [x] Alert muncul untuk pasien baru
- [x] Edit mode untuk pasien existing
- [x] Validasi required fields
- [x] Save data ke localStorage
- [x] Avatar clickable navigate to profile
- [x] All fields editable saat edit mode
- [x] Cancel restore original data

### Payment Methods:
- [x] 4 kartu metode pembayaran ditampilkan
- [x] Debit card dialog buka dengan bank selection
- [x] Card number auto-format
- [x] Expiry date auto-format (MM/YY)
- [x] CVV masked dan max 3 digit
- [x] Validasi semua field required
- [x] Demo payment toast success
- [x] QRIS dialog tampil QR code
- [x] QR code scannable
- [x] E-wallet badges ditampilkan
- [x] Instructions step-by-step clear
- [x] Cash toast notification
- [x] Insurance toast notification
- [x] Security card info ditampilkan

### Mobile Navigation:
- [x] 6 items di bottom nav
- [x] Profile icon & label
- [x] Navigate ke /patient/profile
- [x] Active state highlight

---

## 📝 Files Modified/Created

### New Files:
1. `/pages/patient/PatientProfile.tsx` - Full profile page with registration
2. `/pages/patient/PaymentMethods.tsx` - Payment methods selection
3. `/PATIENT_ENHANCEMENTS.md` - This documentation

### Modified Files:
1. `/layouts/PatientLayout.tsx`
   - Added Dashboard button in header
   - Made avatar clickable
   - Updated mobile nav items

2. `/App.tsx`
   - Added PatientProfile route
   - Added PaymentMethods route

3. `/pages/patient/PatientDashboard.tsx`
   - Updated payment card link to /payment-methods

---

## 🎯 Key Benefits

### User Experience:
- ✅ Quick access ke dashboard dari mana saja
- ✅ Profile management yang lengkap
- ✅ Multiple payment options
- ✅ Demo payment untuk testing
- ✅ Scannable QRIS code
- ✅ Bank selection untuk debit card
- ✅ Auto-format input fields
- ✅ Real-time validation

### Security:
- ✅ No sensitive data stored
- ✅ Demo mode clearly indicated
- ✅ SSL encryption info displayed
- ✅ Password masked CVV

### Data Management:
- ✅ Auto-generate patient ID
- ✅ Auto-generate medical record number
- ✅ Persistent data in localStorage
- ✅ Easy edit/update mechanism

---

## 🚀 Usage Examples

### Akses Dashboard dari Ruangan:
```
1. User di halaman "Cari Ruangan"
2. Klik button "Dashboard" di kanan atas
3. Langsung ke Dashboard
4. Klik menu "Home" untuk balik ke home
```

### Registrasi Pasien Baru:
```
1. Login sebagai pasien baru
2. Klik avatar atau menu Profile
3. Lihat form registrasi
4. Isi semua field required (nama, email, phone)
5. Isi informasi tambahan (optional)
6. Klik "Simpan & Daftar"
7. Profil tersimpan, dapat langsung booking
```

### Pembayaran dengan Debit Card:
```
1. Buka Dashboard → Cara Pembayaran
2. Atau langsung ke /patient/payment-methods
3. Klik card "Kartu Debit"
4. Pilih Bank (misal: BCA)
5. Isi nomor kartu: 1234567890123456
6. Isi nama: JOHN DOE
7. Isi expiry: 12/25
8. Isi CVV: 123
9. Klik "Bayar Sekarang"
10. Success notification
```

### Pembayaran dengan QRIS:
```
1. Buka Dashboard → Cara Pembayaran
2. Klik card "QRIS"
3. QR Code ditampilkan
4. Buka GoPay/OVO/DANA/etc
5. Scan QR Code
6. Konfirmasi pembayaran di aplikasi
7. Done!
```

---

## 🎨 Design Tokens Used

### Colors:
- **Primary**: Emerald/Green (patient theme)
- **Debit**: Blue gradient
- **QRIS**: Purple gradient
- **Cash**: Green gradient
- **Insurance**: Orange gradient

### Icons:
- Dashboard: LayoutDashboard
- Profile: UserCircle
- Debit: CreditCard
- QRIS: QrCode
- Cash: Banknote
- Insurance: Shield

### Spacing:
- Card padding: 6 (p-6)
- Grid gap: 4-6
- Form spacing: 4

### Typography:
- Headers: h1, h2, h3 (default from globals.css)
- Body: text-sm, text-muted-foreground
- Labels: Label component

---

## 🔮 Future Enhancements (Ideas)

1. **Profile Photo Upload**
   - Allow users to upload actual photos
   - Image cropping functionality

2. **Payment History**
   - Link payment methods to invoices
   - Transaction history page

3. **Multiple Payment Methods**
   - Save multiple cards
   - Default payment method

4. **E-Wallet Integration**
   - Direct integration with GoPay API
   - OVO API integration

5. **Real QRIS Generation**
   - Generate unique QRIS per transaction
   - Real-time payment status

6. **Profile Verification**
   - Email verification
   - Phone OTP verification

7. **Family Members**
   - Add family member profiles
   - Manage appointments for family

---

## ✅ Summary

Semua fitur yang diminta telah berhasil diimplementasikan:

1. ✅ **Dashboard Button** di pojok kanan header - accessible dari semua menu
2. ✅ **Profile Page** dengan auto-detection dan registrasi form lengkap
3. ✅ **Payment Methods** dengan 8 pilihan bank untuk debit card
4. ✅ **QRIS Demo** dengan QR code yang bisa di-scan dan kompatibel dengan semua e-wallet
5. ✅ **Avatar Clickable** untuk quick access ke profile
6. ✅ **Mobile Navigation** updated dengan menu Profile

Semua terintegrasi dengan localStorage dan responsive di semua device! 🎉
