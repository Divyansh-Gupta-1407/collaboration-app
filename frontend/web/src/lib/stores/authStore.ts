import { create } from 'zustand';
import { api } from '../api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    set({ isLoading: true });
    const res = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    if (res.data) {
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, token: res.data.token, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
      throw new Error(res.error);
    }
  },

  register: async (email, name, password) => {
    set({ isLoading: true });
    const res = await api.post<{ token: string; user: User }>('/auth/register', { email, name, password });
    if (res.data) {
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, token: res.data.token, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
      throw new Error(res.error);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    set({ isLoading: true });
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    const res = await api.get<User>('/auth/me');
    if (res.data) {
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } else {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
