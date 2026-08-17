'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDocumentStore } from '@/lib/stores/documentStore';
import { Editor } from '@/components/editor/Editor';
import { PresenceAvatars } from '@/components/presence/PresenceAvatars';
import { CommentThread } from '@/components/comments/CommentThread';
import { Button } from '@/components/ui/Button';

export default function DocumentPage() {
  const params = useParams();
  const documentId = params.id as string;
  const { currentDocument, setCurrentDocument } = useDocumentStore();
  const [showComments, setShowComments] = useState(false);
  const [title, setTitle] = useState('Loading...');

  useEffect(() => {
    setCurrentDocument(documentId);
  }, [documentId, setCurrentDocument]);

  useEffect(() => {
    if (currentDocument) {
      setTitle(currentDocument.title || 'Untitled Document');
    }
  }, [currentDocument]);

  const mockUsers = [
    { id: '1', name: 'Alice Smith' },
    { id: '2', name: 'Bob Jones' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0e1a]">
      {/* Topbar */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 shrink-0 bg-[#0a0e1a]/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4 flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-white font-medium text-lg focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-2 py-1 -ml-2 w-full max-w-md transition-all hover:bg-white/5"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <PresenceAvatars users={mockUsers} />
          
          <div className="h-6 w-px bg-white/10"></div>
          
          <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className={showComments ? 'bg-white/10 text-white' : ''}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Comments
          </Button>
          <Button variant="primary" size="sm">
            Share
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden flex relative">
        <div className="flex-1 h-full overflow-hidden p-6 relative">
          <div className="max-w-[850px] mx-auto h-full">
            <Editor documentId={documentId} />
          </div>
        </div>

        {/* Comments Sidebar (Collapsible) */}
        {showComments && (
          <div className="animate-slide-up h-full" style={{ animation: 'none', animationName: 'none' }}>
            <CommentThread documentId={documentId} />
          </div>
        )}
      </div>
    </div>
  );
}
