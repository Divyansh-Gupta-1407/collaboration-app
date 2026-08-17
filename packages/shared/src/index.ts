// =============================================
// Shared Types — Collab Platform
// =============================================

// ─── User ─────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─── Workspace ────────────────────────────────
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  icon?: string;
}

// ─── Workspace Member ─────────────────────────
export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: Role;
  joinedAt: string;
  user?: User;
}

export type Role = 'owner' | 'admin' | 'editor' | 'commenter' | 'viewer';

// ─── Document ─────────────────────────────────
export interface Document {
  id: string;
  workspaceId: string;
  title: string;
  content: Record<string, unknown>;
  contentText: string;
  docType: DocType;
  createdBy: string;
  parentId?: string;
  icon: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DocType = 'document' | 'whiteboard' | 'code' | 'task_board';

export interface CreateDocumentDto {
  workspaceId: string;
  title?: string;
  docType?: DocType;
  parentId?: string;
  icon?: string;
}

export interface UpdateDocumentDto {
  title?: string;
  content?: Record<string, unknown>;
  contentText?: string;
  icon?: string;
  isArchived?: boolean;
}

// ─── Document Permission ──────────────────────
export interface DocumentPermission {
  id: string;
  documentId: string;
  userId: string;
  role: Role;
  grantedAt: string;
}

// ─── Document Version ─────────────────────────
export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  title: string;
  content: Record<string, unknown>;
  contentText: string;
  createdBy: string;
  changeSummary?: string;
  parentVersionId?: string;
  createdAt: string;
}

// ─── Comment ──────────────────────────────────
export interface Comment {
  id: string;
  documentId: string;
  authorId: string;
  parentCommentId?: string;
  content: string;
  selectionRange?: SelectionRange;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
  author?: User;
  replies?: Comment[];
}

export interface SelectionRange {
  from: number;
  to: number;
  text?: string;
}

export interface CreateCommentDto {
  documentId: string;
  content: string;
  parentCommentId?: string;
  selectionRange?: SelectionRange;
}

// ─── Notification ─────────────────────────────
export interface Notification {
  id: string;
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  body?: string;
  resourceType?: string;
  resourceId?: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
}

export type NotificationType = 'mention' | 'comment' | 'share' | 'update' | 'system';

// ─── Attachment ───────────────────────────────
export interface Attachment {
  id: string;
  documentId: string;
  uploadedBy: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageKey: string;
  createdAt: string;
}

// ─── Collaboration / Presence ─────────────────
export interface PresenceInfo {
  userId: string;
  userName: string;
  avatarUrl?: string;
  color: string;
  cursor?: CursorPosition;
  lastSeen: number;
}

export interface CursorPosition {
  anchor: number;
  head: number;
}

// ─── WebSocket Messages ───────────────────────
export type WSMessageType =
  | 'sync'
  | 'awareness'
  | 'cursor_update'
  | 'presence_join'
  | 'presence_leave'
  | 'document_update'
  | 'comment_added'
  | 'error';

export interface WSMessage {
  type: WSMessageType;
  documentId: string;
  userId?: string;
  payload: unknown;
  timestamp: number;
}

// ─── Kafka Events ─────────────────────────────
export type KafkaEventType =
  | 'document.created'
  | 'document.updated'
  | 'document.deleted'
  | 'document.archived'
  | 'comment.created'
  | 'comment.resolved'
  | 'user.mentioned'
  | 'workspace.member_added'
  | 'workspace.member_removed'
  | 'version.created';

export interface KafkaEvent<T = unknown> {
  eventId: string;
  type: KafkaEventType;
  timestamp: string;
  source: string;
  data: T;
}

// ─── Search ───────────────────────────────────
export interface SearchResult {
  id: string;
  type: 'document' | 'comment' | 'workspace';
  title: string;
  snippet: string;
  workspaceId?: string;
  documentId?: string;
  score: number;
  highlights: string[];
}

export interface SearchQuery {
  query: string;
  workspaceId?: string;
  docType?: DocType;
  page?: number;
  limit?: number;
}

// ─── API Response ─────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Analytics ────────────────────────────────
export interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  workspaceId?: string;
  documentId?: string;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsSummary {
  activeUsers: number;
  documentsEdited: number;
  collaborationSessions: number;
  averageLatencyMs: number;
  topWorkspaces: { workspaceId: string; name: string; editCount: number }[];
}
