"use client";

import React, { useEffect, useState } from "react";
import { fetchCryptoData, CryptoData } from "@/utils/apiService";
import { motion } from "framer-motion";

interface CoinListCardProps {
  title: string;
  type: "mostVisited" | "trending";
}

export default function CoinListCard({ title, type }: CoinListCardProps) {
  const [coins, setCoins] = useState<CryptoData[]>([]);

  useEffect(() => {
    fetchCryptoData("USD")
      .then((data) => {
        const sorted = [...data];
        if (type === "trending") {
          // sort by 24h % desc
          sorted.sort((a, b) => {
            return (b.quote.USD.percent_change_24h ?? 0) - (a.quote.USD.percent_change_24h ?? 0);
          });
        } else {
          // mock: sort by name length or something as 'most visited'
          // replace with real logic if you have a 'views' or 'popularity' property
          sorted.sort((a, b) => b.name.length - a.name.length);
        }
        setCoins(sorted.slice(0, 5)); // top 5
      })
      .catch(console.error);
  }, [type]);

  return (
    <motion.div
      className="p-4 rounded-xl bg-[#1F1F2E] shadow-lg border border-gray-800"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-gray-200 font-semibold mb-2 py-4">{title}</h2>
      {coins.length === 0 ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <ul className="space-y-2">
          {coins.map((coin, index) => (
            <li key={coin.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">{index + 1}</span>
                <span className="text-gray-200 font-medium">{coin.name}</span>
              </div>
              <div className="text-gray-300">
                ${coin.quote.USD.price.toFixed(4)}
                <span
                  className={
                    coin.quote.USD.percent_change_24h >= 0 ? "text-green-500 ml-2" : "text-red-500 ml-2"
                  }
                >
                  {coin.quote.USD.percent_change_24h.toFixed(2)}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
