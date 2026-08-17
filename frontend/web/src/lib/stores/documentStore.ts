import { create } from 'zustand';
import { api } from '../api';

export interface Document {
  id: string;
  title: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Version {
  id: string;
  documentId: string;
  createdAt: string;
  createdBy: string;
}

export interface Comment {
  id: string;
  documentId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  versions: Version[];
  comments: Comment[];
  isLoading: boolean;
  fetchDocuments: (workspaceId: string) => Promise<void>;
  createDocument: (dto: { title: string; workspaceId: string }) => Promise<void>;
  setCurrentDocument: (id: string) => void;
  fetchVersions: (docId: string) => Promise<void>;
  fetchComments: (docId: string) => Promise<void>;
  createComment: (dto: { documentId: string; content: string }) => Promise<void>;
  restoreVersion: (docId: string, versionId: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  currentDocument: null,
  versions: [],
  comments: [],
  isLoading: false,

  fetchDocuments: async (workspaceId) => {
    set({ isLoading: true });
    const res = await api.get<Document[]>(`/workspaces/${workspaceId}/documents`);
    if (res.data) {
      set({ documents: res.data, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  createDocument: async (dto) => {
    set({ isLoading: true });
    const res = await api.post<Document>('/documents', dto);
    if (res.data) {
      set((state) => ({ documents: [...state.documents, res.data as Document], isLoading: false }));
    } else {
      set({ isLoading: false });
      throw new Error(res.error);
    }
  },

  setCurrentDocument: (id) => {
    const doc = get().documents.find(d => d.id === id);
    if (doc) {
      set({ currentDocument: doc });
    } else {
      // Mock for when loaded directly
      set({ currentDocument: { id, title: 'Untitled Document', workspaceId: '1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } });
    }
  },

  fetchVersions: async (docId) => {
    set({ isLoading: true });
    const res = await api.get<Version[]>(`/documents/${docId}/versions`);
    if (res.data) {
      set({ versions: res.data, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  fetchComments: async (docId) => {
    set({ isLoading: true });
    const res = await api.get<Comment[]>(`/documents/${docId}/comments`);
    if (res.data) {
      set({ comments: res.data, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  createComment: async (dto) => {
    set({ isLoading: true });
    const res = await api.post<Comment>(`/documents/${dto.documentId}/comments`, { content: dto.content });
    if (res.data) {
      set((state) => ({ comments: [...state.comments, res.data as Comment], isLoading: false }));
    } else {
      set({ isLoading: false });
      throw new Error(res.error);
    }
  },

  restoreVersion: async (docId, versionId) => {
    set({ isLoading: true });
    const res = await api.post(`/documents/${docId}/versions/${versionId}/restore`, {});
    if (res.status === 200) {
      set({ isLoading: false });
    } else {
      set({ isLoading: false });
      throw new Error(res.error);
    }
  }
}));
