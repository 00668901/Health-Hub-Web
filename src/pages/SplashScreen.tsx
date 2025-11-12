import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Activity } from 'lucide-react';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user is already logged in with Remember Me
      const storedUser = localStorage.getItem('healthhub_user');
      const rememberMe = localStorage.getItem('healthhub_remember_me');
      
      if (storedUser && rememberMe === 'true') {
        const user = JSON.parse(storedUser);
        console.log('Auto-redirecting to:', user.role);
        
        // Redirect based on role
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'doctor':
          case 'nurse':
            navigate('/doctor');
            break;
          case 'patient':
            navigate('/patient');
            break;
          default:
            navigate('/select-role');
        }
      } else {
        // Normal flow - check onboarding
        const hasSeenOnboarding = localStorage.getItem('healthhub_onboarding');
        if (hasSeenOnboarding) {
          navigate('/select-role');
        } else {
          navigate('/onboarding');
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
          <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-center gap-3">
              <Heart className="w-16 h-16 text-primary fill-primary" />
              <Activity className="w-16 h-16 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h1 className="text-white mb-2">HEALTH HUB</h1>
          <p className="text-blue-100">Sistem Informasi Kesehatan Terpadu</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-white rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
