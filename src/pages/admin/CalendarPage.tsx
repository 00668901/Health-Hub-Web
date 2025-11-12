import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner@2.0.3';

export default function CalendarPage() {
  const { appointments, patients, doctors, rooms, addAppointment, updateAppointment, deleteAppointment } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    roomId: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'Konsultasi',
    notes: '',
  });

  // Convert appointments to FullCalendar events
  const events = appointments.map(apt => ({
    id: apt.id,
    title: `${apt.patientName} - ${apt.doctorName}`,
    start: `${apt.date}T${apt.startTime}`,
    end: `${apt.date}T${apt.endTime}`,
    backgroundColor: 
      apt.status === 'completed' ? '#10B981' :
      apt.status === 'cancelled' ? '#EF4444' :
      '#0EA5E9',
    borderColor:
      apt.status === 'completed' ? '#059669' :
      apt.status === 'cancelled' ? '#DC2626' :
      '#0369A1',
  }));

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
    setFormData({
      ...formData,
      date: arg.dateStr,
      startTime: '09:00',
      endTime: '09:30',
    });
    setIsAddDialogOpen(true);
  };

  const handleEventDrop = (info: any) => {
    const appointment = appointments.find(a => a.id === info.event.id);
    if (!appointment) return;

    const newDate = info.event.start.toISOString().split('T')[0];
    const newStartTime = info.event.start.toTimeString().slice(0, 5);
    const newEndTime = info.event.end?.toTimeString().slice(0, 5) || newStartTime;

    updateAppointment(appointment.id, {
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
    });

    toast.success('Jadwal berhasil diperbarui');
  };

  const handleEventResize = (info: any) => {
    const appointment = appointments.find(a => a.id === info.event.id);
    if (!appointment) return;

    const newEndTime = info.event.end?.toTimeString().slice(0, 5);

    updateAppointment(appointment.id, {
      endTime: newEndTime,
    });

    toast.success('Durasi berhasil diperbarui');
  };

  const handleAddAppointment = () => {
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.startTime) {
      toast.error('Harap lengkapi semua field yang wajib diisi');
      return;
    }

    const patient = patients.find(p => p.id === formData.patientId);
    const doctor = doctors.find(d => d.id === formData.doctorId);
    const room = rooms.find(r => r.id === formData.roomId);

    if (!patient || !doctor) {
      toast.error('Pasien atau dokter tidak ditemukan');
      return;
    }

    addAppointment({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      roomId: room?.id,
      roomNumber: room?.roomNumber,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime || formData.startTime,
      status: 'scheduled',
      type: formData.type,
      notes: formData.notes,
    });

    toast.success('Janji temu berhasil ditambahkan');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      roomId: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'Konsultasi',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-foreground mb-2">Kalender Rumah Sakit</h1>
          <p className="text-muted-foreground">Kelola jadwal dan janji temu pasien</p>
        </div>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="gap-2 bg-primary hover:bg-primary-dark"
        >
          <Plus className="w-5 h-5" />
          Buat Janji Temu
        </Button>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary"></div>
                <span className="text-sm">Terjadwal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-success"></div>
                <span className="text-sm">Selesai</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-destructive"></div>
                <span className="text-sm">Dibatalkan</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={events}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              dateClick={handleDateClick}
              eventDrop={handleEventDrop}
              eventResize={handleEventResize}
              height="auto"
              locale="id"
              slotMinTime="07:00:00"
              slotMaxTime="20:00:00"
              allDaySlot={false}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Appointment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buat Janji Temu Baru</DialogTitle>
            <DialogDescription>Lengkapi data untuk membuat janji temu baru</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient">Pasien *</Label>
                <select
                  id="patient"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm"
                >
                  <option value="">Pilih Pasien</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.medicalRecordNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="doctor">Dokter *</Label>
                <select
                  id="doctor"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm"
                >
                  <option value="">Pilih Dokter</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room">Ruangan</Label>
                <select
                  id="room"
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm"
                >
                  <option value="">Pilih Ruangan (Opsional)</option>
                  {rooms.filter(r => r.status === 'available').map(room => (
                    <option key={room.id} value={room.id}>
                      {room.roomNumber} - {room.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="type">Jenis</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm"
                >
                  <option>Konsultasi</option>
                  <option>Pemeriksaan</option>
                  <option>Tindakan</option>
                  <option>Kontrol</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Tanggal *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Jam Mulai *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Jam Selesai</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Catatan</Label>
              <Input
                id="notes"
                placeholder="Catatan tambahan (opsional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddAppointment} className="bg-primary hover:bg-primary-dark">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
