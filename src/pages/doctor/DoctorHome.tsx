import { motion } from 'motion/react';
import { Users, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const stats = [
  { title: 'Pasien Hari Ini', value: '12', icon: Users, color: 'from-blue-500 to-blue-600' },
  { title: 'Jadwal Besok', value: '8', icon: Calendar, color: 'from-cyan-500 to-cyan-600' },
  { title: 'Menunggu', value: '3', icon: Clock, color: 'from-yellow-500 to-yellow-600' },
  { title: 'Selesai', value: '9', icon: CheckCircle2, color: 'from-green-500 to-green-600' }
];

const todayAppointments = [
  { time: '09:00', patient: 'Budi Santoso', type: 'Konsultasi', status: 'completed' },
  { time: '10:00', patient: 'Siti Nurhaliza', type: 'Kontrol Rutin', status: 'in-progress' },
  { time: '11:00', patient: 'Andi Wijaya', type: 'Konsultasi', status: 'waiting' },
  { time: '14:00', patient: 'Maya Putri', type: 'Tindakan', status: 'scheduled' }
];

export default function DoctorHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1">Selamat Datang, Dr. Sarah</h1>
        <p className="text-gray-600">Berikut jadwal dan pasien Anda hari ini</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <h3 className="text-gray-900">{stat.value}</h3>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Today's Appointments */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Jadwal Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-900">{appointment.time}</p>
                      <p className="text-xs text-gray-500">WIB</p>
                    </div>
                    <div>
                      <p className="text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                    </div>
                  </div>
                  <Badge
                    variant={appointment.status === 'completed' ? 'default' : 'secondary'}
                    className={
                      appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      appointment.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }
                  >
                    {appointment.status === 'completed' ? 'Selesai' :
                     appointment.status === 'in-progress' ? 'Sedang Berlangsung' :
                     appointment.status === 'waiting' ? 'Menunggu' : 'Terjadwal'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button className="bg-blue-500 hover:bg-blue-600">Lihat Kalender</Button>
            <Button variant="outline">Cari Pasien</Button>
            <Button variant="outline">Ganti Jadwal</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
