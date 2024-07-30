"use client"
import { useState, useEffect } from 'react';
import { useCookies } from 'next-client-cookies';
import { fetchBTCPrice } from '../services/BTCPrice';

import Score from "@/components/Score";
import LoadingBar from '@/components/LoadingBar';
import GuessButtons from "@/components/GuessButtons";

export default function Home() {
  const cookies = useCookies();
  const userId = cookies.get('userId') || null;
  const timeout = 60000;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [userGuess, setUserGuess] = useState<boolean | null>(null);
  const [btcPricePrev, setBtcPricePrev] = useState<number | null>(null);

  useEffect(() => {
    const fetchInitialPrice = async () => {
      try {
        const price = await fetchBTCPrice();
        setBtcPrice(price);
      } catch (error) {
        setError('Error occurred while fetching initial BTC price');
      }
    };

    fetchInitialPrice();
  }, []);

  const handleGuess = async (guess: 'up' | 'down') => {
    setLoading(true);
    setError(null);

    try {
      // Wait for 60 seconds
      await new Promise(resolve => setTimeout(resolve, timeout));

      const newPrice = await fetchBTCPrice();

      const result = guess === 'up' ? (btcPrice !== null && newPrice > btcPrice) : (btcPrice !== null && newPrice < btcPrice);

      const response = await fetch(`/api/score?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guess: result,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update score');
      }

      const data = await response.json();
      setUserScore(data.score);
      setUserGuess(result);
      setBtcPricePrev(btcPrice);
      setBtcPrice(newPrice);
    } catch (error) {
      setError('Error occurred while processing your guess');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between md:p-16 md:pt-6 p-4">
      <div className="z-10 w-full max-w-2xl justify-between font-mono text-sm lg:flex flex flex-col gap-y-8">
        <h1 className='text-xl'>Can you guess the price of Bitcoin after <i>one minute?</i></h1>

        <Score userId={userId || ""} updatedScore={userScore ?? undefined} />

        <div className='flex flex-col items-center self-center text-lg container bg-orange-100 w-full h-64 p-12 py-20 drop-shadow-md rounded-lg'>
          {!btcPrice && <div data-testid="btc-price-loading">Loading BTC Price...</div>}
          {btcPrice && <div data-testid="btc-price">Current BTC Price: <b>${btcPrice}</b></div>}
          {btcPricePrev && <div data-testid="btc-price-prev" className='mt-4 text-gray-600'>Previous BTC Price: <b>${btcPricePrev}</b></div>}

          {!error && userScore !== null && (
            <div className='mt-8'>
              {userGuess ? (
                <div className='text-sm'>✅ YAY! You guessed right, the price went {btcPrice && btcPricePrev ? (btcPrice > btcPricePrev ? 'up' : 'down') : ''}.</div>
              ) : (
                <div className='text-sm'>❌ Oops! You didn&apos;t guess this time. Try again!</div>
              )}
            </div>
          )}
          {error && <div className='text-orange-500 mt-8'>{error}</div>}
        </div>

        <div className='flex flex-col items-center mt-6'>
          <h3>Will the price go...?</h3>
          <GuessButtons onGuess={handleGuess} loading={loading} />
          {loading && <LoadingBar duration={timeout} />}
        </div>
      </div>
    </main>
  );
}
