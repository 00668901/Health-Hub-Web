import React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, Clock, MapPin, X, RefreshCw, AlertCircle,
  CheckCircle, ChevronRight, Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../../contexts/LanguageContext';

interface Schedule {
  id: string;
  day: string;
  date: string;
  time: string;
  room: string;
  status: 'active' | 'cancelled' | 'rescheduled';
  patientCount?: number;
}

// Data awal (fallback jika localStorage kosong)
const initialSchedules: Schedule[] = [
  { 
    id: '1',
    day: 'Senin', 
    date: '2025-10-27',
    time: '09:00 - 12:00', 
    room: 'Ruang 201', 
    status: 'active',
    patientCount: 5
  },
  { 
    id: '2',
    day: 'Selasa', 
    date: '2025-10-28',
    time: '14:00 - 17:00', 
    room: 'Ruang 201', 
    status: 'active',
    patientCount: 3
  },
  { 
    id: '3',
    day: 'Rabu', 
    date: '2025-10-29',
    time: '09:00 - 12:00', 
    room: 'Ruang 201', 
    status: 'active',
    patientCount: 7
  },
  { 
    id: '4',
    day: 'Kamis', 
    date: '2025-10-30',
    time: '14:00 - 17:00', 
    room: 'Ruang 203', 
    status: 'cancelled',
    patientCount: 0
  },
  { 
    id: '5',
    day: 'Jumat', 
    date: '2025-10-31',
    time: '09:00 - 12:00', 
    room: 'Ruang 201', 
    status: 'active',
    patientCount: 4
  }
];

// Kunci unik untuk LocalStorage
const SCHEDULE_STORAGE_KEY = 'doctorScheduleData'; 

// Fungsi untuk mendapatkan data jadwal awal dari LocalStorage atau fallback
const getInitialSchedules = (): Schedule[] => {
  try {
    const storedData = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (storedData) {
      // Pastikan data yang tersimpan adalah array jadwal yang valid
      const parsedData: Schedule[] = JSON.parse(storedData);
      return Array.isArray(parsedData) ? parsedData : initialSchedules;
    }
  } catch (error) {
    console.error("Gagal memuat jadwal dari localStorage:", error);
  }
  return initialSchedules;
};

// Fungsi helper untuk menyimpan jadwal ke LocalStorage
const saveSchedulesToLocalStorage = (schedules: Schedule[]) => {
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.error("Gagal menyimpan jadwal ke localStorage:", error);
    toast.error('Gagal menyimpan perubahan jadwal secara lokal.');
  }
};


const availableDays = [
  { value: 'monday', label: 'Senin' },
  { value: 'tuesday', label: 'Selasa' },
  { value: 'wednesday', label: 'Rabu' },
  { value: 'thursday', label: 'Kamis' },
  { value: 'friday', label: 'Jumat' },
  { value: 'saturday', label: 'Sabtu' },
];

const availableTimes = [
  '08:00 - 11:00',
  '09:00 - 12:00',
  '13:00 - 16:00',
  '14:00 - 17:00',
  '15:00 - 18:00',
];

const recommendedAlternatives = [
  {
    day: 'Sabtu',
    date: '2025-11-01',
    time: '09:00 - 12:00',
    reason: 'Slot tersedia, ruangan sama',
  },
  {
    day: 'Senin',
    date: '2025-11-03',
    time: '14:00 - 17:00',
    reason: 'Minggu depan, pasien lebih sedikit',
  },
];

export default function MySchedule() {
  // **MODIFIKASI 1: Ambil data dari getInitialSchedules**
  const [schedules, setSchedules] = useState<Schedule[]>(getInitialSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [newDay, setNewDay] = useState('');
  const [newTime, setNewTime] = useState('');
  const { language } = useLanguage();

  const handleCancelSchedule = () => {
    if (!selectedSchedule) return;
    
    // Perbarui state schedules
    const updatedSchedules = schedules.map(s => 
      s.id === selectedSchedule.id 
        ? { ...s, status: 'cancelled' as const, patientCount: 0 }
        : s
    );
    
    setSchedules(updatedSchedules);
    
    // **MODIFIKASI 2: Simpan ke LocalStorage**
    saveSchedulesToLocalStorage(updatedSchedules);

    toast.success(
      language === 'id'
        ? `Jadwal ${selectedSchedule.day} berhasil dibatalkan`
        : `${selectedSchedule.day} schedule successfully cancelled`
    );
    setCancelDialogOpen(false);
    setSelectedSchedule(null);
  };

  const handleReschedule = () => {
    if (!selectedSchedule || !newDay || !newTime) {
      toast.error(language === 'id' ? 'Mohon pilih hari dan waktu baru' : 'Please select new day and time');
      return;
    }

    // Perbarui state schedules
    const updatedSchedules = schedules.map(s => 
      s.id === selectedSchedule.id 
        ? { 
            ...s, 
            day: availableDays.find(d => d.value === newDay)?.label || s.day,
            time: newTime,
            status: 'rescheduled' as const
          }
        : s
    );

    setSchedules(updatedSchedules);
    
    // **MODIFIKASI 3: Simpan ke LocalStorage**
    saveSchedulesToLocalStorage(updatedSchedules);
    
    toast.success(
      language === 'id'
        ? 'Jadwal berhasil diubah'
        : 'Schedule successfully rescheduled'
    );
    setRescheduleDialogOpen(false);
    setSelectedSchedule(null);
    setNewDay('');
    setNewTime('');
  };

  const handleSelectRecommendation = (rec: typeof recommendedAlternatives[0]) => {
    setNewDay(rec.day.toLowerCase());
    setNewTime(rec.time);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'rescheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: language === 'id' ? 'Aktif' : 'Active',
      cancelled: language === 'id' ? 'Dibatalkan' : 'Cancelled',
      rescheduled: language === 'id' ? 'Dijadwalkan Ulang' : 'Rescheduled',
    };
    return labels[status] || status;
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">
          {language === 'id' ? 'Jadwal Saya' : 'My Schedule'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'id' 
            ? 'Kelola jadwal praktik Anda dengan mudah'
            : 'Manage your practice schedule easily'}
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'id' ? 'Jadwal Aktif' : 'Active Schedules'}
                  </p>
                  <p className="text-2xl">{schedules.filter(s => s.status === 'active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'id' ? 'Total Pasien' : 'Total Patients'}
                  </p>
                  <p className="text-2xl">
                    {schedules.reduce((sum, s) => sum + (s.patientCount || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'id' ? 'Jam Praktik' : 'Practice Hours'}
                  </p>
                  <p className="text-2xl">{schedules.filter(s => s.status === 'active').length * 3}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Schedule List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {language === 'id' ? 'Jadwal Mingguan' : 'Weekly Schedule'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedules.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="border rounded-lg p-4 hover:border-primary transition-colors dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        {new Date(schedule.date).getDate()}
                      </span>
                      <span className="font-medium text-primary">{schedule.day}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-foreground">{schedule.day}, {schedule.date}</h4>
                        <Badge className={getStatusColor(schedule.status)}>
                          {getStatusLabel(schedule.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {schedule.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {schedule.room}
                        </div>
                      </div>
                      
                      {schedule.patientCount !== undefined && schedule.patientCount > 0 && (
                        <p className="text-sm text-primary mt-2">
                          {schedule.patientCount} {language === 'id' ? 'pasien terdaftar' : 'patients registered'}
                        </p>
                      )}
                    </div>
                  </div>

                  {schedule.status === 'active' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setRescheduleDialogOpen(true);
                        }}
                        className="gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        {language === 'id' ? 'Ubah' : 'Reschedule'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setCancelDialogOpen(true);
                        }}
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        {language === 'id' ? 'Batalkan' : 'Cancel'}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              {language === 'id' ? 'Batalkan Jadwal?' : 'Cancel Schedule?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'id'
                ? `Anda akan membatalkan jadwal ${selectedSchedule?.day} (${selectedSchedule?.time}). ${
                    selectedSchedule?.patientCount && selectedSchedule.patientCount > 0
                      ? `Ada ${selectedSchedule.patientCount} pasien yang sudah terdaftar.`
                      : ''
                  } Tindakan ini tidak dapat dibatalkan.`
                : `You are canceling ${selectedSchedule?.day} schedule (${selectedSchedule?.time}). ${
                    selectedSchedule?.patientCount && selectedSchedule.patientCount > 0
                      ? `There are ${selectedSchedule.patientCount} registered patients.`
                      : ''
                  } This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'id' ? 'Batal' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSchedule}
              className="bg-destructive hover:bg-destructive/90"
            >
              {language === 'id' ? 'Ya, Batalkan' : 'Yes, Cancel'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" />
              {language === 'id' ? 'Ubah Jadwal' : 'Reschedule'}
            </DialogTitle>
            <DialogDescription>
              {language === 'id'
                ? `Ubah jadwal ${selectedSchedule?.day} ke hari dan waktu lain`
                : `Reschedule ${selectedSchedule?.day} to another day and time`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Recommendations */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <h4 className="text-sm font-medium">
                  {language === 'id' ? 'Rekomendasi Hari' : 'Recommended Days'}
                </h4>
              </div>
              <div className="space-y-2">
                {recommendedAlternatives.map((rec, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectRecommendation(rec)}
                    className="p-3 border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{rec.day}, {rec.date}</p>
                        <p className="text-xs text-muted-foreground">{rec.time}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">💡 {rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 dark:border-gray-700">
              <p className="text-sm text-muted-foreground mb-3">
                {language === 'id' ? 'Atau pilih manual:' : 'Or choose manually:'}
              </p>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="new-day">
                    {language === 'id' ? 'Hari Baru' : 'New Day'}
                  </Label>
                  <Select value={newDay} onValueChange={setNewDay}>
                    <SelectTrigger id="new-day">
                      <SelectValue placeholder={language === 'id' ? 'Pilih hari...' : 'Select day...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDays.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-time">
                    {language === 'id' ? 'Waktu Baru' : 'New Time'}
                  </Label>
                  <Select value={newTime} onValueChange={setNewTime}>
                    <SelectTrigger id="new-time">
                      <SelectValue placeholder={language === 'id' ? 'Pilih waktu...' : 'Select time...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
              {language === 'id' ? 'Batal' : 'Cancel'}
            </Button>
            <Button onClick={handleReschedule} className="bg-primary hover:bg-primary-dark">
              {language === 'id' ? 'Simpan Perubahan' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}