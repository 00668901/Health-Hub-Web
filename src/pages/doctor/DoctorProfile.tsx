import React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, User, Mail, Phone, Award, MapPin, Briefcase, Upload, Save, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

// Definisi type untuk formData agar lebih jelas
interface FormData {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  license: string;
}

// Tambahkan type untuk data yang disimpan di LocalStorage
interface StoredData extends FormData {
    avatar?: string;
}


export default function DoctorProfile() {
  const { user } = useAuth();
  const { doctors, updateDoctor } = useData(); 
  
  // Find doctor data (dari context)
  const doctorData = doctors.find(d => d.name === user?.name || d.email === user?.email);
  
  // Fungsi untuk mendapatkan data awal dari LocalStorage atau Context
  const getInitialData = (): StoredData => {
    // Kunci unik untuk LocalStorage (gunakan ID atau Email sebagai fallback)
    const storageKey = `doctorProfile_${doctorData?.id || doctorData?.email || user?.email || 'default'}`;
    const storedData = localStorage.getItem(storageKey);
    
    // Default data dari context/user
    const defaultData = {
        name: doctorData?.name || user?.name || '',
        email: doctorData?.email || user?.email || '',
        phone: doctorData?.phone || user?.phone || '',
        specialty: doctorData?.specialty || user?.specialty || '',
        experience: doctorData?.experience || 0,
        license: doctorData?.license || '',
        avatar: doctorData?.avatar || user?.avatar || '' // Default avatar
    };

    // Coba ambil dari localStorage
    if (storedData) {
        try {
            const parsedData: StoredData = JSON.parse(storedData);
            if (parsedData) {
                // Gabungkan data yang tersimpan dengan default data
                return {
                    ...defaultData,
                    ...parsedData,
                    // Pastikan avatar yang tersimpan diutamakan jika ada
                    avatar: parsedData.avatar || defaultData.avatar
                };
            }
        } catch (e) {
            console.error("Gagal memuat data dari localStorage:", e);
        }
    }
    
    // Jika tidak ada di localStorage atau gagal, gunakan data default
    return defaultData;
  };

  const initialData = getInitialData();

  const [isEditing, setIsEditing] = useState(false);
  // **MODIFIKASI 1: Ambil URL Avatar dari initialData (yang sudah memuat localStorage)**
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatar || ''); 
  
  // Pisahkan formData dari avatar untuk state
  const [formData, setFormData] = useState<FormData>({
    name: initialData.name,
    email: initialData.email,
    phone: initialData.phone,
    specialty: initialData.specialty,
    experience: initialData.experience,
    license: initialData.license,
  }); 

  // Handler untuk input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === 'experience' ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result as string;
        setAvatarUrl(newAvatarUrl); // Perbarui state avatar
        
        // **MODIFIKASI 2: Simpan URL Avatar ke LocalStorage**
        const storageKey = `doctorProfile_${doctorData?.id || formData.email || user?.email || 'default'}`;
        
        // Ambil data yang tersimpan, tambahkan URL avatar yang baru
        const storedData = localStorage.getItem(storageKey);
        const currentData = storedData ? JSON.parse(storedData) : formData;

        try {
            localStorage.setItem(storageKey, JSON.stringify({ ...currentData, avatar: newAvatarUrl }));
            toast.success('Foto profil berhasil diperbarui dan disimpan secara lokal');
        } catch (error) {
            console.error("Gagal menyimpan avatar ke localStorage:", error);
            toast.error('Gagal menyimpan foto profil secara lokal.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // 1. Tentukan profil terbaru
    const updatedProfile: StoredData = {
      ...formData,
      avatar: avatarUrl, // Pastikan avatarUrl masuk ke updatedProfile
    };

    // 2. Tentukan kunci penyimpanan di LocalStorage
    const storageKey = `doctorProfile_${doctorData?.id || formData.email || user?.email || 'default'}`;

    // 3. Panggil updateDoctor (HANYA JIKA doctorData ditemukan)
    if (doctorData) {
      updateDoctor(doctorData.id, updatedProfile); 
    }
    
    // 4. Selalu Simpan data lengkap (termasuk avatar) ke LocalStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedProfile));
      
      if (doctorData) {
         toast.success('Profil berhasil diperbarui dan disimpan secara lokal');
      } else {
         toast.success('Profil berhasil disimpan di browser (local storage).');
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Gagal menyimpan ke localStorage:", error);
      toast.error('Gagal menyimpan profil secara lokal.');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">Profil Saya</h1>
        <p className="text-muted-foreground">Kelola informasi profil dokter Anda</p>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar Upload */}
              <div className="relative group">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-2xl">
                    {formData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-8 h-8 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="mb-2">{formData.name}</h2>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-3">
                  {formData.specialty || 'Spesialisasi belum diisi'}
                </Badge>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Award className="w-4 h-4" />
                    <span>{formData.license || 'Lisensi belum diisi'}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Briefcase className="w-4 h-4" />
                    <span>{formData.experience} tahun pengalaman</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="w-4 h-4" />
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Phone className="w-4 h-4" />
                    <span>{formData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Edit Profil
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Batal
                    </Button>
                    <Button onClick={handleSave} className="bg-primary hover:bg-primary-dark gap-2">
                      <Save className="w-4 h-4" />
                      Simpan
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Information */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Informasi Detail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialty">Spesialisasi</Label>
                  <select
                    id="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm mt-1"
                  >
                    <option value="">Pilih spesialisasi...</option>
                    <option value="Kardiologi">Kardiologi</option>
                    <option value="Pediatri">Pediatri</option>
                    <option value="Bedah Umum">Bedah Umum</option>
                    <option value="Dokter Gigi">Dokter Gigi</option>
                    <option value="Penyakit Dalam">Penyakit Dalam</option>
                    <option value="Mata">Mata</option>
                    <option value="THT">THT</option>
                    <option value="Kulit">Kulit</option>
                    <option value="Neurologi">Neurologi</option>
                    <option value="Ortopedi">Ortopedi</option>
                    <option value="Patah Hati">Patah Hati</option> 
                  </select>
                </div>

                <div>
                  <Label htmlFor="experience">Pengalaman (tahun)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="license">Nomor Lisensi (SIP)</Label>
                  <div className="relative mt-1">
                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="license"
                      value={formData.license}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="SIP-XXX-XXXX"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Schedule Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Jadwal Praktek
            </CardTitle>
          </CardHeader>
          <CardContent>
            {doctorData?.schedule && doctorData.schedule.length > 0 ? (
              <div className="space-y-3">
                {doctorData.schedule.map((sched, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                  >
                    <span className="font-medium">{sched.day}</span>
                    <span className="text-sm text-muted-foreground">
                      {sched.startTime} - {sched.endTime}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Jadwal praktek belum ditentukan
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Statistik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {doctorData?.rating || 0}
                </div>
                <p className="text-sm text-muted-foreground">Rating Rata-rata</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {doctorData?.reviews || 0}
                </div>
                <p className="text-sm text-muted-foreground">Jumlah Review</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {/* Gunakan pengalaman dari formData yang sudah persisten */}
                  {formData.experience || 0} 
                </div>
                <p className="text-sm text-muted-foreground">Tahun Pengalaman</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}