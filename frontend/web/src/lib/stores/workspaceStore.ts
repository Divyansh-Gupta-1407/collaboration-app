import { create } from 'zustand';
import { api } from '../api';

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
}

export interface Member {
  id: string;
  userId: string;
  email: string;
  role: string;
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  members: Member[];
  isLoading: boolean;
  fetchWorkspaces: () => Promise<void>;
  createWorkspace: (dto: { name: string }) => Promise<void>;
  setCurrentWorkspace: (id: string) => void;
  fetchMembers: (workspaceId: string) => Promise<void>;
  addMember: (workspaceId: string, email: string, role: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  members: [],
  isLoading: false,

  fetchWorkspaces: async () => {
    set({ isLoading: true });
    const res = await api.get<Workspace[]>('/workspaces');
    if (res.data) {
      set({ workspaces: res.data, isLoading: false });
      if (res.data.length > 0 && !get().currentWorkspace) {
        set({ currentWorkspace: res.data[0] });
      }
    } else {
      set({ isLoading: false });
    }
  },

  createWorkspace: async (dto) => {
    set({ isLoading: true });
    const res = await api.post<Workspace>('/workspaces', dto);
    if (res.data) {
      set((state) => ({ 
        workspaces: [...state.workspaces, res.data as Workspace],
        currentWorkspace: res.data,
        isLoading: false 
      }));
    } else {
      set({ isLoading: false });
      throw new Error(res.error);
    }
  },

  setCurrentWorkspace: (id) => {
    const workspace = get().workspaces.find(w => w.id === id);
    if (workspace) {
      set({ currentWorkspace: workspace });
    }
  },

  fetchMembers: async (workspaceId) => {
    set({ isLoading: true });
    const res = await api.get<Member[]>(`/workspaces/${workspaceId}/members`);
    if (res.data) {
      set({ members: res.data, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  addMember: async (workspaceId, email, role) => {
    set({ isLoading: true });
    const res = await api.post<Member>(`/workspaces/${workspaceId}/members`, { email, role });
    if (res.data) {
      set((state) => ({ members: [...state.members, res.data as Member], isLoading: false }));
    } else {
      set({ isLoading: false });
      throw new Error(res.error);
    }
  }
}));
