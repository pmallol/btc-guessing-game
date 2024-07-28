"use client"
import { useState } from 'react';

const GuessButtons = () => {
  const [guess, setGuess] = useState<'up' | 'down' | null>(null);

  const handleGuess = (direction: 'up' | 'down') => {
    setGuess(direction);
    // Save guess to backend
  };

  return (
    <div className='flex gap-4'>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleGuess('up')} disabled={guess !== null}>Up</button>
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleGuess('down')} disabled={guess !== null}>Down</button>
    </div>
  );
};

export default GuessButtons;
