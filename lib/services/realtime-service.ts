import { useState, useEffect, useCallback } from 'react';
import { Alert, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface RealtimeNotification {
  id: string;
  type: 'like' | 'save' | 'view' | 'match' | 'bridge_created';
  title: string;
  message: string;
  timestamp: Date;
  data?: any;
  read: boolean;
}

export interface LiveInteraction {
  type: 'like' | 'save' | 'view';
  targetId: string;
  targetType: 'snapshot' | 'bridge';
  userId: string;
  timestamp: Date;
}

class RealtimeService {
  private listeners: Set<(notification: RealtimeNotification) => void> = new Set();
  private interactionListeners: Set<(interaction: LiveInteraction) => void> = new Set();
  private notifications: RealtimeNotification[] = [];
  private isConnected = false;

  constructor() {
    this.startSimulation();
  }

  /**
   * Start simulating real-time interactions for demo purposes
   */
  private startSimulation() {
    this.isConnected = true;
    
    // Simulate random interactions every 3-8 seconds
    setInterval(() => {
      if (this.isConnected) {
        this.simulateRandomInteraction();
      }
    }, Math.random() * 5000 + 3000);

    // Simulate notifications every 10-20 seconds
    setInterval(() => {
      if (this.isConnected) {
        this.simulateRandomNotification();
      }
    }, Math.random() * 10000 + 10000);
  }

  /**
   * Simulate random interactions for demo
   */
  private simulateRandomInteraction() {
    const interactions: LiveInteraction[] = [
      {
        type: 'like',
        targetId: 'bridge_1',
        targetType: 'bridge',
        userId: 'demo_user_1',
        timestamp: new Date(),
      },
      {
        type: 'view',
        targetId: 'snapshot_2',
        targetType: 'snapshot',
        userId: 'demo_user_2',
        timestamp: new Date(),
      },
      {
        type: 'save',
        targetId: 'bridge_3',
        targetType: 'bridge',
        userId: 'demo_user_3',
        timestamp: new Date(),
      },
    ];

    const randomInteraction = interactions[Math.floor(Math.random() * interactions.length)];
    this.broadcastInteraction(randomInteraction);
  }

  /**
   * Simulate random notifications for demo
   */
  private simulateRandomNotification() {
    const notifications = [
      {
        type: 'like' as const,
        title: 'Someone liked your bridge!',
        message: 'Your cultural food exchange got a new like',
      },
      {
        type: 'match' as const,
        title: 'New bridge created!',
        message: 'You\'ve been matched with someone from Tokyo',
      },
      {
        type: 'view' as const,
        title: 'Your content is trending',
        message: 'Your music bridge has been viewed 15 times',
      },
      {
        type: 'bridge_created' as const,
        title: 'Bridge completed!',
        message: 'Your language exchange bridge is now live',
      },
    ];

    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    this.createNotification(randomNotification);
  }

  /**
   * Create a new notification
   */
  createNotification(notification: Omit<RealtimeNotification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: RealtimeNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(newNotification));

    // Show native notification
    this.showNativeNotification(newNotification);

    // Haptic feedback
    if (Haptics.notificationAsync) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  /**
   * Show native notification
   */
  private showNativeNotification(notification: RealtimeNotification) {
    // In a real app, you'd use a proper push notification service
    // For demo purposes, we'll show an alert
    if (__DEV__) {
      console.log('📱 Notification:', notification.title, notification.message);
    }
  }

  /**
   * Broadcast live interaction
   */
  broadcastInteraction(interaction: LiveInteraction) {
    this.interactionListeners.forEach(listener => listener(interaction));
  }

  /**
   * Subscribe to notifications
   */
  subscribeToNotifications(callback: (notification: RealtimeNotification) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Subscribe to live interactions
   */
  subscribeToInteractions(callback: (interaction: LiveInteraction) => void) {
    this.interactionListeners.add(callback);
    return () => this.interactionListeners.delete(callback);
  }

  /**
   * Get all notifications
   */
  getNotifications(): RealtimeNotification[] {
    return [...this.notifications];
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  /**
   * Simulate user action (for demo)
   */
  simulateUserAction(type: 'like' | 'save' | 'view', targetId: string, targetType: 'snapshot' | 'bridge') {
    const interaction: LiveInteraction = {
      type,
      targetId,
      targetType,
      userId: 'current_user',
      timestamp: new Date(),
    };

    this.broadcastInteraction(interaction);

    // Haptic feedback
    if (Haptics.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  /**
   * Disconnect from real-time updates
   */
  disconnect() {
    this.isConnected = false;
  }
}

// Singleton instance
export const realtimeService = new RealtimeService();

// React hooks for easy integration
export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Get initial notifications
    setNotifications(realtimeService.getNotifications());
    setUnreadCount(realtimeService.getUnreadCount());

    // Subscribe to new notifications
    const unsubscribe = realtimeService.subscribeToNotifications((notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return unsubscribe;
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    realtimeService.markAsRead(notificationId);
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    realtimeService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}

export function useLiveInteractions() {
  const [interactions, setInteractions] = useState<LiveInteraction[]>([]);

  useEffect(() => {
    const unsubscribe = realtimeService.subscribeToInteractions((interaction) => {
      setInteractions(prev => [interaction, ...prev.slice(0, 19)]); // Keep last 20
    });

    return unsubscribe;
  }, []);

  return interactions;
}

export function useRealtimeCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const unsubscribe = realtimeService.subscribeToInteractions((interaction) => {
      setCounts(prev => ({
        ...prev,
        [interaction.targetId]: (prev[interaction.targetId] || 0) + 1,
      }));
    });

    return unsubscribe;
  }, []);

  const updateCount = useCallback((targetId: string, delta: number) => {
    setCounts(prev => ({
      ...prev,
      [targetId]: Math.max(0, (prev[targetId] || 0) + delta),
    }));
  }, []);

  return { counts, updateCount };
}
