import { create } from 'zustand';
import { api } from '../api';

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    const res = await api.get<Notification[]>('/notifications');
    if (res.data) {
      set({ notifications: res.data, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    const res = await api.get<{count: number}>('/notifications/unread/count');
    if (res.data) {
      set({ unreadCount: res.data.count });
    }
  },

  markAsRead: async (id) => {
    await api.put(`/notifications/${id}/read`, {});
    set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));
  },

  markAllAsRead: async () => {
    await api.put('/notifications/read-all', {});
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }));
  }
}));
