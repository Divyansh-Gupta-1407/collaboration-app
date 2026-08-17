'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
// Real-time collab extensions to be enabled later with Yjs
// import Collaboration from '@tiptap/extension-collaboration';
// import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { Toolbar } from './Toolbar';
import { useAuthStore } from '@/lib/stores/authStore';

interface EditorProps {
  documentId: string;
  initialContent?: string;
}

export const Editor: React.FC<EditorProps> = ({ documentId, initialContent = '' }) => {
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // history is enabled by default
      }),
      Placeholder.configure({
        placeholder: 'Start writing... Type / for commands',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none px-8 py-6',
      },
    },
    onUpdate: ({ editor }) => {
      // Handle local saves here if needed
      // const html = editor.getHTML();
    },
  });

  if (!isMounted) {
    return <div className="h-full flex items-center justify-center text-gray-500">Loading editor...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0e1a] rounded-lg overflow-hidden border border-white/10 shadow-xl">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="min-h-full h-full" />
      </div>
    </div>
  );
};
