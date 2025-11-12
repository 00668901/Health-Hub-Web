import React from 'react';
import { useState, ChangeEvent } from 'react'; 
import { motion } from 'framer-motion'; // Perbaikan: menggunakan framer-motion jika tersedia
import { 
  Users, Plus, Trash2, Eye, EyeOff, Shield, Mail, Lock,
  Search, Edit2, Stethoscope, Heart, Upload 
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
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
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';
import { useData } from '../../contexts/DataContext';

// URL placeholder default untuk avatar jika tidak ada URL yang tersimpan
const DEFAULT_AVATAR_URL = "https://via.placeholder.com/150/808080/ffffff?text=STAFF"; 

export default function StaffAccounts() {
  const { staffAccounts, addStaffAccount, updateStaffAccount, deleteStaffAccount } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'doctor' | 'nurse'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<typeof staffAccounts[0] | null>(null);
  
  // State untuk mengelola pratinjau foto lokal
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null); 
  // State untuk menyimpan File yang baru dipilih (untuk simulasi unggah)
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'doctor' as 'doctor' | 'nurse',
    specialty: '',
    department: '',
    avatarUrl: '', // URL gambar yang tersimpan
  });
  const [showPassword, setShowPassword] = useState(false);

  const generateUsername = (name: string, role: 'doctor' | 'nurse') => {
    const prefix = role === 'doctor' ? 'dr.' : 'ns.';
    const cleanName = name.toLowerCase().split(' ')[0];
    return prefix + cleanName;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleGenerateCredentials = () => {
    if (!formData.name) {
      toast.error('Masukkan nama terlebih dahulu');
      return;
    }
    
    setFormData({
      ...formData,
      username: generateUsername(formData.name, formData.role),
      password: generatePassword(),
    });
  };

  // Fungsi untuk menangani perubahan file (menciptakan pratinjau lokal)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Membatalkan URL objek lama jika ada untuk menghindari kebocoran memori
      if (previewAvatar) {
        URL.revokeObjectURL(previewAvatar);
      }
      
      const url = URL.createObjectURL(file);
      setPreviewAvatar(url);
      setNewAvatarFile(file); // Simpan file baru
      
      toast.success('Foto siap diunggah saat Anda menyimpan perubahan.');
    }
  };

  // SIMULASI UNGGAH: Fungsi ini akan meniru unggahan ke server
  const simulateUpload = async (file: File) => {
    // Simulasi kembalikan Data URI (Base64)
    await new Promise(resolve => setTimeout(resolve, 500));
    // Menggunakan previewAvatar (URL lokal) sebagai simulasi Data URI/URL baru
    return previewAvatar || `https://images.healthhub.com/${Date.now()}-${file.name}`; 
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      toast.error('Semua field harus diisi');
      return;
    }
    
    let finalAvatarUrl = formData.avatarUrl;

    if (newAvatarFile) {
        toast.loading('Mengunggah foto profil baru...');
        try {
            finalAvatarUrl = await simulateUpload(newAvatarFile);
            toast.dismiss();
            toast.success('Foto profil berhasil diunggah.');
        } catch (error) {
            toast.dismiss();
            toast.error('Gagal mengunggah foto. Menggunakan URL lama/default.');
            finalAvatarUrl = formData.avatarUrl; 
        }
    }

    addStaffAccount({
      name: formData.name,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      specialty: formData.role === 'doctor' ? formData.specialty : undefined,
      department: formData.role === 'nurse' ? formData.department : undefined,
      avatarUrl: finalAvatarUrl, 
    });

    toast.success(`${formData.role === 'doctor' ? 'Dokter' : 'Perawat'} berhasil ditambahkan`);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!selectedStaff) return;
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      toast.error('Semua field harus diisi');
      return;
    }
    
    let finalAvatarUrl = formData.avatarUrl;

    if (newAvatarFile) {
        toast.loading('Mengunggah foto profil baru...');
        try {
            finalAvatarUrl = await simulateUpload(newAvatarFile);
            toast.dismiss();
            toast.success('Foto profil berhasil diunggah dan siap disimpan.');
        } catch (error) {
            toast.dismiss();
            toast.error('Gagal mengunggah foto. Menggunakan URL lama.');
            finalAvatarUrl = formData.avatarUrl;
        }
    }


    updateStaffAccount(selectedStaff.id, {
      name: formData.name,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      specialty: formData.role === 'doctor' ? formData.specialty : undefined,
      department: formData.role === 'nurse' ? formData.department : undefined,
      avatarUrl: finalAvatarUrl,
    });

    toast.success('Data staff berhasil diupdate');
    setIsEditDialogOpen(false);
    setSelectedStaff(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteStaffAccount(id);
    toast.success('Staff berhasil dihapus');
  };

  const openEditDialog = (staff: typeof staffAccounts[0]) => {
    setSelectedStaff(staff);
    
    // Reset state terkait file saat membuka dialog
    if (previewAvatar) {
        URL.revokeObjectURL(previewAvatar);
    }
    setPreviewAvatar(null); 
    setNewAvatarFile(null);
    
    setFormData({
      name: staff.name,
      email: staff.email,
      username: staff.username,
      password: staff.password,
      role: staff.role,
      specialty: staff.specialty || '',
      department: staff.department || '',
      avatarUrl: (staff as any).avatarUrl || '', 
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    if (previewAvatar) {
        URL.revokeObjectURL(previewAvatar);
    }
    setPreviewAvatar(null);
    setNewAvatarFile(null); // Reset file

    setFormData({
      name: '',
      email: '',
      username: '',
      password: '',
      role: 'doctor',
      specialty: '',
      department: '',
      avatarUrl: '',
    });
    setShowPassword(false);
  };
  
  const filteredStaff = staffAccounts.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          staff.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const doctorCount = staffAccounts.filter(s => s.role === 'doctor').length;
  const nurseCount = staffAccounts.filter(s => s.role === 'nurse').length;

  // Fungsi utilitas untuk merender ikon (default)
  const renderRoleIcon = (role: 'doctor' | 'nurse') => {
    if (role === 'doctor') {
      return <Stethoscope className="w-6 h-6" />;
    }
    return <Heart className="w-6 h-6" />;
  };

  // Fungsi untuk merender avatar (jika ada URL) atau ikon default
  const renderAvatarOrIcon = (staff: typeof staffAccounts[0], size: number = 12) => {
    const avatarUrl = (staff as any).avatarUrl;
    const sizeClasses = `w-${size} h-${size}`;
    
    if (avatarUrl) {
      return (
        <img 
          src={avatarUrl} 
          alt={`${staff.name}'s avatar`}
          className={`${sizeClasses} rounded-full object-cover`}
          onError={(e) => { 
            (e.target as HTMLImageElement).style.display = 'none'; 
          }}
        />
      );
    }
    
    return (
      <div className={`${sizeClasses} rounded-full bg-gradient-to-br ${
        staff.role === 'doctor' ? 'from-blue-500 to-cyan-500' : 'from-pink-500 to-rose-500'
      } flex items-center justify-center text-white`}>
        {renderRoleIcon(staff.role)}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Akun Staff Medis
          </h1>
          <p className="text-muted-foreground mt-1">
            Manajemen akun dokter dan perawat
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Tambah Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Staff Medis Baru</DialogTitle>
              <DialogDescription>
                Buat akun staff medis baru dengan kredensial unik
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: 'doctor' | 'nurse') => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Dokter</SelectItem>
                    <SelectItem value="nurse">Perawat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Kontrol Unggah Foto di Dialog Tambah */}
               <div className="flex items-center gap-4 border p-3 rounded-lg">
                <div className="relative">
                    <img 
                        src={previewAvatar || formData.avatarUrl || DEFAULT_AVATAR_URL}
                        alt="Staff Avatar Preview"
                        className="w-16 h-16 rounded-full object-cover border-4 border-muted"
                        onError={(e) => { 
                            (e.target as HTMLImageElement).src = DEFAULT_AVATAR_URL;
                        }}
                    />
                </div>
                <div className="space-y-1">
                    <input 
                        id="avatar-upload-add" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                        key={previewAvatar || 'default-file-input-add'}
                    />
                    <Label htmlFor="avatar-upload-add" className="cursor-pointer">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Upload className="w-4 h-4" />
                            Ganti Foto/Ikon
                        </Button>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                        Foto saat ini: {previewAvatar ? 'Pratinjau' : 'Default'}
                    </p>
                </div>
            </div>
            {/* END Kontrol Unggah Foto di Dialog Tambah */}


              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  placeholder="Dr. John Doe / Ns. Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="staff@healthhub.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {formData.role === 'doctor' && (
                <div className="space-y-2">
                  <Label htmlFor="specialty">Spesialisasi</Label>
                  <Input
                    id="specialty"
                    placeholder="Kardiologi, Pediatri, dll"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  />
                </div>
              )}

              {formData.role === 'nurse' && (
                <div className="space-y-2">
                  <Label htmlFor="department">Departemen</Label>
                  <Input
                    id="department"
                    placeholder="ICU, IGD, dll"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <Label>Kredensial Login</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateCredentials}
                    disabled={!formData.name}
                  >
                    Generate
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="username"
                        placeholder="dr.john / ns.jane"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                Batal
              </Button>
              <Button onClick={handleAdd}>
                Tambah Staff
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats (Tidak Berubah) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffAccounts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokter</CardTitle>
            <Stethoscope className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctorCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perawat</CardTitle>
            <Heart className="w-4 h-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nurseCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs (Tidak Berubah) */}
      <Tabs value={roleFilter} onValueChange={(value) => setRoleFilter(value as any)} className="w-full">
        <TabsList>
          <TabsTrigger value="all">Semua Staff</TabsTrigger>
          <TabsTrigger value="doctor">Dokter</TabsTrigger>
          <TabsTrigger value="nurse">Perawat</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search (Tidak Berubah) */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari staff medis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Staff List (Tidak Berubah) */}
      <div className="grid gap-4">
        {filteredStaff.map((staff, index) => (
          <motion.div
            key={staff.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Menggunakan renderAvatarOrIcon */}
                    {renderAvatarOrIcon(staff)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{staff.name}</h3>
                        <Badge variant={staff.role === 'doctor' ? 'default' : 'secondary'}>
                          {staff.role === 'doctor' ? 'Dokter' : 'Perawat'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{staff.email}</span>
                        </div>
                        {staff.specialty && (
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-3 h-3" />
                            <span>{staff.specialty}</span>
                          </div>
                        )}
                        {staff.department && (
                          <div className="flex items-center gap-2">
                            <Heart className="w-3 h-3" />
                            <span>{staff.department}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Shield className="w-3 h-3" />
                          <span>Username: <code className="bg-muted px-1.5 py-0.5 rounded">{staff.username}</code></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Lock className="w-3 h-3" />
                          <span>Password: <code className="bg-muted px-1.5 py-0.5 rounded">{staff.password}</code></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(staff)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="gap-2">
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Staff?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus {staff.name}? Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(staff.id)}>
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Staff Medis</DialogTitle>
            <DialogDescription>
              Update informasi staff medis
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            
            {/* KONTROL GANTI FOTO/AVATAR */}
            <div className="flex items-center gap-4 border p-3 rounded-lg">
              <div className="relative">
                {/* Tampilan Foto Saat Ini / Pratinjau Foto Baru */}
                <img 
                  src={previewAvatar || formData.avatarUrl || DEFAULT_AVATAR_URL}
                  alt="Staff Avatar Preview"
                  className="w-20 h-20 rounded-full object-cover border-4 border-muted"
                  onError={(e) => { 
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR_URL;
                  }}
                />
              </div>

              <div className="space-y-1">
                {/* 1. Input File Tersembunyi - ID KUNCI */}
                {/* Perbaikan: Menggunakan ID staff sebagai key untuk memaksa reset input file saat beralih staff */}
                <input 
                  id="avatar-upload-edit" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                  key={selectedStaff?.id || 'default-file-input-key'}
                />
                {/* 2. Tombol yang berfungsi sebagai Label (AKTIF SAAT DIKLIK) */}
                <Label htmlFor="avatar-upload-edit" className="cursor-pointer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Ganti Foto/Ikon
                  </Button>
                </Label>
                <p className="text-xs text-muted-foreground">
                  Foto saat ini: {previewAvatar ? 'Pratinjau Foto Baru' : (formData.avatarUrl ? 'Sudah ada' : 'Default')}
                </p>
              </div>
            </div>
            {/* END KONTROL GANTI FOTO/AVATAR */}

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value: 'doctor' | 'nurse') => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Dokter</SelectItem>
                  <SelectItem value="nurse">Perawat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {formData.role === 'doctor' && (
              <div className="space-y-2">
                <Label htmlFor="edit-specialty">Spesialisasi</Label>
                <Input
                  id="edit-specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                />
              </div>
            )}

            {formData.role === 'nurse' && (
              <div className="space-y-2">
                <Label htmlFor="edit-department">Departemen</Label>
                <Input
                  id="edit-department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">Password</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
              Batal
            </Button>
            <Button onClick={handleEdit}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Tidak ada staff medis</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Tidak ada hasil yang cocok dengan pencarian Anda' : 'Mulai dengan menambahkan staff medis baru'}
          </p>
        </div>
      )}
    </div>
  );
}