"use client";

import React, { useState, useEffect } from "react";
import { Box, Select, MenuItem, Typography } from "@mui/material";
import { SparkLineChart } from "@mui/x-charts";
import { motion } from "framer-motion";

/**
 * For demonstration, we have a small 'coins' array
 * If you prefer dynamic data, you can fetch coin symbols from an API.
 */
const coins = [
  { symbol: "bitcoin", name: "Bitcoin" },
  { symbol: "ethereum", name: "Ethereum" },
  { symbol: "dogecoin", name: "Dogecoin" },
];

const MarketCapChart: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>(coins[0].symbol);
  const [marketCapData, setMarketCapData] = useState<number[]>([]);

  // Calls your internal Next.js API route to fetch an array of marketCap values
  async function fetchMarketCapData(coinSymbol: string) {
    try {
      // Example endpoint: /api/crypto?symbol=bitcoin
      const response = await fetch(`/api/crypto?symbol=${coinSymbol}`);
      if (!response.ok) {
        throw new Error("Failed to fetch market cap data");
      }
      const result = await response.json();
      // result might be { marketCaps: number[] }
      setMarketCapData(result.marketCaps || []);
    } catch (error) {
      console.error("Error fetching market cap data:", error);
      setMarketCapData([]);
    }
  }

  useEffect(() => {
    if (!selectedCoin) return;
    fetchMarketCapData(selectedCoin);
    // Poll every 60s
    const intervalId = setInterval(() => {
      fetchMarketCapData(selectedCoin);
    }, 60000);
    return () => clearInterval(intervalId);
  }, [selectedCoin]);

  return (
    <motion.div
      className="p-4 rounded-xl bg-[#1F1F2E] shadow-lg border border-gray-800"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <Typography variant="subtitle1" className="text-gray-200 font-semibold mb-2">
        Market Cap
      </Typography>

      {/* Dropdown to pick coin */}
      <Select
        value={selectedCoin}
        onChange={(e) => setSelectedCoin(e.target.value as string)}
        className="w-full bg-[#2A2A3D] text-gray-300 border-none rounded-lg p-2 mb-3"
      >
        {coins.map((coin) => (
          <MenuItem key={coin.symbol} value={coin.symbol} className="bg-[#24243D] text-white">
            {coin.name}
          </MenuItem>
        ))}
      </Select>

      {/* Sparkline Chart */}
      <Box className="h-16">
        <SparkLineChart
          data={marketCapData}
          height={50}
          area={true}
          colors={["#00e676"]}
          showTooltip={false}
          disableAxisListener={true}
        />
      </Box>
    </motion.div>
  );
};

export default MarketCapChart;
