"use client";

import React, { useEffect, useState } from "react";
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from "@mui/x-charts/Gauge";
import { fetchFearAndGreedIndex } from "@/utils/apiService";
import { motion } from "framer-motion";

const FearGreedPointer = () => {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) return null; // No value to display

  const markerPos = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };

  return (
    <circle cx={markerPos.x} cy={markerPos.y} r={6} fill="white" stroke="black" strokeWidth={2} />
  );
};

const FearAndGreedGauge = () => {
  const [indexValue, setIndexValue] = useState<number | null>(null);
  const [label, setLabel] = useState<string>("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFearAndGreedIndex();
        setIndexValue(data.value);

        // Set label text based on index value
        if (data.value < 25) setLabel("Extreme Fear");
        else if (data.value < 50) setLabel("Fear");
        else if (data.value < 75) setLabel("Greed");
        else setLabel("Extreme Greed");
      } catch (error) {
        console.error("Error fetching Fear and Greed Index:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      className="p-4 rounded-2xl shadow-xl border border-gray-800 bg-[#1F1F2E]"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-gray-300 text-md font-semibold">Fear & Greed</h2>
      </div>

      {/* Gauge Chart */}
      <div className="relative flex justify-center">
        {indexValue !== null ? (
          <GaugeContainer
            width={180}
            height={70}
            startAngle={-90}
            endAngle={90}
            value={indexValue}
          >
            {/* Gauge Reference Arc (Segmented Colors) */}
            <GaugeReferenceArc
              startAngle={-90}
              endAngle={-45}
              strokeWidth={15}
              color="#DC2626" // Red (Extreme Fear)
            />
            <GaugeReferenceArc
              startAngle={-45}
              endAngle={0}
              strokeWidth={15}
              color="#F59E0B" // Orange (Fear)
            />
            <GaugeReferenceArc
              startAngle={0}
              endAngle={45}
              strokeWidth={15}
              color="#EAB308" // Yellow (Greed)
            />
            <GaugeReferenceArc
              startAngle={45}
              endAngle={90}
              strokeWidth={15}
              color="#16A34A" // Green (Extreme Greed)
            />

            {/* Animated Gauge Value Arc */}
            <GaugeValueArc strokeWidth={10} color="white" />
            {/* White Marker (Pointer) */}
            <FearGreedPointer />
          </GaugeContainer>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>

      {/* Fear & Greed Value Display */}
      {indexValue !== null && (
        <div className="text-center">
          <p className="text-2xl text-white font-bold">{indexValue}</p>
          <p className="text-md text-gray-400">{label}</p>
        </div>
      )}
    </motion.div>
  );
};

export default FearAndGreedGauge;
