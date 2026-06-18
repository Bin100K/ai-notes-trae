import { useState, useMemo } from 'react';
import { X, Sparkles, ArrowRight, RefreshCw, Clock, Hash } from 'lucide-react';
import type { Note } from '../types';

interface DailyReviewProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onClose: () => void;
}

export default function DailyReview({ notes, onSelectNote, onClose }: DailyReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pick random notes, prioritizing older ones
  const reviewNotes = useMemo(() => {
    const shuffled = [...notes].sort(() => Math.random() - 0.5);
    // Sort by age - older notes first for "cold data activation"
    return shuffled.sort((a, b) => {
      const ageA = new Date(a.updatedAt).getTime();
      const ageB = new Date(b.updatedAt).getTime();
      return ageA - ageB;
    }).slice(0, 3);
  }, [notes]);

  const currentNote = reviewNotes[currentIndex];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays} 天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
    return `${Math.floor(diffDays / 30)} 个月前`;
  };

  if (!currentNote) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-rule)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-ink)]">每日回顾</h3>
              <p className="text-[10px] text-[var(--color-muted)]">
                {currentIndex + 1} / {reviewNotes.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
          >
            <X className="w-4 h-4 text-[var(--color-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {/* Note Card Preview */}
          <div
            onClick={() => onSelectNote(currentNote)}
            className="p-4 bg-[var(--color-surface-2)] rounded-xl cursor-pointer hover:bg-[var(--color-primary)]/5 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-[var(--color-primary)] font-medium px-2 py-0.5 bg-[var(--color-primary)]/10 rounded-md">
                {currentNote.category}
              </span>
              <span className="text-[10px] text-[var(--color-muted)] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(currentNote.updatedAt)}
              </span>
            </div>
            <h4 className="font-semibold text-sm text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
              {currentNote.title}
            </h4>
            <p className="text-xs text-[var(--color-muted)] line-clamp-3 leading-relaxed">
              {currentNote.content}
            </p>
            {currentNote.tags.length > 0 && (
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {currentNote.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-md text-[10px] text-[var(--color-muted)]"
                  >
                    <Hash className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action hint */}
          <p className="text-center text-[10px] text-[var(--color-muted)] mt-3">
            点击卡片查看详情，或继续浏览下一条
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-rule)]">
          <button
            onClick={() => {
              const newIndex = Math.floor(Math.random() * notes.length);
              setCurrentIndex(newIndex % reviewNotes.length);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            换一批
          </button>
          <div className="flex gap-2">
            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="px-3 py-2 rounded-lg text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] transition-colors"
              >
                上一条
              </button>
            )}
            {currentIndex < reviewNotes.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                下一条
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                完成回顾
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
