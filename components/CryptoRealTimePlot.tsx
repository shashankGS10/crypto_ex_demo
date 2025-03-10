/* eslint-disable @typescript-eslint/no-explicit-any */
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

  useEffect(() => {
    if (!ohlcvData.length || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = 900,
      height = 400;
    const margin = { top: 20, right: 50, bottom: 30, left: 50 };
    svg.selectAll("*").remove();
    const gChart = svg.append("g").attr("class", "chart-content");
    const gXAxis = svg.append("g").attr("class", "x-axis").attr("transform", `translate(0, ${height - margin.bottom})`);
    const gYAxis = svg.append("g").attr("class", "y-axis").attr("transform", `translate(${width - margin.right}, 0)`);
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(ohlcvData, (d) => new Date(d.time)) as [Date, Date])
      .range([margin.left, width - margin.right]);
    const yScale = d3
      .scaleLinear()
      .domain([d3.min(ohlcvData, (d) => d.low)! * 0.98, d3.max(ohlcvData, (d) => d.high)! * 1.02])
      .range([height - margin.bottom, margin.top]);
     
      const tickFormat: (d: Date) => string = 
      timeframe === "1D" ? d3.timeFormat("%H:%M") :
      timeframe === "7D" ? d3.timeFormat("%b %d") :
      timeframe === "1M" ? d3.timeFormat("%b %d") :
      timeframe === "1Y" ? d3.timeFormat("%b %Y") :
      d3.timeFormat("%Y");
      
    const tickCount = timeframe === "1D" ? 6 : timeframe === "7D" ? 5 : timeframe === "1M" ? 5 : timeframe === "1Y" ? 4 : 4;
    const zoomScale: {
      "1D": [number, number];
      "7D": [number, number];
      "1M": [number, number];
      "1Y": [number, number];
      All: [number, number];
    } = {
      "1D": [1, 240],
      "7D": [1, 168],
      "1M": [1, 24],
      "1Y": [1, 3],
      All: [1, 6],
    };
    

    function updateChart(transform: any) {
      const newXScale = transform.rescaleX(xScale);
      const domain = newXScale.domain();
    
      const visibleData = ohlcvData.filter((d) => {
        const time = new Date(d.time);
        return time >= domain[0] && time <= domain[1];
      });
    
      let newYScale = yScale;
      if (visibleData.length > 0) {
        const minLow = d3.min(visibleData, (d) => d.low)!;
        const maxHigh = d3.max(visibleData, (d) => d.high)!;
        newYScale = d3.scaleLinear()
          .domain([minLow * 0.98, maxHigh * 1.02]) // Dynamic adjustment
          .range([height - margin.bottom, margin.top]);
      }
      gYAxis.transition().duration(200).call(d3.axisRight(newYScale));
    
      gXAxis.transition()
  .duration(200)
  .call(d3.axisBottom(newXScale).ticks(tickCount).tickFormat((d) => tickFormat(d as Date)));
      gYAxis.transition().duration(200).call(d3.axisRight(newYScale));
      gChart.selectAll("*").remove();
      if (activeTab === "price" || activeTab === "marketCap") {
        const line = d3
          .line()
          .x((d) => newXScale(new Date((d as any).time)))
          .y((d) => newYScale((d as any).close))
          .curve(d3.curveMonotoneX);
        const gradientId = activeTab === "marketCap" ? "blueGradient" : "redGradient";
        const defs = gChart.append("defs");
        const gradient = defs
          .append("linearGradient")
          .attr("id", gradientId)
          .attr("x1", "0%")
          .attr("x2", "0%")
          .attr("y1", "0%")
          .attr("y2", "100%");
        gradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", activeTab === "marketCap" ? "#0057ff" : "#ff0000")
          .attr("stop-opacity", 0.6);
        gradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "transparent")
          .attr("stop-opacity", 0);
        gChart
          .append("path")
          .datum(ohlcvData)
          .attr("fill", `url(#${gradientId})`)
          .attr("stroke", activeTab === "marketCap" ? "#0057ff" : "#ff0000")
          .attr("stroke-width", 2)
          .attr("d", line as any);
      }
      if (activeTab === "candlestick") {
        const candleWidth = Math.max(5, (width - margin.left - margin.right) / ohlcvData.length - 2);
        gChart
          .selectAll(".candlestick")
          .data(ohlcvData)
          .enter()
          .append("line")
          .attr("x1", (d) => newXScale(new Date(d.time)))
          .attr("x2", (d) => newXScale(new Date(d.time)))
          .attr("y1", (d) => newYScale(d.high))
          .attr("y2", (d) => newYScale(d.low))
          .attr("stroke", "#32CD32")
          .attr("stroke-width", 2.5);
        gChart
          .selectAll(".candle")
          .data(ohlcvData)
          .enter()
          .append("rect")
          .attr("x", (d) => newXScale(new Date(d.time)) - candleWidth / 2)
          .attr("y", (d) => newYScale(Math.max(d.open, d.close)))
          .attr("width", candleWidth)
          .attr("height", (d) => Math.max(6, Math.abs(newYScale(d.open) - newYScale(d.close))))
          .attr("rx", 3)
          .attr("fill", (d) => (d.close > d.open ? "#4caf50" : "#ff0000"))
          .style("fill", (d) => {
            const isBullish = d.close >= d.open;
            const gradientId = isBullish ? "bullishGradient" : "bearishGradient";
            return `url(#${gradientId})`;
          })
          .style("fill", (d) => {
            return `url(#${d.close >= d.open ? "bullishGradient" : "bearishGradient"})`;
          })
          .each(function () {
            const parent = this.parentNode as Element;
            // Select the parent node with the correct type
            const defs = d3.select<Element, unknown>(parent).select<SVGDefsElement>("defs");
            if (defs.empty()) {
              const defsEnter = d3.select<Element, unknown>(parent).append<SVGDefsElement>("defs");
              const bullishGradient = defsEnter
                .append("linearGradient")
                .attr("id", "bullishGradient") 
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");
              bullishGradient
                .append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "#22c55e")
                .attr("stop-opacity", 1);
              bullishGradient
                .append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "#22c55e")
                .attr("stop-opacity", 0.2);
              const bearishGradient = defs
                .append("linearGradient")
                .attr("id", "bearishGradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");
              bearishGradient
                .append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "#ef4444")
                .attr("stop-opacity", 1);
              bearishGradient
                .append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "#ef4444")
                .attr("stop-opacity", 0.2);
            }
          });
      }
      gChart.selectAll(".price-label").remove();
      gChart
        .append("text")
        .attr("class", "price-label")
        .attr("x", width - margin.right)
        .attr("y", newYScale(ohlcvData[ohlcvData.length - 1].close))
        .attr("dy", ".35em")
        .attr("fill", "white")
        .attr("font-size", "14px")
        .attr("text-anchor", "end")
        .text(ohlcvData[ohlcvData.length - 1].close.toFixed(2));
    }

    updateChart(d3.zoomIdentity);

    const zoom = d3
  .zoom<SVGSVGElement, unknown>()
  .scaleExtent(zoomScale[timeframe])
  .translateExtent([[0, 0], [width, height]])
  .on("zoom", (event) => {
    updateChart(event.transform);
  });

d3.select(svgRef.current).call(zoom);

    const hoverLine = d3
      .select(svgRef.current)
      .select(".chart-content")
      .append("line")
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
      const currentTransform = d3.zoomTransform(svg.node() as any);
      const newXScale = currentTransform.rescaleX(xScale);
      const time = newXScale.invert(mouseX);
      const closestData = ohlcvData.reduce((prev, curr) =>
        Math.abs(new Date(curr.time).getTime() - time.getTime()) <
        Math.abs(new Date(prev.time).getTime() - time.getTime())
          ? curr
          : prev
      );
      const xPos = newXScale(new Date(closestData.time));
      hoverLine.attr("x1", xPos).attr("x2", xPos).style("opacity", 1);
      tooltip
        .style("opacity", 1)
        .html(
          `Open: ${closestData.open.toFixed(2)} <br> Close: ${closestData.close.toFixed(
            2
          )} <br> High: ${closestData.high.toFixed(2)} <br> Low: ${closestData.low.toFixed(2)}`
        )
        .style("left", `${event.pageX - 50}px`)
        .style("top", `${event.pageY - 50}px`);
    }).on("mouseleave", () => {
      hoverLine.style("opacity", 0);
      tooltip.style("opacity", 0);
    });
  }, [ohlcvData, activeTab, timeframe]);

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg relative">
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
      <motion.div className="flex justify-center border border-gray-700">
        <svg ref={svgRef} width={900} height={400}></svg>
      </motion.div>
      <div ref={tooltipRef} className="absolute bg-black text-white px-2 py-1 rounded opacity-0 pointer-events-none"></div>
    </div>
  );
}
