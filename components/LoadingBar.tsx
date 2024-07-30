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
      const newProgress = (currentStep / totalSteps) * 100;
      setProgress(newProgress);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div className="w-full h-4 bg-gray-100 rounded mt-4">
      <div
        className="h-full bg-orange-400 transition-all duration-1000"
        style={{ width: `${progress}%` }}
      />
      <div className="mt-2 text-black text-center">{Math.floor(progress)}%</div>
    </div>
  );
};

export default LoadingBar;
