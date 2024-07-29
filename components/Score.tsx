"use client"
import { useState, useEffect } from 'react';

interface ScoreProps {
  userId: string;
}

const Score: React.FC<ScoreProps> = ({ userId }) => {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await fetch(`/api/score?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch score');
        }
        const data = await response.json();
        setScore(data.score);
      } catch (error) {
        console.error('Error fetching score:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div className="text-center text-2xl font-bold">Score: {score}</div>;
};

export default Score;
