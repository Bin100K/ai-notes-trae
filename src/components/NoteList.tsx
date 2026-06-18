import { useState } from 'react';
import { Clock, FileText, Hash, Star, Trash2 } from 'lucide-react';
import type { Note } from '../types';
import { mockCategories } from '../data/mockData';

interface NoteListProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  selectedNoteId: string | null;
}

export default function NoteList({ notes, onSelectNote, onDeleteNote, onToggleFavorite, selectedNoteId }: NoteListProps) {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter((note) => {
    const matchesCategory =
      activeCategory === '全部'
        ? true
        : activeCategory === '收藏'
        ? note.isFavorite
        : note.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-[var(--color-rule)]">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索笔记..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface-2)] rounded-xl text-sm border border-transparent focus:border-[var(--color-primary)] focus:outline-none transition-colors"
          />
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {mockCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Note Count */}
      <div className="px-4 py-2 text-xs text-[var(--color-muted)] flex items-center justify-between">
        <span>共 {filteredNotes.length} 条笔记</span>
        {notes.some((n) => n.isFavorite) && (
          <button
            onClick={() => setActiveCategory(activeCategory === '收藏' ? '全部' : '收藏')}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-colors ${
              activeCategory === '收藏'
                ? 'bg-amber-100 text-amber-700'
                : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]'
            }`}
          >
            <Star className="w-3 h-3" />
            收藏
          </button>
        )}
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note)}
            className={`group relative p-4 rounded-xl mb-2 cursor-pointer transition-all ${
              selectedNoteId === note.id
                ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20'
                : 'bg-white border border-transparent hover:border-[var(--color-rule)] hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm text-[var(--color-ink)] line-clamp-1 flex-1 pr-2">
                {note.title}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(note.id);
                  }}
                  className={`p-1 rounded transition-all ${
                    note.isFavorite
                      ? 'text-amber-500'
                      : 'opacity-0 group-hover:opacity-100 text-[var(--color-muted)] hover:text-amber-500'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-amber-500' : ''}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-[var(--color-muted)] hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-[var(--color-muted)] line-clamp-2 mb-3 leading-relaxed">
              {note.content}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {note.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-surface-2)] rounded-md text-[10px] text-[var(--color-muted)]"
                  >
                    <Hash className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[var(--color-muted)]">
                <Clock className="w-3 h-3" />
                {formatDate(note.updatedAt)}
              </div>
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-[var(--color-muted)]">
            <FileText className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">暂无笔记</p>
            <p className="text-xs mt-1">点击"新建笔记"开始记录</p>
          </div>
        )}
      </div>
    </div>
  );
}
