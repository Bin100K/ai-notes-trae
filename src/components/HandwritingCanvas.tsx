import { useRef, useState, useEffect, useCallback } from 'react';
import { Eraser, Pen, Undo, Trash2, X, Check, Palette } from 'lucide-react';

interface HandwritingCanvasProps {
  onSave: (imageData: string) => void;
  onCancel: () => void;
}

const COLORS = [
  '#1c1917', // black
  '#dc2626', // red
  '#2563eb', // blue
  '#16a34a', // green
  '#d97706', // orange
  '#7c3aed', // purple
];

const LINE_WIDTHS = [2, 4, 6, 8];

export default function HandwritingCanvas({ onSave, onCancel }: HandwritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#1c1917');
  const [lineWidth, setLineWidth] = useState(4);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Fill white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, rect.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Save initial blank state
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialData]);
      setHistoryStep(0);
    }

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCoordinates = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.closePath();

    // Save to history
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep <= 0) return;
    const newStep = historyStep - 1;
    setHistoryStep(newStep);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.putImageData(history[newStep], 0, 0);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-rule)] overflow-x-auto">
        {/* Color picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
            style={{ color }}
          >
            <Palette className="w-5 h-5" />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-xl shadow-lg border border-[var(--color-rule)] flex gap-2 z-50">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => { setColor(c); setShowColorPicker(false); }}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    color === c ? 'border-[var(--color-primary)] scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Line width */}
        <div className="flex items-center gap-1">
          {LINE_WIDTHS.map((w) => (
            <button
              key={w}
              onClick={() => setLineWidth(w)}
              className={`p-1.5 rounded-lg transition-colors ${
                lineWidth === w ? 'bg-[var(--color-primary)]/10' : 'hover:bg-[var(--color-surface-2)]'
              }`}
            >
              <div
                className={`rounded-full ${lineWidth === w ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-muted)]'}`}
                style={{ width: w * 2, height: w * 2 }}
              />
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-[var(--color-rule)] mx-1" />

        {/* Actions */}
        <button
          onClick={undo}
          disabled={historyStep <= 0}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-2)] disabled:opacity-30 transition-colors"
        >
          <Undo className="w-5 h-5 text-[var(--color-muted)]" />
        </button>
        <button
          onClick={clearCanvas}
          className="p-2 rounded-lg hover:bg-red-50 text-[var(--color-muted)] hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
        >
          <X className="w-5 h-5 text-[var(--color-muted)]" />
        </button>
        <button
          onClick={handleSave}
          className="p-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Check className="w-5 h-5" />
        </button>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Hint */}
      <div className="px-4 py-2 text-center text-[10px] text-[var(--color-muted)] border-t border-[var(--color-rule)]">
        支持手指/手写笔书写，可撤销、换色、调整粗细
      </div>
    </div>
  );
}
