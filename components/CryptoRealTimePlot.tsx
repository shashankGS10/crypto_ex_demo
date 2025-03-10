"use client";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { useMockCryptoData } from "@/utils/useMockCryptoData";
import { motion } from "framer-motion";

export default function CryptoRealTimePlot() {
  const [activeTab, setActiveTab] = useState<"price" | "marketCap" | "candlestick">("price");
  const [timeframe, setTimeframe] = useState<"1D" | "7D" | "1M" | "1Y" | "All">("1D");
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const ohlcvData = useMockCryptoData(timeframe, 40);
  const [zoomTransform, setZoomTransform] = useState(d3.zoomIdentity);

  useEffect(() => {
    if (!ohlcvData.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 900, height = 400;
    const margin = { top: 20, right: 60, bottom: 30, left: 50 };

    svg.selectAll("*").remove();

    const tickFormat =
      timeframe === "1D" ? d3.timeFormat("%H:%M") :
      timeframe === "7D" ? d3.timeFormat("%b %d") :
      timeframe === "1M" ? d3.timeFormat("%b %d") :
      timeframe === "1Y" ? d3.timeFormat("%b %Y") :
      d3.timeFormat("%Y");

    const tickCount = timeframe === "1D" ? 6 :
                      timeframe === "7D" ? 5 :
                      timeframe === "1M" ? 5 :
                      timeframe === "1Y" ? 4 : 4;

    const zoomScale = {
      "1D": [1, 240],
      "7D": [1, 168],
      "1M": [1, 30],
      "1Y": [1, 4],
      "All": [1, 6]
    };

    const zoom = d3.zoom()
      .scaleExtent(zoomScale[timeframe])
      .translateExtent([[0, 0], [width, height]])
      .on("zoom", (event) => {
        setZoomTransform(event.transform);
      });

    svg.call(zoom);

    const xScale = d3.scaleTime()
      .domain(d3.extent(ohlcvData, (d) => new Date(d.time)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(ohlcvData, (d) => d.low)! * 0.98, d3.max(ohlcvData, (d) => d.high)! * 1.02])
      .range([height - margin.bottom, margin.top]);

    const g = svg.append("g").attr("transform", zoomTransform);

    if (activeTab === "price" || activeTab === "marketCap") {
      const line = d3.line()
        .x((d) => xScale(new Date((d as any).time)))
        .y((d) => yScale((d as any).close))
        .curve(d3.curveMonotoneX);

      const gradientId = activeTab === "marketCap" ? "blueGradient" : "redGradient";

      const defs = g.append("defs");
      const gradient = defs.append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "100%");

      gradient.append("stop").attr("offset", "0%").attr("stop-color", activeTab === "marketCap" ? "#0057ff" : "#ff0000").attr("stop-opacity", 0.6);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", "transparent").attr("stop-opacity", 0);

      g.append("path")
        .datum(ohlcvData)
        .attr("fill", `url(#${gradientId})`)
        .attr("stroke", activeTab === "marketCap" ? "#0057ff" : "#ff0000")
        .attr("stroke-width", 2)
        .attr("d", line as any);
    }

    if (activeTab === "candlestick") {
      const candleWidth = Math.max(5, (width - margin.left - margin.right) / ohlcvData.length - 2);

      g.selectAll(".candlestick")
        .data(ohlcvData)
        .enter()
        .append("line")
        .attr("x1", (d) => xScale(new Date(d.time)))
        .attr("x2", (d) => xScale(new Date(d.time)))
        .attr("y1", (d) => yScale(d.high))
        .attr("y2", (d) => yScale(d.low))
        .attr("stroke", "#32CD32")
        .attr("stroke-width", 2.5);

      g.selectAll(".candle")
        .data(ohlcvData)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(new Date(d.time)) - candleWidth / 2)
        .attr("y", (d) => yScale(Math.max(d.open, d.close)))
        .attr("width", candleWidth)
        .attr("height", (d) => Math.max(4, Math.abs(yScale(d.open) - yScale(d.close))))
        .attr("rx", 3)
        .attr("fill", (d) => (d.close > d.open ? "#4caf50" : "#ff0000"));
    }

    const hoverLine = g.append("line")
      .attr("class", "hover-line")
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4")
      .style("opacity", 0);

    const tooltip = d3.select(tooltipRef.current);

    svg.on("mousemove", (event) => {
      const [mouseX] = d3.pointer(event);
      const zoomedXScale = zoomTransform.rescaleX(xScale);
      const time = zoomedXScale.invert(mouseX);

      const closestData = ohlcvData.reduce((prev, curr) =>
        Math.abs(new Date(curr.time).getTime() - time.getTime()) <
        Math.abs(new Date(prev.time).getTime() - time.getTime()) ? curr : prev
      );

      const xPos = zoomedXScale(new Date(closestData.time));

      hoverLine.attr("x1", xPos)
        .attr("x2", xPos)
        .style("opacity", 1);

      tooltip.style("opacity", 1)
        .html(`Open: ${closestData.open.toFixed(2)} <br> Close: ${closestData.close.toFixed(2)} <br> High: ${closestData.high.toFixed(2)} <br> Low: ${closestData.low.toFixed(2)}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`);
    }).on("mouseleave", () => {
      hoverLine.style("opacity", 0);
      tooltip.style("opacity", 0);
    });

  }, [ohlcvData, activeTab, timeframe, svgRef, zoomTransform]);

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
      <motion.div animate={{ opacity: 1, y: 0 }}>
        <svg ref={svgRef} width={900} height={400}></svg>
      </motion.div>
      <div ref={tooltipRef} className="absolute bg-black text-white px-2 py-1 rounded opacity-0 pointer-events-none"></div>
    </div>
  );

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
      <div className="flex gap-4 mb-4 justify-start">
        {["price", "marketCap", "candlestick"].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 text-sm rounded ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab === "price" ? "Price" : tab === "marketCap" ? "Market Cap" : "Candlestick"}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-end space-x-2 mb-4">
        {["1D", "7D", "1M", "1Y", "All"].map((time) => (
          <motion.button
            key={time}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded ${
              timeframe === time ? "bg-gray-800 text-white" : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setTimeframe(time as any)}
          >
            {time}
          </motion.button>
        ))}
      </div>

      <motion.div animate={{ opacity: 1, y: 0 }}>
        <svg ref={svgRef} width={900} height={400}></svg>
      </motion.div>

      <div
        ref={tooltipRef}
        className="absolute bg-black text-white px-2 py-1 rounded opacity-0 pointer-events-none"
      ></div>
    </div>
  );
}
