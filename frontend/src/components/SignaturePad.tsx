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
          style={{ height: '150px' }}
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
