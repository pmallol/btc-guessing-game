"use client"
import { useEffect, useState } from 'react';
import { fetchBTCPrice } from '../services/api';

const BTCPrice = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentPrice = await fetchBTCPrice();
        setPrice(currentPrice);
        setLoading(false);
      } catch (error) {
        setError('Error fetching BTC price');
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Fetch every 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>Current BTC Price: ${price}</div>
      )}
    </div>
  );
};

export default BTCPrice;
