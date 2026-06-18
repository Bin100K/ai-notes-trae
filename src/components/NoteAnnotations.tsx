import { useState } from 'react';
import { Pen, MessageSquare, X, Image, Trash2 } from 'lucide-react';
import type { Note, Annotation } from '../types';
import HandwritingCanvas from './HandwritingCanvas';

interface NoteAnnotationsProps {
  note: Note;
  onUpdateAnnotations: (annotations: Annotation[]) => void;
}

export default function NoteAnnotations({ note, onUpdateAnnotations }: NoteAnnotationsProps) {
  const [showCanvas, setShowCanvas] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');

  const annotations = note.annotations || [];

  const handleSaveHandwriting = (imageData: string) => {
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: 'handwriting',
      content: imageData,
      createdAt: new Date().toISOString(),
    };
    onUpdateAnnotations([...annotations, newAnnotation]);
    setShowCanvas(false);
  };

  const handleSaveText = () => {
    if (!textInput.trim()) return;
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: 'text',
      content: textInput.trim(),
      createdAt: new Date().toISOString(),
    };
    onUpdateAnnotations([...annotations, newAnnotation]);
    setTextInput('');
    setShowTextInput(false);
  };

  const handleDelete = (id: string) => {
    onUpdateAnnotations(annotations.filter((a) => a.id !== id));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (showCanvas) {
    return (
      <HandwritingCanvas
        onSave={handleSaveHandwriting}
        onCancel={() => setShowCanvas(false)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[var(--color-rule)]">
        <div>
          <h2 className="font-semibold text-[var(--color-ink)]">批注</h2>
          <p className="text-xs text-[var(--color-muted)]">{annotations.length} 条批注</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            文字
          </button>
          <button
            onClick={() => setShowCanvas(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white hover:shadow-md transition-all"
          >
            <Pen className="w-4 h-4" />
            手写
          </button>
        </div>
      </div>

      {/* Text Input */}
      {showTextInput && (
        <div className="px-4 md:px-6 py-3 border-b border-[var(--color-rule)] animate-fade-in">
          <textarea
            placeholder="输入批注内容..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] text-sm border border-transparent focus:border-[var(--color-primary)] focus:outline-none resize-none"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setShowTextInput(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSaveText}
              className="px-3 py-1.5 rounded-lg text-xs bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      )}

      {/* Annotations List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        {annotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[var(--color-muted)]">
            <Pen className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">暂无批注</p>
            <p className="text-xs mt-1">点击"手写"或"文字"添加批注</p>
          </div>
        ) : (
          <div className="space-y-3">
            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="group relative p-3 bg-[var(--color-surface-2)] rounded-xl"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {annotation.type === 'handwriting' ? (
                      <Pen className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    ) : (
                      <MessageSquare className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    )}
                    <span className="text-[10px] text-[var(--color-muted)]">
                      {annotation.type === 'handwriting' ? '手写批注' : '文字批注'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(annotation.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-[var(--color-muted)] hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {annotation.type === 'handwriting' ? (
                  <img
                    src={annotation.content}
                    alt="手写批注"
                    className="w-full rounded-lg bg-white"
                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                  />
                ) : (
                  <p className="text-sm text-[var(--color-ink)]">{annotation.content}</p>
                )}

                <p className="text-[10px] text-[var(--color-muted)] mt-2">
                  {formatDate(annotation.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
