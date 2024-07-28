"use client"
import { useState } from 'react';

const Score = () => {
  const [score, setScore] = useState(0);

  return <div className="text-center text-2xl font-bold">Score: {score}</div>;
};

export default Score;
