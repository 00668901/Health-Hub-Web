import React from 'react';
import { useState, useMemo, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Star, UserX, Edit, TrendingUp, Upload } from 'lucide-react'; // Tambah Upload icon
import { useData, type Doctor } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

// Tentukan nilai default untuk properti yang mungkin tidak ada
const DEFAULT_DOCTOR_DATA = {
    totalProcedures: 0,
    performanceScore: 0,
    totalPatients: 0,
    rating: 0,
};

export default function DoctorsPage() {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  
  // State baru untuk menyimpan URL/Data URI avatar yang diunggah
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    license: '',
    email: '',
    phone: '',
    experience: 0,
    totalProcedures: 0, 
    availableDays: [] as string[],
  });

  // 1. TAMBAH LOGIKA DEFAULT UNTUK totalProcedures PADA SEMUA DOKTER
  const doctorsWithDefaults = useMemo(() => {
    return doctors.map(doctor => ({
        ...doctor,
        // Pastikan properti ini memiliki nilai default jika tidak ada
        totalProcedures: doctor.totalProcedures ?? DEFAULT_DOCTOR_DATA.totalProcedures,
        performanceScore: doctor.performanceScore ?? DEFAULT_DOCTOR_DATA.performanceScore,
        totalPatients: doctor.totalPatients ?? DEFAULT_DOCTOR_DATA.totalPatients,
        rating: doctor.rating ?? DEFAULT_DOCTOR_DATA.rating,
    }));
  }, [doctors]);


  const filteredDoctors = doctorsWithDefaults.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDoctor = () => {
    if (!formData.name || !formData.specialty || !formData.license) {
      toast.error('Nama, spesialisasi, dan nomor STR harus diisi');
      return;
    }

    addDoctor({
      ...formData,
      rating: 5.0,
      avatar: uploadedAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
      performanceScore: 100,
      totalPatients: 0,
      totalProcedures: formData.totalProcedures, 
    });

    toast.success('Dokter berhasil ditambahkan');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleUpdateDoctor = () => {
    if (!editingDoctor) return;

    // Data yang akan di-update
    const updates: Partial<Doctor> = {
      ...formData,
      experience: Number(formData.experience),
      totalProcedures: Number(formData.totalProcedures),
    };
    
    // Jika ada avatar yang diunggah, tambahkan ke updates
    if (uploadedAvatar) {
        updates.avatar = uploadedAvatar;
    }

    updateDoctor(editingDoctor.id, updates);

    toast.success('Data dokter berhasil diperbarui');
    setEditingDoctor(null); 
    resetForm(); // Reset form dan uploadedAvatar
  };

  const openEditDialog = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    // Kosongkan uploadedAvatar saat membuka dialog baru
    setUploadedAvatar(null); 
    
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      license: doctor.license || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      experience: doctor.experience || 0,
      totalProcedures: doctor.totalProcedures || 0, 
      availableDays: doctor.availability || [],
    });
  };

  const handleDeleteDoctor = (id: string, name: string) => {
    deleteDoctor(id);
    toast.success(`${name} telah diberhentikan dari sistem`);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialty: '',
      license: '',
      email: '',
      phone: '',
      experience: 0,
      totalProcedures: 0, 
      availableDays: [],
    });
    setUploadedAvatar(null); // Reset juga uploaded avatar
  };

  // 2. FUNGSI BARU UNTUK MENGUNGGAH FOTO (AVATAR)
  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Simpan data URI (base64) ke state
        setUploadedAvatar(reader.result as string);
        toast.info('Foto siap diunggah saat Anda menyimpan perubahan.');
      };
      reader.readAsDataURL(file);
    }
  };


  const getPerformanceColor = (score?: number) => {
    if (!score) return 'bg-gray-500';
    if (score >= 90) return 'bg-success';
    if (score >= 70) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header (Dialog Tambah Dokter) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-foreground mb-2">Data Dokter</h1>
          <p className="text-muted-foreground">Kelola data dokter dan kinerja mereka</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary-dark">
              <Plus className="w-5 h-5" />
              Tambah Dokter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Dokter Baru</DialogTitle>
              <DialogDescription>Lengkapi data dokter yang akan ditambahkan</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Tambahkan bagian Upload Avatar di dialog Tambah */}
              <div className="flex items-center gap-4 border p-3 rounded-lg">
                <Avatar className="w-16 h-16">
                    {/* Tampilkan avatar yang diunggah atau default */}
                    <AvatarImage src={uploadedAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=new-doctor`} />
                    <AvatarFallback><Upload className="w-6 h-6"/></AvatarFallback>
                </Avatar>
                <div>
                    <Label htmlFor="avatar-upload-add" className="cursor-pointer text-sm font-medium hover:text-primary transition-colors">
                        Unggah Foto Dokter
                    </Label>
                    <Input
                        id="avatar-upload-add"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                    />
                    <p className="text-xs text-muted-foreground">Maks 2MB, format JPG/PNG</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    placeholder="Dr. Nama Dokter, Sp.XX"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Spesialisasi *</Label>
                  <Input
                    id="specialty"
                    placeholder="Kardiologi"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="license">Nomor STR *</Label>
                  <Input
                    id="license"
                    placeholder="STR-12345678"
                    value={formData.license}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Pengalaman (tahun)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                  <Label htmlFor="totalProcedures">Total Tindakan</Label>
                  <Input
                    id="totalProcedures"
                    type="number"
                    value={formData.totalProcedures}
                    onChange={(e) => setFormData({ ...formData, totalProcedures: parseInt(e.target.value) || 0 })}
                  />
                </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddDoctor} className="bg-primary hover:bg-primary-dark">
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search (tidak diubah) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari dokter berdasarkan nama atau spesialisasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Doctors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={doctor.avatar} />
                    <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base mb-1 truncate">{doctor.name}</CardTitle>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      {doctor.specialty}
                    </Badge>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{(doctor.rating).toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({doctor.totalPatients} pasien)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Kinerja</span>
                    <span className={`${doctor.performanceScore >= 90 ? 'text-success' : 'text-warning'}`}>
                      {doctor.performanceScore}%
                    </span>
                  </div>
                  <Progress
                    value={doctor.performanceScore}
                    className={getPerformanceColor(doctor.performanceScore)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Pengalaman</p>
                    <p>{doctor.experience} tahun</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tindakan</p>
                    {/* Nilai dijamin ada berkat doctorsWithDefaults */}
                    <p>{doctor.totalProcedures}</p> 
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>STR: {doctor.license}</p>
                  <p>{doctor.email}</p>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => openEditDialog(doctor)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 gap-2 text-destructive hover:bg-destructive hover:text-white">
                        <UserX className="w-4 h-4" />
                        Pecat
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Pemberhentian</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin memberhentikan {doctor.name}? 
                          Tindakan ini tidak dapat dibatalkan dan semua data akan dihapus dari sistem.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteDoctor(doctor.id, doctor.name)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Ya, Berhentikan
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Tidak ada dokter ditemukan</p>
          </CardContent>
        </Card>
      )}

      {/* DIALOG EDIT */}
      <Dialog open={!!editingDoctor} onOpenChange={() => setEditingDoctor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Data Dokter: {editingDoctor?.name}</DialogTitle>
            <DialogDescription>Perbarui informasi detail dokter</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            
            {/* Bagian Edit Avatar */}
            <div className="flex items-center gap-4 border p-3 rounded-lg">
                <Avatar className="w-16 h-16">
                    {/* Tampilkan avatar yang diunggah, avatar saat ini, atau default */}
                    <AvatarImage src={uploadedAvatar || editingDoctor?.avatar} />
                    <AvatarFallback>{editingDoctor?.name[0] || 'DR'}</AvatarFallback>
                </Avatar>
                <div>
                    <Label htmlFor="avatar-upload-edit" className="cursor-pointer text-sm font-medium hover:text-primary transition-colors">
                        <span className='flex items-center gap-1'>
                            <Upload className='w-4 h-4'/> Ganti Foto Dokter
                        </span>
                    </Label>
                    <Input
                        id="avatar-upload-edit"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                    />
                    <p className="text-xs text-muted-foreground">Foto saat ini: {uploadedAvatar ? 'Siap diunggah' : 'Tidak ada perubahan'}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nama Lengkap *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="edit-specialty">Spesialisasi *</Label>
                <Input
                  id="edit-specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-license">Nomor STR *</Label>
                <Input
                  id="edit-license"
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-experience">Pengalaman (tahun)</Label>
                <Input
                  id="edit-experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-procedures">Total Tindakan</Label>
                <Input
                  id="edit-procedures"
                  type="number"
                  value={formData.totalProcedures}
                  onChange={(e) => setFormData({ ...formData, totalProcedures: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Nomor Telepon</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDoctor(null)}>
              Batal
            </Button>
            <Button onClick={handleUpdateDoctor} className="bg-primary hover:bg-primary-dark">
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}