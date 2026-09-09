import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  type: 'payment' | 'property' | 'system' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  targetRole?: 'all' | 'admin' | 'user'; // Audience target
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialize with some mock data if user is present
  useEffect(() => {
    if (user && notifications.length === 0) {
      const adminNotifications: Notification[] = [
        {
          id: 'admin_1',
          type: 'payment',
          title: 'Large Payment Processed',
          message: 'A payment of $25,000 has been successfully processed for the sale of the Victoria Island property. The funds have been cleared into the escrow account and are pending final disbursement.',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          read: false,
          actionUrl: '/admin/payments'
        },
        {
          id: 'admin_2',
          type: 'system',
          title: 'Security Alert: Suspicious Login Attempt',
          message: 'Multiple failed login attempts detected from IP address 192.168.1.45 targeting the administrator portal. The IP has been temporarily blocked for 30 minutes in accordance with our security policy.',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          read: false,
          actionUrl: '/admin/security'
        },
        {
          id: 'admin_3',
          type: 'message',
          title: 'Confidential Client Dispute',
          message: 'A high-priority dispute has been opened by Client #8492 regarding the property boundary lines at the Lekki Phase 1 estate. Legal counsel review is required before proceeding.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          read: false,
          actionUrl: '/admin/disputes'
        }
      ];

      const userNotifications: Notification[] = [
        {
          id: 'user_1',
          type: 'system',
          title: 'Scheduled System Maintenance',
          message: 'The scheduled system maintenance has been completed successfully. We have introduced several new features to improve your experience, including enhanced notification management, improved property listing views, and faster payment processing times. Thank you for your patience.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          read: false,
          targetRole: 'user'
        },
        {
          id: 'user_2',
          type: 'property',
          title: 'New Properties in Your Area',
          message: 'We have just added 5 new premium properties in your preferred area of interest. Check out the latest listings to find your next dream home or investment opportunity.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          read: false,
          actionUrl: '/properties',
          targetRole: 'user'
        },
        {
          id: 'user_3',
          type: 'message',
          title: 'Service Upgrade Included!',
          message: 'Good news! Your basic tier plan has been upgraded with our new faster customer support response times—at no additional cost to you. Enjoy priority handling for all your future inquiries.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          read: false,
          targetRole: 'user'
        }
      ];

      // Retrieve custom broadcasted notifications from local storage
      let customNotifications: Notification[] = [];
      try {
        const stored = window.localStorage.getItem('custom_notifications');
        if (stored) {
          customNotifications = JSON.parse(stored) as Notification[];
        }
      } catch (e) {
        console.error('Failed to parse custom notifications', e);
      }

      // Filter local storage notifications applicable to the current user's role
      const applicableCustoms = customNotifications.filter(n => {
        if (!n.targetRole || n.targetRole === 'all') return true;
        if (n.targetRole === 'admin' && user.role === 'admin') return true;
        if (n.targetRole === 'user' && user.role !== 'admin') return true;
        return false;
      });

      const baseNotifications = user.role === 'admin' ? adminNotifications : userNotifications;
      
      // Combine custom ones with base mocks, sort by timestamp
      const combined = [...applicableCustoms, ...baseNotifications].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(combined);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notifData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notifData,
      id: `custom_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Save to local storage for persistence across users
    try {
      const stored = window.localStorage.getItem('custom_notifications');
      const existing = stored ? JSON.parse(stored) : [];
      window.localStorage.setItem('custom_notifications', JSON.stringify([newNotif, ...existing]));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }

    // Immediately add if it applies to current user (admin sees everything they send, or if it matches their own role logic)
    if (!newNotif.targetRole || newNotif.targetRole === 'all' || 
        (newNotif.targetRole === 'admin' && user?.role === 'admin') || 
        (newNotif.targetRole === 'user' && user?.role !== 'admin')) {
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
