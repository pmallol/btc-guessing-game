import { cookies } from 'next/headers'

import BTCPrice from "@/components/BTCPrice";
import Score from "@/components/Score";
import GuessButtons from "@/components/GuessButtons";

function getUserId() {
  const userId = cookies().get('userId')?.value
  return userId ? userId : ''
}

export default function Home() {
  const userId = getUserId();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex flex-col gap-y-8">
        <BTCPrice />
        <GuessButtons />
        <Score userId={userId || ""}/>
      </div>
    </main>
  );
}
