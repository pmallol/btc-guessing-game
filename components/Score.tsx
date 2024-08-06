"use client"
import { useState, useEffect } from 'react';

interface ScoreProps {
  userId: string;
  updatedScore?: number;
}

const Score: React.FC<ScoreProps> = ({ userId, updatedScore }) => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [userId]);

  if (loading) {
    return <div className="text-lg p-4">Loading your score...</div>;
  }

  return <div data-testid="score" className="text-lg border border-orange-300 p-4 px-6 w-fit rounded-lg">Your Score: <b>{updatedScore ? updatedScore : score}</b></div>;
};

export default Score;
