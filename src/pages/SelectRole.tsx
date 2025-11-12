import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Stethoscope, User, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import type { UserRole } from '../contexts/AuthContext';

const roles = [
  {
    id: 'admin' as UserRole,
    title: 'Administrator',
    description: 'Akses penuh untuk mengelola sistem',
    icon: Shield,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'doctor' as UserRole,
    title: 'Dokter / Perawat',
    description: 'Kelola pasien dan jadwal medis',
    icon: Stethoscope,
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    id: 'patient' as UserRole,
    title: 'Pasien',
    description: 'Booking janji dan lihat rekam medis',
    icon: User,
    gradient: 'from-teal-500 to-emerald-500',
  },
];

export default function SelectRole() {
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary to-accent/30 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="mb-2 text-primary-dark">Pilih Role Anda</h1>
          <p className="text-muted-foreground">Silakan pilih sebagai apa Anda ingin masuk ke sistem</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectRole(role.id)}
              className="cursor-pointer"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden h-full">
                <div className={`bg-gradient-to-br ${role.gradient} p-8 text-center`}>
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="inline-block bg-white/20 backdrop-blur-sm p-6 rounded-2xl"
                  >
                    <role.icon className="w-16 h-16 text-white" strokeWidth={1.5} />
                  </motion.div>
                </div>

                <div className="p-6 text-center">
                  <h3 className="mb-2 text-foreground">{role.title}</h3>
                  <p className="text-muted-foreground text-sm">{role.description}</p>

                  <Button className="mt-6 w-full bg-primary hover:bg-primary-dark">
                    Masuk sebagai {role.title}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/onboarding')}
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
