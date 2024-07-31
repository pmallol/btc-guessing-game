"use client"

interface GuessButtonsProps {
  onGuess: (guess: 'up' | 'down') => void;
  loading: boolean;
}

const GuessButtons: React.FC<GuessButtonsProps> = ({ onGuess, loading }) => {

  return (
    <div className='flex gap-4 my-6'>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed" 
        onClick={() => onGuess('up')}
        disabled={loading}
        >
          ▲ Up
        </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-red-900 disabled:text-gray-400 disabled:cursor-not-allowed" 
        onClick={() => onGuess('down')} 
        disabled={loading}
        >
          Down ▼
        </button>
    </div>
  );
};

export default GuessButtons;
