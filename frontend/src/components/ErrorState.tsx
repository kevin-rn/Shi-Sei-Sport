import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  message: string;
  maxWidth?: string;
}

export const ErrorState = ({ title, message, maxWidth = 'max-w-5xl' }: ErrorStateProps) => (
  <div className={`container mx-auto px-6 pt-24 pb-32 ${maxWidth}`}>
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-bold text-red-900 mb-2">{title}</h3>
        <p className="text-red-700">{message}</p>
      </div>
    </div>
  </div>
);
