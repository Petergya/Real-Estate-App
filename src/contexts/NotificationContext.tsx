import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { db, functions } from '../lib/firebase';

export interface Notification {
  id: string;
  type: 'payment' | 'property' | 'system' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  targetRole?: 'all' | 'admin' | 'user';
  recipientId: string;
}

type NewNotification = Omit<Notification, 'id' | 'timestamp' | 'read' | 'recipientId'>;

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: NewNotification) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!db || !user) {
      setNotifications([]);
      return;
    }

    return onSnapshot(
      query(collection(db, 'notifications'), where('recipientId', '==', user.id)),
      (snapshot) => {
        const items = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }) as Notification);
        items.sort((left, right) => right.timestamp.localeCompare(left.timestamp));
        setNotifications(items);
      },
      (error) => {
        console.error('Unable to load notifications', error);
        toast.error('Notifications could not be loaded.');
      },
    );
  }, [user]);

  const addNotification = async (notification: NewNotification) => {
    if (!functions) throw new Error('Firebase Functions are not configured.');
    const broadcast = httpsCallable(functions, 'broadcastNotification');
    await broadcast(notification);
  };

  const markAsRead = async (id: string) => {
    if (!db || !user) return;
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      console.error('Unable to mark notification as read', error);
      toast.error('Could not update this notification.');
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((notification) => !notification.read);
    const results = await Promise.allSettled(unread.map((notification) => markAsRead(notification.id)));
    if (results.some((result) => result.status === 'rejected')) {
      toast.error('Some notifications could not be updated.');
    }
  };

  const deleteNotification = async (id: string) => {
    if (!db || !user) return;
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      console.error('Unable to delete notification', error);
      toast.error('Could not delete this notification.');
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount: notifications.filter((notification) => !notification.read).length,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
