/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CryptoQuote {
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  volume_24h: number;
}

export interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  circulating_supply: number;
  quote: Record<string, CryptoQuote>;
}

export interface DominanceData {
  name: string;
  value: number;
}

export interface FearAndGreedData {
  value: number;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
}



// In-memory cache for API responses to avoid repetitive calls
const cache: {
  [key: string]: { timestamp: number; data: CryptoData[] | DominanceData[] | FearAndGreedData };
} = {};

const CACHE_DURATION = 5 * 60 * 1000; // e.g. 5 minutes

/**
 * Fetch top-50 cryptos from /api/crypto?currency=XXXX
 * Uses a simple in-memory cache for 5 minutes.
 */
export async function fetchCryptoData(currency: string): Promise<CryptoData[]> {
  const cacheKey = currency.toUpperCase();
  const now = Date.now();

  // Return cached data if it exists and is fresh
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data as CryptoData[];
  }

  try {
    const res = await fetch(`/api/crypto?currency=${cacheKey}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch crypto data: ${res.status}`);
    }
    const data: CryptoData[] = await res.json();
    // Cache the fetched data with a timestamp
    cache[cacheKey] = { data, timestamp: now };
    return data;
  } catch (err) {
    console.error("Error fetching crypto data:", err);
    throw err;
  }
}


export async function fetchDominanceData(): Promise<DominanceData[]> {
  const cacheKey = 'dominance';
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data as DominanceData[];
  }

  try {
    const res = await fetch("/api/crypto/dominance");
    if (!res.ok) {
      throw new Error(`Failed to fetch dominance data: ${res.statusText}`);
    }
    const data: DominanceData[] = await res.json();
    cache[cacheKey] = { data, timestamp: now };
    return data;
  } catch (err) {
    console.error("Error fetching dominance data:", err);
    throw err;
  }
}

export async function fetchFearAndGreedIndex(): Promise<FearAndGreedData> {
  const cacheKey = 'fearGreedIndex';
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data as unknown as FearAndGreedData;
  }

  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=1");
    if (!res.ok) {
      throw new Error(`Failed to fetch Fear and Greed Index: ${res.statusText}`);
    }
    const data = await res.json();
    const indexData: FearAndGreedData = {
      value: parseInt(data.data[0].value, 10),
      value_classification: data.data[0].value_classification,
      timestamp: data.data[0].timestamp,
      time_until_update: data.data[0].time_until_update,
    };
    cache[cacheKey] = { data: indexData, timestamp: now };
    return indexData;
  } catch (err) {
    console.error("Error fetching Fear and Greed Index:", err);
    throw err;
  }
}
