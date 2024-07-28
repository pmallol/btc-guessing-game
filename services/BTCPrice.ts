export const fetchBTCPrice = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
  const data = await response.json();
  if (response.status !== 200) {
    throw new Error('Failed to fetch BTC price');
  }
  return data.bitcoin.usd;
};
