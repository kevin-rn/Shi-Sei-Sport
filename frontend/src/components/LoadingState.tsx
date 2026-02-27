import { LoadingDots } from './LoadingDots';

interface LoadingStateProps {
  message: string;
  maxWidth?: string;
}

export const LoadingState = ({ message, maxWidth = 'max-w-5xl' }: LoadingStateProps) => (
  <div className={`container mx-auto px-6 pt-24 pb-32 ${maxWidth}`}>
    <div className="text-center">
      <LoadingDots />
      <p className="mt-4 text-judo-gray">{message}</p>
    </div>
  </div>
);
