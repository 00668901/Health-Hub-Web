import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, X, User, Stethoscope } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner@2.0.3';

export default function MyAppointments() {
  const { appointments, updateAppointment, doctors } = useData();

  const scheduled = appointments.filter(a => a.status === 'Scheduled');
  const completed = appointments.filter(a => a.status === 'Completed');
  const cancelled = appointments.filter(a => a.status === 'Cancelled');

  const handleCancelAppointment = (id: string) => {
    if (confirm('Apakah Anda yakin ingin membatalkan janji temu ini?')) {
      updateAppointment(id, { status: 'Cancelled' });
      toast.success('Janji temu berhasil dibatalkan');
    }
  };

  const renderAppointmentCard = (appointment: typeof appointments[0], index: number) => {
    // Find the doctor details
    const doctor = doctors.find(d => d.id === appointment.doctorId || d.name === appointment.doctorName);
    
    return (
      <motion.div
        key={appointment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-1">{appointment.doctorName}</h3>
                      {doctor && (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-1">
                          <Stethoscope className="w-3 h-3 mr-1" />
                          {doctor.specialty}
                        </Badge>
                      )}
                      <div>
                        <Badge variant="outline">
                          {appointment.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {appointment.status === 'Scheduled' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Batal
                    </Button>
                  )}
                </div>

                <div className="space-y-2 ml-15">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(appointment.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.time}</span>
                  </div>
                  {doctor && (
                    <div className="text-sm text-muted-foreground">
                      📧 {doctor.email} | 📞 {doctor.phone}
                    </div>
                  )}
                </div>

                {appointment.notes && (
                  <div className="mt-3 p-3 bg-accent/50 rounded-lg ml-15">
                    <p className="text-sm text-muted-foreground">Catatan:</p>
                    <p className="text-sm">{appointment.notes}</p>
                  </div>
                )}
              </div>

              <Badge
                className={
                  appointment.status === 'Scheduled'
                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                    : appointment.status === 'Completed'
                    ? 'bg-success/10 text-success hover:bg-success/20'
                    : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                }
              >
                {appointment.status === 'Scheduled' ? 'Terjadwal' :
                 appointment.status === 'Completed' ? 'Selesai' : 'Dibatalkan'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">Janji Temu Saya</h1>
        <p className="text-muted-foreground">Kelola jadwal appointment Anda</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="scheduled">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scheduled">
              Terjadwal ({scheduled.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Selesai ({completed.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Dibatalkan ({cancelled.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scheduled" className="space-y-4 mt-6">
            {scheduled.length > 0 ? (
              scheduled.map((apt, idx) => renderAppointmentCard(apt, idx))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Belum ada janji temu yang terjadwal</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {completed.length > 0 ? (
              completed.map((apt, idx) => renderAppointmentCard(apt, idx))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Belum ada janji temu yang selesai</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4 mt-6">
            {cancelled.length > 0 ? (
              cancelled.map((apt, idx) => renderAppointmentCard(apt, idx))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Tidak ada janji temu yang dibatalkan</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
