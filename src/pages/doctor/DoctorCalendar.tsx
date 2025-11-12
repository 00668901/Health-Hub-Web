import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, User, FileText, Filter, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import MedicalCalendar from '../../components/MedicalCalendar';

export default function DoctorCalendar() {
  const { user } = useAuth();
  const { appointments, doctors, patients } = useData();
  const [selectedDay, setSelectedDay] = useState('all');

  // Get doctor data
  const doctorData = doctors.find(d => d.name === user?.name || d.email === user?.email);

  // Get appointments for this doctor
  const doctorAppointments = useMemo(() => {
    return appointments.filter(apt => 
      apt.doctorName === user?.name || apt.doctorId === doctorData?.id
    );
  }, [appointments, user?.name, doctorData?.id]);

  // Filter by selected day
  const filteredAppointments = useMemo(() => {
    if (selectedDay === 'all') return doctorAppointments;

    return doctorAppointments.filter(apt => {
      const appointmentDate = new Date(apt.date);
      const dayName = appointmentDate.toLocaleDateString('id-ID', { weekday: 'long' });
      return dayName === selectedDay;
    });
  }, [doctorAppointments, selectedDay]);

  // Group appointments by date
  const groupedAppointments = useMemo(() => {
    const groups: Record<string, typeof doctorAppointments> = {};
    
    filteredAppointments.forEach(apt => {
      const dateKey = apt.date;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(apt);
    });

    return groups;
  }, [filteredAppointments]);

  // Get upcoming appointments
  const upcomingAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return doctorAppointments
      .filter(apt => {
        const aptDate = new Date(apt.date);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate >= today && apt.status === 'Scheduled';
      })
      .sort((a, b) => {
        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      })
      .slice(0, 5);
  }, [doctorAppointments]);

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">Kalender Saya</h1>
        <p className="text-muted-foreground">Kelola jadwal praktik dan janji temu pasien Anda</p>
      </motion.div>

      {/* Practice Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Jadwal Praktek Rutin
            </CardTitle>
          </CardHeader>
          <CardContent>
            {doctorData?.schedule && doctorData.schedule.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {doctorData.schedule.map((sched, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border-l-4 border-primary"
                  >
                    <div>
                      <p className="font-medium text-foreground">{sched.day}</p>
                      <p className="text-sm text-muted-foreground">
                        {sched.startTime} - {sched.endTime}
                      </p>
                    </div>
                    <CalendarIcon className="w-5 h-5 text-primary" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                Jadwal praktek belum ditentukan
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Janji Temu Mendatang ({upcomingAppointments.length})
              </CardTitle>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter Hari" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Hari</SelectItem>
                  {days.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => {
                  const patient = patients.find(p => p.id === apt.patientId || p.name === apt.patientName);
                  const appointmentDate = new Date(apt.date);
                  const dayName = appointmentDate.toLocaleDateString('id-ID', { weekday: 'long' });
                  
                  return (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{apt.patientName}</h4>
                            {patient?.medicalRecordNumber && (
                              <span className="text-xs text-muted-foreground">
                                ({patient.medicalRecordNumber})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{dayName}, {appointmentDate.toLocaleDateString('id-ID')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{apt.time}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{apt.type}</Badge>
                            <Badge className={getStatusColor(apt.status)}>{apt.status}</Badge>
                          </div>
                          {apt.notes && (
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              Catatan: {apt.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {selectedDay === 'all' 
                    ? 'Tidak ada janji temu mendatang' 
                    : `Tidak ada janji temu pada hari ${selectedDay}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Calendar View with Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Kalender Lengkap</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <MedicalCalendar role="doctor" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Appointments by Date */}
      {Object.keys(groupedAppointments).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pasien Per Tanggal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedAppointments)
                  .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                  .map(([date, apts]) => {
                    const dateObj = new Date(date);
                    const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'long' });
                    
                    return (
                      <div key={date}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-primary/10 px-4 py-2 rounded-lg">
                            <p className="font-medium text-primary">
                              {dayName}, {dateObj.toLocaleDateString('id-ID')}
                            </p>
                          </div>
                          <Badge variant="outline">{apts.length} pasien</Badge>
                        </div>
                        <div className="grid gap-2 pl-4 border-l-2 border-primary/20">
                          {apts.sort((a, b) => a.time.localeCompare(b.time)).map(apt => {
                            const patient = patients.find(p => p.id === apt.patientId || p.name === apt.patientName);
                            
                            return (
                              <div
                                key={apt.id}
                                className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{apt.time}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {apt.patientName} 
                                      {patient?.medicalRecordNumber && ` - ${patient.medicalRecordNumber}`}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{apt.type}</Badge>
                                  <Badge className={getStatusColor(apt.status)}>{apt.status}</Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {doctorAppointments.filter(apt => apt.status === 'Scheduled').length}
                </div>
                <p className="text-sm text-muted-foreground">Janji Temu Terjadwal</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {doctorAppointments.filter(apt => apt.status === 'Completed').length}
                </div>
                <p className="text-sm text-muted-foreground">Selesai</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {doctorAppointments.length}
                </div>
                <p className="text-sm text-muted-foreground">Total Pasien</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
