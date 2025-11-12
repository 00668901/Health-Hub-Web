import React from 'react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth, type UserRole } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner@2.0.3';

// Data akun untuk demo
const DEMO_ACCOUNTS = {
  admin: [
    { username: 'kingmalik', password: 'kingmalik2025', name: 'KingMalik', role: 'Super Administrator' },
    { username: 'kingkeny', password: 'kingkeny2025', name: 'KingKeny', role: 'Medical Administrator' },
  ],
  doctor: [
    { username: 'dr.Malik', password: 'DrMalik2025', name: 'Dr. Malikkusaleh', specialty: 'Patah Hati' },
    { username: 'dr.Bagas', password: 'DrBagas2025', name: 'Dr. Bagas Skena', specialty: 'Dokter Gigi' },
  ],
  nurse: [
    { username: 'ns.budi', password: 'NsBudi@2025', name: 'Ns. Budi Santoso', department: 'ICU' },
    { username: 'ns.dewi', password: 'NsDewi@2025', name: 'Ns. Dewi Lestari', department: 'IGD' },
  ],
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') as UserRole;
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const getRoleTitle = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'doctor': return 'Dokter';
      case 'nurse': return 'Perawat';
      case 'patient': return 'Pasien';
      default: return '';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'from-blue-500 to-cyan-500';
      case 'doctor': return 'from-teal-500 to-emerald-500';
      case 'nurse': return 'from-teal-500 to-emerald-500';
      case 'patient': return 'from-emerald-500 to-green-500';
      default: return 'from-primary to-primary-dark';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Username dan password harus diisi');
      return;
    }

    try {
      // For patients, allow any username/password (demo)
      if (role === 'patient') {
        await login(username, password, role, rememberMe);
        toast.success('Login berhasil!');
        navigate('/patient');
        return;
      }

      // For admin/doctor/nurse, check against demo accounts
      const accounts = role === 'admin' ? DEMO_ACCOUNTS.admin : 
                      role === 'doctor' ? DEMO_ACCOUNTS.doctor :
                      DEMO_ACCOUNTS.nurse;
      
      const account = accounts.find(acc => acc.username === username && acc.password === password);
      
      if (!account) {
        toast.error('Username atau password salah');
        return;
      }

      await login(username, password, role, rememberMe);
      toast.success(`Selamat datang, ${account.name}!`);
      
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'doctor':
        case 'nurse':
          navigate('/doctor');
          break;
        default:
          navigate('/select-role');
      }
    } catch (error) {
      toast.error('Login gagal. Silakan coba lagi.');
    }
  };

  const getDemoAccounts = () => {
    if (role === 'admin') return DEMO_ACCOUNTS.admin;
    if (role === 'doctor') return DEMO_ACCOUNTS.doctor;
    if (role === 'nurse') return DEMO_ACCOUNTS.nurse;
    return [];
  };

  if (!role) {
    navigate('/select-role');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary to-accent/30 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration & Demo Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className={`bg-gradient-to-br ${getRoleColor(role)} rounded-3xl p-12 text-white text-center`}>
            <h2 className="mb-4 text-white">Health Hub 2.0</h2>
            <p className="text-white/80 mb-8">Sistem Informasi Kesehatan Terpadu</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="w-48 h-48 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                <div className="text-6xl">
                  {role === 'admin' ? '🏥' : role === 'patient' ? '👤' : '⚕️'}
                </div>
              </div>
            </div>
          </div>

          {/* Demo Accounts Info */}
          {role !== 'patient' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Akun Demo</CardTitle>
                <CardDescription>Gunakan salah satu akun berikut untuk login:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {getDemoAccounts().map((account, idx) => (
                  <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{account.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <code className="bg-background px-2 py-0.5 rounded">{account.username}</code>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Lock className="w-3 h-3" />
                      <code className="bg-background px-2 py-0.5 rounded">{account.password}</code>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8"
        >
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/select-role')}
              className="gap-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
            <h2 className="mb-2">Login {getRoleTitle(role)}</h2>
            <p className="text-muted-foreground">Silakan login untuk melanjutkan</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                {role === 'patient' ? 'Email / Nomor HP' : 'Username'}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder={role === 'patient' ? 'user@email.com' : 'username'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {role === 'patient' && (
              <p className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                💡 Untuk pasien, gunakan email atau nomor HP apapun untuk demo
              </p>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Ingat saya
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${getRoleColor(role)} hover:opacity-90`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Dengan login, Anda menyetujui</p>
            <p>
              <button className="text-primary hover:underline">Syarat & Ketentuan</button>
              {' '}dan{' '}
              <button className="text-primary hover:underline">Kebijakan Privasi</button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
