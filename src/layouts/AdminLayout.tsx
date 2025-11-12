import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCog,
  Stethoscope,
  BedDouble,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  KeyRound,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useLanguage } from '../contexts/LanguageContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Calendar, label: 'Kalender RS', path: '/admin/calendar' },
  { icon: Users, label: 'Data Pasien', path: '/admin/patients' },
  { icon: Stethoscope, label: 'Data Dokter', path: '/admin/doctors' },
  { icon: UserCog, label: 'Data Perawat', path: '/admin/nurses' },
  { icon: BedDouble, label: 'Ruangan & Antrean', path: '/admin/rooms' },
  { icon: BarChart3, label: 'Laporan Kinerja', path: '/admin/performance' },
  { icon: Shield, label: 'Kelola Admin', path: '/admin/admins' },
  { icon: KeyRound, label: 'Akun Staff Medis', path: '/admin/staff-accounts' },
  { icon: Settings, label: 'Pengaturan', path: '/admin/settings' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
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
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white">🏥</span>
                </div>
                <span className="text-primary-dark">Health Hub</span>
              </div>
            ) : (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white">🏥</span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-2">
            {menuItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
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
                <AvatarFallback className="bg-primary text-white">A</AvatarFallback>
              </Avatar>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">Super Administrator</p>
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
                <p className="text-xs text-muted-foreground">Super Administrator</p>
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
