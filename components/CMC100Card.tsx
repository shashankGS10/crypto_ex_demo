"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CMC100Card() {
  // Example placeholders
  const price = 178.14;
  const change = -7.71;

  return (
    <motion.div
      className="p-4 rounded-xl bg-[#1F1F2E] shadow-lg border border-gray-800"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-gray-200 font-semibold mb-2">CMC100</h2>
      <p className="text-xl text-white">${price.toFixed(2)}</p>
      <p className={change < 0 ? "text-red-500" : "text-green-500"}>
        {change < 0 ? "▼" : "▲"} {Math.abs(change).toFixed(2)}%
      </p>
      {/* Optional sparkline or chart placeholder */}
      <div className="mt-2 h-8 text-gray-500 text-xs">
        (Sparkline or chart placeholder)
      </div>
    </motion.div>
  );
}
