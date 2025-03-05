"use client";

import React, { useEffect, useState } from "react";
import { fetchFearAndGreedIndex } from "@/utils/apiService";
import { motion } from "framer-motion";

const FearAndGreedGauge = () => {
  const [indexValue, setIndexValue] = useState<number | null>(null);
  const [label, setLabel] = useState<string>("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFearAndGreedIndex();
        setIndexValue(data.value);

        if (data.value < 25) setLabel("Extreme Fear");
        else if (data.value < 45) setLabel("Fear");
        else if (data.value < 60) setLabel("Neutral");
        else if (data.value < 80) setLabel("Greed");
        else setLabel("Extreme Greed");
      } catch (error) {
        console.error("Error fetching Fear and Greed Index:", error);
        setLabel("Error");
      }
    };

    fetchData();
  }, []);

  const calculateArcPath = (
    startAngle: number,
    endAngle: number,
    radius: number,
    x: number,
    y: number
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 0 ${end.x} ${end.y}`;
  };
  

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const gaugeRadius = 50;
  const gaugeCenterX = 60;
  const gaugeCenterY = 70; // Shifted up to remove bottom half

  const segments = [
    { label: "Extreme Fear", endAngle: -54, color: "#DC2626" },
    { label: "Fear", endAngle: -18, color: "#F59E0B" },
    { label: "Neutral", endAngle: 18, color: "#EAB308" },
    { label: "Greed", endAngle: 54, color: "#16A34A" },
    { label: "Extreme Greed", endAngle: 90, color: "#16A34A" },
  ];

  const valueAngle = indexValue !== null ? (indexValue / 100) * 180 - 90 : -90;

  const pointerX =
    gaugeCenterX + (gaugeRadius - 5) * Math.cos(((valueAngle - 90) * Math.PI) / 180);
  const pointerY =
    gaugeCenterY + (gaugeRadius - 5) * Math.sin(((valueAngle - 90) * Math.PI) / 180);

  return (
    <motion.div
      className="p-3 rounded-2xl shadow-xl border border-gray-800 bg-[#1F1F2E] "
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-gray-300 text-sm font-semibold">Fear & Greed Index</h2>
      </div>

      {/* Gauge Chart */}
      <div className="relative flex justify-center">
        {indexValue !== null ? (
            <svg width="140" height="80">
            {/* Gauge Segments */}
            {segments.map((segment, idx) => {
              const startAngle = idx === 0 ? -90 : segments[idx - 1].endAngle;
              return (
              <path
              key={segment.label}
              d={calculateArcPath(
              startAngle,
              segment.endAngle,
              gaugeRadius,
              gaugeCenterX,
              gaugeCenterY
              )}
              stroke={segment.color}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              />
              );
            })}

            {/* Pointer */}
            <line
              x1={gaugeCenterX}
              y1={gaugeCenterY}
              x2={pointerX}
              y2={pointerY}
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx={gaugeCenterX} cy={gaugeCenterY} r="4" fill="#fff" />
            </svg>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>

      {/* Fear & Greed Value Display */}
      {indexValue !== null && (
        <div className="text-center mt-2">
          <p
            className="text-2xl font-bold"
            style={{
              color:
                segments.find((segment) => indexValue <= (segment.endAngle + 90) * (100 / 180))
                  ?.color || "#fff",
            }}
          >
            {indexValue}
          </p>
          <p className="text-sm text-gray-400">{label}</p>
        </div>
      )}
    </motion.div>
  );
};

export default FearAndGreedGauge;
