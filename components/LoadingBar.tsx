import { useEffect, useState } from 'react';

interface LoadingProps {
  duration: number;
}

const LoadingBar: React.FC<LoadingProps> = ({ duration }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 1000; // Update every second
    const totalSteps = duration / interval;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      const timeInSeconds = currentStep * interval / 1000;
      setProgress(timeInSeconds);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  const maxProgress = duration / 1000; // Maximum progress value in seconds
  const progressWidth = (progress / maxProgress) * 100;

  return (
    <div className="w-1/3 h-1 bg-gray-100 rounded mt-2">
      <div
        className="h-full bg-orange-600 transition-all duration-1000"
        style={{ width: `${progressWidth}%` }}
      />
      <div className="mt-1 text-black text-center">{Math.floor(progress)}s</div>
    </div>
  );
};

export default LoadingBar;
