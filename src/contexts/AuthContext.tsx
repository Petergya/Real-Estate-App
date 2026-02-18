// import React, { createContext, useContext, useState, useEffect } from 'react';

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: 'buyer' | 'agent' | 'landlord' | 'admin';
//   phone?: string;
//   avatar?: string;
//   isVerified: boolean;
//   kycStatus: 'pending' | 'approved' | 'rejected';
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (userData: any) => Promise<void>;
//   logout: () => void;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check for stored user session
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       const mockUser: User = {
//         id: '1',
//         email,
//         name: 'John Doe',
//         role: 'buyer',
//         isVerified: true,
//         kycStatus: 'approved'
//       };
      
//       setUser(mockUser);
//       localStorage.setItem('user', JSON.stringify(mockUser));
//     } catch (error) {
//       throw new Error('Login failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (userData: any) => {
//     setIsLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       const newUser: User = {
//         id: Date.now().toString(),
//         email: userData.email,
//         name: userData.name,
//         role: userData.role,
//         phone: userData.phone,
//         isVerified: false,
//         kycStatus: 'pending'
//       };
      
//       setUser(newUser);
//       localStorage.setItem('user', JSON.stringify(newUser));
//     } catch (error) {
//       throw new Error('Registration failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



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

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterInput) => Promise<void>;
  logout: () => void;
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

  useEffect(() => {
    // Simulate checking for stored user session
    // In a real app, this would check localStorage/sessionStorage or make an API call
    // For now, we'll just set loading to false after a brief delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Use password to satisfy lint rules in this mock implementation
      void password;
      
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        role: 'buyer',
        isVerified: true,
        kycStatus: 'approved'
      };
      
      setUser(mockUser);
      // Note: In a real app, you would store this in localStorage here
      // localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Login failed', error);
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterInput) => {
    setIsLoading(true);
    try {
      // Simulate API call
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
      
      setUser(newUser);
      // Note: In a real app, you would store this in localStorage here
      // localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Registration failed', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Note: In a real app, you would remove from localStorage here
    // localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};