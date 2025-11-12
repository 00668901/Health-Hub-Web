import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Users, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const slides = [
  {
    icon: Heart,
    title: 'Selamat Datang di Health Hub',
    description: 'Platform manajemen kesehatan terpadu untuk rumah sakit modern',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'Kelola Pasien & Dokter',
    description: 'Manajemen data pasien, dokter, dan perawat dalam satu sistem terintegrasi',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    icon: Calendar,
    title: 'Jadwal & Booking',
    description: 'Sistem booking appointment dan kalender medis yang mudah digunakan',
    color: 'from-teal-500 to-emerald-500',
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      localStorage.setItem('healthhub_onboarding', 'true');
      navigate('/select-role');
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('healthhub_onboarding', 'true');
    navigate('/select-role');
  };

  const IconComponent = slides[currentSlide].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className={`bg-gradient-to-br ${slides[currentSlide].color} p-12 text-center`}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-block bg-white/20 backdrop-blur-sm p-8 rounded-3xl"
              >
                <IconComponent className="w-24 h-24 text-white" strokeWidth={1.5} />
              </motion.div>
            </div>

            <div className="p-8 md:p-12 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4 text-foreground"
              >
                {slides[currentSlide].title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-8"
              >
                {slides[currentSlide].description}
              </motion.p>

              <div className="flex gap-2 justify-center mb-8">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-muted'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-4 justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-muted-foreground"
                >
                  Lewati
                </Button>

                <div className="flex gap-2">
                  {currentSlide > 0 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrev}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                  )}

                  <Button
                    onClick={handleNext}
                    className="gap-2 bg-primary hover:bg-primary-dark"
                  >
                    {currentSlide === slides.length - 1 ? 'Mulai' : 'Lanjut'}
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
