"use client";

import { useCryptoStore } from "@/store/useCryptoStore";
import { motion } from "framer-motion";
import Image from "next/image";

export default function TrendingList() {
  const cryptos = useCryptoStore((state) => state.cryptos);
  const currency = useCryptoStore((state) => state.selectedCurrency);

  // Define "trending" as top 10 gainers by 24h percentage change
  const trending = [...cryptos]
    .sort((a, b) => {
      const aChange = a.quote[currency]?.percent_change_24h ?? -Infinity;
      const bChange = b.quote[currency]?.percent_change_24h ?? -Infinity;
      return bChange - aChange;
    })
    .slice(0, 10);

  return (
    <div className="bg-[#1E1E2E] p-4 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold text-gray-300 mb-4">🔥 Trending (24h Gainers)</h2>
      {trending.length === 0 ? (
        <p className="text-sm text-gray-500">No data available.</p>
      ) : (
        <ul className="space-y-3">
          {trending.map((coin, index) => {
            const change = coin.quote[currency]?.percent_change_24h;
            const isPositive = change !== undefined ? change >= 0 : false;

            return (
              <motion.li
                key={coin.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#24243D] transition-all duration-300 hover:bg-[#2A2A3D] hover:shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* Left Side: Rank & Name */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm font-semibold">{index + 1}.</span>
                  <Image
                    src={`https://cryptoicons.org/api/icon/${coin.symbol.toLowerCase()}/32`}
                    alt={coin.name}
                    className="w-6 h-6"
                    onError={(e) => (e.currentTarget.style.display = "none")} // Hide if icon not found
                  />
                  <span className="text-gray-300 font-medium">
                    {coin.name} <span className="text-gray-500">({coin.symbol})</span>
                  </span>
                </div>

                {/* Right Side: Percentage Change */}
                <span
                  className={`font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}
                >
                  {change?.toFixed(2)}%
                </span>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
