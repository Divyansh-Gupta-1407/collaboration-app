'use client';

import React, { useState, useEffect } from 'react';
import { useDocumentStore, Comment } from '@/lib/stores/documentStore';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export const CommentThread = ({ documentId }: { documentId: string }) => {
  const { comments, fetchComments, createComment } = useDocumentStore();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments(documentId);
  }, [documentId, fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      await createComment({ documentId, content: newComment });
      setNewComment('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Just now' : d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-[#111827]/80 backdrop-blur-md border-l border-white/10 w-80 shrink-0">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold text-gray-200">Comments</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.length === 0 ? (
          <div className="text-center text-sm text-gray-500 mt-10">
            No comments yet. Start the conversation!
          </div>
        ) : (
          comments.map((comment, i) => (
            <div key={comment.id || i} className="flex gap-3 animate-fade-in">
              <Avatar name={comment.authorName || 'User'} size="sm" />
              <div className="flex-1 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-gray-200">{comment.authorName || 'User'}</span>
                  <span className="text-xs text-gray-500">
                    {comment.createdAt ? formatDate(comment.createdAt) : 'Just now'}
                  </span>
                </div>
                <div className="text-sm text-gray-300 bg-black/20 p-2.5 rounded-lg rounded-tl-none border border-white/5">
                  {comment.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-[#0a0e1a]/50">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!newComment.trim() || isSubmitting} isLoading={isSubmitting}>
              Comment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
