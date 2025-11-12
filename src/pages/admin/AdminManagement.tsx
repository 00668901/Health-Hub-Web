import React from 'react';
import { useState, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { 
  UserCog, Plus, Trash2, Eye, EyeOff, Shield, Mail, Lock,
  Search, Edit2, CheckCircle, XCircle, Upload
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
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';
// MEMPERBAIKI: Mengimpor tipe AdminAccount secara langsung
import { useData, type AdminAccount } from '../../contexts/DataContext'; 

// FIX: Menggunakan tipe AdminAccount yang diimpor, bukan memanggil hook
interface AdminAccountWithAvatar extends AdminAccount {
  avatarUrl?: string;
}

export default function AdminManagement() {
  const { t } = useLanguage();
  // Casting adminAccounts agar memiliki properti avatarUrl
  const { adminAccounts, addAdminAccount, updateAdminAccount, deleteAdminAccount } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccountWithAvatar | null>(null);
  
  // State baru untuk menyimpan URL/Data URI avatar yang diunggah
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'Administrator',
  });
  const [showPassword, setShowPassword] = useState(false);

  const generateUsername = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '.') + Math.floor(Math.random() * 100);
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
    setFormData({
      ...formData,
      username: generateUsername(formData.name),
      password: generatePassword(),
    });
  };

  // FUNGSI BARU: MENGUNGGAH FOTO
  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedAvatar(reader.result as string);
        toast.info('Foto siap diunggah saat Anda menyimpan perubahan.');
      };
      reader.readAsDataURL(file);
    }
  };


  const handleAdd = () => {
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      toast.error('Semua field harus diisi');
      return;
    }

    addAdminAccount({
      name: formData.name,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      // Tambahkan avatarUrl ke data yang dikirim ke context
      avatarUrl: uploadedAvatar || undefined,
    });

    toast.success('Administrator berhasil ditambahkan');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedAdmin) return;

    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      toast.error('Semua field harus diisi');
      return;
    }

    const updates = {
      name: formData.name,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      // Update avatarUrl jika ada foto baru diunggah
      avatarUrl: uploadedAvatar !== null ? uploadedAvatar : selectedAdmin.avatarUrl,
    };

    updateAdminAccount(selectedAdmin.id, updates);

    toast.success('Administrator berhasil diupdate');
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteAdminAccount(id);
    toast.success('Administrator berhasil dihapus');
  };

  const openEditDialog = (admin: AdminAccountWithAvatar) => {
    setSelectedAdmin(admin);
    setUploadedAvatar(null); // Reset uploaded avatar state
    setFormData({
      name: admin.name,
      email: admin.email,
      username: admin.username,
      password: admin.password,
      role: admin.role,
    });
    setIsEditDialogOpen(true);
  };
  
  const resetForm = () => {
      setFormData({ name: '', email: '', username: '', password: '', role: 'Administrator' });
      setUploadedAvatar(null);
      setSelectedAdmin(null);
  }

  // Casting untuk mencakup avatarUrl
  const filteredAdmins = adminAccounts.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) as AdminAccountWithAvatar[]; 

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2">
            <UserCog className="w-8 h-8 text-primary" />
            Kelola Administrator
          </h1>
          <p className="text-muted-foreground mt-1">
            Manajemen akun administrator sistem
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={resetForm}>
              <Plus className="w-4 h-4" />
              Tambah Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Administrator Baru</DialogTitle>
              <DialogDescription>
                Buat akun administrator baru dengan kredensial unik
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* INPUT UPLOAD AVATAR - TAMBAH */}
              <div className="flex items-center gap-4 border p-3 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white overflow-hidden">
                    {/* Tampilkan avatar yang diunggah */}
                    {uploadedAvatar ? (
                        <img src={uploadedAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                        <UserCog className="w-8 h-8" />
                    )}
                </div>
                <div>
                    <Label htmlFor="avatar-upload-add" className="cursor-pointer text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                        <Upload className='w-4 h-4'/> Unggah Foto/Ikon
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
              
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@healthhub.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  placeholder="Administrator"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>

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
                        placeholder="username"
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
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAdd}>
                Tambah Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats (Tidak diubah) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admin</CardTitle>
            <UserCog className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminAccounts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminAccounts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Aktif</CardTitle>
            <XCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Search (Tidak diubah) */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari administrator..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Admin List */}
      <div className="grid gap-4">
        {filteredAdmins.map((admin, index) => (
          <motion.div
            key={admin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* TAMPILAN IKON/AVATAR DINAMIS */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white overflow-hidden">
                      {admin.avatarUrl ? (
                         <img src={admin.avatarUrl} alt={`${admin.name} Avatar`} className="w-full h-full object-cover" />
                      ) : (
                         <UserCog className="w-6 h-6" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{admin.name}</h3>
                        <Badge variant="default">{admin.role}</Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{admin.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-3 h-3" />
                          <span>Username: <code className="bg-muted px-1.5 py-0.5 rounded">{admin.username}</code></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Lock className="w-3 h-3" />
                          <span>Password: <code className="bg-muted px-1.5 py-0.5 rounded">{admin.password}</code></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(admin)}
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
                          <AlertDialogTitle>Hapus Administrator?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus {admin.name}? Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(admin.id)}>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Administrator</DialogTitle>
            <DialogDescription>
              Update informasi administrator
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* INPUT UPLOAD AVATAR - EDIT */}
            <div className="flex items-center gap-4 border p-3 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white overflow-hidden">
                    {/* Tampilkan avatar yang diunggah atau avatar yang sudah ada */}
                    {uploadedAvatar ? (
                        <img src={uploadedAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (selectedAdmin?.avatarUrl ? (
                         <img src={selectedAdmin.avatarUrl} alt={`${selectedAdmin.name} Avatar`} className="w-full h-full object-cover" />
                    ) : (
                        <UserCog className="w-8 h-8" />
                    ))}
                </div>
                <div>
                    <Label htmlFor="avatar-upload-edit" className="cursor-pointer text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                        <Upload className='w-4 h-4'/> Ganti Foto/Ikon
                    </Label>
                    <Input
                        id="avatar-upload-edit"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                    />
                    <p className="text-xs text-muted-foreground">Foto saat ini: {uploadedAvatar ? 'Siap diunggah' : (selectedAdmin?.avatarUrl ? 'Sudah ada' : 'Default')}</p>
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input
                id="edit-name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="john@healthhub.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Input
                id="edit-role"
                placeholder="Administrator"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                placeholder="username"
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
                  placeholder="••••••••"
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEdit}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredAdmins.length === 0 && (
        <div className="text-center py-12">
          <UserCog className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Tidak ada administrator</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Tidak ada hasil yang cocok dengan pencarian Anda' : 'Mulai dengan menambahkan administrator baru'}
          </p>
        </div>
      )}
    </div>
  );
}