import { Patient, MedicalRecord } from '../contexts/DataContext';

export async function generateMedicalRecordPDF(patient: Patient, records: MedicalRecord[]) {
  // Using jsPDF for PDF generation
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('HEALTH HUB', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Rekam Medis Pasien', 105, 28, { align: 'center' });

  // Patient Info
  doc.setFontSize(10);
  let yPos = 45;
  doc.text(`Nama: ${patient.name}`, 20, yPos);
  yPos += 7;
  doc.text(`No. Rekam Medis: ${patient.medicalRecordNumber}`, 20, yPos);
  yPos += 7;
  doc.text(`Tanggal Lahir: ${patient.dateOfBirth}`, 20, yPos);
  yPos += 7;
  doc.text(`Golongan Darah: ${patient.bloodType || '-'}`, 20, yPos);
  yPos += 7;
  doc.text(`Telepon: ${patient.phone}`, 20, yPos);
  yPos += 10;

  // Medical Records
  doc.setFontSize(12);
  doc.text('Riwayat Medis:', 20, yPos);
  yPos += 10;

  doc.setFontSize(9);
  records.forEach((record, index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.text(`${index + 1}. Tanggal: ${record.date}`, 20, yPos);
    yPos += 6;
    doc.text(`   Dokter: ${record.doctorName}`, 20, yPos);
    yPos += 6;
    doc.text(`   Diagnosis: ${record.diagnosis}`, 20, yPos);
    yPos += 6;
    doc.text(`   Perawatan: ${record.treatment}`, 20, yPos);
    yPos += 6;
    if (record.medications && record.medications.length > 0) {
      doc.text(`   Obat: ${record.medications.join(', ')}`, 20, yPos);
      yPos += 6;
    }
    yPos += 4;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Halaman ${i} dari ${pageCount} - Dicetak pada ${new Date().toLocaleDateString('id-ID')}`,
      105,
      290,
      { align: 'center' }
    );
  }

  // Save
  doc.save(`RM-${patient.medicalRecordNumber}-${Date.now()}.pdf`);
}

export async function generatePerformanceReportPDF(
  doctorName: string,
  period: string,
  data: {
    totalPatients: number;
    totalProcedures: number;
    rating: number;
    performanceScore: number;
  }
) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('HEALTH HUB', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Laporan Kinerja Dokter', 105, 28, { align: 'center' });

  // Doctor Info
  doc.setFontSize(10);
  let yPos = 45;
  doc.text(`Nama Dokter: ${doctorName}`, 20, yPos);
  yPos += 7;
  doc.text(`Periode: ${period}`, 20, yPos);
  yPos += 15;

  // Performance Data
  doc.setFontSize(12);
  doc.text('Ringkasan Kinerja:', 20, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.text(`Total Pasien Ditangani: ${data.totalPatients}`, 30, yPos);
  yPos += 7;
  doc.text(`Total Tindakan: ${data.totalProcedures}`, 30, yPos);
  yPos += 7;
  doc.text(`Rating: ${data.rating}/5.0`, 30, yPos);
  yPos += 7;
  doc.text(`Skor Kinerja: ${data.performanceScore}%`, 30, yPos);

  // Footer
  doc.setFontSize(8);
  doc.text(
    `Dicetak pada ${new Date().toLocaleDateString('id-ID')}`,
    105,
    290,
    { align: 'center' }
  );

  // Save
  doc.save(`Laporan-Kinerja-${doctorName.replace(/\s+/g, '-')}-${Date.now()}.pdf`);
}

export async function generateQueueTicketPDF(queueData: {
  queueNumber: number;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
}) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 120], // Thermal printer size
  });

  // Header
  doc.setFontSize(16);
  doc.text('HEALTH HUB', 40, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Kartu Antrean', 40, 22, { align: 'center' });

  // Queue Number
  doc.setFontSize(40);
  doc.text(`${queueData.queueNumber}`, 40, 45, { align: 'center' });

  // Details
  doc.setFontSize(9);
  let yPos = 60;
  doc.text(`Nama: ${queueData.patientName}`, 10, yPos);
  yPos += 7;
  doc.text(`Dokter: ${queueData.doctorName}`, 10, yPos);
  yPos += 7;
  doc.text(`Tanggal: ${queueData.date}`, 10, yPos);
  yPos += 7;
  doc.text(`Jam: ${queueData.time}`, 10, yPos);

  // Footer
  doc.setFontSize(7);
  doc.text('Mohon datang 15 menit sebelum jadwal', 40, 105, { align: 'center' });

  // Save
  doc.save(`Antrean-${queueData.queueNumber}-${Date.now()}.pdf`);
}
