"use client";  // This store is used on the client side

import { create } from "zustand";

interface CryptoQuote {
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  volume_24h: number;
}
interface Crypto {
  id: number;
  name: string;
  symbol: string;
  circulating_supply: number;
  quote: Record<string, CryptoQuote>;  // quotes for different currencies (USD, EUR, etc.)
}

interface CryptoState {
  cryptos: Crypto[];               // list of top 50 cryptocurrencies
  selectedCurrency: string;        // current currency (USD, EUR, CHF, GBP, INR)
  selectedCrypto: Crypto | null;   // a crypto selected for details (if needed)
  setCryptos: (data: Crypto[]) => void;
  setSelectedCurrency: (currency: string) => void;
  setSelectedCrypto: (crypto: Crypto | null) => void;
}

export const useCryptoStore = create<CryptoState>()((set) => ({
  cryptos: [],
  selectedCurrency: "USD",
  selectedCrypto: null,
  setCryptos: (data) => set({ cryptos: data }),
  setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
  setSelectedCrypto: (crypto) => set({ selectedCrypto: crypto })
}));
