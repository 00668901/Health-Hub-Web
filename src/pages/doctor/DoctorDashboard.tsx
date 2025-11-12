import { Routes, Route, Navigate } from 'react-router-dom';
import DoctorLayout from '../../layouts/DoctorLayout';
import DoctorHome from './DoctorHome';
import DoctorCalendar from './DoctorCalendar';
import MyPatients from './MyPatients';
import MySchedule from './MySchedule';
import DoctorProfile from './DoctorProfile';

export default function DoctorDashboard() {
  return (
    <DoctorLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="/dashboard" element={<DoctorHome />} />
        <Route path="/calendar" element={<DoctorCalendar />} />
        <Route path="/patients" element={<MyPatients />} />
        <Route path="/schedule" element={<MySchedule />} />
        <Route path="/profile" element={<DoctorProfile />} />
      </Routes>
    </DoctorLayout>
  );
}
