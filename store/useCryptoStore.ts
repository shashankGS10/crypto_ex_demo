import { create } from 'zustand';

interface CryptoStore {
  currency: string;
  setCurrency: (currency: string) => void;
  
  activeCategory: 'trending' | 'recently_added' | 'most_visited';
  setActiveCategory: (category: 'trending' | 'recently_added' | 'most_visited') => void;

  activeTab: 'price' | 'percentage' | 'volume' | 'market_cap' | 'circulating_supply';
  setActiveTab: (tab: 'price' | 'percentage' | 'volume' | 'market_cap' | 'circulating_supply') => void;

  visibleColumns: string[];
  toggleColumn: (column: string) => void;

  filters: {
    marketCap: [number, number] | null;
    circulatingSupply: [number, number] | null;
    sevenDayChange: [number, number] | null;
  };
  setFilters: (filters: Partial<CryptoStore['filters']>) => void;

  historicalData: Record<string, number[]>; // Store 7-day history
  setHistoricalData: (id: string, data: number[]) => void;
}

export const useCryptoStore = create<CryptoStore>((set) => ({
  currency: 'USD',
  setCurrency: (currency) => set({ currency }),

  activeCategory: 'trending',
  setActiveCategory: (category) => set({ activeCategory: category }),

  activeTab: 'price',
  setActiveTab: (tab) => set({ activeTab: tab }),

  visibleColumns: ['price', 'percentage', 'market_cap', 'volume', '7d_trend'],
  toggleColumn: (column) =>
    set((state) => ({
      visibleColumns: state.visibleColumns.includes(column)
        ? state.visibleColumns.filter((c) => c !== column)
        : [...state.visibleColumns, column],
    })),

  filters: {
    marketCap: null,
    circulatingSupply: null,
    sevenDayChange: null,
  },
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),

  historicalData: {}, // Store 7-day price trends
  setHistoricalData: (id, data) =>
    set((state) => ({
      historicalData: { ...state.historicalData, [id]: data },
    })),
}));
