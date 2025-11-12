import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, Bell, Clock, MapPin, User,
  CheckCircle, AlertCircle, Plus, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { useLanguage } from '../../contexts/LanguageContext';

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  specialty: string;
  room: string;
  type: 'consultation' | 'checkup' | 'treatment' | 'follow-up';
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  reminder: boolean;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: '2025-10-25',
    time: '10:00',
    doctorName: 'Dr. Ahmad Rizki',
    specialty: 'Kardiologi',
    room: 'Ruang 201',
    type: 'consultation',
    status: 'upcoming',
    notes: 'Kontrol rutin jantung',
    reminder: true,
  },
  {
    id: '2',
    date: '2025-10-28',
    time: '14:30',
    doctorName: 'Dr. Sarah Putri',
    specialty: 'Pediatri',
    room: 'Ruang 105',
    type: 'checkup',
    status: 'upcoming',
    notes: 'Pemeriksaan tumbuh kembang anak',
    reminder: true,
  },
  {
    id: '3',
    date: '2025-11-02',
    time: '09:00',
    doctorName: 'Dr. Ahmad Rizki',
    specialty: 'Kardiologi',
    room: 'Ruang 201',
    type: 'follow-up',
    status: 'upcoming',
    notes: 'Follow-up hasil lab',
    reminder: true,
  },
];

export default function PatientCalendar() {
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { language } = useLanguage();

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const hasAppointment = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.some(apt => apt.date === dateStr);
  };

  const upcomingAppointments = appointments
    .filter(apt => {
      const aptDate = new Date(apt.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return aptDate >= today && apt.status === 'upcoming';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todayAppointments = getAppointmentsForDate(new Date());

  const getTypeLabel = (type: string) => {
    const labels = {
      consultation: language === 'id' ? 'Konsultasi' : 'Consultation',
      checkup: language === 'id' ? 'Pemeriksaan' : 'Check-up',
      treatment: language === 'id' ? 'Perawatan' : 'Treatment',
      'follow-up': language === 'id' ? 'Follow-up' : 'Follow-up',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">
          {language === 'id' ? 'Kalender Janji Temu' : 'Appointment Calendar'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'id' 
            ? 'Kelola dan pantau jadwal janji temu Anda'
            : 'Manage and track your appointments'}
        </p>
      </motion.div>

      {/* Today's Appointments */}
      {todayAppointments.length > 0 && (
        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="w-5 h-5" />
              {language === 'id' ? 'Janji Hari Ini' : "Today's Appointments"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayAppointments.map((apt) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => handleAppointmentClick(apt)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{apt.doctorName}</h3>
                    <p className="text-sm text-white/80">{apt.specialty}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-3 h-3" />
                      {apt.time}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-white/80 mt-1">
                      <MapPin className="w-3 h-3" />
                      {apt.room}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {language === 'id' ? 'Kalender' : 'Calendar'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                hasAppointment: (date) => hasAppointment(date),
              }}
              modifiersStyles={{
                hasAppointment: {
                  fontWeight: 'bold',
                  backgroundColor: 'rgb(59, 130, 246)',
                  color: 'white',
                  borderRadius: '50%',
                },
              }}
            />
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                {language === 'id' ? 'Jadwal' : 'Schedule'} - {selectedDate.toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              
              {getAppointmentsForDate(selectedDate).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {language === 'id' ? 'Tidak ada janji temu' : 'No appointments'}
                </p>
              ) : (
                <div className="space-y-2">
                  {getAppointmentsForDate(selectedDate).map((apt) => (
                    <div 
                      key={apt.id}
                      className="p-3 bg-white dark:bg-gray-800 rounded border cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleAppointmentClick(apt)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{apt.time}</span>
                        <Badge className={getStatusColor(apt.status)} variant="secondary">
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground">{apt.doctorName}</p>
                      <p className="text-xs text-muted-foreground">{apt.specialty} • {apt.room}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {language === 'id' ? 'Janji Mendatang' : 'Upcoming'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.slice(0, 5).map((apt) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 border rounded-lg cursor-pointer hover:border-primary transition-colors dark:border-gray-700"
                onClick={() => handleAppointmentClick(apt)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    apt.reminder ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{apt.doctorName}</p>
                    <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {new Date(apt.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {apt.time}
                      </span>
                    </div>
                  </div>
                  {apt.reminder && (
                    <Bell className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              </motion.div>
            ))}
            
            {upcomingAppointments.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {language === 'id' ? 'Tidak ada janji mendatang' : 'No upcoming appointments'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Appointment Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>
              {language === 'id' ? 'Detail Janji Temu' : 'Appointment Details'}
            </DialogTitle>
            <DialogDescription>
              {selectedAppointment && new Date(selectedAppointment.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{selectedAppointment.doctorName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.specialty}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(selectedAppointment.status)}>
                  {selectedAppointment.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {language === 'id' ? 'Waktu' : 'Time'}
                  </p>
                  <div className="flex items-center gap-2 text-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{selectedAppointment.time}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {language === 'id' ? 'Ruangan' : 'Room'}
                  </p>
                  <div className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedAppointment.room}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {language === 'id' ? 'Tipe' : 'Type'}
                </p>
                <Badge variant="outline">
                  {getTypeLabel(selectedAppointment.type)}
                </Badge>
              </div>

              {selectedAppointment.notes && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {language === 'id' ? 'Catatan' : 'Notes'}
                  </p>
                  <p className="text-sm text-foreground bg-gray-50 dark:bg-gray-900 p-3 rounded">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}

              {selectedAppointment.reminder && (
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Bell className="w-4 h-4" />
                  <span>
                    {language === 'id' 
                      ? 'Pengingat aktif - Anda akan menerima notifikasi'
                      : 'Reminder active - You will receive notifications'}
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
