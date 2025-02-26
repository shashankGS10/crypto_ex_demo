const API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency';
const API_KEY = process.env.NEXT_PUBLIC_CMC_API_KEY!;

export const fetchCryptos = async (currency: string, category: string) => {
  let endpoint = '';
  switch (category) {
    case 'trending':
      endpoint = 'trending/latest';
      break;
    case 'recently_added':
      endpoint = 'listings/latest';
      break;
    case 'most_visited':
      endpoint = 'mostvisited/latest';
      break;
    default:
      endpoint = 'listings/latest';
  }

  try {
    const response = await fetch(`${API_URL}/${endpoint}?limit=10&convert=${currency}`, {
      headers: { 'X-CMC_PRO_API_KEY': API_KEY },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Crypto API Error:', error);
    throw error;
  }
};

// Fetch 7-day historical price data
export const fetchCryptoHistory = async (cryptoId: string, currency: string) => {
  try {
    const response = await fetch(`${API_URL}/quotes/historical?id=${cryptoId}&interval=1d&convert=${currency}`, {
      headers: { 'X-CMC_PRO_API_KEY': API_KEY },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch historical data');
    }

    const data = await response.json();
    return data.data.quotes.map((quote: any) => quote.price); // Extract 7-day prices
  } catch (error) {
    console.error(`Error fetching history for ${cryptoId}:`, error);
    return [];
  }
};
