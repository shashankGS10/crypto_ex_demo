// hooks/useCrypto.ts
import { useState, useEffect } from 'react';
import { useCryptoStore } from '@/store/useCryptoStore';
import { fetchCryptos } from '@/utils/apiService';

export const useCrypto = () => {
  const { currency, filter } = useCryptoStore();
  const [cryptos, setCryptos] = useState<Crypto[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const data = await fetchCryptos(currency, filter);
        setCryptos(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [currency, filter]);

  return { cryptos, loading, error };
};
