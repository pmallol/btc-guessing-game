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
  const formatPrice = (price: number | null): string => {
    if (price === null) {
      return '';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className='flex flex-col self-center text-lg container w-full h-64 p-6 py-12 drop-shadow-md rounded-lg'>
      <div className='flex justify-between gap-8'>
        {!btcPrice && <div data-testid="btc-price-loading">Loading BTC Price...</div>}
        {btcPrice &&
          <div data-testid="btc-price">
            Latest BTC Price:
            <p><b>{formatPrice(btcPrice)}</b>
              {btcPricePrev && <span className='text-sm ml-3 text-orange-400'> {btcPrice > btcPricePrev ? '+' : ''}{formatPrice(btcPrice - btcPricePrev)}</span>}
            </p>
          </div>
        }
        {btcPricePrev &&
          <div data-testid="btc-price-prev" className='text-gray-500'>Previous BTC Price:
            <p><b>{formatPrice(btcPricePrev)}</b></p>
          </div>
        }
      </div>

      {!error && userScore !== null && (
        <div className={`mt-8 ${hideMessage ? 'hidden' : ''}`}>
          {userGuess ? (
            <div className='text-sm'>✅ YAY! You guessed right, the price went {btcPrice && btcPricePrev ? (btcPrice > btcPricePrev ? 'up' : 'down') : ''}.</div>
          ) : (
            <div className='text-sm'>❌ You didn&apos;t guess this time, the price {btcPrice === btcPricePrev ? 'stayed the same' :
            `went ${btcPrice && btcPricePrev ? (btcPrice > btcPricePrev ? 'up' : 'down') : ''}`}. Try again!</div>
          )}
        </div>
      )}
      {error && <div className='text-orange-500 mt-8'>{error}</div>}
    </div>
  );
};

export default BTCPriceGuess;