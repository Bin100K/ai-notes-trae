import { useState } from 'react';
import { Copy, Nfc, QrCode, Smartphone, CheckCircle2 } from 'lucide-react';
import type { Note } from '../types';

interface NFCToolsProps {
  notes: Note[];
}

export default function NFCTools({ notes }: NFCToolsProps) {
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [copied, setCopied] = useState(false);
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);

  // Check NFC support
  useState(() => {
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    } else {
      setNfcSupported(false);
    }
  });

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const generateUrl = (noteId: string) => {
    return `${window.location.origin}${window.location.pathname}?note=${noteId}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const writeNFC = async () => {
    if (!selectedNote) return;
    try {
      // @ts-ignore
      const ndef = new NDEFReader();
      await ndef.write({
        records: [
          {
            recordType: 'url',
            data: generateUrl(selectedNote.id),
          },
        ],
      });
      alert('NFC 标签写入成功！');
    } catch (error) {
      alert('NFC 写入失败：' + (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b border-[var(--color-rule)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center">
            <Nfc className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--color-ink)]">NFC 标签工具</h2>
            <p className="text-xs text-[var(--color-muted)]">将笔记绑定到 NFC 标签，贴标签即可直达</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* NFC Support Status */}
        <div className={`p-4 rounded-xl ${nfcSupported ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className={`w-4 h-4 ${nfcSupported ? 'text-green-600' : 'text-amber-600'}`} />
            <span className={`text-sm font-medium ${nfcSupported ? 'text-green-700' : 'text-amber-700'}`}>
              {nfcSupported === null ? '检测中...' : nfcSupported ? '你的设备支持 NFC' : '你的浏览器不支持 Web NFC'}
            </span>
          </div>
          <p className={`text-xs ${nfcSupported ? 'text-green-600' : 'text-amber-600'}`}>
            {nfcSupported
              ? '可以直接使用下方工具写入 NFC 标签'
              : '请使用支持 NFC 的 Android Chrome 浏览器，或手动复制 URL 写入标签'}
          </p>
        </div>

        {/* Select Note */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-ink)] mb-2">
            选择要绑定的笔记
          </label>
          <select
            value={selectedNoteId}
            onChange={(e) => setSelectedNoteId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-transparent focus:border-[var(--color-primary)] focus:outline-none text-sm"
          >
            <option value="">请选择一篇笔记...</option>
            {notes.map((note) => (
              <option key={note.id} value={note.id}>
                {note.title}
              </option>
            ))}
          </select>
        </div>

        {selectedNote && (
          <>
            {/* Note Info Card */}
            <div className="p-4 bg-[var(--color-surface-2)] rounded-xl">
              <h3 className="font-medium text-sm text-[var(--color-ink)] mb-1">{selectedNote.title}</h3>
              <p className="text-xs text-[var(--color-muted)] line-clamp-2">{selectedNote.content}</p>
              <div className="flex gap-1 mt-2">
                {selectedNote.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 bg-white rounded-md text-[var(--color-muted)]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* URL Display */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-ink)] mb-2">
                笔记直达链接
              </label>
              <div className="flex gap-2">
                <code className="flex-1 px-4 py-3 bg-[var(--color-surface-2)] rounded-xl text-xs font-mono text-[var(--color-ink)] break-all">
                  {generateUrl(selectedNote.id)}
                </code>
                <button
                  onClick={() => handleCopy(generateUrl(selectedNote.id))}
                  className="px-4 py-3 rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Note ID */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-ink)] mb-2">
                笔记 ID（用于 NFC 工具写入）
              </label>
              <div className="flex gap-2">
                <code className="flex-1 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-mono text-amber-800 break-all">
                  {selectedNote.id}
                </code>
                <button
                  onClick={() => handleCopy(selectedNote.id)}
                  className="px-4 py-3 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Write NFC Button */}
            {nfcSupported && (
              <button
                onClick={writeNFC}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-medium hover:shadow-lg hover:shadow-[var(--color-primary)]/30 transition-all"
              >
                <Nfc className="w-5 h-5" />
                写入 NFC 标签
              </button>
            )}

            {/* QR Code hint */}
            <div className="flex items-center gap-2 p-4 bg-[var(--color-surface-2)] rounded-xl">
              <QrCode className="w-5 h-5 text-[var(--color-muted)]" />
              <p className="text-xs text-[var(--color-muted)]">
                提示：你也可以将链接生成二维码打印出来，扫码即可访问
              </p>
            </div>
          </>
        )}

        {/* Instructions */}
        <div className="p-4 bg-[var(--color-surface-2)] rounded-xl">
          <h3 className="font-medium text-sm text-[var(--color-ink)] mb-3">使用说明</h3>
          <ol className="space-y-2 text-xs text-[var(--color-muted)]">
            <li className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px] flex-shrink-0">1</span>
              选择要绑定到 NFC 标签的笔记
            </li>
            <li className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px] flex-shrink-0">2</span>
              复制笔记 ID 或完整链接
            </li>
            <li className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px] flex-shrink-0">3</span>
              使用 NFC 工具（如 NFC Tools APP）将链接写入空白标签
            </li>
            <li className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px] flex-shrink-0">4</span>
              将标签贴在对应物品上，手机贴近即可自动打开笔记
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
