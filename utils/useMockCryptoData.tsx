// hooks/useMockCryptoData.ts
import { useState, useEffect } from "react";

interface MockOHLCVData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function useMockCryptoData(timeframe: string, dataPoints: number = 40) {
  const [ohlcvData, setOhlcvData] = useState<MockOHLCVData[]>([]);

  useEffect(() => {
    const generateMockData = (startTime: Date) => {
      const newPrice = 50000 + Math.random() * 2000 - 1000;
      const open = newPrice + (Math.random() * 100 - 50);
      const close = newPrice + (Math.random() * 100 - 50);
      const high = Math.max(open, close) + Math.random() * 100;
      const low = Math.min(open, close) - Math.random() * 100;
      const volume = Math.random() * 100000;

      return {
        time: startTime.toISOString(),
        open,
        high,
        low,
        close,
        volume,
      };
    };

    // Generate historical timestamps based on timeframe
    const now = new Date();
    let interval = 1 * 60 * 60 * 1000; // Default: 1 Hour per point (1D)
    if (timeframe === "7D") interval = 6 * 60 * 60 * 1000; // 6 Hours per point
    if (timeframe === "1M") interval = 12 * 60 * 60 * 1000; // 12 Hours per point
    if (timeframe === "1Y") interval = 3 * 24 * 60 * 60 * 1000; // 3 Days per point
    if (timeframe === "All") interval = 10 * 24 * 60 * 60 * 1000; // 10 Days per point

    const historicalData = Array.from({ length: dataPoints }).map((_, i) => {
      const time = new Date(now.getTime() - i * interval);
      return generateMockData(time);
    }).reverse();

    setOhlcvData(historicalData);

    // Simulate real-time updates
    const intervalId = setInterval(() => {
      setOhlcvData((prevData) => {
        const updatedData = [...prevData.slice(1), generateMockData(new Date())];
        return updatedData;
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, [timeframe, dataPoints]);

  return ohlcvData;
}
