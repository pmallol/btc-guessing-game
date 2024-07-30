import { CookiesProvider } from 'next-client-cookies/server';
import type { Metadata } from "next";
import Image from 'next/image';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bitcoin Guessing Game",
  description: "A fun game where you guess the price of Bitcoin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className='flex items-center gap-4 p-8 font-bold'>
          <Image src='/bitcoin-btc-logo.svg' alt='Bitcoin logo' className='h-12 w-12' width={12} height={12} />
          Bitcoin Guessing Game
        </nav>
        <CookiesProvider>{children}</CookiesProvider>
        </body>
    </html>
  );
}
