'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useWorkspaceStore } from '@/lib/stores/workspaceStore';
import { DocumentTree } from './DocumentTree';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { useNotificationStore } from '@/lib/stores/notificationStore';

export const Sidebar = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { workspaces, currentWorkspace, fetchWorkspaces, setCurrentWorkspace } = useWorkspaceStore();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    fetchWorkspaces();
    fetchUnreadCount();
  }, [fetchWorkspaces, fetchUnreadCount]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="w-[280px] h-screen glass-panel flex flex-col border-r border-white/10 shrink-0 select-none">
      {/* User & Workspace Section */}
      <div className="p-4 border-b border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name || 'User'} size="sm" isOnline />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        <select 
          className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none cursor-pointer"
          value={currentWorkspace?.id || ''}
          onChange={(e) => setCurrentWorkspace(e.target.value)}
        >
          {workspaces.map(w => (
            <option key={w.id} value={w.id} className="bg-[#111827]">{w.name}</option>
          ))}
          {workspaces.length === 0 && <option value="" disabled>No workspaces</option>}
        </select>
      </div>

      {/* Main Navigation */}
      <div className="py-2 px-2">
        <button 
          onClick={() => router.push('/dashboard')}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard Home
        </button>
      </div>

      {/* Document Tree */}
      <div className="flex-1 overflow-hidden">
        <DocumentTree />
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Notifications
          </div>
          {unreadCount > 0 && <Badge variant="primary">{unreadCount}</Badge>}
        </button>
        <button 
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 3a1 1 0 011 1v5.274c0 .265.105.52.293.707l2.121 2.122a1 1 0 01.293.707V15a1 1 0 01-1 1h-5a1 1 0 01-1-1v-2.192a1 1 0 01.293-.707l2.121-2.122A1 1 0 0010 9.274V4a1 1 0 011-1z" />
          </svg>
          Settings
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm mt-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};
