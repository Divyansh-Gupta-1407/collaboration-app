import React from 'react';
import { Editor as TiptapEditor } from '@tiptap/react';

interface ToolbarProps {
  editor: TiptapEditor | null;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const IconButton = ({ 
    isActive, 
    onClick, 
    icon,
    title
  }: { 
    isActive?: boolean, 
    onClick: () => void, 
    icon: string,
    title: string
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-purple-500/20 text-purple-400' 
          : 'text-gray-400 hover:bg-white/10 hover:text-gray-200'
      }`}
    >
      <span className="text-lg leading-none" dangerouslySetInnerHTML={{ __html: icon }} />
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-white/10 p-2 bg-[#0a0e1a]/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-1 pr-2 border-r border-white/10">
        <IconButton 
          title="Bold"
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon="<strong>B</strong>"
        />
        <IconButton 
          title="Italic"
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon="<em>I</em>"
        />
        <IconButton 
          title="Strike"
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon="<strike>S</strike>"
        />
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-white/10">
        <IconButton 
          title="Heading 1"
          isActive={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          icon="H1"
        />
        <IconButton 
          title="Heading 2"
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          icon="H2"
        />
        <IconButton 
          title="Heading 3"
          isActive={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          icon="H3"
        />
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-white/10">
        <IconButton 
          title="Bullet List"
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon="•="
        />
        <IconButton 
          title="Ordered List"
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon="1."
        />
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-white/10">
        <IconButton 
          title="Code Block"
          isActive={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          icon="&lt;/&gt;"
        />
        <IconButton 
          title="Blockquote"
          isActive={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon='"'
        />
        <IconButton 
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon="—"
        />
      </div>

      <div className="flex items-center gap-1 pl-2 ml-auto">
        <IconButton 
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          icon="↺"
        />
        <IconButton 
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          icon="↻"
        />
      </div>
    </div>
  );
};
