"use client";

import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { fetchCryptoData, CryptoData } from "@/utils/apiService";
import { Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";

const CryptoMarketCard: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("trending");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCryptoData("USD");
        setCryptoData(data);
      } catch (err) {
        setError("Failed to fetch market data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (_: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
    if (newFilter !== null) setFilter(newFilter);
  };

  const getFilteredData = () => {
    if (filter === "trending") {
      return cryptoData.slice(0, 3);
    } else if (filter === "new") {
      return cryptoData.slice(-3);
    } else if (filter === "mostViewed") {
      return cryptoData.sort((a, b) => b.quote.USD.market_cap - a.quote.USD.market_cap).slice(0, 3);
    }
    return [];
  };

  const filteredData = getFilteredData().map((crypto) => ({
    name: crypto.symbol.toUpperCase(),
    price: crypto.quote.USD.price,
  }));

  return (
    <Card className="bg-[#1F1F2E] shadow-lg rounded-xl border border-gray-800 w-full p-4">
      <CardContent>
        <Typography variant="h6" className="text-gray-200 font-semibold">
          Market Overview
        </Typography>

        {/* Toggle Buttons */}
        <div className="flex justify-center my-4">
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilterChange}
            className="bg-[#29293D] p-1 rounded-lg"
          >
            <ToggleButton value="trending" className={`text-gray-300 px-3 py-2 rounded-md ${filter === "trending" ? "bg-[#3B3B52] text-white" : ""}`}>
              🔥
            </ToggleButton>
            <ToggleButton value="new" className={`text-gray-300 px-3 py-2 rounded-md ${filter === "new" ? "bg-[#3B3B52] text-white" : ""}`}>
              ⏳
            </ToggleButton>
            <ToggleButton value="mostViewed" className={`text-gray-300 px-3 py-2 rounded-md ${filter === "mostViewed" ? "bg-[#3B3B52] text-white" : ""}`}>
              👁️
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        {loading ? (
          <Typography className="text-gray-400">Loading...</Typography>
        ) : error ? (
          <Typography className="text-red-500">{error}</Typography>
        ) : (
          <LineChart
            xAxis={[{ dataKey: "name", scaleType: "band" }]}
            series={[{ dataKey: "price", label: "Price (USD)", color: "#3b82f6", showMark: false }]}
            dataset={filteredData}
            height={120}
            margin={{ top: 10, right: 10, bottom: 20, left: 30 }}
            sx={{
              ".MuiLineElement-root": { strokeWidth: 2 },
              ".MuiGridLines-root": { display: "none" },
              ".MuiAxis-root": { color: "white" },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoMarketCard;
