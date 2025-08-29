// Notification Service
import { formatDisplayDate } from '@/utils/dateUtils';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
  metadata?: any;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  ideaValidationAlerts: boolean;
  taskReminders: boolean;
  teamUpdates: boolean;
  systemUpdates: boolean;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private readonly STORAGE_KEY = 'workspace_notifications';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          this.notifications = parsed.map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt)
          }));
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load notifications from storage:', error);
    }

    // Initialize with mock data if no stored data
    this.initializeWithMockData();
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notifications));
      }
    } catch (error) {
      console.error('Failed to save notifications to storage:', error);
    }
  }

  private initializeWithMockData() {
    // Mock notifications for demo
    this.notifications = [
      {
        id: '1',
        title: 'Idea Validation Complete',
        message: 'Your startup idea "AI-powered fitness app" has been validated with a score of 85/100.',
        type: 'success',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        actionUrl: '/workspace/idea-vault',
        actionText: 'View Results'
      },
      {
        id: '2',
        title: 'New AI Feature Available',
        message: 'Business Model Canvas generator is now available in your workspace.',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        actionUrl: '/workspace/business-model-canvas',
        actionText: 'Try Now'
      },
      {
        id: '3',
        title: 'Task Reminder',
        message: 'Don\'t forget to complete your market research task due today.',
        type: 'warning',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        actionUrl: '/workspace/task-planner',
        actionText: 'View Task'
      },
      {
        id: '4',
        title: 'Welcome to Builder Blueprint AI',
        message: 'Get started by validating your first startup idea in the Workshop.',
        type: 'info',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        actionUrl: '/workspace/workshop',
        actionText: 'Get Started'
      }
    ];
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return [...this.notifications].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get unread notifications
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.isRead);
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    this.saveToStorage();
    this.notifyListeners();
  }

  // Add new notification
  addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      isRead: false
    };
    
    this.notifications.unshift(newNotification);
    this.saveToStorage();
    this.notifyListeners();
  }

  // Remove notification
  removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveToStorage();
    this.notifyListeners();
  }

  // Clear all notifications
  clearAll(): void {
    this.notifications = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getNotifications()));
  }

  // Format time ago
  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return formatDisplayDate(date);
    }
  }

  // Simulate real-time notifications (for demo)
  simulateNotification(): void {
    const mockNotifications = [
      {
        title: 'AI Analysis Complete',
        message: 'Your market analysis has been completed successfully.',
        type: 'success' as const,
        actionUrl: '/workspace/ai-tools',
        actionText: 'View Analysis'
      },
      {
        title: 'New Team Member',
        message: 'John Doe has joined your team workspace.',
        type: 'info' as const,
        actionUrl: '/workspace/teamspace',
        actionText: 'View Team'
      },
      {
        title: 'Task Due Soon',
        message: 'Your MVP wireframes task is due in 2 hours.',
        type: 'warning' as const,
        actionUrl: '/workspace/task-planner',
        actionText: 'View Task'
      }
    ];

    const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
    this.addNotification(randomNotification);
  }
}

export const notificationService = new NotificationService();
