'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useWorkspaceStore } from '@/lib/stores/workspaceStore';
import { useDocumentStore } from '@/lib/stores/documentStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentWorkspace, workspaces, createWorkspace } = useWorkspaceStore();
  const { documents, createDocument } = useDocumentStore();
  
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;
    try {
      setIsSubmitting(true);
      await createWorkspace({ name: workspaceName });
      setIsWorkspaceModalOpen(false);
      setWorkspaceName('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateDocument = async () => {
    if (!currentWorkspace) return;
    try {
      // Mock call for now since store handles API request
      await createDocument({ title: 'Untitled Document', workspaceId: currentWorkspace.id });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-gray-400">Here&apos;s what&apos;s happening in your workspaces today.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsWorkspaceModalOpen(true)}>
              New Workspace
            </Button>
            <Button onClick={handleCreateDocument} disabled={!currentWorkspace}>
              New Document
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <h3 className="text-gray-400 font-medium mb-1">Total Documents</h3>
            <div className="text-4xl font-bold text-white">{documents.length}</div>
          </Card>
          <Card className="bg-gradient-to-br from-teal-500/10 to-transparent border-teal-500/20">
            <h3 className="text-gray-400 font-medium mb-1">Workspaces</h3>
            <div className="text-4xl font-bold text-white">{workspaces.length}</div>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
            <h3 className="text-gray-400 font-medium mb-1">Active Members</h3>
            <div className="text-4xl font-bold text-white">4</div>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Documents</h2>
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.slice(0, 6).map((doc) => (
                <Card 
                  key={doc.id} 
                  hoverable 
                  onClick={() => router.push(`/documents/${doc.id}`)}
                  className="group flex flex-col h-40"
                >
                  <div className="flex items-start justify-between mb-auto">
                    <svg className="w-8 h-8 text-purple-400 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white truncate">{doc.title || 'Untitled Document'}</h3>
                    <p className="text-xs text-gray-500 mt-1">Edited {new Date(doc.updatedAt || doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-xl p-12 text-center">
              <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No documents yet</h3>
              <p className="text-gray-500 mb-6">Create your first document to start collaborating.</p>
              <Button onClick={handleCreateDocument} disabled={!currentWorkspace}>
                Create Document
              </Button>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isWorkspaceModalOpen} onClose={() => setIsWorkspaceModalOpen(false)} title="Create Workspace">
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <Input
            label="Workspace Name"
            placeholder="e.g. Engineering Team"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsWorkspaceModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={!workspaceName.trim()}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
