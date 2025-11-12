import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Stethoscope,
  CreditCard,
  FileText,
  Calendar,
  Heart,
  MessageCircleQuestion,
  ChevronRight,
  Clock,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appointments, doctors } = useData();

  // Get upcoming appointments for this patient
  const upcomingAppointments = appointments
    .filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= new Date() && apt.status === 'Scheduled';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const dashboardCards = [
    {
      title: 'Home',
      description: 'Kembali ke halaman utama',
      icon: Home,
      color: 'from-blue-500 to-cyan-500',
      path: '/patient',
      badge: null,
    },
    {
      title: 'Spesialis Dokter',
      description: 'Cari dokter berdasarkan spesialisasi',
      icon: Stethoscope,
      color: 'from-teal-500 to-emerald-500',
      path: '/patient/search-doctors',
      badge: `${doctors.length} dokter`,
    },
    {
      title: 'Cara Pembayaran',
      description: 'Lihat metode pembayaran tersedia',
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500',
      path: '/patient/payment-methods',
      badge: 'Debit, QRIS, Cash',
    },
    {
      title: 'Cetak Invoice',
      description: 'Download invoice pembayaran',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      path: '/patient/invoices',
      badge: 'PDF',
    },
    {
      title: 'Janji Temu',
      description: 'Lihat jadwal appointment Anda',
      icon: Calendar,
      color: 'from-indigo-500 to-blue-500',
      path: '/patient/appointments',
      badge: upcomingAppointments.length > 0 ? `${upcomingAppointments.length} mendatang` : null,
    },
    {
      title: 'Tips Kesehatan',
      description: 'Baca tips kesehatan terkini',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      path: '/patient/health-tips',
      badge: 'Terbaru',
    },
  ];

  const handleAskAdmin = () => {
    const subject = encodeURIComponent('Pertanyaan dari Pasien - Health Hub 2.0');
    const body = encodeURIComponent(`
Halo Admin Health Hub,

Saya ${user?.name || 'Pasien'} ingin bertanya tentang:

[Tuliskan pertanyaan Anda di sini]

Terima kasih.
    `);
    
    // In a real app, this would open a support form or messaging system
    // For demo, we'll create a mailto link
    window.location.href = `mailto:admin@healthhub.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-foreground">Dashboard Pasien</h1>
            <p className="text-muted-foreground">
              Selamat datang, {user?.name || 'Pasien'}! 👋
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Badge>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Janji Temu Mendatang</p>
                  <h3 className="text-2xl">{upcomingAppointments.length}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Dokter Tersedia</p>
                  <h3 className="text-2xl">{doctors.length}</h3>
                </div>
                <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-teal-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status Kesehatan</p>
                  <h3 className="text-lg">Baik</h3>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Dashboard Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="mb-4">Menu Cepat</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
                onClick={() => navigate(card.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                      <card.icon className="w-7 h-7 text-white" />
                    </div>
                    {card.badge && (
                      <Badge variant="outline" className="text-xs">
                        {card.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {card.description}
                  </p>
                  <div className="flex items-center text-primary text-sm">
                    <span>Buka</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Janji Temu Mendatang
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((apt, index) => {
                  const doctor = doctors.find(d => d.id === apt.doctorId || d.name === apt.doctorName);
                  return (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{apt.doctorName}</p>
                          {doctor && (
                            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(apt.date).toLocaleDateString('id-ID')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {apt.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/patient/appointments');
                        }}
                      >
                        Detail
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
              <Button 
                variant="link" 
                className="w-full mt-4"
                onClick={() => navigate('/patient/appointments')}
              >
                Lihat Semua Janji Temu
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Ask Admin Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircleQuestion className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2">Ada Pertanyaan?</h3>
                  <p className="text-sm text-muted-foreground">
                    Hubungi administrator kami untuk bantuan lebih lanjut atau pertanyaan seputar layanan kesehatan
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleAskAdmin}
                className="bg-primary hover:bg-primary-dark gap-2 flex-shrink-0"
              >
                <MessageCircleQuestion className="w-4 h-4" />
                Hubungi Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">Privasi & Keamanan Data</h4>
                <p className="text-sm text-muted-foreground">
                  Semua data medis Anda disimpan dengan aman dan terenkripsi. Kami menjaga kerahasiaan 
                  informasi kesehatan Anda sesuai dengan standar privasi yang berlaku.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
