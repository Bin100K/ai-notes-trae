import { useState, useEffect } from 'react';
import { ArrowLeft, Hash, Save, Wand2, X } from 'lucide-react';
import type { Note } from '../types';
import { mockCategories, mockTags } from '../data/mockData';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Note) => void;
  onCancel: () => void;
  isMobile: boolean;
}

export default function NoteEditor({ note, onSave, onCancel, isMobile }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('技术学习');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setTags(note.tags);
    } else {
      setTitle('');
      setContent('');
      setCategory('技术学习');
      setTags([]);
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    const now = new Date().toISOString();
    onSave({
      id: note?.id || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      tags,
      category,
      createdAt: note?.createdAt || now,
      updatedAt: now,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const generateTags = () => {
    setIsGeneratingTags(true);
    setTimeout(() => {
      const contentLower = content.toLowerCase();
      const suggested = mockTags.filter(
        (t) => contentLower.includes(t.toLowerCase()) && !tags.includes(t)
      );
      if (suggested.length > 0) {
        setTags([...tags, ...suggested.slice(0, 3)]);
      }
      setIsGeneratingTags(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-[var(--color-rule)]">
        {isMobile && (
          <button
            onClick={onCancel}
            className="p-2 -ml-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-muted)]" />
          </button>
        )}
        <h2 className="font-semibold text-[var(--color-ink)]">
          {note ? '编辑笔记' : '新建笔记'}
        </h2>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {!isMobile && (
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] transition-colors"
            >
              <X className="w-4 h-4" />
              取消
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white hover:shadow-md hover:shadow-[var(--color-primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        {/* Title */}
        <input
          type="text"
          placeholder="笔记标题..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl md:text-2xl font-semibold bg-transparent border-none outline-none placeholder:text-[var(--color-muted)]/50 mb-4"
        />

        {/* Category */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-[var(--color-muted)]">分类：</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-2)] text-sm border-none outline-none cursor-pointer"
          >
            {mockCategories.filter((c) => c !== '全部').map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-[var(--color-muted)]">标签：</span>
            <button
              onClick={generateTags}
              disabled={isGeneratingTags || !content.trim()}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 disabled:opacity-50 transition-colors"
            >
              <Wand2 className="w-3 h-3" />
              {isGeneratingTags ? '生成中...' : 'AI 生成标签'}
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg text-xs"
              >
                <Hash className="w-3 h-3" />
                {tag}
                <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="添加标签..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-surface-2)] text-sm border border-transparent focus:border-[var(--color-primary)] focus:outline-none"
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-2 rounded-lg bg-[var(--color-surface-2)] text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              添加
            </button>
          </div>
        </div>

        {/* Content */}
        <textarea
          placeholder="开始记录你的知识..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[300px] resize-none bg-transparent border-none outline-none text-sm md:text-base leading-relaxed placeholder:text-[var(--color-muted)]/50"
        />
      </div>
    </div>
  );
}
