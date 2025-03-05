"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { fetchDominanceData } from "@/utils/apiService";

// If the server data doesn't include "change", you can define an interface or fallback
interface ExtendedDominanceData {
  name: string;
  value: number;
  color?: string;
  change?: number; // Not in original DominanceData, but used for display
}

const DominanceChart = () => {
  const [dominance, setDominance] = useState<ExtendedDominanceData[]>([
    { name: "Bitcoin", value: 60.4, color: "#FF9900", change: 0.70 },
    { name: "Ethereum", value: 9.1, color: "#627EEA", change: -1.63 },
    { name: "Others", value: 30.5, color: "#8C8C8C", change: 0.93 },
  ]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Server data might only have { name, value }, so we map to add color/change if needed
        const data = await fetchDominanceData();
        const updatedData = data.map((item) => {
          // Provide defaults or map color based on name
          let color = "#8C8C8C";
          let change = 0; // fallback

          if (item.name.toLowerCase().includes("bitcoin")) {
            color = "#FF9900";
            change = 0.70; // Example fallback if not returned from API
          } else if (item.name.toLowerCase().includes("eth")) {
            color = "#627EEA";
            change = -1.63; // Example fallback
          } else {
            color = "#8C8C8C";
            change = 0.93; // Example fallback
          }

          return {
            ...item,
            color,
            change: (item as ExtendedDominanceData).change ?? change,
          };
        });
        setDominance(updatedData);
      } catch (err) {
        console.error("Dominance fetch error:", err);
        // Use fallback data if fetch fails
      }
    };

    fetchData();
  }, []);

  // Sum for progress bar
  const total = dominance.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <motion.div
      className="p-4 rounded-2xl shadow-xl border border-gray-800 bg-[#1F1F2E] w-full max-w-md"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title */}
      <Typography variant="h6" className="text-lg text-white font-semibold mb-4">
        Bitcoin Dominance
      </Typography>

      {/* Columns */}
      <Box className="flex justify-between mb-4">
        {dominance.map((item) => (
          <Box key={item.name} className="text-center min-w-[80px]">
            {/* Name */}
            <Typography variant="body2" className="text-gray-400 flex items-center justify-center gap-1">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </Typography>
            {/* Value */}
            <Typography variant="h5" className="font-bold text-md text-white">
              {item.value.toFixed(1)}%
            </Typography>
            {/* Change */}
            <Typography
              variant="body2"
              className={`${
                item.change && item.change >= 0 ? "text-green-400" : "text-red-400"
              } flex items-center justify-center`}
            >
              {item.change && item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change ?? 0).toFixed(2)}%
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Progress Bar */}
      <Box className="w-full h-2 bg-gray-700 rounded-full overflow-hidden flex">
        {dominance.map((item, idx) => {
          const segmentWidth = (item.value / total) * 100;
          return (
            <Box
              key={item.name + idx}
              className="h-full"
              style={{
                width: `${segmentWidth}%`,
                backgroundColor: item.color,
              }}
            />
          );
        })}
      </Box>
    </motion.div>
  );
};

export default DominanceChart;
