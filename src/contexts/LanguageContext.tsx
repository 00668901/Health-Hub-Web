import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  id: {
    // Common
    'common.home': 'Beranda',
    'common.dashboard': 'Dashboard',
    'common.patients': 'Pasien',
    'common.doctors': 'Dokter',
    'common.nurses': 'Perawat',
    'common.calendar': 'Kalender',
    'common.settings': 'Pengaturan',
    'common.logout': 'Keluar',
    'common.save': 'Simpan',
    'common.cancel': 'Batal',
    'common.delete': 'Hapus',
    'common.edit': 'Edit',
    'common.add': 'Tambah',
    'common.search': 'Cari',
    'common.filter': 'Filter',
    'common.export': 'Ekspor',
    'common.yes': 'Ya',
    'common.no': 'Tidak',
    'common.loading': 'Memuat...',
    
    // Admin
    'admin.welcome': 'Selamat Datang, Administrator',
    'admin.manage': 'Kelola Admin',
    'admin.admins': 'Admin',
    'admin.performance': 'Kinerja',
    'admin.rooms': 'Ruangan',
    'admin.addAdmin': 'Tambah Admin',
    'admin.username': 'Username',
    'admin.password': 'Password',
    'admin.role': 'Peran',
    
    // Doctor
    'doctor.welcome': 'Selamat Datang, Dokter',
    'doctor.myPatients': 'Pasien Saya',
    'doctor.mySchedule': 'Jadwal Saya',
    'doctor.profile': 'Profil',
    'doctor.reschedule': 'Ubah Jadwal',
    'doctor.cancelSchedule': 'Batalkan Jadwal',
    'doctor.medicalHistory': 'Riwayat Tindakan',
    
    // Patient
    'patient.welcome': 'Selamat Datang',
    'patient.makeAppointment': 'Buat Janji Baru',
    'patient.myAppointments': 'Janji Temu Saya',
    'patient.searchDoctors': 'Cari Dokter',
    'patient.searchRooms': 'Cari Ruangan',
    'patient.healthTips': 'Tips Kesehatan',
    'patient.healthNews': 'Berita Kesehatan',
    
    // Settings
    'settings.theme': 'Tema',
    'settings.language': 'Bahasa',
    'settings.darkMode': 'Mode Gelap',
    'settings.lightMode': 'Mode Terang',
    'settings.indonesian': 'Bahasa Indonesia',
    'settings.english': 'English',
  },
  en: {
    // Common
    'common.home': 'Home',
    'common.dashboard': 'Dashboard',
    'common.patients': 'Patients',
    'common.doctors': 'Doctors',
    'common.nurses': 'Nurses',
    'common.calendar': 'Calendar',
    'common.settings': 'Settings',
    'common.logout': 'Logout',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.loading': 'Loading...',
    
    // Admin
    'admin.welcome': 'Welcome, Administrator',
    'admin.manage': 'Manage Admins',
    'admin.admins': 'Admins',
    'admin.performance': 'Performance',
    'admin.rooms': 'Rooms',
    'admin.addAdmin': 'Add Admin',
    'admin.username': 'Username',
    'admin.password': 'Password',
    'admin.role': 'Role',
    
    // Doctor
    'doctor.welcome': 'Welcome, Doctor',
    'doctor.myPatients': 'My Patients',
    'doctor.mySchedule': 'My Schedule',
    'doctor.profile': 'Profile',
    'doctor.reschedule': 'Reschedule',
    'doctor.cancelSchedule': 'Cancel Schedule',
    'doctor.medicalHistory': 'Medical History',
    
    // Patient
    'patient.welcome': 'Welcome',
    'patient.makeAppointment': 'Make New Appointment',
    'patient.myAppointments': 'My Appointments',
    'patient.searchDoctors': 'Search Doctors',
    'patient.searchRooms': 'Search Rooms',
    'patient.healthTips': 'Health Tips',
    'patient.healthNews': 'Health News',
    
    // Settings
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.darkMode': 'Dark Mode',
    'settings.lightMode': 'Light Mode',
    'settings.indonesian': 'Bahasa Indonesia',
    'settings.english': 'English',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('healthhub_language');
    return (saved as Language) || 'id';
  });

  useEffect(() => {
    localStorage.setItem('healthhub_language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
