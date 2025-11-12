import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import AdminHome from './AdminHome';
import CalendarPage from './CalendarPage';
import PatientsPage from './PatientsPage';
import DoctorsPage from './DoctorsPage';
import NursesPage from './NursesPage';
import RoomsPage from './RoomsPage';
import PerformancePage from './PerformancePage';
import SettingsPage from './SettingsPage';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminHome />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/nurses" element={<NursesPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AdminLayout>
  );
}
