"use client";

import React, { useEffect, useState } from "react";
import { SparkLineChart } from "@mui/x-charts/SparklineChart";
import { fetchCryptoData, CryptoData } from "@/utils/apiService";

const LoadingPlaceholder = () => (
  <p className="text-gray-500 mt-2">Loading...</p>
);

const ErrorPlaceholder = () => (
  <p className="text-red-500 mt-2">Failed to load data</p>
);

export default function CMC100Card() {
  const [btcData, setBtcData] = useState<CryptoData | null>(null);
  const [historicalData, setHistoricalData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Define a state to hold the chart color
  const [chartColor, setChartColor] = useState("#DC2626"); // Default to red

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const data: CryptoData[] = await fetchCryptoData("USD");
        const btc = data.find((item) => item.symbol === "BTC");

        if (btc) {
          setBtcData(btc);

          // Determine chart color based on percentage change
          setChartColor(btc.quote.USD.percent_change_24h < 0 ? "#DC2626" : "#22C55E");

          // Fetch 30-day price trend using percent change approximation
          const basePrice = btc.quote.USD.price;
          const percentChange30d = btc.quote.USD.percent_change_7d / 100; // Approximate % change

          const historicalPrices = Array.from({ length: 30 }, (_, i) => {
            const price = basePrice * (1 + percentChange30d * (i / 30) * (Math.random() - 0.5));
            return price;
          });

          setHistoricalData(historicalPrices);
        }
      } catch (error) {
        console.error("Error fetching BTC data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 rounded-2xl bg-[#1F1F2E] shadow-lg border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-gray-200 font-semibold text-md">CMC100</h2>
      </div>

      {/* Price Display */}
      {loading ? (
        <LoadingPlaceholder />
      ) : error ? (
        <ErrorPlaceholder />
      ) : btcData ? (
        <>
          <p className="text-lg text-white font-bold mt-1">${btcData.quote.USD.price.toFixed(2)}</p>
          <p className={`text-sm font-medium ${btcData.quote.USD.percent_change_24h < 0 ? "text-red-500" : "text-green-500"}`}>
            {btcData.quote.USD.percent_change_24h < 0 ? "▼" : "▲"}{" "}
            {Math.abs(btcData.quote.USD.percent_change_24h).toFixed(2)}%
          </p>
        </>
      ) : null}

      {/* Chart Section */}
      <div className="h-8 w-14 mt-3">
        {historicalData.length > 0 ? (
          <SparkLineChart
            data={historicalData}
            width={160}
            height={40}
            colors={[chartColor]}
          />
        ) : (
          <p className="text-gray-500">Loading chart...</p>
        )}
      </div>
    </div>
  );
}
