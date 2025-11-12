import React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Eye, Edit, Trash2, Download, FileText } from 'lucide-react'; 
import { useData, type Patient } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner@2.0.3';
import { generateMedicalRecordPDF } from '../../utils/pdfGenerator';

export default function PatientsPage() {
  const { patients, addPatient, updatePatient, deletePatient, medicalRecords } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    medicalRecordNumber: '',
    dateOfBirth: '',
    gender: 'Laki-laki',
    phone: '',
    email: '',
    address: '',
    bloodType: '',
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.medicalRecordNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  const handleAddPatient = () => {
    if (!formData.name || !formData.phone) {
      toast.error('Nama dan nomor telepon harus diisi');
      return;
    }

    const mrNumber = formData.medicalRecordNumber || `MR-${Date.now()}`;
    
    addPatient({
      ...formData,
      medicalRecordNumber: mrNumber,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
    });

    toast.success('Pasien berhasil ditambahkan');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleUpdatePatient = () => {
    if (!editingPatient) return;

    updatePatient(editingPatient.id, formData);
    toast.success('Data pasien berhasil diperbarui');
    setEditingPatient(null);
    resetForm();
  };

  const handleDeletePatient = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pasien ${name}?`)) {
      deletePatient(id);
      toast.success('Pasien berhasil dihapus');
    }
  };

  // --- FUNGSI UNDUH JSON (METODE PALING PRIMITIF DENGAN SETTIMEOUT & TANPA TOAST) ---
  const handleDownloadMedicalRecordJson = (patient: Patient) => {
    const patientRecords = medicalRecords.filter(r => r.patientId === patient.id);
    
    const dataToDownload = {
      nama_pasien: patient.name,
      no_rekam_medis: patient.medicalRecordNumber,
      demografi: {
        golongan_darah: patient.bloodType,
        tanggal_lahir: patient.dateOfBirth,
        jenis_kelamin: patient.gender,
      },
      detail_kontak: {
        telepon: patient.phone,
        email: patient.email,
        alamat: patient.address,
      },
      riwayat_medis: patientRecords.length > 0 ? patientRecords : 'Belum ada riwayat medis',
    };

    try {
      const jsonString = JSON.stringify(dataToDownload, null, 2); 
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString);
      
      const fileName = `${patient.name.replace(/\s/g, '_')}_RiwayatMedis.json`;
      
      // Buat elemen <a>
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = fileName;
      
      // Metode andal: Bungkus dalam setTimeout untuk memisah dari event klik React
      setTimeout(() => {
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }, 0); 
      
      // toast.success('Rekam medis berhasil diunduh (JSON)'); // DIHAPUS SEMENTARA
    } catch (error) {
        console.error("Gagal mengunduh file JSON:", error);
        toast.error('Gagal membuat file unduhan JSON.');
    }
  };
  // --- END FUNGSI UNDUH JSON ---

  // Fungsi unduh PDF (TETAP)
  const handleDownloadMedicalRecord = async (patient: Patient) => {
    const patientRecords = medicalRecords.filter(r => r.patientId === patient.id);
    // Masalah pada tombol PDF kemungkinan ada di dalam fungsi generateMedicalRecordPDF ini.
    await generateMedicalRecordPDF(patient, patientRecords); 
    // toast.success('Rekam medis berhasil diunduh (PDF)'); // DIHAPUS SEMENTARA
  };

  const resetForm = () => {
    setFormData({
      name: '',
      medicalRecordNumber: '',
      dateOfBirth: '',
      gender: 'Laki-laki',
      phone: '',
      email: '',
      address: '',
      bloodType: '',
    });
  };

  const openEditDialog = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      medicalRecordNumber: patient.medicalRecordNumber,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      bloodType: patient.bloodType || '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header dan Tambah Pasien Dialog */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-foreground mb-2">Data Pasien</h1>
          <p className="text-muted-foreground">Kelola data pasien rumah sakit</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary-dark">
              <Plus className="w-5 h-5" />
              Tambah Pasien
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Pasien Baru</DialogTitle>
              <DialogDescription>Lengkapi formulir untuk menambahkan pasien baru</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="mrn">No. Rekam Medis</Label>
                  <Input
                    id="mrn"
                    placeholder="Auto-generate"
                    value={formData.medicalRecordNumber}
                    onChange={(e) => setFormData({ ...formData, medicalRecordNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dob">Tanggal Lahir</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm"
                  >
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+628123456789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="bloodType">Golongan Darah</Label>
                <select
                  id="bloodType"
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm"
                >
                  <option value="">Pilih golongan darah</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddPatient} className="bg-primary hover:bg-primary-dark">
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
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
                placeholder="Cari pasien berdasarkan nama, nomor RM, atau telepon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pasien</TableHead>
                    <TableHead>No. RM</TableHead>
                    <TableHead>Tanggal Lahir</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Gol. Darah</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient, index) => (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-accent/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={patient.avatar} />
                            <AvatarFallback>{patient.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p>{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.gender}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{patient.medicalRecordNumber}</Badge>
                      </TableCell>
                      <TableCell>{patient.dateOfBirth}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{patient.phone}</p>
                          <p className="text-muted-foreground">{patient.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {patient.bloodType && (
                          <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
                            {patient.bloodType}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewingPatient(patient)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(patient)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          {/* OPSI UNDUH JSON DI TABEL (Menggunakan A Native yang distyle) */}
                          <a
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault(); 
                              handleDownloadMedicalRecordJson(patient);
                            }}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 w-9 p-0 bg-transparent text-yellow-600 hover:bg-accent hover:text-yellow-700"
                            role="button"
                            title="Unduh Rekam Medis (JSON)"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                          
                          {/* OPSI UNDUH PDF DI TABEL */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadMedicalRecord(patient)}
                            className="text-primary"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeletePatient(patient.id, patient.name)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPatient} onOpenChange={() => setEditingPatient(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Pasien</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nama Lengkap</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Nomor Telepon</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-address">Alamat</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPatient(null)}>
              Batal
            </Button>
            <Button onClick={handleUpdatePatient} className="bg-primary hover:bg-primary-dark">
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Patient Dialog */}
      <Dialog open={!!viewingPatient} onOpenChange={() => setViewingPatient(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail Pasien</DialogTitle>
          </DialogHeader>
          {viewingPatient && (
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={viewingPatient.avatar} />
                  <AvatarFallback>{viewingPatient.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="mb-2">{viewingPatient.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">No. Rekam Medis</p>
                      <p>{viewingPatient.medicalRecordNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Golongan Darah</p>
                      <p>{viewingPatient.bloodType || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tanggal Lahir</p>
                      <p>{viewingPatient.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Jenis Kelamin</p>
                      <p>{viewingPatient.gender}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-3">Kontak</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Telepon</p>
                    <p>{viewingPatient.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p>{viewingPatient.email || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Alamat</p>
                    <p>{viewingPatient.address}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4>Riwayat Medis</h4>
                  <div className="flex gap-2">
                    {/* TOMBOL UNDUH JSON DI DIALOG */}
                    <Button
                      size="sm"
                      onClick={() => handleDownloadMedicalRecordJson(viewingPatient)}
                      variant="outline"
                      className="gap-2 text-yellow-600 hover:text-yellow-700 border-yellow-300"
                    >
                      <FileText className="w-4 h-4" />
                      Unduh JSON
                    </Button>
                    
                    {/* Tombol Unduh PDF */}
                    <Button
                      size="sm"
                      onClick={() => handleDownloadMedicalRecord(viewingPatient)}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Unduh PDF
                    </Button>
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Belum ada riwayat medis
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}