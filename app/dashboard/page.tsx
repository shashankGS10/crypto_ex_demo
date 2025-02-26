'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Top10List from '@/components/Top10List';
import { useCryptoStore } from '@/store/useCryptoStore';

const HomePage = () => {
  const { activeCategory } = useCryptoStore();
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/crypto?convert=USD`);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        setCryptos(data.data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-4 text-black">Top 50 Cryptocurrencies</h1>
      <Top10List cryptos={cryptos} />
    </div>
  );
};

export default HomePage;
