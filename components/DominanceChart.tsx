"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";
import {fetchDominanceData} from "@/utils/apiService";

/**
 * Example fetch function that calls your existing Next.js API route or apiService
 * Adjust endpoint & response shape as needed
 */


const DominanceChart = () => {
  const [dominance, setDominance] = useState<
    { name: string; value: number; color?: string }[]
  >([]);

  // Example fallback slices if data is empty
  const fallbackData = [
    { name: "BTC", value: 50, color: "#f2a900" },
    { name: "ETH", value: 25, color: "#627eea" },
    { name: "Others", value: 25, color: "#9c27b0" },
  ];

  // On mount, fetch real data
  useEffect(() => {
    fetchDominanceData()
      .then((data) => {
        // If your API doesn't provide a color property, we can manually assign some futuristic ones:
        const finalData = data.map((item: any) => {
          if (item.name.toLowerCase().includes("btc")) {
            return { ...item, color: "#f2a900" };
          } else if (item.name.toLowerCase().includes("eth")) {
            return { ...item, color: "#627eea" };
          }
          // default purple or random color
          return { ...item, color: item.color || "#8884d8" };
        });
        setDominance(finalData);
      })
      .catch((err) => {
        console.error("Dominance fetch error:", err);
        // fallback data if fetch fails
        setDominance(fallbackData);
      });
  }, []);

  // Fallback if dominance array is empty
  const chartData = dominance.length > 0 ? dominance : fallbackData;

  return (
    <motion.div
      className="p-4 rounded-2xl shadow-xl border border-gray-800 bg-gradient-to-br from-[#1A1A2E] to-[#13131F]"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.02 }}
    >
      <h2 className="text-gray-300 text-lg font-semibold mb-2">Dominance</h2>

      <div className="w-full h-40 relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={60}
              innerRadius={30}
              paddingAngle={3}
              stroke="none"
              blendStroke
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#sliceGradient-${index})`} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#2A2A3D", border: "none" }}
              labelStyle={{ color: "#ccc" }}
              itemStyle={{ color: "#ccc" }}
              cursor={{ fill: "rgba(255,255,255,0.1)" }}
            />
            {/* We define radial gradients for each slice to get a neon-like look */}
            {chartData.map((entry, idx) => (
              <defs key={`defs-${idx}`}>
                <radialGradient id={`sliceGradient-${idx}`} cx="50%" cy="50%" r="75%">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.4} />
                  <stop offset="70%" stopColor={entry.color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={1} />
                </radialGradient>
              </defs>
            ))}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DominanceChart;
