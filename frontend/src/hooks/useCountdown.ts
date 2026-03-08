import { useState, useEffect } from 'react';

export const useCountdown = (active: boolean, totalSeconds: number) => {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (!active) {
      setRemaining(totalSeconds);
      return;
    }
    setRemaining(totalSeconds);
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active, totalSeconds]);

  return { remaining, progress: remaining / totalSeconds };
};
