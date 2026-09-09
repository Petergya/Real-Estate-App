import React, { useState } from 'react';
import { Bell, X, Check, AlertCircle, DollarSign, Home, Users } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="h-5 w-5 text-gold" />;
      case 'property':
        return <Home className="h-5 w-5 text-gold" />;
      case 'message':
        return <Users className="h-5 w-5 text-purple-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
    }
  };

  // You can keep the user check inside but we want the bell icon visible to everyone now
  // if (!user) return null;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-ink transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-ink">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-gold hover:text-secondary"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-light/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notification.read ? 'text-ink' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </p>
                              <div className="mt-1">
                                <p className={`text-sm text-gray-600 transition-all ${
                                  expandedId !== notification.id ? 'line-clamp-2' : ''
                                }`}>
                                  {notification.message}
                                </p>
                                {notification.message.length > 80 && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedId(expandedId === notification.id ? null : notification.id);
                                    }}
                                    className="text-xs text-gold font-medium hover:text-navy transition-colors mt-1 focus:outline-none"
                                  >
                                    {expandedId === notification.id ? 'Show less' : 'Read more'}
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-gold hover:text-secondary p-1"
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-gray-400 hover:text-red-600 p-1"
                                title="Delete notification"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Removed actionUrl button as requested */}
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to full notifications page
                    console.log('Navigate to notifications page');
                  }}
                  className="text-sm text-gold hover:text-secondary"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;