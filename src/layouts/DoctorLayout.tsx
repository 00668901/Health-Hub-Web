import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  ClipboardList,
  Clock,
  UserCircle,
  LogOut,
  Menu,
  X,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor' },
  { icon: Calendar, label: 'Kalender Saya', path: '/doctor/calendar' },
  { icon: Users, label: 'Pasien Saya', path: '/doctor/patients' },
  { icon: ClipboardList, label: 'Riwayat Tindakan', path: '/doctor/records' },
  { icon: Clock, label: 'Jadwal Saya', path: '/doctor/schedule' },
  { icon: UserCircle, label: 'Profil', path: '/doctor/profile' },
];

export default function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/select-role');
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 80 }}
        className="fixed left-0 top-0 h-screen bg-white border-r border-border shadow-lg z-50"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white">⚕️</span>
                </div>
                <span className="text-teal-700">Health Hub</span>
              </div>
            ) : (
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white">⚕️</span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/doctor'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-colors ${
                    isActive
                      ? 'bg-teal-500 text-white'
                      : 'text-muted-foreground hover:bg-accent'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-teal-500 text-white">D</AvatarFallback>
              </Avatar>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">Dokter</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full mt-2 gap-2 text-destructive hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        style={{ marginLeft: sidebarOpen ? 240 : 80 }}
        className="transition-all duration-300"
      >
        {/* Top Bar */}
        <header className="bg-white border-b border-border sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Dokter</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
