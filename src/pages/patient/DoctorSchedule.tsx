import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Search, Filter } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function DoctorSchedule() {
  const { doctors } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));
  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Group doctors by day
  const getDoctorsByDay = (day: string) => {
    return filteredDoctors.filter(doctor =>
      doctor.schedule?.some(s => s.day === day)
    );
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2">Jadwal Dokter</h1>
        <p className="text-muted-foreground">
          Lihat jadwal praktek dokter dalam seminggu
        </p>
      </motion.div>

      {/* Search & Filter */}
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

            <div>
              <Label htmlFor="specialty-filter">Filter Spesialisasi</Label>
              <div className="relative mt-1">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  id="specialty-filter"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm pl-10"
                >
                  <option value="all">Semua Spesialisasi</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Schedule Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="Senin" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            {daysOfWeek.map(day => (
              <TabsTrigger key={day} value={day} className="text-xs md:text-sm">
                {day.substring(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {daysOfWeek.map((day, dayIndex) => {
            const doctorsOnDay = getDoctorsByDay(day);
            
            return (
              <TabsContent key={day} value={day} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{day}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {doctorsOnDay.length} dokter bertugas
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>

                {doctorsOnDay.length > 0 ? (
                  <div className="space-y-3">
                    {doctorsOnDay.map((doctor, index) => {
                      const daySchedule = doctor.schedule?.filter(s => s.day === day) || [];
                      
                      return (
                        <motion.div
                          key={doctor.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                        >
                          <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white flex-shrink-0">
                                      {doctor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="mb-2">{doctor.name}</h3>
                                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-3">
                                        {doctor.specialty}
                                      </Badge>
                                      <div className="grid gap-2">
                                        {daySchedule.map((schedule, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-center gap-2 text-sm text-muted-foreground"
                                          >
                                            <Clock className="w-4 h-4" />
                                            <span>
                                              {schedule.startTime} - {schedule.endTime}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2 text-right">
                                  <div className="flex items-center gap-1 text-sm">
                                    <span className="text-yellow-500">★</span>
                                    <span>{doctor.rating}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {doctor.experience} tahun pengalaman
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        Tidak ada dokter bertugas pada hari {day}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </motion.div>

      {/* Schedule by Specialty */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="mb-4">Jadwal Berdasarkan Spesialisasi</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {specialties.map((specialty, index) => {
            const specialtyDoctors = doctors.filter(d => d.specialty === specialty);
            
            return (
              <motion.div
                key={specialty}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{specialty}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {specialtyDoctors.map(doctor => (
                        <div
                          key={doctor.id}
                          className="p-3 bg-accent/50 rounded-lg"
                        >
                          <p className="mb-2">{doctor.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {doctor.schedule?.map((sched, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {sched.day}: {sched.startTime}-{sched.endTime}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
