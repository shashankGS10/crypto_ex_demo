"use client";

import React, { useState, useEffect, useRef } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { fetchCryptoData, CryptoData } from "@/utils/apiService";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

const TopConstituentsDonutChart: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchCryptoData("USD");
        setCryptoData(data.slice(0, 10)); // Top 10 constituents + Others
      } catch (err) {
        console.error("Error fetching crypto data:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatData = () => {
    if (cryptoData.length === 0) return [];

    const totalMarketCap = cryptoData.reduce(
      (acc, coin) => acc + coin.quote.USD.market_cap,
      0
    );

    let formattedData = cryptoData.map((coin) => ({
      id: coin.id,
      value: (coin.quote.USD.market_cap / totalMarketCap) * 100,
      label: coin.symbol,
      name: coin.name,
      color: getColor(coin.symbol),
    }));

    const othersValue = formattedData
      .slice(9)
      .reduce((acc, coin) => acc + coin.value, 0);

    formattedData = formattedData.slice(0, 9);
    formattedData.push({
      id: "others",
      value: othersValue,
      label: "Others",
      name: "Others",
      color: "#6B7280",
    });

    return formattedData;
  };

  const getColor = (symbol: string) => {
    switch (symbol) {
      case "BTC": return "#F7931A";
      case "ETH": return "#627EEA";
      case "XRP": return "#23292F";
      case "USDT": return "#26A17B";
      case "BNB": return "#F3BA2F";
      case "SOL": return "#00FFA3";
      case "ADA": return "#0033AD";
      case "DOGE": return "#C2A633";
      default: return "#6B7280";
    }
  };

  const handleDownload = () => {
    if (chartRef.current) {
      const svgElement = chartRef.current.querySelector("svg");
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "top-constituents-chart.svg";
        link.click();
      }
    }
  };

  return (
    <motion.div
      ref={chartRef}
      className="p-3 bg-[#1A1A2E] rounded-2xl shadow-lg border border-[#2A2A42] w-full relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Top Constituents</h2>
        <button
          onClick={handleDownload}
          className="bg-[#2A2A42] p-2 rounded-md hover:bg-[#343458] transition"
        >
          <Download size={18} className="text-gray-300" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-400">{error}</div>
      ) : (
        <div className="relative">
          <PieChart
            series={[
              {
                data: formatData(),
                innerRadius: 80,
                outerRadius: 120,
                paddingAngle: 2,
                cornerRadius: 4,
                startAngle: -90,
                endAngle: 270,
                cx: 150,
                cy: 150,
              },
            ]}
            width={300}
            height={300}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            slotProps={{
              legend: { hidden: true },
            }}
            sx={{
              "& .MuiPieArc-arc": {
                stroke: "none",
              },
              "& .MuiPieArc-label": {
                fill: "white",
                fontSize: 10,
              },
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Constituents:</p>
              <p className="text-white text-3xl font-bold">100</p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {formatData().map((item) => (
          <div key={item.id} className="flex items-center">
        <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></div>
        <span className="text-white text-sm">{item.label}</span>
        <span className="text-white text-xs ml-2">{item.value.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TopConstituentsDonutChart;
