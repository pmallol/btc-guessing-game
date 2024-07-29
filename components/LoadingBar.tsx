import { useEffect, useState } from 'react';

const LoadingBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 1000; // Update every second
    const totalDuration = 60000; // Total duration is 60 seconds
    const totalSteps = totalDuration / interval;

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
  }, []);

  return (
    <div className="w-full h-4 bg-gray-100 rounded overflow-hidden mt-4">
      <div
        className="h-full bg-orange-400 transition-all duration-1000"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default LoadingBar;
