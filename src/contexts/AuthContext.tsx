import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from '../lib/firebase';

type UserRole = 'buyer' | 'agent' | 'landlord' | 'admin';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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
  userRole: UserRole;
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
  sendPasswordReset: (email: string) => Promise<void>;
  isLoading: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  password?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const getUserFromFirebase = async (firebaseUser: FirebaseUser): Promise<User> => {
  if (!db) throw new Error('Firebase is not configured.');
  const [profile, token] = await Promise.all([
    getDoc(doc(db, 'users', firebaseUser.uid)),
    firebaseUser.getIdTokenResult(),
  ]);
  const profileData = profile.data();
  const isAdmin = token.claims.admin === true;
  const role = profileData?.role;
  const validRole: UserRole = isAdmin ? 'admin' : role === 'agent' || role === 'landlord' ? role : 'buyer';
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: profileData?.name || firebaseUser.displayName || '',
    role: validRole,
    phone: profileData?.phone || firebaseUser.phoneNumber || undefined,
    avatar: profileData?.avatar || firebaseUser.photoURL || undefined,
    isVerified: firebaseUser.emailVerified,
    kycStatus: profileData?.kycStatus === 'approved' || profileData?.kycStatus === 'rejected'
      ? profileData.kycStatus
      : 'pending',
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const firestore = db;
    if (!auth || !firestore) {
      setIsLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setActivityLogs([]);
          return;
        }

        const authenticatedUser = await getUserFromFirebase(firebaseUser);
        setUser(authenticatedUser);

        const logs = await getDoc(doc(firestore, 'userActivity', firebaseUser.uid));
        const storedLogs = logs.data()?.entries;
        setActivityLogs(Array.isArray(storedLogs) ? storedLogs as ActivityLog[] : []);
      } catch (error) {
        console.error('Unable to load Firebase user profile', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }, (error) => {
      console.error('Firebase authentication listener failed', error);
      setUser(null);
      setIsLoading(false);
    });
  }, []);

  const trackActivity = async (userObj: User, action: ActivityLog['action']) => {
    if (!db) return;
    const log: ActivityLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      userId: userObj.id,
      userName: userObj.name,
      userEmail: userObj.email,
      userRole: userObj.role,
      action,
      timestamp: new Date().toISOString(),
    };
    const nextLogs = [log, ...activityLogs].slice(0, 100);
    await setDoc(doc(db, 'userActivity', userObj.id), {
      userId: userObj.id,
      entries: nextLogs,
      updatedAt: serverTimestamp(),
    });
    setActivityLogs(nextLogs);
  };

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase is not configured. Add your Firebase web app settings to .env.');
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    const authenticatedUser = await getUserFromFirebase(result.user);
    if (!result.user.emailVerified) {
      await signOut(auth);
      throw new Error('Verify your email address before signing in. Check your inbox for the verification link.');
    }
    setUser(authenticatedUser);
    await trackActivity(authenticatedUser, 'login');
  };

  const loginAsAdmin = async (email: string, password: string) => {
    await login(email, password);
    const token = await auth?.currentUser?.getIdTokenResult(true);
    if (token?.claims.admin !== true) {
      await signOut(auth!);
      throw new Error('This Firebase account is not authorized as an administrator.');
    }
  };

  const register = async (userData: RegisterInput) => {
    if (!auth || !db) throw new Error('Firebase is not configured. Add your Firebase web app settings to .env.');
    if (!userData.password) throw new Error('A password is required.');
    if (!['buyer', 'agent', 'landlord'].includes(userData.role)) throw new Error('Invalid account role.');
    const credential = await createUserWithEmailAndPassword(auth, userData.email.trim(), userData.password);
    try {
      await updateProfile(credential.user, { displayName: userData.name.trim() });
      await setDoc(doc(db, 'users', credential.user.uid), {
        name: userData.name.trim(),
        email: credential.user.email,
        phone: userData.phone?.trim() || '',
        role: userData.role,
        isVerified: false,
        kycStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await sendEmailVerification(credential.user);
    } catch (error) {
      await deleteDoc(doc(db, 'users', credential.user.uid)).catch((cleanupError) => {
        console.error('Could not remove incomplete user profile', cleanupError);
      });
      await deleteUser(credential.user);
      throw error;
    }
    await signOut(auth);
  };

  const registerAsAdmin = async () => {
    throw new Error('Admin accounts must be provisioned by an authorized Firebase administrator.');
  };

  const logout = () => {
    if (!auth) return;
    void signOut(auth).catch((error) => console.error('Firebase sign-out failed', error));
  };

  const deleteAccount = async (userId: string) => {
    if (!auth?.currentUser || auth.currentUser.uid !== userId) {
      throw new Error('You can only delete your own account.');
    }
    if (!functions) throw new Error('Firebase Functions are not configured.');
    const deleteMyAccountCall = httpsCallable(functions, 'deleteMyAccount');
    await deleteMyAccountCall();
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!auth?.currentUser || !db || !user) throw new Error('Sign in before updating your profile.');
    const allowedUpdates = {
      ...(updates.name !== undefined ? { name: updates.name.trim() } : {}),
      ...(updates.phone !== undefined ? { phone: updates.phone.trim() } : {}),
      ...(updates.avatar !== undefined ? { avatar: updates.avatar } : {}),
    };
    if (Object.keys(allowedUpdates).length === 0) return;
    await updateDoc(doc(db, 'users', user.id), { ...allowedUpdates, updatedAt: serverTimestamp() });
    if (allowedUpdates.name) await updateProfile(auth.currentUser, { displayName: allowedUpdates.name });
    setUser({ ...user, ...allowedUpdates });
  };

  const sendPasswordReset = async (email: string) => {
    if (!auth) throw new Error('Firebase is not configured.');
    await sendPasswordResetEmail(auth, email.trim());
  };

  return (
    <AuthContext.Provider value={{
      user,
      activityLogs,
      login,
      loginAsAdmin,
      register,
      registerAsAdmin,
      logout,
      deleteAccount,
      updateUser,
      sendPasswordReset,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
