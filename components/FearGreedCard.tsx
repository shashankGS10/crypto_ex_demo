"use client";

import React from "react";
import { motion } from "framer-motion";

export default function FearGreedCard() {
  const fearGreedIndex = 29; // sample
  const sentiment = fearGreedIndex >= 50 ? "Greed" : "Fear";

  return (
    <motion.div
      className="p-4 rounded-xl bg-[#1F1F2E] shadow-lg border border-gray-800"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-gray-200 font-semibold mb-2">Fear &amp; Greed</h2>
      <p className="text-3xl text-white font-bold">{fearGreedIndex}</p>
      <p className="text-sm text-gray-300">
        {sentiment} ({fearGreedIndex}/100)
      </p>
      <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
        <div
          className={`h-2 rounded-full ${
            sentiment === "Greed" ? "bg-green-400" : "bg-red-500"
          }`}
          style={{ width: `${fearGreedIndex}%` }}
        />
      </div>
    </motion.div>
  );
}
