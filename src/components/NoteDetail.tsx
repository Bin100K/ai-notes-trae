import { useState } from 'react';
import { ArrowLeft, Copy, Edit3, Hash, Nfc, CheckCircle2, PenLine, MessageSquare, Star } from 'lucide-react';
import type { Note, Annotation } from '../types';
import NoteAnnotations from './NoteAnnotations';

interface NoteDetailProps {
  note: Note;
  notes: Note[];
  onEdit: () => void;
  onSelectNote: (note: Note) => void;
  onBack: () => void;
  onUpdateNote: (note: Note) => void;
  onToggleFavorite: (id: string) => void;
  isMobile: boolean;
}

export default function NoteDetail({ note, notes, onEdit, onSelectNote, onBack, onUpdateNote, onToggleFavorite, isMobile }: NoteDetailProps) {
  const [showNfcInfo, setShowNfcInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);

  const relatedNotes = notes.filter(
    (n) =>
      n.id !== note.id &&
      (n.category === note.category || n.tags.some((t) => note.tags.includes(t)))
  ).slice(0, 3);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const nfcUrl = `${window.location.origin}${window.location.pathname}?note=${note.id}`;

  const handleCopyNfcUrl = () => {
    navigator.clipboard.writeText(nfcUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateAnnotations = (annotations: Annotation[]) => {
    onUpdateNote({ ...note, annotations });
  };

  if (showAnnotations) {
    return (
      <NoteAnnotations
        note={note}
        onUpdateAnnotations={handleUpdateAnnotations}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-[var(--color-rule)]">
        {isMobile && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-muted)]" />
          </button>
        )}
        <span className="text-xs text-[var(--color-primary)] font-medium px-2.5 py-1 bg-[var(--color-primary)]/10 rounded-lg">
          {note.category}
        </span>
        <div className="flex-1" />
        {/* Favorite button */}
        <button
          onClick={() => onToggleFavorite(note.id)}
          className={`p-2 rounded-lg transition-colors ${
            note.isFavorite
              ? 'text-amber-500 hover:bg-amber-50'
              : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-amber-500'
          }`}
          title={note.isFavorite ? '取消收藏' : '收藏'}
        >
          <Star className={`w-4 h-4 ${note.isFavorite ? 'fill-amber-500' : ''}`} />
        </button>
        {/* Annotation button */}
        <button
          onClick={() => setShowAnnotations(true)}
          className="p-2 rounded-lg hover:bg-[var(--color-primary)]/10 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
          title="批注"
        >
          <PenLine className="w-4 h-4" />
        </button>
        {/* NFC icon - subtle corner placement */}
        <button
          onClick={() => setShowNfcInfo(!showNfcInfo)}
          className="p-2 rounded-lg hover:bg-amber-50 text-[var(--color-muted)] hover:text-amber-600 transition-colors"
          title="NFC 标签信息"
        >
          <Nfc className="w-4 h-4" />
        </button>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white hover:shadow-md transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          编辑
        </button>
      </div>

      {/* NFC Info Panel - collapsible */}
      {showNfcInfo && (
        <div className="px-4 md:px-6 py-3 bg-amber-50 border-b border-amber-200 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-700">NFC 标签链接</span>
            <button
              onClick={handleCopyNfcUrl}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-white text-xs text-amber-700 hover:bg-amber-100 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? '已复制' : '复制'}
            </button>
          </div>
          <code className="block text-[11px] bg-white px-3 py-2 rounded-lg text-amber-800 font-mono break-all">
            {nfcUrl}
          </code>
          <p className="text-[10px] text-amber-600 mt-1.5">
            将此链接写入 NFC 标签，手机贴近即可直达这篇笔记
          </p>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-6 py-6">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--color-ink)] mb-3">
            {note.title}
          </h1>
          <p className="text-xs text-[var(--color-muted)] mb-4">
            更新于 {formatDate(note.updatedAt)}
          </p>

          {/* Tags with NFC icon at the end */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--color-surface-2)] rounded-lg text-xs text-[var(--color-muted)]"
              >
                <Hash className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {/* Small NFC icon after tags */}
            <button
              onClick={() => setShowNfcInfo(!showNfcInfo)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <Nfc className="w-3 h-3" />
              NFC
            </button>
          </div>

          {/* Content */}
          <div className="text-sm md:text-base leading-relaxed text-[var(--color-ink)] whitespace-pre-wrap">
            {note.content}
          </div>
        </div>

        {/* Related Notes */}
        {relatedNotes.length > 0 && (
          <div className="px-4 md:px-6 py-4 border-t border-[var(--color-rule)]">
            <h3 className="text-xs font-semibold text-[var(--color-muted)] mb-3">相关推荐</h3>
            <div className="flex flex-col gap-2">
              {relatedNotes.map((related) => (
                <button
                  key={related.id}
                  onClick={() => onSelectNote(related)}
                  className="text-left p-3 bg-[var(--color-surface-2)] rounded-xl hover:bg-[var(--color-primary)]/5 transition-colors"
                >
                  <p className="text-xs font-medium text-[var(--color-ink)]">{related.title}</p>
                  <p className="text-[10px] text-[var(--color-muted)] mt-1 line-clamp-1">
                    {related.content.substring(0, 60)}...
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
