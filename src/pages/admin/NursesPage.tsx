import React from 'react';
import { useState, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { useData, type Nurse } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'; // Tambah CardHeader, CardTitle
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
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
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export default function NursesPage() {
  const { nurses, addNurse, updateNurse, deleteNurse } = useData();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    shift: 'Pagi' as 'Pagi' | 'Siang' | 'Malam',
    license: '', // Asumsi ada license/STR di Nurse type
    email: '',
    phone: '',
    experience: 0,
  });

  // FUNGSI UNTUK MENGUNGGAH FOTO (AVATAR)
  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedAvatar(reader.result as string);
        toast.info('Foto siap diunggah saat Anda menyimpan/memperbarui data.');
      };
      reader.readAsDataURL(file);
    }
  };

  // FUNGSI TAMBAH PERAWAT
  const handleAddNurse = () => {
    if (!formData.name || !formData.department || !formData.shift) {
      toast.error('Nama, departemen, dan shift harus diisi');
      return;
    }

    addNurse({
      ...formData,
      experience: Number(formData.experience),
      avatar: uploadedAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`, 
    });

    toast.success('Perawat berhasil ditambahkan');
    setIsDialogOpen(false);
    resetForm();
  };

  // Membuka Dialog Edit
  const openEditDialog = (nurse: Nurse) => {
    setEditingNurse(nurse);
    setIsDialogOpen(true);
    setUploadedAvatar(null); 
    
    setFormData({
      name: nurse.name,
      department: nurse.department,
      shift: nurse.shift,
      license: (nurse as any).license || '', 
      email: nurse.email || '',
      phone: nurse.phone || '',
      experience: nurse.experience || 0,
    });
  };

  // FUNGSI EDIT PERAWAT
  const handleUpdateNurse = () => {
    if (!editingNurse) return;

    const updates: Partial<Nurse> = {
      ...formData,
      experience: Number(formData.experience),
    };
    
    if (uploadedAvatar) {
        updates.avatar = uploadedAvatar;
    }

    updateNurse(editingNurse.id, updates);

    toast.success('Data perawat berhasil diperbarui');
    setEditingNurse(null); 
    setIsDialogOpen(false);
    resetForm();
  };

  // FUNGSI HAPUS PERAWAT
  const handleDeleteNurse = (id: string, name: string) => {
    deleteNurse(id);
    toast.success(`${name} telah dihapus dari sistem`);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      department: '',
      shift: 'Pagi',
      license: '',
      email: '',
      phone: '',
      experience: 0,
    });
    setUploadedAvatar(null);
    setEditingNurse(null);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-foreground mb-2">Data Perawat</h1>
          <p className="text-muted-foreground">Kelola data perawat rumah sakit</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary-dark" onClick={resetForm}>
              <Plus className="w-5 h-5" />
              Tambah Perawat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNurse ? 'Edit Data Perawat' : 'Tambah Perawat Baru'}</DialogTitle>
              <DialogDescription>Lengkapi data perawat yang akan ditambahkan atau diperbarui</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               {/* Bagian Unggah Avatar (Sama seperti DoctorsPage) */}
              <div className="flex items-center gap-4 border p-3 rounded-lg">
                <Avatar className="w-16 h-16">
                    <AvatarImage 
                        src={uploadedAvatar || (editingNurse?.avatar ? editingNurse.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name || 'NN'}`)} 
                    />
                    <AvatarFallback>{formData.name[0] || 'N'}</AvatarFallback>
                </Avatar>
                <div>
                    <Label htmlFor="avatar-upload" className="cursor-pointer text-sm font-medium hover:text-primary transition-colors">
                        <span className='flex items-center gap-1'>
                            <Upload className='w-4 h-4'/> Unggah Foto Perawat
                        </span>
                    </Label>
                    <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                    />
                    <p className="text-xs text-muted-foreground">Maks 2MB, format JPG/PNG</p>
                </div>
              </div>
              {/* Form Data Perawat (Tidak diubah) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    placeholder="Ns. Nama Perawat"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Departemen *</Label>
                  <Input
                    id="department"
                    placeholder="ICU / IGD / Rawat Inap"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shift">Shift Kerja *</Label>
                  <Select 
                    value={formData.shift} 
                    onValueChange={(val) => setFormData({...formData, shift: val as 'Pagi' | 'Siang' | 'Malam'})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pagi">Pagi</SelectItem>
                      <SelectItem value="Siang">Siang</SelectItem>
                      <SelectItem value="Malam">Malam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="license">Nomor STR</Label>
                  <Input
                    id="license"
                    placeholder="STR-12345678"
                    value={formData.license}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Pengalaman (tahun)</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="5"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+628..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="perawat@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                onClick={editingNurse ? handleUpdateNurse : handleAddNurse} 
                className="bg-primary hover:bg-primary-dark"
              >
                {editingNurse ? 'Simpan Perubahan' : 'Simpan Perawat'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nurses.map((nurse, index) => (
          <motion.div
            key={nurse.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              {/* CARD HEADER - Mirip Dokter */}
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={nurse.avatar} />
                    <AvatarFallback>{nurse.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base mb-1 truncate">{nurse.name}</CardTitle>
                    {/* Badge Departemen */}
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      {nurse.department}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              {/* CARD CONTENT - Mirip Dokter */}
              <CardContent className="space-y-4">
                
                {/* Informasi Shift */}
                <div className="border-b pb-3">
                    <p className='text-sm text-muted-foreground'>Shift Kerja</p>
                    <p className='font-semibold'>{nurse.shift}</p>
                </div>

                {/* Pengalaman & STR */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Pengalaman</p>
                    <p>{nurse.experience || 0} tahun</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nomor STR</p>
                    <p>{(nurse as any).license || 'N/A'}</p>
                  </div>
                </div>

                {/* Kontak */}
                <div className="text-xs text-muted-foreground border-t pt-4">
                  <p>Telepon: {nurse.phone || 'N/A'}</p>
                  <p>Email: {nurse.email || 'N/A'}</p>
                </div>

                {/* Tombol Aksi - Mirip Dokter */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => openEditDialog(nurse)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 gap-2 text-destructive hover:bg-destructive hover:text-white">
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus Data</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus data perawat **{nurse.name}** dari sistem?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDeleteNurse(nurse.id, nurse.name)}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Ya, Hapus
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
      
      {nurses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Tidak ada perawat ditemukan</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}