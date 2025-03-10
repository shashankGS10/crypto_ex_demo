import * as d3 from "d3";
import { useEffect } from "react";

interface ChartRendererProps {
  svgRef: React.RefObject<SVGSVGElement>;
  ohlcvData: any[];
  activeTab: string;
  zoomTransform: d3.ZoomTransform;
  width: number;
  height: number;
}

export default function ChartRenderer({ svgRef, ohlcvData, activeTab, zoomTransform, width, height }: ChartRendererProps) {
  useEffect(() => {
    if (!svgRef.current || ohlcvData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const xScale = d3.scaleTime()
      .domain(d3.extent(ohlcvData, (d) => new Date(d.time)) as [Date, Date])
      .range([50, width - 60]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(ohlcvData, (d) => d.low)! * 0.98, d3.max(ohlcvData, (d) => d.high)! * 1.02])
      .range([height - 30, 20]);

    if (activeTab === "price" || activeTab === "marketCap") {
      const line = d3.line()
        .x((d) => xScale(new Date((d as any).time)))
        .y((d) => yScale((d as any).close))
        .curve(d3.curveMonotoneX);

      svg.append("path")
        .datum(ohlcvData)
        .attr("fill", "none")
        .attr("stroke", activeTab === "marketCap" ? "#0057ff" : "#ff0000")
        .attr("stroke-width", 2)
        .attr("d", line as any);
    }

    if (activeTab === "candlestick") {
      svg.selectAll(".candlestick")
        .data(ohlcvData)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(new Date(d.time)) - 5)
        .attr("y", (d) => yScale(Math.max(d.open, d.close)))
        .attr("width", 10)
        .attr("height", (d) => Math.max(4, Math.abs(yScale(d.open) - yScale(d.close))))
        .attr("fill", (d) => d.close > d.open ? "#4caf50" : "#ff0000");
    }

    svg.append("g")
      .attr("transform", `translate(0, ${height - 30})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat("%H:%M")));

    svg.append("g")
      .attr("transform", `translate(${width - 60}, 0)`)
      .call(d3.axisRight(yScale));

  }, [svgRef, ohlcvData, activeTab, zoomTransform, width, height]);

  return null;
}
