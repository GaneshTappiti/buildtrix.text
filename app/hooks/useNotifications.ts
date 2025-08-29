import { useState, useEffect } from 'react';
import { notificationService, Notification } from '@/services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initial load
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());

    // Subscribe to changes
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
      setUnreadCount(notificationService.getUnreadCount());
    });

    return unsubscribe;
  }, []);

  const markAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const removeNotification = (notificationId: string) => {
    notificationService.removeNotification(notificationId);
  };

  const clearAll = () => {
    notificationService.clearAll();
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    notificationService.addNotification(notification);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    addNotification,
    formatTimeAgo: notificationService.formatTimeAgo.bind(notificationService)
  };
};
