"use client"
import { useState, useEffect } from 'react';
import { fetchBTCPrice } from '../services/BTCPrice';

import Score from "@/components/Score";
import GuessButtons from "@/components/GuessButtons";

function getUserId() {
  const cookies = document.cookie;
  const userId = cookies?.split('; ').find(cookie => cookie.startsWith('userId='));
  return userId ? userId.split('=')[1] : ''
}

export default function Home() {
  const userId = getUserId();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [userScore, setUserScore] = useState<number | null>(null);

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex flex-col gap-y-8">
        {btcPrice && <div>Current BTC Price: ${btcPrice}</div>}
        <GuessButtons onGuess={handleGuess} loading={loading}/>
        <Score userId={userId || ""}/>
      </div>
    </main>
  );
}
