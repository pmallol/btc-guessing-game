import type { NextApiResponse } from 'next'
import { type NextRequest } from 'next/server'

type Data = {
  price?: number;
  message?: string;
};

export async function GET(request: NextRequest, res: NextApiResponse<Data>) {
  const headers = new Headers();
  headers.append('X-CMC_PRO_API_KEY', process.env.N_COIN_MARKET_API!);

  try {
    const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC', {
      method: 'GET',
      headers: headers,
      cache: 'no-store'
    });
    const data = await response.json();

    return Response.json({ price: data.data.BTC.quote.USD.price }, { status: 200 });
  } catch (error) {
    return Response.json({ message: `Error fetching BTC price: ${error}` }, { status: 500 });
  }
}