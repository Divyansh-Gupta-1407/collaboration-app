'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useWorkspaceStore } from '@/lib/stores/workspaceStore';
import { useDocumentStore } from '@/lib/stores/documentStore';

export const DocumentTree = () => {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;
  const { currentWorkspace } = useWorkspaceStore();
  const { documents, fetchDocuments, createDocument } = useDocumentStore();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      fetchDocuments(currentWorkspace.id);
    }
  }, [currentWorkspace, fetchDocuments]);

  const handleCreateNew = async () => {
    if (!currentWorkspace) return;
    try {
      setIsCreating(true);
      // For now using mock function call since createDocument expects title & workspaceId
      await createDocument({ title: 'Untitled Document', workspaceId: currentWorkspace.id });
    } catch (e) {
      console.error('Failed to create doc', e);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col h-full text-sm">
      <div className="flex items-center justify-between px-4 py-2 group">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Documents</span>
        <button 
          onClick={handleCreateNew}
          disabled={isCreating}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => router.push(`/documents/${doc.id}`)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-left truncate ${
              documentId === doc.id 
                ? 'bg-white/10 text-white font-medium' 
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <svg className="w-4 h-4 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="truncate">{doc.title || 'Untitled Document'}</span>
          </button>
        ))}
        {documents.length === 0 && (
          <div className="px-4 py-3 text-gray-500 text-xs italic">
            No documents yet.
          </div>
        )}
      </div>
    </div>
  );
};
