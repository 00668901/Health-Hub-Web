import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Calendar, User, Activity, Download, Filter,
  Search, ChevronDown, ChevronUp, Stethoscope, Pill, Syringe
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface MedicalRecord {
  id: string;
  patientName: string;
  patientId: string;
  medicalRecordNumber?: string;
  doctorName: string;
  nurseAssistant?: string;
  date: string;
  type: 'consultation' | 'treatment' | 'surgery' | 'checkup';
  diagnosis: string;
  treatment: string;
  medications?: string[];
  notes: string;
  status: 'completed' | 'ongoing' | 'follow-up';
}

const mockRecords: MedicalRecord[] = [
  {
    id: '1',
    patientName: 'Ahmad Wijaya',
    patientId: 'P-001',
    medicalRecordNumber: 'MR-2024-001',
    doctorName: 'Dr. Ahmad Rizki',
    nurseAssistant: 'Ns. Budi Santoso',
    date: '2025-10-20',
    type: 'consultation',
    diagnosis: 'Hipertensi Stadium 2',
    treatment: 'Terapi obat antihipertensi',
    medications: ['Amlodipine 10mg', 'Losartan 50mg'],
    notes: 'Pasien disarankan untuk diet rendah garam dan olahraga teratur',
    status: 'ongoing',
  },
  {
    id: '2',
    patientName: 'Siti Rahma',
    patientId: 'P-002',
    medicalRecordNumber: 'MR-2024-002',
    doctorName: 'Dr. Sarah Putri',
    nurseAssistant: 'Ns. Dewi Lestari',
    date: '2025-10-18',
    type: 'checkup',
    diagnosis: 'Pemeriksaan rutin anak sehat',
    treatment: 'Imunisasi DPT',
    medications: ['Vaksin DPT'],
    notes: 'Anak dalam kondisi sehat, tumbuh kembang normal',
    status: 'completed',
  },
  {
    id: '3',
    patientName: 'Budi Hartono',
    patientId: 'P-003',
    medicalRecordNumber: 'MR-2024-003',
    doctorName: 'Dr. Ahmad Rizki',
    date: '2025-10-15',
    type: 'treatment',
    diagnosis: 'Diabetes Mellitus Tipe 2',
    treatment: 'Kontrol gula darah',
    medications: ['Metformin 500mg', 'Glimepiride 2mg'],
    notes: 'Kontrol rutin setiap 2 minggu, cek HbA1c bulan depan',
    status: 'ongoing',
  },
];

export default function MedicalHistory() {
  const [records] = useState<MedicalRecord[]>(mockRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());
  const { t } = useLanguage();

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedRecords);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRecords(newExpanded);
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.medicalRecordNumber && record.medicalRecordNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || record.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleDownloadJSON = (record: MedicalRecord) => {
    const jsonData = JSON.stringify(record, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medical-record-${record.medicalRecordNumber || record.patientId}-${record.date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Riwayat medis berhasil diunduh sebagai JSON');
  };

  const handleDownloadAllJSON = () => {
    const jsonData = JSON.stringify(filteredRecords, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medical-records-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`${filteredRecords.length} riwayat medis berhasil diunduh sebagai JSON`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Stethoscope className="w-4 h-4" />;
      case 'treatment': return <Pill className="w-4 h-4" />;
      case 'surgery': return <Activity className="w-4 h-4" />;
      case 'checkup': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      consultation: 'Konsultasi',
      treatment: 'Perawatan',
      surgery: 'Operasi',
      checkup: 'Pemeriksaan',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ongoing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">{t('doctor.medicalHistory')}</h1>
        <p className="text-muted-foreground">
          Riwayat tindakan medis pasien
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari nama pasien, nomor rekam medis, atau diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="consultation">Konsultasi</SelectItem>
                  <SelectItem value="treatment">Perawatan</SelectItem>
                  <SelectItem value="surgery">Operasi</SelectItem>
                  <SelectItem value="checkup">Pemeriksaan</SelectItem>
                </SelectContent>
              </Select>
              {filteredRecords.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleDownloadAllJSON}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Unduh Semua JSON
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredRecords.map((record) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg overflow-hidden dark:border-gray-700"
            >
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {getTypeIcon(record.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {record.patientName}
                          <span className="text-sm text-muted-foreground ml-2">
                            ({record.patientId})
                          </span>
                        </h3>
                        {record.medicalRecordNumber && (
                          <p className="text-xs text-muted-foreground">
                            No. Rekam Medis: {record.medicalRecordNumber}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(record.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">
                        {getTypeLabel(record.type)}
                      </Badge>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleExpand(record.id)}
                    >
                      {expandedRecords.has(record.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownloadJSON(record)}
                      title="Unduh sebagai JSON"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {expandedRecords.has(record.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 space-y-4 border-t dark:border-gray-700"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Tenaga Medis
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-foreground">Dokter: {record.doctorName}</p>
                        {record.nurseAssistant && (
                          <p className="text-muted-foreground">Perawat: {record.nurseAssistant}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        <Activity className="w-4 h-4 inline mr-1" />
                        Diagnosis
                      </h4>
                      <p className="text-sm text-foreground">{record.diagnosis}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      <Stethoscope className="w-4 h-4 inline mr-1" />
                      Tindakan/Perawatan
                    </h4>
                    <p className="text-sm text-foreground">{record.treatment}</p>
                  </div>

                  {record.medications && record.medications.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        <Pill className="w-4 h-4 inline mr-1" />
                        Obat yang Diberikan
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {record.medications.map((med, idx) => (
                          <Badge key={idx} variant="secondary">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      <FileText className="w-4 h-4 inline mr-1" />
                      Catatan Tambahan
                    </h4>
                    <p className="text-sm text-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      {record.notes}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Tidak ada riwayat tindakan ditemukan</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
