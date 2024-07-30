import { useEffect, useState } from 'react';

interface BTCPriceGuessProps {
  btcPrice: number | null;
  btcPricePrev: number | null;
  error: string | null;
  userScore: number | null;
  userGuess: boolean | null;
  hideMessage: boolean;
}

const BTCPriceGuess: React.FC<BTCPriceGuessProps> = ({ btcPrice, btcPricePrev, error, userScore, userGuess, hideMessage }) => {
  return (
    <div className='flex flex-col items-center self-center text-lg container bg-orange-100 w-full h-64 p-12 py-20 drop-shadow-md rounded-lg'>
      {!btcPrice && <div data-testid="btc-price-loading">Loading BTC Price...</div>}
      {btcPrice && <div data-testid="btc-price">Current BTC Price: <b>${btcPrice}</b></div>}
      {btcPricePrev && <div data-testid="btc-price-prev" className='mt-4 text-gray-600'>Previous BTC Price: <b>${btcPricePrev}</b></div>}

      {!error && userScore !== null && (
        <div className={`mt-8 ${hideMessage ? 'hidden' : ''}`}>
          {userGuess ? (
            <div className='text-sm'>✅ YAY! You guessed right, the price went {btcPrice && btcPricePrev ? (btcPrice > btcPricePrev ? 'up' : 'down') : ''}.</div>
          ) : (
            <div className='text-sm'>❌ Oops! You didn&apos;t guess this time. Try again!</div>
          )}
        </div>
      )}
      {error && <div className='text-orange-500 mt-8'>{error}</div>}
    </div>
  );
};

export default BTCPriceGuess;