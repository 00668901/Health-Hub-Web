import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Home,
  Search,
  Building2,
  Calendar,
  UserCircle,
  LogOut,
  Heart,
  Newspaper,
  CalendarCheck,
  FileText,
  Clock,
  Plus,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

const menuItems = [
  { icon: Home, label: 'Home', path: '/patient' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/patient/dashboard' },
  { icon: Plus, label: 'Booking', path: '/patient/book-appointment' },
  { icon: Search, label: 'Dokter', path: '/patient/search-doctors' },
  { icon: CalendarCheck, label: 'Janji', path: '/patient/appointments' },
  { icon: UserCircle, label: 'Profil', path: '/patient/profile' },
];

export default function PatientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/select-role');
  };

  return (
    <div className="min-h-screen bg-secondary/30 pb-20 md:pb-0">
      {/* Mobile Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40 md:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👤</span>
              </div>
              <span className="text-emerald-700 font-medium">Health Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/patient/dashboard')}
                className="gap-1 text-emerald-600"
              >
                <LayoutDashboard className="w-4 h-4" />
              </Button>
              <Avatar
                className="cursor-pointer w-8 h-8"
                onClick={() => navigate('/patient/profile')}
              >
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-emerald-500 text-white text-xs">P</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40 hidden md:block">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white">👤</span>
              </div>
              <div>
                <span className="text-emerald-700">Health Hub</span>
                <p className="text-xs text-muted-foreground">Portal Pasien</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/patient/dashboard')}
                className="gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
              <div className="text-right">
                <p className="text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Pasien</p>
              </div>
              <Avatar
                className="cursor-pointer"
                onClick={() => navigate('/patient/profile')}
              >
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-emerald-500 text-white">P</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-border md:hidden z-50"
      >
        <div className="flex justify-around items-center h-16 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/patient'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[60px] ${
                  isActive
                    ? 'text-emerald-500'
                    : 'text-muted-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-6 h-6 ${isActive ? 'fill-emerald-500/10' : ''}`} />
                  <span className="text-xs">{item.label.split(' ')[0]}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </motion.nav>
    </div>
  );
}
