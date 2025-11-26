import React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Eye, Edit, Trash2, Download, FileText, User, Syringe } from 'lucide-react'; 
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

// --- DEFINISI TIPE MEDICAL RECORD ---
type MedicalRecord = {
  id: string;
  patientId: string;
  date: string;
  chiefComplaint: string;
  diagnosis: string;
  medication: string;
  doctor: string;       
  action: string;       
  isAdmitted?: boolean;
};

// --- FUNGSI HELPER UNTUK MOCK DATA SEMUA PASIEN ---
const createMockRecords = (patientId: string): MedicalRecord[] => {
    // Riwayat Spesifik untuk Ahmad Fauzi (5 Riwayat Lengkap)
    if (patientId === 'MR-2024-001-ID-Ahmad') {
        return [
             { // Riwayat 1 (Terbaru)
                id: 'rec-005', patientId, date: '2026-03-10', chiefComplaint: 'Luka robek pada kaki akibat terjatuh saat berolahraga.', diagnosis: 'Vulnus Laceratum', medication: 'Anti-tetanus, Paracetamol', doctor: 'Dr. Malikusa Saleh', action: 'Jahit luka (5 jahitan), Pembersihan luka', isAdmitted: false,
            },
             { // Riwayat 2
                id: 'rec-004', patientId, date: '2026-01-25', chiefComplaint: 'Batuk berdahak dan sesak napas selama seminggu terakhir.', diagnosis: 'Bronkitis Akut', medication: 'Obat pengencer dahak, Antibiotik Azithromycin', doctor: 'Dr. Sinta Wijaya, Sp.PD', action: 'Rontgen Thorax, Nebulizer', isAdmitted: false,
            },
             { // Riwayat 3
                id: 'rec-003', patientId, date: '2025-11-20', chiefComplaint: 'Nyeri tenggorokan dan batuk kering selama 3 hari.', diagnosis: 'Faringitis Akut', medication: 'Amoxicillin 500mg (3x1), Obat batuk sirup (3x1)', doctor: 'Dr. Malikusa Saleh', action: 'Pemeriksaan fisik tenggorokan, Resep obat', isAdmitted: false,
            },
            { // Riwayat 4 (Rawat Inap)
                id: 'rec-002', patientId, date: '2025-09-01', chiefComplaint: 'Demam tinggi mendadak selama 5 hari, disertai bintik merah dan mimisan.', diagnosis: 'Demam Berdarah Dengue (DBD) Grade I', medication: 'Infus Ringer Laktat, Paracetamol, Monitoring trombosit', doctor: 'Dr. Sinta Wijaya, Sp.PD', action: 'Pemasangan Infus, Cek darah rutin harian, Rawat Inap', isAdmitted: true,
            },
            { // Riwayat 5 (Paling Lama - Kontrol Kronis)
                id: 'rec-001', patientId, date: '2025-03-25', chiefComplaint: 'Kontrol rutin untuk tekanan darah, pusing ringan di pagi hari.', diagnosis: 'Hipertensi Primer', medication: 'Amlodipine 5mg (1x1), Diet rendah garam', doctor: 'Dr. Malikusa Saleh', action: 'Pengukuran Tensi, Konsultasi gizi', isAdmitted: false,
            },
        ];
    } 
    
    // Riwayat Spesifik untuk Siti Nurhaliza (5 Riwayat Lengkap)
    if (patientId === 'MR-2024-002-ID-Siti') {
        return [
            { // Riwayat 1 (Terbaru)
                id: 'rec-105', patientId, date: '2026-02-01', chiefComplaint: 'Mata bengkak dan sakit, penglihatan kabur.', diagnosis: 'Glaukoma Akut', medication: 'Tetes mata Pilocarpine', doctor: 'Dr. Ahmad Fauzi, Sp.M', action: 'Pemeriksaan tekanan bola mata, Rujukan ke spesialis', isAdmitted: false,
            },
            { // Riwayat 2
                id: 'rec-104', patientId, date: '2025-12-15', chiefComplaint: 'Lemas dan pucat, hasil lab menunjukkan kadar hemoglobin rendah.', diagnosis: 'Anemia Defisiensi Besi', medication: 'Suplemen zat besi, Vitamin B12', doctor: 'Dr. Nurul Hikmah', action: 'Pemeriksaan darah lengkap, Konsultasi nutrisi', isAdmitted: false,
            },
            { // Riwayat 3
                id: 'rec-103', patientId, date: '2025-11-05', chiefComplaint: 'Nyeri perut bagian bawah dan sering buang air kecil.', diagnosis: 'Infeksi Saluran Kemih', medication: 'Ciprofloxacin 500mg (2x1), Perbanyak minum air putih', doctor: 'Dr. Nurul Hikmah', action: 'Pemeriksaan Urin, Resep antibiotik', isAdmitted: false,
            },
            { // Riwayat 4
                id: 'rec-102', patientId, date: '2025-08-10', chiefComplaint: 'Nyeri punggung bawah setelah mengangkat barang berat.', diagnosis: 'Strain Lumbar', medication: 'Obat pelemas otot, fisioterapi', doctor: 'Dr. Budi Santoso', action: 'Pemeriksaan fisik, Rujukan fisioterapi', isAdmitted: false,
            },
            { // Riwayat 5 (Paling Lama)
                id: 'rec-101', patientId, date: '2025-03-20', chiefComplaint: 'Mata merah, bengkak, dan gatal.', diagnosis: 'Konjungtivitis Viral', medication: 'Tetes mata antivirus', doctor: 'Dr. Nurul Hikmah', action: 'Pemeriksaan mata, Resep obat', isAdmitted: false,
            },
        ];
    }
    
    // Riwayat default (General Check Up) untuk pasien lainnya (3 Riwayat)
    return [
        { // Riwayat 1 (Terbaru)
            id: `rec-${patientId}-003`,
            patientId,
            date: '2025-10-15',
            chiefComplaint: 'Luka memar ringan di lengan akibat terbentur.',
            diagnosis: 'Kontusio Ringan',
            medication: 'Krim pereda nyeri',
            doctor: 'Dr. Umum IGD',
            action: 'Kompres dingin, Resep obat luar',
            isAdmitted: false,
        },
        { // Riwayat 2
            id: `rec-${patientId}-002`,
            patientId,
            date: '2025-05-01',
            chiefComplaint: 'Vaksinasi rutin Influenza.',
            diagnosis: 'Imunisasi Influenza',
            medication: 'Vaksin Influenza',
            doctor: 'Suster Rika',
            action: 'Injeksi, Observasi 15 menit',
            isAdmitted: false,
        },
        { // Riwayat 3 (Paling Lama)
            id: `rec-${patientId}-001`,
            patientId,
            date: '2025-01-01',
            chiefComplaint: 'Pemeriksaan kesehatan rutin tahunan.',
            diagnosis: 'Sehat / General Check Up',
            medication: 'Suplemen vitamin',
            doctor: 'Dr. Umum IGD',
            action: 'Pengambilan sampel darah, Timbang berat badan',
            isAdmitted: false,
        }
    ];
};
// --- END MOCK DATA HELPER ---


export default function PatientsPage() {
  const dataContext = useData();
  
  // --- START PENYESUAIAN SEMENTARA UNTUK DEMO SEMUA PASIEN ---
  
  const patients = dataContext.patients.map(p => {
    if (p.medicalRecordNumber === 'MR-2024-001') {
        return { ...p, id: 'MR-2024-001-ID-Ahmad' };
    }
    if (p.medicalRecordNumber === 'MR-2024-002') {
        return { ...p, id: 'MR-2024-002-ID-Siti' };
    }
    return { ...p, id: p.id || p.medicalRecordNumber };
  });
  
  const mockRecordsForDemo = patients.flatMap(p => createMockRecords(p.id));
  const medicalRecords = [...(dataContext.medicalRecords ?? []), ...mockRecordsForDemo];
  
  const { addPatient, updatePatient, deletePatient } = dataContext; 
  
  // --- END PENYESUAIAN SEMENTARA ---

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [isAddRecordDialogOpen, setIsAddRecordDialogOpen] = useState(false); 
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null); 

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

  const [newRecordData, setNewRecordData] = useState({
    date: new Date().toISOString().substring(0, 10),
    chiefComplaint: '',
    diagnosis: '',
    medication: '',
    doctor: '',           
    action: '',             
    isAdmitted: false,
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
  
  const addMedicalRecord = (record: MedicalRecord) => {
      // Di aplikasi sesungguhnya, Anda akan memanggil fungsi dari DataContext di sini
      toast.success('Riwayat medis baru berhasil ditambahkan (Mock)');
  };

  const handleAddNewMedicalRecord = () => {
    if (!viewingPatient || !newRecordData.chiefComplaint || !newRecordData.diagnosis) {
        toast.error('Keluhan utama dan diagnosis harus diisi');
        return;
    }

    const newRecord: MedicalRecord = {
        id: `rec-${Date.now()}`,
        patientId: viewingPatient.id,
        ...newRecordData,
    };

    addMedicalRecord(newRecord); 
    setIsAddRecordDialogOpen(false);
    setNewRecordData({
        date: new Date().toISOString().substring(0, 10),
        chiefComplaint: '',
        diagnosis: '',
        medication: '',
        doctor: '',          
        action: '',            
        isAdmitted: false,
    });
  };
  

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
      
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = fileName;
      
      setTimeout(() => {
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }, 0); 
    } catch (error) {
        console.error("Gagal mengunduh file JSON:", error);
        toast.error('Gagal membuat file unduhan JSON.');
    }
  };
  

  const handleDownloadMedicalRecord = async (patient: Patient) => {
    const patientRecords = medicalRecords.filter(r => r.patientId === patient.id);
    await generateMedicalRecordPDF(patient, patientRecords); 
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
      <Dialog open={!!viewingPatient} onOpenChange={() => { setViewingPatient(null); setViewingRecord(null); }}>
        {/* FIX SCROLL DIALOG UTAMA DI SINI */}
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto"> 
          <DialogHeader>
            <DialogTitle>Detail Pasien</DialogTitle>
          </DialogHeader>
          {viewingPatient && (
            <div className="space-y-6">
              {/* Data Demografi Pasien */}
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
              {/* Kontak */}
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

              {/* RIWAYAT MEDIS (LIST) */}
              <div className="border-t pt-4">
                {/* BLOK INI SEKARANG HANYA BERISI HEADING DAN TOMBOL-TOMBOL DI SAMPINGNYA */}
                <div className="flex items-center justify-between mb-3">
                  <h4>Riwayat Medis</h4>
                  <div className="flex gap-2 items-center"> {/* Tambahkan items-center untuk alignment vertikal */}
                    {/* Tombol Unduh JSON */}
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
                    
                    {/* TOMBOL TAMBAH RIWAYAT BARU (IKON KECIL) */}
                    <Button
                      size="icon" // Menggunakan size="icon"
                      onClick={() => setIsAddRecordDialogOpen(true)} 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700 w-9 h-9 flex-shrink-0" // Dibuat lebih kecil dan ikon
                      title="Tambah Riwayat Baru"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                
                {(() => {
                  const patientRecords = medicalRecords
                    .filter(r => r.patientId === viewingPatient.id)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                  if (patientRecords.length === 0) {
                    return (
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground text-center">
                          Belum ada riwayat medis
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="max-h-[20rem] overflow-y-auto"> 
                        <div className="space-y-3 pr-2">
                            {patientRecords.map((record, index) => (
                                <Card key={record.id} className="shadow-none border-l-4 border-primary/70">
                                  <CardContent className="p-3 flex justify-between items-center">
                                    <div className="flex-1 space-y-1">
                                        <h5 className="font-semibold text-primary">
                                            {record.diagnosis || 'Kunjungan'}
                                        </h5>
                                        <p className="text-xs text-muted-foreground">
                                            {record.chiefComplaint.substring(0, 50)}
                                            {record.chiefComplaint.length > 50 ? '...' : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary flex-shrink-0 text-xs">
                                            {new Date(record.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </Badge>
                                        {/* TOMBOL MATA UNTUK LIHAT DETAIL RIWAYAT SPESIFIK */}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setViewingRecord(record)}
                                            className="text-gray-500 hover:text-primary p-0 h-8 w-8"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                        </div>
                    </div>
                  );
                })()}
                {/* --- AKHIR LOGIKA RIWAYAT MEDIS --- */}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Medical Record Dialog (Memastikan ada tombol SIMPAN) */}
      <Dialog open={isAddRecordDialogOpen} onOpenChange={setIsAddRecordDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Tambah Riwayat Medis</DialogTitle>
            <DialogDescription>
              Catat kunjungan atau perawatan baru untuk pasien **{viewingPatient?.name}**.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="record-date">Tanggal Kunjungan</Label>
                    <Input
                        id="record-date"
                        type="date"
                        value={newRecordData.date}
                        onChange={(e) => setNewRecordData({ ...newRecordData, date: e.target.value })}
                    />
                </div>
                <div>
                    <Label htmlFor="doctor">Dokter Penanggung Jawab</Label>
                    <Input
                        id="doctor"
                        placeholder="Contoh: Dr. Malikusa Saleh"
                        value={newRecordData.doctor}
                        onChange={(e) => setNewRecordData({ ...newRecordData, doctor: e.target.value })}
                    />
                </div>
            </div>
            <div>
              <Label htmlFor="chief-complaint">Keluhan Utama *</Label>
              <Input
                id="chief-complaint"
                value={newRecordData.chiefComplaint}
                onChange={(e) => setNewRecordData({ ...newRecordData, chiefComplaint: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Input
                id="diagnosis"
                value={newRecordData.diagnosis}
                onChange={(e) => setNewRecordData({ ...newRecordData, diagnosis: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="medication">Obat</Label>
              <Input
                id="medication"
                placeholder="Contoh: Paracetamol 500mg"
                value={newRecordData.medication}
                onChange={(e) => setNewRecordData({ ...newRecordData, medication: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="action">Tindakan/Prosedur</Label>
              <Input
                id="action"
                placeholder="Contoh: Pemasangan Infus, Rujukan"
                value={newRecordData.action}
                onChange={(e) => setNewRecordData({ ...newRecordData, action: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="isAdmitted"
                type="checkbox"
                checked={newRecordData.isAdmitted}
                onChange={(e) => setNewRecordData({ ...newRecordData, isAdmitted: e.target.checked })}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
              />
              <Label htmlFor="isAdmitted" className="font-medium">Pasien Rawat Inap</Label>
            </div>
          </div>
          <DialogFooter>
            {/* TOMBOL BATAL */}
            <Button variant="outline" onClick={() => setIsAddRecordDialogOpen(false)}>
              Batal
            </Button>
            {/* TOMBOL SIMPAN (Sudah terhubung ke fungsi simpan handleAddNewMedicalRecord) */}
            <Button onClick={handleAddNewMedicalRecord} className="bg-green-600 hover:bg-green-700">
              Simpan Riwayat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Medical Record Detail Dialog */}
      <Dialog open={!!viewingRecord} onOpenChange={() => setViewingRecord(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Detail Riwayat Medis</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang kunjungan pada tanggal {viewingRecord ? new Date(viewingRecord.date).toLocaleDateString('id-ID') : ''}.
            </DialogDescription>
          </DialogHeader>
          {viewingRecord && (
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b">
                    <h3 className="text-xl font-bold text-primary">{viewingRecord.diagnosis}</h3>
                    {viewingRecord.isAdmitted && (
                        <Badge className="bg-red-500 text-white font-semibold flex items-center gap-1">
                            Rawat Inap
                        </Badge>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Tanggal Kunjungan</p>
                        <p className="font-medium">{new Date(viewingRecord.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                            <User className='w-4 h-4' /> Dokter Penanggung Jawab
                        </p>
                        <p className="font-medium">{viewingRecord.doctor || '-'}</p>
                    </div>
                </div>

                <div className="space-y-3 p-3 bg-muted rounded-lg">
                    <p>
                        <span className="font-semibold text-muted-foreground">Keluhan Utama:</span> {viewingRecord.chiefComplaint}
                    </p>
                    <p>
                        <span className="font-semibold text-muted-foreground">Obat Diberikan:</span> {viewingRecord.medication || '-'}
                    </p>
                    <p>
                        <span className="font-semibold text-muted-foreground flex items-center gap-1">
                            <Syringe className='w-4 h-4' /> Tindakan/Prosedur:
                        </span> {viewingRecord.action || '-'}
                    </p>
                </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingRecord(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}