import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { loginUser, registerUser, verifyOtp, loginAdmin, fetchUserMe } from '../lib/api';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

interface AuthContextType {
  currentUser: UserProfile | null;
  adminUser: AdminUser | null;
  isAdminMode: boolean;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  loginWithOtp: (payload: any) => Promise<void>;
  loginAsAdmin: (email: string, pass: string) => Promise<void>;
  loginDemoUser: (userIndex?: number) => Promise<void>;
  loginDemoAdmin: () => Promise<void>;
  logout: () => void;
  logoutAdmin: () => void;
  setIsAdminMode: (mode: boolean) => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('careerfit_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('careerfit_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('careerfit_mode') === 'admin';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('careerfit_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('careerfit_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('careerfit_admin', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('careerfit_admin');
    }
  }, [adminUser]);

  useEffect(() => {
    localStorage.setItem('careerfit_mode', isAdminMode ? 'admin' : 'user');
  }, [isAdminMode]);

  const login = async (identifier: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await loginUser(identifier, pass);
      setCurrentUser(data.user);
      setIsAdminMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await registerUser(data);
      setCurrentUser(res.user);
      setIsAdminMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOtp = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await verifyOtp(payload);
      setCurrentUser(res.user);
      setIsAdminMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await loginAdmin(email, pass);
      setAdminUser(res.admin);
      setIsAdminMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemoUser = async (userIndex: number = 0) => {
    setIsLoading(true);
    try {
      const demoEmails = [
        { email: 'priyanshukumar09430056@gmail.com', pass: 'careerfit123' },
        { email: 'ananya.sharma@example.com', pass: 'password123' },
        { email: 'rohan.mehta@example.com', pass: 'password123' }
      ];
      const target = demoEmails[userIndex] || demoEmails[0];
      const res = await loginUser(target.email, target.pass);
      setCurrentUser(res.user);
      setIsAdminMode(false);
    } catch (e) {
      // Fallback local demo profile
      const fallbackUser: UserProfile = {
        id: 'user-demo-1',
        name: 'Priyanshu Kumar',
        email: 'priyanshukumar09430056@gmail.com',
        phone: '+91 9876543210',
        education: 'B.Tech in Computer Science',
        graduationYear: '2025',
        role: 'user',
        status: 'active',
        currentDomain: 'Full Stack Development',
        careerGoal: 'Become a Lead Full Stack Engineer',
        experienceLevel: 'Fresher',
        createdAt: new Date().toISOString()
      };
      setCurrentUser(fallbackUser);
      setIsAdminMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemoAdmin = async () => {
    setIsLoading(true);
    try {
      const res = await loginAdmin('admin@careerfit.ai', 'admin123');
      setAdminUser(res.admin);
      setIsAdminMode(true);
    } catch (e) {
      const fallbackAdmin: AdminUser = {
        id: 'admin-1',
        email: 'admin@careerfit.ai',
        name: 'Chief Admin (CareerFit AI)',
        role: 'admin'
      };
      setAdminUser(fallbackAdmin);
      setIsAdminMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('careerfit_user');
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    setIsAdminMode(false);
    localStorage.removeItem('careerfit_admin');
  };

  const refreshUserProfile = async () => {
    if (!currentUser) return;
    try {
      const data = await fetchUserMe(currentUser.id);
      if (data.user) {
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.warn('Could not refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        adminUser,
        isAdminMode,
        isLoading,
        login,
        register,
        loginWithOtp,
        loginAsAdmin,
        loginDemoUser,
        loginDemoAdmin,
        logout,
        logoutAdmin,
        setIsAdminMode,
        refreshUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
