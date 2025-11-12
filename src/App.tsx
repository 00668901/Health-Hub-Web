import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from './components/ui/sonner';

// Pages
import SplashScreen from './pages/SplashScreen';
import Onboarding from './pages/Onboarding';
import SelectRole from './pages/SelectRole';
import Login from './pages/Login';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import DoctorLayout from './layouts/DoctorLayout';
import PatientLayout from './layouts/PatientLayout';

// Admin Pages
import AdminHome from './pages/admin/AdminHome';
import CalendarPage from './pages/admin/CalendarPage';
import PatientsPage from './pages/admin/PatientsPage';
import DoctorsPage from './pages/admin/DoctorsPage';
import NursesPage from './pages/admin/NursesPage';
import RoomsPage from './pages/admin/RoomsPage';
import PerformancePage from './pages/admin/PerformancePage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminManagement from './pages/admin/AdminManagement';
import StaffAccounts from './pages/admin/StaffAccounts';

// Doctor Pages
import DoctorHome from './pages/doctor/DoctorHome';
import DoctorCalendar from './pages/doctor/DoctorCalendar';
import MyPatients from './pages/doctor/MyPatients';
import MySchedule from './pages/doctor/MySchedule';
import DoctorProfile from './pages/doctor/DoctorProfile';
import MedicalHistory from './pages/doctor/MedicalHistory';

// Patient Pages
import PatientHome from './pages/patient/PatientHome';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientProfile from './pages/patient/PatientProfile';
import PaymentMethods from './pages/patient/PaymentMethods';
import SearchDoctors from './pages/patient/SearchDoctors';
import SearchRooms from './pages/patient/SearchRooms';
import MyAppointments from './pages/patient/MyAppointments';
import HealthTips from './pages/patient/HealthTips';
import HealthNews from './pages/patient/HealthNews';
import PatientCalendar from './pages/patient/PatientCalendar';
import BookAppointment from './pages/patient/BookAppointment';
import DoctorSchedule from './pages/patient/DoctorSchedule';
import MyInvoices from './pages/patient/MyInvoices';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/select-role" replace />;
  }

  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/select-role" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<SplashScreen />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="nurses" element={<NursesPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="admins" element={<AdminManagement />} />
        <Route path="staff-accounts" element={<StaffAccounts />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Doctor Routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={['doctor', 'nurse']}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorHome />} />
        <Route path="calendar" element={<DoctorCalendar />} />
        <Route path="patients" element={<MyPatients />} />
        <Route path="records" element={<MedicalHistory />} />
        <Route path="schedule" element={<MySchedule />} />
        <Route path="profile" element={<DoctorProfile />} />
      </Route>

      {/* Patient Routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientHome />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="payment-methods" element={<PaymentMethods />} />
        <Route path="book-appointment" element={<BookAppointment />} />
        <Route path="doctor-schedule" element={<DoctorSchedule />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="invoices" element={<MyInvoices />} />
        <Route path="search-doctors" element={<SearchDoctors />} />
        <Route path="search-rooms" element={<SearchRooms />} />
        <Route path="calendar" element={<PatientCalendar />} />
        <Route path="health-tips" element={<HealthTips />} />
        <Route path="health-news" element={<HealthNews />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <DataProvider>
              <AppRoutes />
              <Toaster position="top-right" richColors />
            </DataProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
