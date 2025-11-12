import React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, RefreshCw, Edit, Trash2 } from 'lucide-react'; // Tambah Edit, Trash2
import { useData, type Room } from '../../contexts/DataContext'; // Import type Room
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
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
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '../../components/ui/select';
import { toast } from 'sonner'; // Menggunakan import tunggal toast

export default function RoomsPage() {
  // Asumsi fungsi queue di DataContext adalah clearQueue atau tetap resetQueue
  const { rooms, queue, addRoom, updateRoom, deleteRoom, resetQueue } = useData(); 

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    roomNumber: '',
    type: 'Reguler',
    capacity: 1,
    floor: 1,
    status: 'Tersedia' as 'Tersedia' | 'Terisi' | 'Maintenance', // Pastikan status sesuai interface Room
  });

  // 1. Mengganti Reset Antrean menjadi Hapus Antrean (dan Hapus Fungsi)
  // Catatan: Nama fungsi resetQueue dipertahankan, namun tombolnya diganti
  const handleResetQueue = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua nomor antrean?')) {
      resetQueue(); // Asumsi fungsi resetQueue di Context menghapus semua antrean
      toast.success('Antrean berhasil dihapus');
    }
  };
  
  // 2. FUNGSI TAMBAH RUANGAN
  const handleAddRoom = () => {
    if (!formData.name || !formData.roomNumber) {
        toast.error('Nama dan Nomor Ruangan harus diisi');
        return;
    }

    addRoom({
        ...formData,
        capacity: Number(formData.capacity),
        floor: Number(formData.floor),
        // Properti lain yang mungkin ada (facilities, price) diabaikan sementara
    });

    toast.success('Ruangan berhasil ditambahkan');
    setIsDialogOpen(false);
    resetForm();
  };

  // 3. FUNGSI EDIT RUANGAN
  const handleUpdateRoom = () => {
    if (!editingRoom) return;

    updateRoom(editingRoom.id, {
        ...formData,
        capacity: Number(formData.capacity),
        floor: Number(formData.floor),
    });

    toast.success('Keterangan ruangan berhasil diperbarui');
    setEditingRoom(null);
    setIsDialogOpen(false);
    resetForm();
  };

  // FUNGSI MEMBUKA DIALOG EDIT
  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
    setFormData({
        name: room.name,
        roomNumber: room.roomNumber || '',
        type: room.type,
        capacity: room.capacity || 1,
        floor: room.floor || 1,
        status: room.status,
    });
  };

  const resetForm = () => {
    setFormData({
        name: '',
        roomNumber: '',
        type: 'Reguler',
        capacity: 1,
        floor: 1,
        status: 'Tersedia',
    });
    setEditingRoom(null);
  };

  const getStatusColor = (status: Room['status']) => {
      switch (status) {
          case 'Tersedia':
              return 'bg-success/10 text-success hover:bg-success/20';
          case 'Terisi':
              return 'bg-warning/10 text-warning hover:bg-warning/20';
          case 'Maintenance':
              return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
          default:
              return 'bg-muted';
      }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-foreground mb-2">Ruangan & Antrean</h1>
          <p className="text-muted-foreground">Kelola ruangan dan sistem antrean</p>
        </div>

        <div className="flex gap-2">
          {/* Tombol HAPUS Antrean */}
          <Button variant="outline" onClick={handleResetQueue} className="gap-2 text-destructive border-destructive hover:bg-destructive/10">
            <Trash2 className="w-5 h-5" />
            Hapus Antrean
          </Button>
          
          {/* Tombol Tambah Ruangan */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button 
                    className="gap-2 bg-primary hover:bg-primary-dark"
                    onClick={resetForm} // Selalu reset form saat klik Tambah
                >
                    <Plus className="w-5 h-5" />
                    Tambah Ruangan
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-md'>
                <DialogHeader>
                    <DialogTitle>{editingRoom ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}</DialogTitle>
                    <DialogDescription>Lengkapi detail ruangan</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="name">Nama Ruangan *</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <Label htmlFor="roomNumber">Nomor Ruangan/Kode *</Label>
                        <Input id="roomNumber" value={formData.roomNumber} onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} />
                    </div>
                    <div>
                        <Label htmlFor="type">Tipe Ruangan</Label>
                        <Input id="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="capacity">Kapasitas</Label>
                            <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })} />
                        </div>
                        <div>
                            <Label htmlFor="floor">Lantai</Label>
                            <Input id="floor" type="number" value={formData.floor} onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 1 })} />
                        </div>
                    </div>
                    
                    {/* Input Status Ruangan (Hanya di Dialog Edit, atau jika ada editingRoom) */}
                    {(editingRoom || isDialogOpen) && (
                        <div>
                            <Label htmlFor="status">Status Ruangan</Label>
                            <Select 
                                value={formData.status} 
                                onValueChange={(val) => setFormData({...formData, status: val as Room['status']})}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Tersedia">Tersedia</SelectItem>
                                    <SelectItem value="Terisi">Terisi</SelectItem>
                                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                    <Button 
                        onClick={editingRoom ? handleUpdateRoom : handleAddRoom} 
                        className="bg-primary hover:bg-primary-dark"
                    >
                        {editingRoom ? 'Simpan Perubahan' : 'Simpan Ruangan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Rooms */}
      <div>
        <h2 className="mb-4">Daftar Ruangan</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className='relative'>
                {/* Tombol Edit di Pojok Kanan Atas */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 w-8 h-8 text-primary hover:bg-primary/10"
                    onClick={() => openEditDialog(room)}
                >
                    <Edit className="w-4 h-4" />
                </Button>
                
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Ruang {room.roomNumber}</span>
                    <Badge className={getStatusColor(room.status)}>
                      {room.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 font-medium">{room.name}</p>
                  {room.currentPatient && (
                      <p className='text-sm text-warning mb-2'>Pasien: {room.currentPatient}</p>
                  )}
                  <div className="text-sm text-muted-foreground space-y-1 pt-2 border-t mt-2">
                    <p>Tipe: {room.type}</p>
                    <p>Kapasitas: {room.capacity} orang</p>
                    <p>Lantai: {room.floor}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Queue */}
      <div>
        <h2 className="mb-4">Antrean Saat Ini</h2>
        <Card>
          <CardContent className="p-6">
            {(queue?.length ?? 0) > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {queue.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg border border-border bg-accent/30"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-4xl text-primary">{item.queueNumber}</div>
                      <Badge
                        className={
                          item.status === 'waiting'
                            ? 'bg-primary/10 text-primary'
                            : item.status === 'in-progress'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-success/10 text-success'
                        }
                      >
                        {item.status === 'waiting' ? 'Menunggu' :
                         item.status === 'in-progress' ? 'Dilayani' : 'Selesai'}
                      </Badge>
                    </div>
                    <p>{item.patientName}</p>
                    <p className="text-sm text-muted-foreground">{item.doctorName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.checkInTime}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Tidak ada antrean saat ini</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}