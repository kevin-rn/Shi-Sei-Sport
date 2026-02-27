import { useRef, useEffect, useCallback } from 'react';
import SignaturePadLib from 'signature_pad';
import { Eraser } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void;
  label: string;
  clearLabel: string;
}

export const SignaturePad = ({ onSignatureChange, label, clearLabel }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePadLib | null>(null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !padRef.current) return;

    const data = padRef.current.toData();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);

    padRef.current.clear();
    if (data.length > 0) {
      padRef.current.fromData(data);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePadLib(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(0, 0, 0)',
    });
    padRef.current = pad;

    resizeCanvas();

    pad.addEventListener('endStroke', () => {
      onSignatureChange(pad.isEmpty() ? null : pad.toDataURL('image/png'));
    });

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      pad.off();
    };
  }, [onSignatureChange, resizeCanvas]);

  const handleClear = () => {
    padRef.current?.clear();
    onSignatureChange(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-judo-dark mb-2">
        {label} *
      </label>
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full touch-none"
          style={{
            height: '150px',
            cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='%23333'%3E%3Cpath d='M167-120q-21 5-36.5-10.5T120-167l40-191 198 198-191 40Zm191-40L160-358l458-458q23-23 57-23t57 23l84 84q23 23 23 57t-23 57L358-160Zm317-600L261-346l85 85 414-414-85-85Z'/%3E%3C/svg%3E") 0 24, crosshair`,
          }}
        />
      </div>
      <button
        type="button"
        onClick={handleClear}
        className="mt-2 text-sm text-gray-500 hover:text-judo-red flex items-center gap-1 transition-colors"
      >
        <Eraser className="w-4 h-4" />
        {clearLabel}
      </button>
    </div>
  );
};
