import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient' | null;

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  specialty?: string;
  department?: string;
  license?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole, rememberMe?: boolean) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  loginWithPhone: (phone: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session and remember me
    const storedUser = localStorage.getItem('healthhub_user');
    const rememberMe = localStorage.getItem('healthhub_remember_me');
    const lastRole = localStorage.getItem('healthhub_last_role');
    
    if (storedUser && rememberMe === 'true') {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log('Auto-login successful:', parsedUser.name, 'Role:', parsedUser.role);
    }
    setLoading(false);
  }, []);

  const login = async (usernameOrEmail: string, password: string, role: UserRole, rememberMe: boolean = false) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Database akun (dalam aplikasi nyata ini dari backend)
    const accounts = {
      admin: [
        { username: 'kingmalik', password: 'kingmalik2025', name: 'King Malik', email: 'superadmin@healthhub.com' },
        { username: 'kingkeny', password: 'kingkeny2025', name: 'Kingkeny', email: 'medisadmin@healthhub.com' },
      ],
      doctor: [
        { username: 'dr.Malik', password: 'DrMalik2025', name: 'Dr. Malikkusaleh', email: 'malikkusaleh@healthhub.com', specialty: 'Patah Hati' },
        { username: 'dr.Bagas', password: 'DrBagas2025', name: 'Dr. Bagas Skena', email: 'bagas.skena@healthhub.com', specialty: 'Dokter Gigi' },
      ],
      nurse: [
        { username: 'ns.budi', password: 'NsBudi@2025', name: 'Ns. Budi Santoso', email: 'budi.santoso@healthhub.com', department: 'ICU' },
        { username: 'ns.dewi', password: 'NsDewi@2025', name: 'Ns. Dewi Lestari', email: 'dewi.lestari@healthhub.com', department: 'IGD' },
      ],
    };
    
    let mockUser: User;
    
    if (role === 'patient') {
      // For patients, allow any username/email
      mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        username: usernameOrEmail,
        name: usernameOrEmail.split('@')[0] || usernameOrEmail,
        email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@healthhub.com`,
        phone: '+62812345678',
        role: 'patient',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${usernameOrEmail}`,
      };
    } else {
      // For staff, find account
      const roleAccounts = accounts[role as keyof typeof accounts] || [];
      const account = roleAccounts.find(acc => acc.username === usernameOrEmail);
      
      if (account) {
        mockUser = {
          id: Math.random().toString(36).substr(2, 9),
          username: account.username,
          name: account.name,
          email: account.email,
          phone: '+62812345678',
          role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.username}`,
          specialty: 'specialty' in account ? account.specialty : undefined,
          department: 'department' in account ? account.department : undefined,
        };
      } else {
        throw new Error('Invalid credentials');
      }
    }
    
    setUser(mockUser);
    localStorage.setItem('healthhub_user', JSON.stringify(mockUser));
    localStorage.setItem('healthhub_remember_me', rememberMe.toString());
    localStorage.setItem('healthhub_last_role', role || '');
    setLoading(false);
  };

  const loginWithGoogle = async (role: UserRole) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Google User',
      email: 'user@gmail.com',
      phone: '+62812345678',
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=google`,
    };
    
    setUser(mockUser);
    localStorage.setItem('healthhub_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const loginWithPhone = async (phone: string, role: UserRole) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Phone User',
      email: `${phone}@healthhub.com`,
      phone,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
    };
    
    setUser(mockUser);
    localStorage.setItem('healthhub_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthhub_user');
    localStorage.removeItem('healthhub_remember_me');
    localStorage.removeItem('healthhub_last_role');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, loginWithPhone, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
