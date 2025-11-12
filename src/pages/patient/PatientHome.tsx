import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, Search, Building2, Heart, Plus, 
  Stethoscope, Star, ChevronRight, FileText,
  CreditCard, Wallet, QrCode, Banknote, Shield,
  Printer, Eye, LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Separator } from '../../components/ui/separator';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

export default function PatientHome() {
  const { user } = useAuth();
  const { appointments, doctors, invoices, patients } = useData();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [medicalRecordNumber, setMedicalRecordNumber] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);

  const currentPatient = patients.find(p => p.email === user?.email || p.phone === user?.phone);
  const upcomingAppointments = appointments.filter(a => a.status === 'Scheduled').slice(0, 3);

  const quickActions = [
    {
      icon: Search,
      title: 'Cari Dokter',
      description: 'Temukan dokter yang tersedia',
      link: '/patient/search-doctors',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Building2,
      title: 'Cari Ruangan',
      description: 'Booking ruangan pemeriksaan',
      link: '/patient/search-rooms',
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      icon: Calendar,
      title: 'Janji Saya',
      description: 'Lihat jadwal appointment',
      link: '/patient/appointments',
      gradient: 'from-teal-500 to-emerald-500',
    },
  ];

  const paymentMethods = [
    {
      icon: CreditCard,
      name: 'Debit Card',
      description: 'Bayar dengan kartu debit',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: QrCode,
      name: 'QRIS',
      description: 'Scan QR untuk bayar',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Banknote,
      name: 'Cash',
      description: 'Bayar tunai di kasir',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Shield,
      name: 'KIS/BPJS',
      description: 'Potongan 70%',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const specialtyColors: { [key: string]: string } = {
    'Kardiologi': 'from-red-500 to-pink-500',
    'Pediatri': 'from-blue-500 to-cyan-500',
    'Bedah Umum': 'from-purple-500 to-pink-500',
    'Dokter Gigi': 'from-green-500 to-emerald-500',
    'Penyakit Dalam': 'from-indigo-500 to-purple-500',
    'Mata': 'from-orange-500 to-red-500',
  };

  const handleSearchInvoice = () => {
    if (!medicalRecordNumber.trim()) {
      toast.error('Silakan masukkan nomor rekam medis');
      return;
    }

    const invoice = invoices.find(inv => 
      inv.patientMedicalRecordNumber === medicalRecordNumber
    );

    if (invoice) {
      setSelectedInvoice(invoice);
      setMedicalRecordNumber('');
    } else {
      toast.error('Invoice tidak ditemukan untuk nomor rekam medis ini');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden relative">
          <CardContent className="p-8">
            <div className="relative z-10">
              <h1 className="text-white mb-2">Selamat Datang, {user?.name}!</h1>
              <p className="text-blue-100 mb-6">
                Kelola kesehatan Anda dengan mudah melalui Health Hub
              </p>
              {currentPatient && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 inline-block">
                  <p className="text-blue-100 text-sm mb-1">Nomor Rekam Medis Anda</p>
                  <p className="text-white text-xl font-mono">{currentPatient.medicalRecordNumber}</p>
                </div>
              )}
              <div className="flex gap-3 flex-wrap">
                <Button 
                  className="bg-white text-primary hover:bg-blue-50"
                  asChild
                >
                  <Link to="/patient/dashboard">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button 
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  asChild
                >
                  <Link to="/patient/book-appointment">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Janji Baru
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  asChild
                >
                  <Link to="/patient/doctor-schedule">
                    <Calendar className="w-4 h-4 mr-2" />
                    Jadwal Dokter
                  </Link>
                </Button>
              </div>
            </div>
            <div className="absolute right-0 top-0 opacity-10 text-[200px]">
              <Heart className="fill-white" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4">Aksi Cepat</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link to={action.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dokter Kami */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2>Dokter Kami</h2>
            <p className="text-sm text-muted-foreground">Dokter terbaik di rumah sakit kami</p>
          </div>
          <Link to="/patient/search-doctors">
            <Button variant="outline" size="sm">Lihat Semua</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.slice(0, 6).map((doctor) => {
            const gradientColor = specialtyColors[doctor.specialty] || 'from-gray-500 to-gray-600';
            return (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <div className={`h-2 bg-gradient-to-r ${gradientColor}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradientColor} flex items-center justify-center text-white flex-shrink-0`}>
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="mb-1 truncate">{doctor.name}</h4>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm">{doctor.rating} ({doctor.reviews} review)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {doctor.experience} tahun pengalaman
                        </span>
                      </div>
                    </div>

                    {doctor.availability && doctor.availability.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Tersedia:</p>
                        <div className="flex flex-wrap gap-1">
                          {doctor.availability.slice(0, 3).map((day) => (
                            <Badge key={day} variant="outline" className="text-xs">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Cara Pembayaran */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2>Cara Pembayaran</h2>
            <p className="text-sm text-muted-foreground">Metode pembayaran yang tersedia</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowPaymentDialog(true)}
          >
            Info Lengkap
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className={`bg-gradient-to-br ${method.color} text-white border-0 cursor-pointer`}>
                <CardContent className="p-6 text-center">
                  <method.icon className="w-10 h-10 mx-auto mb-3" />
                  <h4 className="text-white mb-1">{method.name}</h4>
                  <p className="text-white/80 text-sm">{method.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Cetak Invoice Section */}
        <Card className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">Cetak Invoice</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Masukkan nomor rekam medis untuk mencetak invoice pembayaran Anda
                </p>
                <div className="flex gap-3">
                  <Input
                    placeholder="Contoh: MR-2024-001"
                    value={medicalRecordNumber}
                    onChange={(e) => setMedicalRecordNumber(e.target.value)}
                    className="max-w-xs"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchInvoice()}
                  />
                  <Button 
                    onClick={handleSearchInvoice}
                    className="bg-primary hover:bg-primary-dark gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Cetak
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowInvoiceDialog(true)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat Semua
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2>Janji Temu Mendatang</h2>
          <Link to="/patient/appointments">
            <Button variant="ghost" size="sm">Lihat Semua</Button>
          </Link>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="truncate">{appointment.doctorName}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className="text-primary">{appointment.date}</span>
                          <span className="text-muted-foreground">{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Belum ada janji temu</p>
              <Button className="mt-4" asChild>
                <Link to="/patient/book-appointment">Buat Janji Baru</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Health Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <h2 className="mb-4">Tips Kesehatan</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: 'Minum Air Putih Cukup',
              description: 'Konsumsi minimal 8 gelas air putih per hari untuk menjaga hidrasi tubuh',
              icon: '💧',
            },
            {
              title: 'Olahraga Teratur',
              description: 'Luangkan waktu 30 menit setiap hari untuk aktivitas fisik',
              icon: '🏃',
            },
          ].map((tip, index) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
            >
              <Card className="bg-accent/50">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="text-4xl">{tip.icon}</div>
                    <div>
                      <h4 className="mb-1">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline" asChild>
            <Link to="/patient/health-tips">
              Lihat Lebih Banyak Tips
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Informasi Cara Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.name}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1">{method.name}</h4>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      {method.name === 'KIS/BPJS' && (
                        <Badge className="mt-2 bg-orange-500/10 text-orange-700">
                          Diskon hingga 70%
                        </Badge>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Show All Invoices Dialog */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Semua Invoice</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {currentPatient && invoices.filter(inv => 
              inv.patientMedicalRecordNumber === currentPatient.medicalRecordNumber
            ).map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="mb-1">{invoice.invoiceNumber}</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(invoice.date)}</p>
                      <p className="text-sm mt-1">Dokter: {invoice.doctorName}</p>
                      <p className="text-primary mt-2">{formatCurrency(invoice.total)}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Lihat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {currentPatient && invoices.filter(inv => 
              inv.patientMedicalRecordNumber === currentPatient.medicalRecordNumber
            ).length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Belum ada invoice</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Invoice</DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div id="invoice-print" className="space-y-6">
              {/* Invoice Header */}
              <div className="text-center border-b pb-6">
                <h2 className="mb-2">Health Hub 2.0</h2>
                <p className="text-sm text-muted-foreground">
                  Jl. Kesehatan No. 123, Jakarta Selatan
                </p>
                <p className="text-sm text-muted-foreground">
                  Telp: (021) 1234-5678 | Email: info@healthhub.com
                </p>
              </div>

              {/* Invoice Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="mb-3">Informasi Invoice</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">No. Invoice:</span>
                      <span>{selectedInvoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tanggal:</span>
                      <span>{formatDate(selectedInvoice.date)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Data Pasien</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nama:</span>
                      <span>{selectedInvoice.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">No. RM:</span>
                      <span className="text-primary">
                        {selectedInvoice.patientMedicalRecordNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dokter:</span>
                      <span>{selectedInvoice.doctorName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Invoice Items */}
              <div>
                <h4 className="mb-3">Rincian Biaya</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-accent">
                      <tr>
                        <th className="text-left p-3">Item</th>
                        <th className="text-center p-3">Qty</th>
                        <th className="text-right p-3">Harga</th>
                        <th className="text-right p-3">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3">{item.name}</td>
                          <td className="text-center p-3">{item.quantity}</td>
                          <td className="text-right p-3">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="text-right p-3">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-accent/50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  {selectedInvoice.insurance ? (
                    <div className="flex justify-between text-green-600">
                      <span>Potongan {selectedInvoice.insurance} (70%):</span>
                      <span>- {formatCurrency(selectedInvoice.subtotal * 0.7)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>Pajak (10%):</span>
                      <span>{formatCurrency(selectedInvoice.tax)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CreditCard className="w-5 h-5" />
                  <div>
                    <p className="text-sm">Status Pembayaran: <strong>LUNAS</strong></p>
                    <p className="text-sm">
                      Metode: {selectedInvoice.paymentMethod}
                      {selectedInvoice.insurance && ` | Jaminan: ${selectedInvoice.insurance}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-muted-foreground border-t pt-4">
                <p>Terima kasih telah menggunakan layanan Health Hub 2.0</p>
                <p className="mt-1">Invoice ini adalah bukti pembayaran yang sah</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 print:hidden">
                <Button
                  variant="outline"
                  onClick={() => setSelectedInvoice(null)}
                  className="flex-1"
                >
                  Tutup
                </Button>
                <Button
                  onClick={handlePrint}
                  className="flex-1 bg-primary hover:bg-primary-dark gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-print, #invoice-print * {
            visibility: visible;
          }
          #invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
