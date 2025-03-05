/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchCryptoData } from "@/utils/apiService";

const categories = ["🔥", "🆕", "👀"];

const Top10List = () => {
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("🔥");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Fetch data using a default currency, e.g., "USD"
    fetchCryptoData("USD")
      .then((data) => {
        setCryptos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching crypto data:", err);
        setLoading(false);
      });
  }, []);

  // Sort the cryptos based on the chosen category
  const getCategoryData = () => {
    switch (activeCategory) {
      case "🔥":
        // Trending: sort by 24h % change (descending)
        return [...cryptos]
          .sort(
            (a, b) =>
              (b.quote?.USD?.percent_change_24h ?? 0) -
              (a.quote?.USD?.percent_change_24h ?? 0)
          )
          .slice(0, 10);
      case "🆕":
        // New Added: sort by newest date_added first
        return [...cryptos]
          .sort(
            (a, b) =>
              new Date(b.date_added ?? 0).getTime() -
              new Date(a.date_added ?? 0).getTime()
          )
          .slice(0, 10);
      case "👀":
        // Most Visited: sort by 'views' (descending)
        return [...cryptos]
          .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
          .slice(0, 10);
      default:
        return [];
    }
  };

  const data = getCategoryData();

  return (
    <motion.div
      className="pt-4 pb-2 px-4 bg-[#1F1F2E] rounded-xl shadow-lg border border-gray-800 w-full"
      style={{ maxWidth: "340px" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-300 text-xs font-semibold">Top 10</h2>
        <h2 className="text-gray-300 text-xs font-semibold">
          {activeCategory === "🔥"
            ? "Trending"
            : activeCategory === "🆕"
            ? "New Added"
            : "Most Visited"}
        </h2>
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                activeCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-[#2A2A3D] text-gray-300 hover:bg-[#34344e]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-xs">Loading data...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-400 text-xs">No data available.</p>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700">
          {data.map((coin, index) => {
            const change24h = coin.quote?.USD?.percent_change_24h ?? 0;
            const isPositive = change24h >= 0;
            const price = coin.quote?.USD?.price ?? 0;

            return (
              <motion.div
                key={coin.id}
                className="flex items-center justify-between px-2 bg-[#2A2A3D] rounded-lg hover:bg-[#34344e] transition"
                whileHover={{ scale: 1.01 }}
              >
                {/* Left side: rank & name */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-gray-400 font-semibold">{index + 1}.</span>
                  <span className="text-gray-300 font-medium">
                    {coin.name} <span className="text-gray-500">({coin.symbol})</span>
                  </span>
                </div>

                {/* Right side: Price + 24h change */}
                <div className="text-right">
                  <p className="text-gray-300 text-xs">
                    ${price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </p>
                  <p
                    className={`text-xs font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}
                  >
                    {isPositive ? "+" : ""}
                    {change24h.toFixed(2)}%
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Top10List;
