"use client"
import { useState, useEffect } from 'react';
import { useCookies } from 'next-client-cookies';
import { fetchBTCPrice } from '../services/BTCPrice';

import Score from "@/components/Score";
import LoadingBar from '@/components/LoadingBar';
import GuessButtons from "@/components/GuessButtons";
import BTCPriceGuess from "@/components/BTCPriceGuess";

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
  const [hideMessage, setHideMessage] = useState(false);

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
    setError(null);

    try {
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
      setLoading(true);
      setHideMessage(false);
      setTimeout(() => {
        setHideMessage(true);
      }, 10000);

      await new Promise(resolve => setTimeout(resolve, timeout));
    } catch (error) {
      setError('Error occurred while processing your guess');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between md:p-16 md:pt-6 p-4">
      <div className="z-10 w-full max-w-2xl justify-between font-mono text-sm lg:flex flex flex-col gap-y-8">
        <h1 className='text-xl'>Can you guess the price of Bitcoin after <i>one minute?</i></h1>

        <Score userId={userId || ""} updatedScore={userScore ?? undefined} />

        <BTCPriceGuess
          btcPrice={btcPrice}
          btcPricePrev={btcPricePrev}
          userScore={userScore}
          userGuess={userGuess}
          hideMessage={hideMessage}
          error={error}
        />

        <div className='flex flex-col items-center mt-6'>
          <h3>Will the price go...?</h3>
          <GuessButtons onGuess={handleGuess} loading={loading} />
          {loading && <LoadingBar duration={timeout} />}
        </div>
      </div>
    </main>
  );
}
