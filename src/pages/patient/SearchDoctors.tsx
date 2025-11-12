import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Star, Calendar, MapPin, Briefcase, Award } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner@2.0.3';

export default function SearchDoctors() {
  const { user } = useAuth();
  const { doctors, addAppointment, patients, rooms } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [bookingDoctor, setBookingDoctor] = useState<typeof doctors[0] | null>(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '09:00',
    type: 'Konsultasi',
    notes: '',
  });

  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    const matchesDay = selectedDay === 'all' || doctor.availability.includes(selectedDay);
    return matchesSearch && matchesSpecialty && matchesDay;
  });

  const handleBookAppointment = () => {
    if (!bookingDoctor || !bookingData.date || !bookingData.time) {
      toast.error('Harap lengkapi tanggal dan waktu');
      return;
    }

    // Get current patient from logged in user or patients list
    const currentPatient = patients.find(p => p.email === user?.email || p.phone === user?.phone) || patients[0];

    addAppointment({
      patientId: currentPatient?.id || user?.id || 'patient-1',
      patientName: currentPatient?.name || user?.name || 'Pasien',
      doctorId: bookingDoctor.id,
      doctorName: bookingDoctor.name,
      date: bookingData.date,
      time: bookingData.time,
      status: 'Scheduled',
      type: bookingData.type,
      notes: bookingData.notes,
    });

    toast.success(`Janji temu dengan ${bookingDoctor.name} berhasil dibuat!`);
    setBookingDoctor(null);
    setBookingData({ date: '', time: '09:00', type: 'Konsultasi', notes: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">Cari Dokter</h1>
        <p className="text-muted-foreground">Temukan dokter yang sesuai dengan kebutuhan Anda</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari nama dokter atau spesialisasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="specialty">Spesialisasi</Label>
                <select
                  id="specialty"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm mt-1"
                >
                  <option value="all">Semua Spesialisasi</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="day">Hari Tersedia</Label>
                <select
                  id="day"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm mt-1"
                >
                  <option value="all">Semua Hari</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Ditemukan {filteredDoctors.length} dokter
        </p>

        {filteredDoctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="w-24 h-24 flex-shrink-0">
                    <AvatarImage src={doctor.avatar} />
                    <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="mb-1">{doctor.name}</h3>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          {doctor.specialty}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => setBookingDoctor(doctor)}
                        className="bg-primary hover:bg-primary-dark gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Buat Janji
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{doctor.rating.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">
                            ({doctor.reviews} review)
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          Pengalaman
                        </p>
                        <p>{doctor.experience} tahun</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Lisensi
                        </p>
                        <p className="text-sm">{doctor.license}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Jadwal Tersedia</p>
                      <div className="flex flex-wrap gap-2">
                        {doctor.availability.map(day => (
                          <Badge key={day} variant="outline" className="bg-accent">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-muted-foreground space-y-1">
                      <p>📧 {doctor.email}</p>
                      <p>📞 {doctor.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredDoctors.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Tidak ada dokter yang sesuai dengan filter Anda</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={!!bookingDoctor} onOpenChange={() => setBookingDoctor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Janji dengan {bookingDoctor?.name}</DialogTitle>
            <DialogDescription>
              {bookingDoctor?.specialty} - Pilih tanggal dan waktu yang tersedia
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Doctor Info Summary */}
            <div className="bg-accent/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={bookingDoctor?.avatar} />
                  <AvatarFallback>{bookingDoctor?.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{bookingDoctor?.name}</p>
                  <p className="text-sm text-muted-foreground">{bookingDoctor?.specialty}</p>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {bookingDoctor?.experience} tahun pengalaman
                </p>
                <p className="text-muted-foreground">
                  Jadwal: {bookingDoctor?.availability.join(', ')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="booking-date">Tanggal *</Label>
                <Input
                  id="booking-date"
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="booking-time">Waktu *</Label>
                <Input
                  id="booking-time"
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="booking-type">Jenis Konsultasi</Label>
              <select
                id="booking-type"
                value={bookingData.type}
                onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm"
              >
                <option>Konsultasi</option>
                <option>Pemeriksaan</option>
                <option>Kontrol</option>
              </select>
            </div>

            <div>
              <Label htmlFor="booking-notes">Catatan</Label>
              <Input
                id="booking-notes"
                placeholder="Keluhan atau catatan tambahan (opsional)"
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDoctor(null)}>
              Batal
            </Button>
            <Button onClick={handleBookAppointment} className="bg-primary hover:bg-primary-dark">
              Konfirmasi Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
