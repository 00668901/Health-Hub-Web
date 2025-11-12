import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types (Tidak diubah, tetap sama seperti file Anda)
export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
  createdAt: string;
}

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'doctor' | 'nurse';
  specialty?: string;
  department?: string;
  createdAt: string;
}

export interface DoctorSchedule {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviews: number;
  availability: string[];
  schedule?: DoctorSchedule[];
  avatar?: string;
  email?: string;
  phone?: string;
  license?: string;
}

export interface Nurse {
  id: string;
  name: string;
  department: string;
  shift: 'Pagi' | 'Siang' | 'Malam';
  experience: number;
  avatar?: string;
  email?: string;
  phone?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string[];
  medicalHistory?: MedicalRecord[];
  lastVisit?: string;
  nextAppointment?: string;
  medicalRecordNumber?: string;
  isNewPatient?: boolean;
  registrationDate?: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  doctor: string;
  diagnosis: string;
  treatment: string;
  medications?: string[];
  notes?: string;
}

export interface Room {
  id: string;
  name: string;
  roomNumber?: string; // For backward compatibility
  type: string;
  capacity: number;
  floor: number;
  status: 'Tersedia' | 'Terisi' | 'Maintenance';
  currentPatient?: string;
  facilities?: string[];
  price?: number;
}

export interface RoomHistory {
  id: string;
  roomId: string;
  roomName: string;
  patientName: string;
  checkIn: string;
  checkOut: string;
  type: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  method: 'Debit' | 'QRIS' | 'Cash';
  insurance?: 'KIS' | 'BPJS' | 'None';
  status: 'Paid' | 'Pending' | 'Failed';
  paidAt?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  appointmentId: string;
  patientName: string;
  patientMedicalRecordNumber?: string;
  doctorName: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  insurance?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId?: string;
  doctorName: string;
  doctorId?: string;
  date: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  createdBy?: string;
  paymentId?: string;
  invoiceId?: string;
}

export interface DoctorRating {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

interface DataContextType {
  // Admin Accounts
  adminAccounts: AdminAccount[];
  addAdminAccount: (account: Omit<AdminAccount, 'id' | 'createdAt'>) => void;
  updateAdminAccount: (id: string, account: Partial<AdminAccount>) => void;
  deleteAdminAccount: (id: string) => void;

  // Staff Accounts
  staffAccounts: StaffAccount[];
  addStaffAccount: (account: Omit<StaffAccount, 'id' | 'createdAt'>) => void;
  updateStaffAccount: (id: string, account: Partial<StaffAccount>) => void;
  deleteStaffAccount: (id: string) => void;

  // Doctors
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;

  // Nurses
  nurses: Nurse[];
  addNurse: (nurse: Omit<Nurse, 'id'>) => void;
  updateNurse: (id: string, nurse: Partial<Nurse>) => void;
  deleteNurse: (id: string) => void;

  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // Rooms
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  resetAllRooms: () => void;

  // Room History
  roomHistory: RoomHistory[];
  addRoomHistory: (history: Omit<RoomHistory, 'id'>) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  // Doctor Ratings
  doctorRatings: DoctorRating[];
  addDoctorRating: (rating: Omit<DoctorRating, 'id'>) => void;
  deleteDoctorRating: (id: string) => void;

  // Payments
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;

  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  getInvoiceByAppointment: (appointmentId: string) => Invoice | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial data (Tidak diubah, akan digunakan jika Local Storage kosong)
const initialAdmins: AdminAccount[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'superadmin@healthhub.com',
    username: 'superadmin',
    password: 'SuperAdmin@2025',
    role: 'Super Administrator',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Admin Medis',
    email: 'medisadmin@healthhub.com',
    username: 'adminmedis',
    password: 'MedisAdmin@2025',
    role: 'Medical Administrator',
    createdAt: new Date().toISOString(),
  },
];

const initialStaff: StaffAccount[] = [
  {
    id: '1',
    name: 'Dr. Ahmad Rizki',
    email: 'ahmad.rizki@healthhub.com',
    username: 'dr.rizki',
    password: 'DrRizki@2025',
    role: 'doctor',
    specialty: 'Kardiologi',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Dr. Sarah Putri',
    email: 'sarah.putri@healthhub.com',
    username: 'dr.sarah',
    password: 'DrSarah@2025',
    role: 'doctor',
    specialty: 'Pediatri',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Ns. Budi Santoso',
    email: 'budi.santoso@healthhub.com',
    username: 'ns.budi',
    password: 'NsBudi@2025',
    role: 'nurse',
    department: 'ICU',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Ns. Dewi Lestari',
    email: 'dewi.lestari@healthhub.com',
    username: 'ns.dewi',
    password: 'NsDewi@2025',
    role: 'nurse',
    department: 'IGD',
    createdAt: new Date().toISOString(),
  },
];

const initialDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Ahmad Rizki',
    specialty: 'Kardiologi',
    experience: 12,
    rating: 4.8,
    reviews: 156,
    availability: ['Senin', 'Rabu', 'Jumat'],
    schedule: [
      { day: 'Senin', startTime: '08:00', endTime: '12:00' },
      { day: 'Rabu', startTime: '14:00', endTime: '18:00' },
      { day: 'Jumat', startTime: '08:00', endTime: '12:00' },
    ],
    email: 'ahmad.rizki@healthhub.com',
    phone: '+62812345678',
    license: 'SIP-001-2023',
  },
  {
    id: '2',
    name: 'Dr. Sarah Putri',
    specialty: 'Pediatri',
    experience: 8,
    rating: 4.9,
    reviews: 203,
    availability: ['Selasa', 'Kamis', 'Sabtu'],
    schedule: [
      { day: 'Selasa', startTime: '09:00', endTime: '13:00' },
      { day: 'Kamis', startTime: '09:00', endTime: '13:00' },
      { day: 'Sabtu', startTime: '08:00', endTime: '11:00' },
    ],
    email: 'sarah.putri@healthhub.com',
    phone: '+62812345679',
    license: 'SIP-002-2023',
  },
  {
    id: '3',
    name: 'Dr. Budi Hartono',
    specialty: 'Bedah Umum',
    experience: 15,
    rating: 4.7,
    reviews: 189,
    availability: ['Senin', 'Selasa', 'Rabu'],
    schedule: [
      { day: 'Senin', startTime: '13:00', endTime: '17:00' },
      { day: 'Selasa', startTime: '13:00', endTime: '17:00' },
      { day: 'Rabu', startTime: '08:00', endTime: '12:00' },
    ],
    email: 'budi.hartono@healthhub.com',
    phone: '+62812345680',
    license: 'SIP-003-2023',
  },
  {
    id: '4',
    name: 'Dr. Siti Rahmawati',
    specialty: 'Dokter Gigi',
    experience: 10,
    rating: 4.9,
    reviews: 178,
    availability: ['Senin', 'Rabu', 'Jumat'],
    schedule: [
      { day: 'Senin', startTime: '08:00', endTime: '14:00' },
      { day: 'Rabu', startTime: '08:00', endTime: '14:00' },
      { day: 'Jumat', startTime: '13:00', endTime: '17:00' },
    ],
    email: 'siti.rahma@healthhub.com',
    phone: '+62812345681',
    license: 'SIP-004-2023',
  },
  {
    id: '5',
    name: 'Dr. Rendra Wijaya',
    specialty: 'Penyakit Dalam',
    experience: 14,
    rating: 4.8,
    reviews: 165,
    availability: ['Selasa', 'Kamis', 'Sabtu'],
    schedule: [
      { day: 'Selasa', startTime: '08:00', endTime: '12:00' },
      { day: 'Kamis', startTime: '14:00', endTime: '18:00' },
      { day: 'Sabtu', startTime: '08:00', endTime: '12:00' },
    ],
    email: 'rendra.wijaya@healthhub.com',
    phone: '+62812345682',
    license: 'SIP-005-2023',
  },
  {
    id: '6',
    name: 'Dr. Maya Kusuma',
    specialty: 'Mata',
    experience: 9,
    rating: 4.7,
    reviews: 142,
    availability: ['Senin', 'Rabu', 'Jumat'],
    schedule: [
      { day: 'Senin', startTime: '14:00', endTime: '18:00' },
      { day: 'Rabu', startTime: '08:00', endTime: '12:00' },
      { day: 'Jumat', startTime: '08:00', endTime: '12:00' },
    ],
    email: 'maya.kusuma@healthhub.com',
    phone: '+62812345683',
    license: 'SIP-006-2023',
  },
];

const initialNurses: Nurse[] = [
  {
    id: '1',
    name: 'Ns. Budi Santoso',
    department: 'ICU',
    shift: 'Pagi',
    experience: 5,
    email: 'budi.santoso@healthhub.com',
    phone: '+62812345681',
  },
  {
    id: '2',
    name: 'Ns. Dewi Lestari',
    department: 'IGD',
    shift: 'Malam',
    experience: 7,
    email: 'dewi.lestari@healthhub.com',
    phone: '+62812345682',
  },
];

const initialPatients: Patient[] = [
  {
    id: '1',
    name: 'Ahmad Fauzi',
    age: 35,
    gender: 'Laki-laki',
    phone: '+62812345683',
    email: 'ahmad.fauzi@email.com',
    bloodType: 'O+',
    allergies: ['Penisilin'],
    lastVisit: '2025-01-15',
    medicalRecordNumber: 'MR-2024-001',
    isNewPatient: false,
    registrationDate: '2024-01-10',
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    age: 28,
    gender: 'Perempuan',
    phone: '+62812345684',
    email: 'siti.nur@email.com',
    bloodType: 'A+',
    lastVisit: '2025-01-20',
    medicalRecordNumber: 'MR-2024-002',
    isNewPatient: false,
    registrationDate: '2024-03-15',
  },
];

const initialRooms: Room[] = [
  {
    id: '1',
    name: 'VIP-101',
    roomNumber: 'VIP-101',
    type: 'VIP',
    capacity: 1,
    floor: 1,
    status: 'Tersedia',
    facilities: ['AC', 'TV', 'Kamar Mandi Dalam', 'Kulkas', 'Sofa', 'WiFi'],
    price: 1500000,
  },
  {
    id: '2',
    name: 'VIP-102',
    roomNumber: 'VIP-102',
    type: 'VIP',
    capacity: 1,
    floor: 1,
    status: 'Tersedia',
    facilities: ['AC', 'TV', 'Kamar Mandi Dalam', 'Kulkas', 'WiFi'],
    price: 1500000,
  },
  {
    id: '3',
    name: 'VIP-103',
    roomNumber: 'VIP-103',
    type: 'VIP',
    capacity: 1,
    floor: 1,
    status: 'Terisi',
    currentPatient: 'Siti Nurhaliza',
    facilities: ['AC', 'TV', 'Kamar Mandi Dalam', 'Kulkas', 'Sofa', 'WiFi'],
    price: 1500000,
  },
  {
    id: '4',
    name: 'ICU-201',
    roomNumber: 'ICU-201',
    type: 'ICU',
    capacity: 1,
    floor: 2,
    status: 'Terisi',
    currentPatient: 'Ahmad Fauzi',
    facilities: ['Ventilator', 'Monitor', 'Defibrilator', 'AC'],
    price: 3000000,
  },
  {
    id: '5',
    name: 'ICU-202',
    roomNumber: 'ICU-202',
    type: 'ICU',
    capacity: 1,
    floor: 2,
    status: 'Tersedia',
    facilities: ['Ventilator', 'Monitor', 'Defibrilator', 'AC'],
    price: 3000000,
  },
  {
    id: '6',
    name: 'ICU-203',
    roomNumber: 'ICU-203',
    type: 'ICU',
    capacity: 1,
    floor: 2,
    status: 'Tersedia',
    facilities: ['Ventilator', 'Monitor', 'Defibrilator', 'AC'],
    price: 3000000,
  },
  {
    id: '7',
    name: 'REG-301',
    roomNumber: 'REG-301',
    type: 'Reguler',
    capacity: 2,
    floor: 3,
    status: 'Tersedia',
    facilities: ['AC', 'TV', 'Kamar Mandi Dalam'],
    price: 500000,
  },
  {
    id: '8',
    name: 'REG-302',
    roomNumber: 'REG-302',
    type: 'Reguler',
    capacity: 2,
    floor: 3,
    status: 'Tersedia',
    facilities: ['AC', 'TV', 'Kamar Mandi Dalam'],
    price: 500000,
  },
  {
    id: '9',
    name: 'REG-303',
    roomNumber: 'REG-303',
    type: 'Reguler',
    capacity: 2,
    floor: 3,
    status: 'Tersedia',
    facilities: ['AC', 'TV', 'Kamar Mandi Dalam'],
    price: 500000,
  },
  {
    id: '10',
    name: 'REG-304',
    roomNumber: 'REG-304',
    type: 'Reguler',
    capacity: 2,
    floor: 3,
    status: 'Terisi',
    currentPatient: 'Budi Santoso',
    facilities: ['AC', 'TV', 'Kamar Mandi Dalam'],
    price: 500000,
  },
  {
    id: '11',
    name: 'REG-305',
    roomNumber: 'REG-305',
    type: 'Reguler',
    capacity: 2,
    floor: 3,
    status: 'Tersedia',
    facilities: ['AC', 'TV', 'Kamar Mandi Dalam'],
    price: 500000,
  },
  {
    id: '12',
    name: 'REG-306',
    roomNumber: 'REG-306',
    type: 'Reguler',
    capacity: 2,
    floor: 3,
    status: 'Tersedia',
    facilities: ['AC', 'TV', 'Kamar Mandi Dalam'],
    price: 500000,
  },
];

const initialInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-001',
    appointmentId: 'apt-001',
    patientName: 'Ahmad Fauzi',
    patientMedicalRecordNumber: 'MR-2024-001',
    doctorName: 'Dr. Ahmad Rizki',
    date: '2025-01-15',
    items: [
      { name: 'Konsultasi Kardiologi', quantity: 1, price: 300000 },
      { name: 'EKG', quantity: 1, price: 200000 },
      { name: 'Obat Jantung', quantity: 1, price: 150000 },
    ],
    subtotal: 650000,
    tax: 65000,
    total: 715000,
    paymentMethod: 'Debit',
    createdAt: '2025-01-15T10:30:00',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-002',
    appointmentId: 'apt-002',
    patientName: 'Siti Nurhaliza',
    patientMedicalRecordNumber: 'MR-2024-002',
    doctorName: 'Dr. Sarah Putri',
    date: '2025-01-20',
    items: [
      { name: 'Konsultasi Pediatri', quantity: 1, price: 250000 },
      { name: 'Vitamin Anak', quantity: 1, price: 100000 },
    ],
    subtotal: 350000,
    tax: 0,
    total: 105000,
    paymentMethod: 'QRIS',
    insurance: 'BPJS',
    createdAt: '2025-01-20T14:15:00',
  },
];

// --------------------------------------------------------------------------------
// MEMBUAT FUNGSI HELPER UNTUK LOCAL STORAGE
// --------------------------------------------------------------------------------

/**
 * Mengambil data dari localStorage dan mengembalikan parsed object/array.
 * Menggunakan fungsi ini dalam inisialisasi useState untuk lazy initialization.
 */
const getLocalData = <T,>(key: string, initialData: T): T => {
  if (typeof window === 'undefined') {
    return initialData;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialData;
  } catch (error) {
    console.error(`Error reading data from localStorage for key: ${key}`, error);
    return initialData;
  }
};

/**
 * Menyimpan data ke localStorage.
 */
const setLocalData = (key: string, value: any): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing data to localStorage for key: ${key}`, error);
  }
};

// --------------------------------------------------------------------------------
// DATA PROVIDER DENGAN LOCAL STORAGE
// --------------------------------------------------------------------------------

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Inisialisasi state dengan memuat data dari Local Storage (jika ada)
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>(() => getLocalData('healthhub_admins', initialAdmins));
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>(() => getLocalData('healthhub_staff', initialStaff));
  const [doctors, setDoctors] = useState<Doctor[]>(() => getLocalData('healthhub_doctors', initialDoctors));
  const [nurses, setNurses] = useState<Nurse[]>(() => getLocalData('healthhub_nurses', initialNurses));
  const [patients, setPatients] = useState<Patient[]>(() => getLocalData('healthhub_patients', initialPatients));
  const [rooms, setRooms] = useState<Room[]>(() => getLocalData('healthhub_rooms', initialRooms));
  const [roomHistory, setRoomHistory] = useState<RoomHistory[]>(() => getLocalData('healthhub_room_history', []));
  const [appointments, setAppointments] = useState<Appointment[]>(() => getLocalData('healthhub_appointments', []));
  const [doctorRatings, setDoctorRatings] = useState<DoctorRating[]>(() => getLocalData('healthhub_ratings', []));
  const [payments, setPayments] = useState<Payment[]>(() => getLocalData('healthhub_payments', []));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getLocalData('healthhub_invoices', initialInvoices));
  
  // NOTE: Saya menghapus useEffect 'Load data from localStorage on mount' yang lama
  // karena inisialisasi sekarang sudah dilakukan secara lazy di useState.

  // Save to localStorage whenever data changes (Menggantikan banyak useEffect yang terpisah)
  
  useEffect(() => {
    setLocalData('healthhub_admins', adminAccounts);
  }, [adminAccounts]);

  useEffect(() => {
    setLocalData('healthhub_staff', staffAccounts);
  }, [staffAccounts]);

  useEffect(() => {
    setLocalData('healthhub_doctors', doctors);
  }, [doctors]);

  useEffect(() => {
    setLocalData('healthhub_nurses', nurses);
  }, [nurses]);

  useEffect(() => {
    setLocalData('healthhub_patients', patients);
  }, [patients]);

  useEffect(() => {
    setLocalData('healthhub_rooms', rooms);
  }, [rooms]);

  useEffect(() => {
    setLocalData('healthhub_room_history', roomHistory);
  }, [roomHistory]);

  useEffect(() => {
    setLocalData('healthhub_appointments', appointments);
  }, [appointments]);

  useEffect(() => {
    setLocalData('healthhub_ratings', doctorRatings);
  }, [doctorRatings]);

  useEffect(() => {
    setLocalData('healthhub_payments', payments);
  }, [payments]);

  useEffect(() => {
    setLocalData('healthhub_invoices', invoices);
  }, [invoices]);

  // Admin Accounts (Tidak diubah isinya)
  const addAdminAccount = (account: Omit<AdminAccount, 'id' | 'createdAt'>) => {
    const newAccount: AdminAccount = {
      ...account,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAdminAccounts([...adminAccounts, newAccount]);
  };

  const updateAdminAccount = (id: string, updates: Partial<AdminAccount>) => {
    setAdminAccounts(adminAccounts.map(acc => acc.id === id ? { ...acc, ...updates } : acc));
  };

  const deleteAdminAccount = (id: string) => {
    setAdminAccounts(adminAccounts.filter(acc => acc.id !== id));
  };

  // Staff Accounts (Tidak diubah isinya)
  const addStaffAccount = (account: Omit<StaffAccount, 'id' | 'createdAt'>) => {
    const newAccount: StaffAccount = {
      ...account,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setStaffAccounts([...staffAccounts, newAccount]);
  };

  const updateStaffAccount = (id: string, updates: Partial<StaffAccount>) => {
    setStaffAccounts(staffAccounts.map(acc => acc.id === id ? { ...acc, ...updates } : acc));
  };

  const deleteStaffAccount = (id: string) => {
    setStaffAccounts(staffAccounts.filter(acc => acc.id !== id));
  };

  // Doctors (Tidak diubah isinya)
  const addDoctor = (doctor: Omit<Doctor, 'id'>) => {
    const newDoctor: Doctor = { ...doctor, id: Date.now().toString() };
    setDoctors([...doctors, newDoctor]);
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors(doctors.map(doc => doc.id === id ? { ...doc, ...updates } : doc));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(doctors.filter(doc => doc.id !== id));
  };

  // Nurses (Tidak diubah isinya)
  const addNurse = (nurse: Omit<Nurse, 'id'>) => {
    const newNurse: Nurse = { ...nurse, id: Date.now().toString() };
    setNurses([...nurses, newNurse]);
  };

  const updateNurse = (id: string, updates: Partial<Nurse>) => {
    setNurses(nurses.map(nurse => nurse.id === id ? { ...nurse, ...updates } : nurse));
  };

  const deleteNurse = (id: string) => {
    setNurses(nurses.filter(nurse => nurse.id !== id));
  };

  // Patients (Tidak diubah isinya)
  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient: Patient = { ...patient, id: Date.now().toString() };
    setPatients([...patients, newPatient]);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(patients.map(patient => patient.id === id ? { ...patient, ...updates } : patient));
  };

  const deletePatient = (id: string) => {
    setPatients(patients.filter(patient => patient.id !== id));
  };

  // Rooms (Tidak diubah isinya)
  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom: Room = { ...room, id: Date.now().toString() };
    setRooms([...rooms, newRoom]);
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(rooms.map(room => room.id === id ? { ...room, ...updates } : room));
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  const resetAllRooms = () => {
    // Save current rooms to history before resetting
    const historyEntries: RoomHistory[] = rooms
      .filter(room => room.status === 'Terisi' && room.currentPatient)
      .map(room => ({
        id: Date.now().toString() + Math.random(),
        roomId: room.id,
        roomName: room.name,
        patientName: room.currentPatient!,
        checkIn: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        checkOut: new Date().toISOString(),
        type: room.type,
      }));
    
    setRoomHistory([...roomHistory, ...historyEntries]);
    setRooms([]);
  };

  // Room History (Tidak diubah isinya)
  const addRoomHistory = (history: Omit<RoomHistory, 'id'>) => {
    const newHistory: RoomHistory = { ...history, id: Date.now().toString() };
    setRoomHistory([...roomHistory, newHistory]);
  };

  // Appointments (Tidak diubah isinya)
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = { ...appointment, id: Date.now().toString() };
    setAppointments([...appointments, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(appointments.map(apt => apt.id === id ? { ...apt, ...updates } : apt));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
  };

  // Doctor Ratings (Tidak diubah isinya)
  const addDoctorRating = (rating: Omit<DoctorRating, 'id'>) => {
    const newRating: DoctorRating = { ...rating, id: Date.now().toString() };
    setDoctorRatings([...doctorRatings, newRating]);
  };

  const deleteDoctorRating = (id: string) => {
    setDoctorRatings(doctorRatings.filter(rating => rating.id !== id));
  };

  // Payments (Tidak diubah isinya)
  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment: Payment = { ...payment, id: Date.now().toString() };
    setPayments([...payments, newPayment]);
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments(payments.map(payment => payment.id === id ? { ...payment, ...updates } : payment));
  };

  // Invoices (Tidak diubah isinya)
  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = { ...invoice, id: Date.now().toString() };
    setInvoices([...invoices, newInvoice]);
  };

  const getInvoiceByAppointment = (appointmentId: string) => {
    return invoices.find(inv => inv.appointmentId === appointmentId);
  };

  return (
    <DataContext.Provider value={{
      adminAccounts,
      addAdminAccount,
      updateAdminAccount,
      deleteAdminAccount,
      staffAccounts,
      addStaffAccount,
      updateStaffAccount,
      deleteStaffAccount,
      doctors,
      addDoctor,
      updateDoctor,
      deleteDoctor,
      nurses,
      addNurse,
      updateNurse,
      deleteNurse,
      patients,
      addPatient,
      updatePatient,
      deletePatient,
      rooms,
      addRoom,
      updateRoom,
      deleteRoom,
      resetAllRooms,
      roomHistory,
      addRoomHistory,
      appointments,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      doctorRatings,
      addDoctorRating,
      deleteDoctorRating,
      payments,
      addPayment,
      updatePayment,
      invoices,
      addInvoice,
      getInvoiceByAppointment,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}