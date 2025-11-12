import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  FileText,
  Edit,
  Save,
  X,
  UserCircle,
  Activity,
  Stethoscope,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';

export default function PatientProfile() {
  const { user } = useAuth();
  const { patients, addPatient, updatePatient } = useData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<any>(null);
  const [isNewPatient, setIsNewPatient] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    allergies: '',
    medications: '',
    medicalHistory: '',
    insurance: '',
  });

  useEffect(() => {
    // Find patient by email or phone
    const patient = patients.find(
      p => p.email === user?.email || p.phone === user?.phone || p.name === user?.name
    );

    if (patient) {
      setCurrentPatient(patient);
      setIsNewPatient(false);
      setFormData({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        dateOfBirth: patient.dateOfBirth || '',
        gender: patient.gender || '',
        bloodType: patient.bloodType || '',
        address: patient.address || '',
        emergencyContact: patient.emergencyContact || '',
        emergencyPhone: patient.emergencyPhone || '',
        allergies: patient.allergies || '',
        medications: patient.medications || '',
        medicalHistory: patient.medicalHistory || '',
        insurance: patient.insurance || '',
      });
    } else {
      setIsNewPatient(true);
      setIsEditing(true);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dateOfBirth: '',
        gender: '',
        bloodType: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        allergies: '',
        medications: '',
        medicalHistory: '',
        insurance: '',
      });
    }
  }, [patients, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Nama, email, dan nomor telepon wajib diisi');
      return;
    }

    const patientData = {
      ...formData,
      id: currentPatient?.id || `PAT${Date.now()}`,
      medicalRecordNumber: currentPatient?.medicalRecordNumber || `MR${Date.now()}`,
      registrationDate: currentPatient?.registrationDate || new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      status: 'Active' as const,
      age: formData.dateOfBirth 
        ? new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear()
        : 0,
    };

    if (isNewPatient) {
      addPatient(patientData);
      toast.success('Profil berhasil didaftarkan!');
      setIsNewPatient(false);
    } else {
      updatePatient(patientData.id, patientData);
      toast.success('Profil berhasil diperbarui!');
    }

    setCurrentPatient(patientData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (isNewPatient) {
      toast.info('Silakan lengkapi profil Anda untuk melanjutkan');
      return;
    }
    
    if (currentPatient) {
      setFormData({
        name: currentPatient.name || '',
        email: currentPatient.email || '',
        phone: currentPatient.phone || '',
        dateOfBirth: currentPatient.dateOfBirth || '',
        gender: currentPatient.gender || '',
        bloodType: currentPatient.bloodType || '',
        address: currentPatient.address || '',
        emergencyContact: currentPatient.emergencyContact || '',
        emergencyPhone: currentPatient.emergencyPhone || '',
        allergies: currentPatient.allergies || '',
        medications: currentPatient.medications || '',
        medicalHistory: currentPatient.medicalHistory || '',
        insurance: currentPatient.insurance || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground">
              {isNewPatient ? 'Registrasi Profil Pasien' : 'Profil Pasien'}
            </h1>
            <p className="text-muted-foreground">
              {isNewPatient 
                ? 'Lengkapi informasi Anda untuk melanjutkan' 
                : 'Kelola informasi pribadi dan riwayat medis Anda'}
            </p>
          </div>
          {!isNewPatient && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Batal
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Save className="w-4 h-4" />
                    Simpan
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profil
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Alert for new patients */}
      {isNewPatient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert className="border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20">
            <AlertCircle className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800 dark:text-emerald-200">
              Selamat datang! Silakan lengkapi profil Anda untuk dapat menggunakan semua fitur Health Hub.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Profile Card */}
      {!isEditing && currentPatient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                  <UserCircle className="w-16 h-16 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-white mb-2">{currentPatient.name}</h2>
                  <div className="flex flex-wrap gap-4 text-emerald-50">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{currentPatient.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{currentPatient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-mono">{currentPatient.medicalRecordNumber}</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white hover:bg-white/30 text-lg px-4 py-2">
                  {currentPatient.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Information Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informasi Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Nomor Telepon *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bloodType">Golongan Darah</Label>
                <Select
                  value={formData.bloodType}
                  onValueChange={(value) => handleInputChange('bloodType', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih golongan darah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                    <SelectItem value="O">O</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emergency Contact & Medical Info */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Kontak Darurat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emergencyContact">Nama Kontak Darurat</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Nama keluarga/teman"
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyPhone">Nomor Telepon Darurat</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    disabled={!isEditing}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div>
                  <Label htmlFor="insurance">Asuransi Kesehatan</Label>
                  <Input
                    id="insurance"
                    value={formData.insurance}
                    onChange={(e) => handleInputChange('insurance', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Nama asuransi (BPJS, KIS, dll)"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Informasi Medis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="allergies">Alergi</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Sebutkan alergi (obat, makanan, dll)"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="medications">Obat yang Sedang Dikonsumsi</Label>
                  <Textarea
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => handleInputChange('medications', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Daftar obat yang sedang dikonsumsi"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="medicalHistory">Riwayat Penyakit</Label>
                  <Textarea
                    id="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Riwayat penyakit atau operasi"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Save Button for New Patient */}
      {isNewPatient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleSave}
            size="lg"
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 px-8"
          >
            <Save className="w-5 h-5" />
            Simpan & Daftar
          </Button>
        </motion.div>
      )}

      {/* Quick Stats */}
      {!isNewPatient && currentPatient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Ringkasan Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Terdaftar Sejak</p>
                  <p className="font-medium">
                    {new Date(currentPatient.registrationDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Heart className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Kunjungan Terakhir</p>
                  <p className="font-medium">
                    {new Date(currentPatient.lastVisit).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">No. Rekam Medis</p>
                  <p className="font-medium font-mono">{currentPatient.medicalRecordNumber}</p>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Shield className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge className="bg-green-500 text-white">{currentPatient.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
