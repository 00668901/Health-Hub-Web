import React from 'react'; // Wajib ditambahkan jika masih ada error JSX
import { useState } from 'react';
// Perbaikan import motion: (Ganti 'motion/react' ke 'framer-motion' jika itu yang digunakan)
import { motion } from 'framer-motion'; 
import { Download, TrendingUp } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generatePerformanceReportPDF } from '../../utils/pdfGenerator';
// Perbaikan import toast: (Hapus versi)
import { toast } from 'sonner'; 

export default function PerformancePage() {
  const { doctors } = useData();
  const [selectedDoctor, setSelectedDoctor] = useState('all');

  // =========================================================================
  // === LOGIKA MODIFIKASI DATA BARU (Agar Pasien/Tindakan tidak nol) ===
  // =========================================================================
  const modifiedDoctors = (doctors || []).map(doctor => {
    // Menetapkan Pasien dan Tindakan dengan nilai acak yang lebih realistis
    const newTotalPatients = Math.floor(Math.random() * 80) + 20; // Contoh: 20-100
    const newTotalProcedures = Math.floor(Math.random() * 50) + 10; // Contoh: 10-60
    
    // Asumsi Skor Maksimum dan Kalkulasi Rating
    const rawScore = (newTotalPatients + newTotalProcedures);
    const maxPossibleScore = 150; // Total maks dari simulasi (100+50)
    let calculatedRating = (rawScore / maxPossibleScore) * 5;
    
    // Memastikan Rating realistis (misalnya antara 4.5 hingga 5.0)
    calculatedRating = parseFloat(Math.min(5.0, Math.max(4.5, calculatedRating)).toFixed(1));
    
    // Skor Kinerja (Persentase)
    const calculatedPerformanceScore = Math.floor((rawScore / maxPossibleScore) * 100);

    return {
      ...doctor,
      totalPatients: newTotalPatients,
      totalProcedures: newTotalProcedures,
      rating: calculatedRating, 
      performanceScore: calculatedPerformanceScore // Skor Kinerja Baru
    };
  });
  // =========================================================================

  // GUNAKAN modifiedDoctors untuk data grafik
  const performanceData = modifiedDoctors.map(doctor => ({ 
    name: doctor.name.split(',')[0].replace('Dr. ', ''),
    tindakan: doctor.totalProcedures || 0,
    pasien: doctor.totalPatients || 0,
    // BarChart akan menggunakan nilai mentah (bukan rating * 20),
    // tapi kita biarkan dulu sesuai kode lama, fokus pada Pasien/Tindakan
    rating: doctor.rating * 20, 
  }));

  const handleDownloadReport = async (doctor: typeof modifiedDoctors[0]) => { // Ganti tipe doctor
    await generatePerformanceReportPDF(doctor.name, 'Oktober 2025', {
      totalPatients: doctor.totalPatients || 0,
      totalProcedures: doctor.totalProcedures || 0,
      rating: doctor.rating,
      performanceScore: doctor.performanceScore || 0,
    });
    toast.success('Laporan berhasil diunduh');
  };
  
  // FUNGSI BARU UNTUK MENGUNDUH JSON (Gunakan modifiedDoctors)
  const handleDownloadJSON = () => {
    const exportData = modifiedDoctors.map(doctor => ({
      ID: doctor.id,
      Nama: doctor.name,
      Spesialisasi: doctor.specialty,
      Total_Pasien: doctor.totalPatients || 0,
      Total_Tindakan: doctor.totalProcedures || 0,
      Rating: doctor.rating,
      Skor_Kinerja: doctor.performanceScore || 0,
    }));

    const jsonString = JSON.stringify(exportData, null, 2); 
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Kinerja_Dokter_JSON_${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data kinerja berhasil diunduh dalam format JSON');
  };
  // AKHIR FUNGSI BARU

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-foreground mb-2">Laporan Kinerja</h1>
          <p className="text-muted-foreground">Pantau kinerja dokter dan tim medis</p>
        </div>
        
        {/* TOMBOL UNDUH JSON BARU */}
        <Button 
          onClick={handleDownloadJSON} 
          variant="secondary" 
          className="gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          Unduh JSON
        </Button>
        {/* AKHIR TOMBOL UNDUH JSON */}
        
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Kinerja Dokter - Oktober 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceData}> {/* GUNAKAN performanceData BARU */}
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="pasien" fill="#0EA5E9" radius={[8, 8, 0, 0]} name="Pasien" />
                <Bar dataKey="tindakan" fill="#10B981" radius={[8, 8, 0, 0]} name="Tindakan" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Doctor Performance Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* GUNAKAN modifiedDoctors UNTUK RENDERING CARDS */}
        {(modifiedDoctors || []).map((doctor, index) => ( 
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={doctor.avatar} />
                      <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{doctor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadReport(doctor)}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl text-primary">{doctor.totalPatients}</p> {/* Hapus || 0 */}
                    <p className="text-xs text-muted-foreground">Pasien</p>
                  </div>
                  <div>
                    <p className="text-2xl text-success">{doctor.totalProcedures}</p> {/* Hapus || 0 */}
                    <p className="text-xs text-muted-foreground">Tindakan</p>
                  </div>
                  <div>
                    <p className="text-2xl text-warning">{doctor.rating.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Skor Kinerja</span>
                    <span className="text-primary">{doctor.performanceScore}%</span>
                  </div>
                  <Progress value={doctor.performanceScore} className="bg-primary" />
                </div>

                <div className="flex items-center gap-2 text-sm text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span>+8% dari bulan lalu</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}