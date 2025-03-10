"use client";

import { useCryptoStore } from "@/store/useCryptoStore";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CryptoRealTimePlot from "@/components/CryptoRealTimePlot";

export default function DetailPage() {
  const { id } = useParams();
  const selectedCrypto = useCryptoStore((state) => state.selectedCrypto);
  const selectedCurrency = useCryptoStore((state) => state.selectedCurrency); 
  const [crypto] = useState(selectedCrypto);

  useEffect(() => {
    if (!crypto || crypto.id !== Number(id)) {
      console.log("Fetching data for crypto:", id);
      // Fetch data if required in future stages
    }
  }, [crypto, id]);

  if (!crypto) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const quote = crypto.quote?.[selectedCurrency] || {}; // Use selected currency data

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg max-w-2xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-2">
        {crypto.name} <span className="text-gray-400">({crypto.symbol})</span>
      </h1>
      <p className="text-lg text-gray-400">Rank #{crypto.cmc_rank}</p>
      <div className="mt-6 flex text-lg">
      <CryptoRealTimePlot/>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-lg">
        <div>
          <p className="text-gray-400">Current Price</p>
          <p className="text-white font-semibold">
            {quote.price?.toLocaleString(undefined, {
              style: "currency",
              currency: selectedCurrency,
            }) || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Market Cap</p>
          <p className="text-white font-semibold">
            {quote.market_cap?.toLocaleString(undefined, {
              style: "currency",
              currency: selectedCurrency,
              maximumFractionDigits: 0,
            }) || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Fully Diluted Valuation (FDV)</p>
          <p className="text-white font-semibold">
            {quote.fully_diluted_market_cap?.toLocaleString(undefined, {
              style: "currency",
              currency: selectedCurrency,
              maximumFractionDigits: 0,
            }) || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-gray-400">24h Volume</p>
          <p className="text-white font-semibold">
            {quote.volume_24h?.toLocaleString(undefined, {
              style: "currency",
              currency: selectedCurrency,
              maximumFractionDigits: 0,
            }) || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Circulating Supply</p>
          <p className="text-white font-semibold">
            {crypto.circulating_supply?.toLocaleString()} {crypto.symbol}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Total Supply</p>
          <p className="text-white font-semibold">
            {crypto.total_supply?.toLocaleString() || "N/A"} {crypto.symbol}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Price Changes</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-400">1h</p>
            <p className={quote.percent_change_1h >= 0 ? "text-green-400" : "text-red-400"}>
              {quote.percent_change_1h?.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-gray-400">24h</p>
            <p className={quote.percent_change_24h >= 0 ? "text-green-400" : "text-red-400"}>
              {quote.percent_change_24h?.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-gray-400">7d</p>
            <p className={quote.percent_change_7d >= 0 ? "text-green-400" : "text-red-400"}>
              {quote.percent_change_7d?.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
