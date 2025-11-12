import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CreditCard,
  Shield,
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { toast } from 'sonner@2.0.3';

type BookingStep = 'specialty' | 'doctor' | 'schedule' | 'patient-info' | 'payment' | 'confirmation';

export default function BookAppointment() {
  const { user } = useAuth();
  const { doctors, patients, addPatient, updatePatient, addAppointment, addPayment, addInvoice } = useData();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<BookingStep>('specialty');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('Konsultasi');
  const [notes, setNotes] = useState('');
  
  // Patient info
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [patientData, setPatientData] = useState({
    name: user?.name || '',
    age: '',
    gender: '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    bloodType: '',
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'Debit' | 'QRIS' | 'Cash'>('Cash');
  const [insurance, setInsurance] = useState<'KIS' | 'BPJS' | 'None'>('None');

  // Get unique specialties
  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));

  // Get doctors by specialty
  const doctorsBySpecialty = selectedSpecialty
    ? doctors.filter(d => d.specialty === selectedSpecialty)
    : [];

  // Get selected doctor details
  const doctor = doctors.find(d => d.id === selectedDoctor);

  // Check if patient exists
  const existingPatient = patients.find(p => p.email === user?.email || p.phone === user?.phone);

  const handleSpecialtySelect = (specialty: string) => {
    setSelectedSpecialty(specialty);
    setCurrentStep('doctor');
  };

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setCurrentStep('schedule');
  };

  const handleScheduleSelect = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Pilih tanggal dan waktu terlebih dahulu');
      return;
    }
    
    // Check if patient exists
    if (existingPatient) {
      setIsNewPatient(false);
      setPatientData({
        name: existingPatient.name,
        age: existingPatient.age.toString(),
        gender: existingPatient.gender,
        phone: existingPatient.phone,
        email: existingPatient.email || '',
        address: existingPatient.address || '',
        bloodType: existingPatient.bloodType || '',
      });
    }
    
    setCurrentStep('patient-info');
  };

  const handlePatientInfoSubmit = () => {
    if (!patientData.name || !patientData.age || !patientData.gender || !patientData.phone) {
      toast.error('Lengkapi data pasien terlebih dahulu');
      return;
    }
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = () => {
    setCurrentStep('confirmation');
  };

  const handleConfirmBooking = () => {
    let patientId = existingPatient?.id;

    // Create or update patient record
    if (!existingPatient && isNewPatient) {
      const medicalRecordNumber = `MR-${new Date().getFullYear()}-${String(patients.length + 1).padStart(3, '0')}`;
      addPatient({
        name: patientData.name,
        age: parseInt(patientData.age),
        gender: patientData.gender,
        phone: patientData.phone,
        email: patientData.email,
        address: patientData.address,
        bloodType: patientData.bloodType,
        medicalRecordNumber,
        isNewPatient: true,
        registrationDate: new Date().toISOString(),
      });
      patientId = Date.now().toString();
    }

    // Create appointment
    const appointmentId = Date.now().toString();
    addAppointment({
      patientId: patientId!,
      patientName: patientData.name,
      doctorId: selectedDoctor,
      doctorName: doctor!.name,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      status: 'Scheduled',
      notes,
    });

    // Create payment
    const consultationFee = 150000;
    const adminFee = 10000;
    const subtotal = consultationFee + adminFee;
    const tax = subtotal * 0.1;
    const total = insurance !== 'None' ? subtotal * 0.3 : subtotal + tax;

    const paymentId = Date.now().toString() + '-payment';
    addPayment({
      appointmentId,
      amount: total,
      method: paymentMethod,
      insurance,
      status: 'Paid',
      paidAt: new Date().toISOString(),
    });

    // Create invoice
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    addInvoice({
      invoiceNumber,
      appointmentId,
      patientName: patientData.name,
      patientMedicalRecordNumber: existingPatient?.medicalRecordNumber || `MR-${new Date().getFullYear()}-${String(patients.length + 1).padStart(3, '0')}`,
      doctorName: doctor!.name,
      date: selectedDate,
      items: [
        { name: 'Biaya Konsultasi', quantity: 1, price: consultationFee },
        { name: 'Biaya Admin', quantity: 1, price: adminFee },
      ],
      subtotal,
      tax,
      total,
      paymentMethod,
      insurance: insurance !== 'None' ? insurance : undefined,
      createdAt: new Date().toISOString(),
    });

    toast.success('Booking berhasil dibuat!');
    navigate('/patient/appointments');
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'specialty', label: 'Spesialisasi' },
      { key: 'doctor', label: 'Dokter' },
      { key: 'schedule', label: 'Jadwal' },
      { key: 'patient-info', label: 'Data Pasien' },
      { key: 'payment', label: 'Pembayaran' },
      { key: 'confirmation', label: 'Konfirmasi' },
    ];

    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentIndex
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentIndex ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-xs mt-1 whitespace-nowrap">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-1 mx-2 ${
                  index < currentIndex ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2">Booking Appointment</h1>
        <p className="text-muted-foreground">Buat janji temu dengan dokter pilihan Anda</p>
      </motion.div>

      {renderStepIndicator()}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Step 1: Select Specialty */}
        {currentStep === 'specialty' && (
          <Card>
            <CardHeader>
              <CardTitle>Pilih Spesialisasi Dokter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {specialties.map((specialty) => {
                  const doctorCount = doctors.filter(d => d.specialty === specialty).length;
                  return (
                    <motion.div
                      key={specialty}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
                        onClick={() => handleSpecialtySelect(specialty)}
                      >
                        <CardContent className="p-6">
                          <h3 className="mb-2">{specialty}</h3>
                          <p className="text-sm text-muted-foreground">
                            {doctorCount} dokter tersedia
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Doctor */}
        {currentStep === 'doctor' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pilih Dokter {selectedSpecialty}</CardTitle>
                <Button variant="ghost" onClick={() => setCurrentStep('specialty')}>
                  Kembali
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctorsBySpecialty.map((doc) => (
                  <motion.div
                    key={doc.id}
                    whileHover={{ scale: 1.01 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card
                      className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
                        selectedDoctor === doc.id ? 'border-primary' : 'border-transparent'
                      }`}
                      onClick={() => handleDoctorSelect(doc.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="mb-2">{doc.name}</h3>
                            <div className="space-y-2">
                              <Badge className="bg-primary/10 text-primary">
                                {doc.specialty}
                              </Badge>
                              <p className="text-sm text-muted-foreground">
                                Pengalaman: {doc.experience} tahun
                              </p>
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-yellow-500">★</span>
                                <span>{doc.rating}</span>
                                <span className="text-muted-foreground">
                                  ({doc.reviews} review)
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Schedule */}
        {currentStep === 'schedule' && doctor && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pilih Jadwal - {doctor.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{doctor.specialty}</p>
                </div>
                <Button variant="ghost" onClick={() => setCurrentStep('doctor')}>
                  Kembali
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Weekly Schedule Display */}
              <div>
                <Label className="mb-3 block">Jadwal Praktek Mingguan</Label>
                <div className="grid gap-2">
                  {doctor.schedule?.map((sched, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{sched.day}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {sched.startTime} - {sched.endTime}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <Label htmlFor="appointment-date">Pilih Tanggal</Label>
                <Input
                  id="appointment-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
              </div>

              {/* Time Selection */}
              <div>
                <Label htmlFor="appointment-time">Pilih Waktu</Label>
                <select
                  id="appointment-time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm mt-1"
                >
                  <option value="">Pilih waktu...</option>
                  <option value="08:00">08:00 - 09:00</option>
                  <option value="09:00">09:00 - 10:00</option>
                  <option value="10:00">10:00 - 11:00</option>
                  <option value="11:00">11:00 - 12:00</option>
                  <option value="13:00">13:00 - 14:00</option>
                  <option value="14:00">14:00 - 15:00</option>
                  <option value="15:00">15:00 - 16:00</option>
                  <option value="16:00">16:00 - 17:00</option>
                </select>
              </div>

              {/* Appointment Type */}
              <div>
                <Label htmlFor="appointment-type">Jenis Konsultasi</Label>
                <select
                  id="appointment-type"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm mt-1"
                >
                  <option>Konsultasi</option>
                  <option>Pemeriksaan</option>
                  <option>Kontrol</option>
                  <option>Tindakan</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Input
                  id="notes"
                  placeholder="Keluhan atau catatan tambahan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleScheduleSelect}
                className="w-full bg-primary hover:bg-primary-dark"
              >
                Lanjutkan
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Patient Information */}
        {currentStep === 'patient-info' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Data Pasien</CardTitle>
                <Button variant="ghost" onClick={() => setCurrentStep('schedule')}>
                  Kembali
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Status */}
              {existingPatient ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="mb-1">Pasien Lama - Rekam Medis Ditemukan</p>
                        <p className="text-sm">
                          No. Rekam Medis: <strong>{existingPatient.medicalRecordNumber}</strong>
                        </p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <p className="mb-1">Pasien Baru</p>
                    <p className="text-sm">
                      Silakan lengkapi data identitas Anda untuk membuat rekam medis baru
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patient-name">
                    Nama Lengkap <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="patient-name"
                      value={patientData.name}
                      onChange={(e) =>
                        setPatientData({ ...patientData, name: e.target.value })
                      }
                      className="pl-10"
                      disabled={!isNewPatient && !!existingPatient}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="patient-age">
                    Usia <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="patient-age"
                    type="number"
                    value={patientData.age}
                    onChange={(e) =>
                      setPatientData({ ...patientData, age: e.target.value })
                    }
                    className="mt-1"
                    disabled={!isNewPatient && !!existingPatient}
                  />
                </div>

                <div>
                  <Label htmlFor="patient-gender">
                    Jenis Kelamin <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="patient-gender"
                    value={patientData.gender}
                    onChange={(e) =>
                      setPatientData({ ...patientData, gender: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm mt-1"
                    disabled={!isNewPatient && !!existingPatient}
                  >
                    <option value="">Pilih...</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="patient-phone">
                    No. Telepon <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="patient-phone"
                      value={patientData.phone}
                      onChange={(e) =>
                        setPatientData({ ...patientData, phone: e.target.value })
                      }
                      className="pl-10"
                      disabled={!isNewPatient && !!existingPatient}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="patient-email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="patient-email"
                      type="email"
                      value={patientData.email}
                      onChange={(e) =>
                        setPatientData({ ...patientData, email: e.target.value })
                      }
                      className="pl-10"
                      disabled={!isNewPatient && !!existingPatient}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="patient-blood">Golongan Darah</Label>
                  <select
                    id="patient-blood"
                    value={patientData.bloodType}
                    onChange={(e) =>
                      setPatientData({ ...patientData, bloodType: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm mt-1"
                    disabled={!isNewPatient && !!existingPatient}
                  >
                    <option value="">Pilih...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="patient-address">Alamat</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="patient-address"
                    value={patientData.address}
                    onChange={(e) =>
                      setPatientData({ ...patientData, address: e.target.value })
                    }
                    className="pl-10"
                    disabled={!isNewPatient && !!existingPatient}
                  />
                </div>
              </div>

              <Button
                onClick={handlePatientInfoSubmit}
                className="w-full bg-primary hover:bg-primary-dark"
              >
                Lanjutkan ke Pembayaran
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Payment */}
        {currentStep === 'payment' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Metode Pembayaran</CardTitle>
                <Button variant="ghost" onClick={() => setCurrentStep('patient-info')}>
                  Kembali
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Insurance */}
              <div>
                <Label className="mb-3 block">Jaminan Kesehatan</Label>
                <div className="grid md:grid-cols-3 gap-3">
                  {(['None', 'KIS', 'BPJS'] as const).map((ins) => (
                    <Card
                      key={ins}
                      className={`cursor-pointer transition-all border-2 ${
                        insurance === ins
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                      onClick={() => setInsurance(ins)}
                    >
                      <CardContent className="p-4 text-center">
                        <Shield
                          className={`w-8 h-8 mx-auto mb-2 ${
                            insurance === ins ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        />
                        <p className="text-sm">
                          {ins === 'None' ? 'Tidak Ada' : ins}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {insurance !== 'None' && (
                  <Alert className="mt-3 bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800 text-sm">
                      Dengan jaminan {insurance}, Anda mendapat potongan 70% dari total biaya
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <Label className="mb-3 block">Metode Pembayaran</Label>
                <div className="grid md:grid-cols-3 gap-3">
                  {(['Cash', 'Debit', 'QRIS'] as const).map((method) => (
                    <Card
                      key={method}
                      className={`cursor-pointer transition-all border-2 ${
                        paymentMethod === method
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                      onClick={() => setPaymentMethod(method)}
                    >
                      <CardContent className="p-4 text-center">
                        <CreditCard
                          className={`w-8 h-8 mx-auto mb-2 ${
                            paymentMethod === method ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        />
                        <p className="text-sm">{method}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-accent/50 rounded-lg p-4">
                <h4 className="mb-3">Rincian Biaya</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Biaya Konsultasi</span>
                    <span>Rp 150.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Admin</span>
                    <span>Rp 10.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp 160.000</span>
                  </div>
                  {insurance !== 'None' ? (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span>Potongan {insurance} (70%)</span>
                        <span>- Rp 112.000</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span>Total</span>
                        <span>Rp 48.000</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Pajak (10%)</span>
                        <span>Rp 16.000</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span>Total</span>
                        <span>Rp 176.000</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Button
                onClick={handlePaymentSubmit}
                className="w-full bg-primary hover:bg-primary-dark"
              >
                Lanjutkan
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Confirmation */}
        {currentStep === 'confirmation' && doctor && (
          <Card>
            <CardHeader>
              <CardTitle>Konfirmasi Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Pastikan semua data sudah benar sebelum melakukan konfirmasi
                </AlertDescription>
              </Alert>

              {/* Booking Summary */}
              <div className="space-y-4">
                <div>
                  <h4 className="mb-3">Detail Appointment</h4>
                  <div className="bg-accent/50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dokter</span>
                      <span>{doctor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spesialisasi</span>
                      <span>{doctor.specialty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tanggal</span>
                      <span>{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Waktu</span>
                      <span>{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jenis</span>
                      <span>{appointmentType}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Data Pasien</h4>
                  <div className="bg-accent/50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nama</span>
                      <span>{patientData.name}</span>
                    </div>
                    {existingPatient && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">No. Rekam Medis</span>
                        <span className="text-primary">{existingPatient.medicalRecordNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Usia / Jenis Kelamin</span>
                      <span>
                        {patientData.age} tahun / {patientData.gender}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Telepon</span>
                      <span>{patientData.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Pembayaran</h4>
                  <div className="bg-accent/50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Metode</span>
                      <span>{paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jaminan</span>
                      <span>{insurance === 'None' ? 'Tidak Ada' : insurance}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Total Bayar</span>
                      <span>
                        Rp {insurance !== 'None' ? '48.000' : '176.000'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('payment')}
                  className="flex-1"
                >
                  Kembali
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-primary hover:bg-primary-dark"
                >
                  Konfirmasi & Bayar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
