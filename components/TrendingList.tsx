import React, { useState, useMemo } from 'react';
import { useCryptoStore } from '@/store/useCryptoStore';
import Image from 'next/image';

interface Crypto {
  id: number;
  name: string;
  symbol: string;
  logo?: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
      volume_24h: number;
    };
  };
}

interface Props {
  title: string;
  icon: string;
  cryptos: Crypto[];
}

const TrendingList: React.FC<Props> = ({ title, icon, cryptos }) => {
  const { currency } = useCryptoStore();
  const [activeTab, setActiveTab] = useState<'price' | 'percentage' | 'volume'>('price');

  const sortedCryptos = useMemo(() => {
    return [...cryptos].sort((a, b) => {
      switch (activeTab) {
        case 'price':
          return b.quote[currency].price - a.quote[currency].price;
        case 'percentage':
          return b.quote[currency].percent_change_24h - a.quote[currency].percent_change_24h;
        case 'volume':
          return b.quote[currency].volume_24h - a.quote[currency].volume_24h;
        default:
          return 0;
      }
    });
  }, [cryptos, activeTab, currency]);

  return (
    <div className="bg-gray-900 px-4 rounded-lg w-full max-w-md h-72 overflow-y-auto shadow-lg">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900 z-10 ">
        {/* Title & Category */}
        <h2 className="text-lg font-bold flex items-center space-x-2 h">
          <span>{icon}</span>
          <span>{title}</span>
        </h2>

        {/* Tab Buttons */}
        <div className="flex space-x-2 my-3">
          <button className={`p-2 rounded ${activeTab === 'price' ? 'bg-gray-700' : 'bg-gray-800'}`} onClick={() => setActiveTab('price')}>💰 Price</button>
          <button className={`p-2 rounded ${activeTab === 'percentage' ? 'bg-gray-700' : 'bg-gray-800'}`} onClick={() => setActiveTab('percentage')}>📈 % Change</button>
          <button className={`p-2 rounded ${activeTab === 'volume' ? 'bg-gray-700' : 'bg-gray-800'}`} onClick={() => setActiveTab('volume')}>🔊 Volume</button>
        </div>
      </div>

      {/* Crypto List */}
      {sortedCryptos.length > 0 ? (
        <ul>
          {sortedCryptos.slice(0, 10).map((crypto, index) => (
            <li key={crypto.id} className="flex justify-between items-center p-2 border rounded-lg border-gray-700">
              {/* Coin Name & Logo */}
              
                {crypto.logo && <Image src={icon} alt={`${title} icon`} width={24} height={24} />}
                <span> {crypto.name} ({crypto.symbol})</span>
              {activeTab === 'price' && <span>${crypto.quote[currency].price.toFixed(2)}</span>}
              {activeTab === 'percentage' && (
                <span className={`font-semibold ${crypto.quote[currency].percent_change_24h < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {crypto.quote[currency].percent_change_24h.toFixed(2)}%
                </span>
              )}
              {activeTab === 'volume' && <span>${crypto.quote[currency].volume_24h.toLocaleString()}</span>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400">No data available</p>
      )}
    </div>
  );
};

export default TrendingList;
