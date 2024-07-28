import BTCPrice from "@/components/BTCPrice";
import Score from "@/components/Score";
import GuessButtons from "@/components/GuessButtons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex flex-col gap-y-8">
        <BTCPrice />
        <GuessButtons />
        <Score />
      </div>
    </main>
  );
}
