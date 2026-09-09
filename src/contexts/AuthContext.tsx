
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'agent' | 'landlord' | 'admin';
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected';
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: User['role'];
  action: 'login' | 'register' | 'logout';
  timestamp: string;
}

interface AuthContextType {
  user: User | null;
  activityLogs: ActivityLog[];
  login: (email: string, password: string) => Promise<void>;
  loginAsAdmin: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterInput) => Promise<void>;
  registerAsAdmin: (userData: RegisterInput) => Promise<void>;
  logout: () => void;
  deleteAccount: (userId: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  role: User['role'];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const trackActivity = (userObj: User | null, action: ActivityLog['action']) => {
    if (!userObj) return;
    const newLog: ActivityLog = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      userId: userObj.id,
      userName: userObj.name,
      userEmail: userObj.email,
      userRole: userObj.role,
      action,
      timestamp: new Date().toISOString(),
    };
    
    setActivityLogs(prev => {
      const updated = [newLog, ...prev];
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem('admin_activity_logs', JSON.stringify(updated));
        } catch { /* ignore */ }
      }
      return updated;
    });
  };

  const getManagedUsers = () => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem('admin_managed_users');
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return [
      { id: '1', name: 'Current Admin', email: 'admin@example.com', role: 'admin', status: 'active' },
      { id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'agent', status: 'active' },
      { id: '3', name: 'Michael Smith', email: 'michael@example.com', role: 'buyer', status: 'active' },
    ];
  };

  const syncUserToAdminList = (userObj: User) => {
    if (typeof window === 'undefined') return;
    try {
      const users = getManagedUsers();
      
      // Prevent duplicates
      if (!users.some((u: any) => u.email === userObj.email)) {
        users.push({
          id: userObj.id,
          name: userObj.name,
          email: userObj.email,
          role: userObj.role,
          status: 'active'
        });
        window.localStorage.setItem('admin_managed_users', JSON.stringify(users));
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem('auth_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as User;
        const users = getManagedUsers();
        const existingUser = users.find((u: any) => u.email === parsedUser.email);
        
        if (!existingUser) {
          window.localStorage.removeItem('auth_user');
          setUser(null);
        } else if (existingUser.status === 'suspended') {
          window.localStorage.removeItem('auth_user');
          setUser(null);
        } else {
          setUser(parsedUser);
        }
      }
      
      const storedLogs = window.localStorage.getItem('admin_activity_logs');
      if (storedLogs) {
        setActivityLogs(JSON.parse(storedLogs) as ActivityLog[]);
      }
    } catch (error) {
      console.error('Failed to restore auth session or logs', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      void password;
      const emailLower = email.toLowerCase().trim();
      const isAdminLogin = emailLower === 'admin' && password === 'admin';
      const targetEmail = isAdminLogin ? 'admin@example.com' : emailLower;

      const users = getManagedUsers();
      const existingUser = users.find((u: any) => u.email.toLowerCase() === targetEmail);

      if (!existingUser && !isAdminLogin) {
        throw new Error('Account does not exist or has been deleted by an administrator.');
      }

      if (existingUser && existingUser.status === 'suspended') {
        throw new Error('Account has been suspended.');
      }

      const role: User['role'] = existingUser ? existingUser.role : 'admin';
      const name = existingUser ? existingUser.name : 'Admin User';
      const id = existingUser ? existingUser.id : '1';

      const mockUser: User = {
        id,
        email: existingUser ? existingUser.email : targetEmail,
        name,
        role,
        isVerified: true,
        kycStatus: 'approved'
      };
      setUser(mockUser);
      window.localStorage.setItem('auth_user', JSON.stringify(mockUser));
      trackActivity(mockUser, 'login');
    } catch (error: any) {
      console.error('Login failed', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = async (email: string, password: string) => {
    return login(email, password);
  };

  const register = async (userData: RegisterInput) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        phone: userData.phone,
        isVerified: false,
        kycStatus: 'pending'
      };
      // Removed auto-login. The user must manually log in.
      trackActivity(newUser, 'register');
      syncUserToAdminList(newUser);
    } catch (error) {
      console.error('Registration failed', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const registerAsAdmin = async (userData: RegisterInput) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: 'admin',
        phone: userData.phone,
        isVerified: true,
        kycStatus: 'approved'
      };
      // Removed auto-login.
      trackActivity(newUser, 'register');
      syncUserToAdminList(newUser);
    } catch (error) {
      console.error('Admin registration failed', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (user) {
      trackActivity(user, 'logout');
    }
    setUser(null);
    window.localStorage.removeItem('auth_user');
  };

  const deleteAccount = async (userId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (typeof window !== 'undefined') {
        const users = getManagedUsers();
        // Option 1: remove user completely
        // const updatedUsers = users.filter((u: any) => u.id !== userId);
        // Option 2: mark as deleted/suspended
        const updatedUsers = users.filter((u: any) => u.id !== userId);
        window.localStorage.setItem('admin_managed_users', JSON.stringify(updatedUsers));
        
        if (user && user.id === userId) {
          trackActivity(user, 'logout'); // Track a logout action for deletion
          setUser(null);
          window.localStorage.removeItem('auth_user');
        }
      }
    } catch (error) {
      console.error('Account deletion failed', error);
      throw new Error('Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('auth_user', JSON.stringify(updatedUser));
          
          // Also sync with admin_managed_users
          const users = getManagedUsers();
          const userIndex = users.findIndex((u: any) => u.id === updatedUser.id);
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            window.localStorage.setItem('admin_managed_users', JSON.stringify(users));
          }
        }
      }
    } catch (error) {
      console.error('Failed to update user', error);
      throw new Error('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, activityLogs, login, loginAsAdmin, register, registerAsAdmin, logout, deleteAccount, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};