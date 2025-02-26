import React, { useMemo, useState } from 'react';
import { useCryptoStore } from '@/store/useCryptoStore';
import TrendingList from './TrendingList';

interface Crypto {
  id: number;
  name: string;
  symbol: string;
  date_added: string;
  quote: {
    [currency: string]: {
      price: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      market_cap: number;
      volume_24h: number;
    };
  };
}

interface Props {
  cryptos: Crypto[];
}

const CryptoTable: React.FC<Props> = ({ cryptos }) => {
  const { activeCategory, currency, activeTab, setActiveTab } = useCryptoStore();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table'); // Toggle Table / Card View
  const [sortTimeFrame, setSortTimeFrame] = useState<'1h' | '24h' | '7d'>('24h'); // Sorting Time Frame

  const sortedFilteredCryptos = useMemo(() => {
    let filtered = [...cryptos];

    // Sorting logic based on activeTab
    filtered.sort((a, b) => {
      const timeframeKey = `percent_change_${sortTimeFrame}`;
      switch (activeTab) {
        case 'price':
          return b.quote[currency].price - a.quote[currency].price;
        case 'percentage':
          return b.quote[currency][timeframeKey] - a.quote[currency][timeframeKey];
        case 'volume':
          return b.quote[currency].volume_24h - a.quote[currency].volume_24h;
        default:
          return 0;
      }
    });

    // Filtering for "Recently Added"
    if (activeCategory === 'recently_added') {
      filtered = filtered.sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime());
    }

    return filtered;
  }, [cryptos, activeTab, currency, activeCategory, sortTimeFrame]);

  return (
    <div className="bg-gray-900 p-6 rounded-lg w-full max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <TrendingList title="Top 10 Cryptos" icon="🔥" cryptos={sortedFilteredCryptos} />
      </div>
      <hr className="my-4 border-gray-700" />
      {/* Sorting & View Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Crypto Dashboard</h2>
        <p className="text-gray-400">Top 10 Cryptocurrencies by {activeTab}</p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button className={`p-2 rounded ${activeTab === 'price' ? 'bg-gray-700' : 'bg-gray-800'}`} onClick={() => setActiveTab('price')}>
            💰 Price
          </button>
          <button className={`p-2 rounded ${activeTab === 'percentage' ? 'bg-gray-700' : 'bg-gray-800'}`} onClick={() => setActiveTab('percentage')}>
            📈 % Change
          </button>
          <button className={`p-2 rounded ${activeTab === 'volume' ? 'bg-gray-700' : 'bg-gray-800'}`} onClick={() => setActiveTab('volume')}>
            🔊 Volume
          </button>
        </div>

        <div className="flex space-x-2">
          <button onClick={() => setViewMode('table')} className={`p-2 rounded ${viewMode === 'table' ? 'bg-gray-700' : 'bg-gray-800'}`}>
            📊 Table
          </button>
          <button onClick={() => setViewMode('cards')} className={`p-2 rounded ${viewMode === 'cards' ? 'bg-gray-700' : 'bg-gray-800'}`}>
            🏷 Cards
          </button>
        </div>
      </div>
      
      {/* Sorting Time Frame */}
      <div className="flex justify-start space-x-4 mb-4">
        {['1h', '24h', '7d'].map((time) => (
          <button
            key={time}
            onClick={() => setSortTimeFrame(time as '1h' | '24h' | '7d')}
            className={`px-4 py-2 rounded ${sortTimeFrame === time ? 'bg-blue-600' : 'bg-gray-800'}`}
          >
            {time.toUpperCase()}
          </button>
        ))}
      </div>
        
      {/* Toggle Between Table or Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-5">
          {sortedFilteredCryptos.slice(0, 10).map((crypto) => (
            <div key={crypto.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-lg">{crypto.name} ({crypto.symbol})</h3>
              <p className="text-gray-300">${crypto.quote[currency].price.toFixed(2)}</p>
              <p className={`text-sm ${crypto.quote[currency][`percent_change_${sortTimeFrame}`] >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {crypto.quote[currency][`percent_change_${sortTimeFrame}`].toFixed(2)}%
              </p>
            </div>
          ))}
        </div>

        <table className="min-w-full text-left text-sm text-gray-200">
          <thead className="bg-gray-800 uppercase text-xs text-gray-400">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Change ({sortTimeFrame})</th>
              <th className="px-4 py-2">Market Cap</th>
              <th className="px-4 py-2">Volume</th>
            </tr>
          </thead>
          <tbody>
            {sortedFilteredCryptos.slice(0, 10).map((crypto, index) => (
              <tr key={crypto.id} className="border-b border-gray-700 border">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  {crypto.name} ({crypto.symbol})
                </td>
                <td className="px-4 py-2">${crypto.quote[currency].price.toFixed(2)}</td>
                <td className={`px-4 py-2 ${crypto.quote[currency][`percent_change_${sortTimeFrame}`] >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {crypto.quote[currency][`percent_change_${sortTimeFrame}`].toFixed(2)}%
                </td>
                <td className="px-4 py-2">${crypto.quote[currency].market_cap.toLocaleString()}</td>
                <td className="px-4 py-2">${crypto.quote[currency].volume_24h.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      
    </div>
  );
};

export default CryptoTable;
