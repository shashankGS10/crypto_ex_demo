/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCryptoStore } from "@/store/useCryptoStore";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CryptoRealTimePlot from "@/components/CryptoRealTimePlot";
import {
  fetchCryptoData,
  fetchDominanceData,
  fetchFearAndGreedIndex,
} from "@/utils/apiService";

import { TrendingUp, TrendingDown, Star, Timeline, Mood, SentimentDissatisfied, AttachMoney, BarChart, MonetizationOn, AccountBalanceWallet, ShowChart, Layers } from "@mui/icons-material";

export default function DetailPage() {
  const { id } = useParams();
  const selectedCurrency = useCryptoStore((state) => state.selectedCurrency);
  const [crypto, setCrypto] = useState<any>(null);
  const [dominance, setDominance] = useState<any>(null); // ✅ Add this line
  const [fearAndGreed, setFearAndGreed] = useState<any>(null);



  useEffect(() => {
    async function fetchData() {
      try {
        const cryptoData = await fetchCryptoData(selectedCurrency);
        const selectedCrypto = cryptoData.find((item) => item.id === Number(id));
        setCrypto(selectedCrypto);

        const dominanceData = await fetchDominanceData();
        setDominance(dominanceData);

        const fearAndGreedData = await fetchFearAndGreedIndex();
        setFearAndGreed(fearAndGreedData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
  }, [id, selectedCurrency]);

  if (!crypto) {
    return (
      <div className="p-4 text-center text-white">
        <div className="spinner-border text-white" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const quote = crypto.quote?.[selectedCurrency] || {};

  return (
    <div className="max-w-7xl w-full p-6 bg-gray-700 text-white rounded-xl shadow-lg border border-gray-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold flex items-center space-x-3">
            <span>{crypto.name}</span>
            <span className="text-gray-400 text-3xl">({crypto.symbol})</span>
          </h1>
          <p className="text-lg text-gray-400">Rank #{crypto.cmc_rank}</p>
        </div>
        <div className="text-right">
          <p className="text-6xl font-bold">${quote.price?.toLocaleString()}</p>
          <p
            className={`text-xl font-semibold ${
              quote.percent_change_24h >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {quote.percent_change_24h?.toFixed(2)}% (24h)
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full bg-gray-800 rounded-lg p-4 shadow-md mb-6 text-white">
        <CryptoRealTimePlot />
      </div>

      {/* Metrics Section */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-lg">
  {[
    { label: "Market Cap", value: quote.market_cap, icon: <BarChart className="text-blue-400" /> },
    { label: "Volume (24h)", value: quote.volume_24h, icon: <MonetizationOn className="text-green-400" /> },
    { label: "Fully Diluted Valuation (FDV)", value: quote.fully_diluted_market_cap, icon: <AttachMoney className="text-yellow-400" /> },
    { label: "Circulating Supply", value: crypto.circulating_supply, icon: <AccountBalanceWallet className="text-purple-400" /> },
    { label: "Total Supply", value: crypto.total_supply, icon: <ShowChart className="text-gray-400" /> },
    { label: "Max Supply", value: crypto.max_supply, icon: <Layers className="text-red-400" /> },
  ].map((item, index) => (
    <div key={index} className="bg-gray-800 p-5 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex items-center gap-3">
        {item.icon}
        <p className="text-gray-400 text-sm">{item.label}</p>
      </div>
      <p className="text-white font-semibold text-lg">
        {item.value?.toLocaleString(undefined, {
          style: item.label.includes("Supply") ? undefined : "currency",
          currency: selectedCurrency,
          maximumFractionDigits: 0,
        }) || "N/A"}
      </p>
    </div>
  ))}
</div>


{/* Price Performance Section */}
<div className="mt-6">
  <h2 className="text-2xl font-semibold mb-4">Price Performance</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-lg">
    {[
      { label: "Low (24h)", value: `$${(quote.price * (0.95 + Math.random() * 0.05)).toLocaleString()}`, icon: <TrendingDown className="text-red-400" /> },
      { label: "High (24h)", value: `$${(quote.price * (1 + Math.random() * 0.05)).toLocaleString()}`, icon: <TrendingUp className="text-green-400" /> },
      { label: "All-Time High", value: `$${(quote.price * (3 + Math.random() * 2)).toLocaleString()}`, icon: <Star className="text-yellow-400" /> },
      { label: "All-Time Low", value: `$${(quote.price * (0.01 + Math.random() * 0.1)).toLocaleString()}`, icon: <ShowChart className="text-gray-400" /> },
    ].map((item, index) => (
      <div key={index} className="bg-gray-800 p-5 rounded-lg shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          {item.icon}
          <p className="text-gray-400 text-sm">{item.label}</p>
        </div>
        <p className="text-white font-semibold text-lg">{item.value || "N/A"}</p>
      </div>
    ))}
  </div>
</div>

{/* Community Sentiment Section */}
<div className="mt-6">
  <h2 className="text-2xl font-semibold mb-4">Community Sentiment</h2>
  <div className="bg-gray-800 p-5 rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Mood className="text-green-400" />
        <span className="text-green-400 font-bold text-lg">Bullish</span>
      </div>
      <div className="flex items-center gap-2">
        <SentimentDissatisfied className="text-red-400" />
        <span className="text-red-400 font-bold text-lg">Bearish</span>
      </div>
    </div>
    <div className="relative pt-1">
      <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-700">
        <div
          style={{ width: `75%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
        >
          75%
        </div>
        <div
          style={{ width: `25%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 transition-all duration-500"
        >
          25%
        </div>
      </div>
    </div>
  </div>
</div>

{/* Market Insights */}
<div className="mt-6">
  <h2 className="text-2xl font-semibold mb-4">Market Insights</h2>
  <div className="grid grid-cols-2 gap-4 text-lg">
    {[
      { label: "Dominance", value: `${(40 + Math.random() * 30).toFixed(2)}%`, icon: <BarChart className="text-blue-400" /> },
      { label: "Fear & Greed Index", value: Math.floor(Math.random() * 101), icon: <Timeline className="text-purple-400" /> },
    ].map((item, index) => (
      <div key={index} className="bg-gray-800 p-5 rounded-lg shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          {item.icon}
          <p className="text-gray-400 text-sm">{item.label}</p>
        </div>
        <p className="text-white font-semibold text-lg">{item.value || "N/A"}</p>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}
