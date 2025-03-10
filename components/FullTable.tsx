"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCryptoStore } from "@/store/useCryptoStore";
import { fetchCryptoData } from "@/utils/apiService";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function FullTable() {
  const cryptos = useCryptoStore((state) => state.cryptos);
  const setCryptos = useCryptoStore((state) => state.setCryptos);
  const currency = useCryptoStore((state) => state.selectedCurrency);
  const setCurrency = useCryptoStore((state) => state.setSelectedCurrency);
  const setSelectedCrypto = useCryptoStore((state) => state.setSelectedCrypto);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch crypto data on initial load and whenever currency changes
  useEffect(() => {
    setError(null);
    setLoading(true);
    fetchCryptoData(currency)
      .then((data) => {
        setCryptos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Unable to load data: ${err.message}`);
        setLoading(false);
      });
  }, [currency, setCryptos]);

  // Filter cryptos based on search query (by name or symbol, case-insensitive)
  const filteredCryptos = useMemo(() => {
    const query = search.toLowerCase();
    return cryptos.filter((coin) => {
      if (!query) return true;
      return (
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query)
      );
    });
  }, [cryptos, search]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-gradient-to-r from-black via-blue-800 to-black text-white border-gray-600 rounded-xl border-2">
    
        <h1 className="text-white text-2xl md:text-3xl font-bold py-8">
          Explore All Coins 💰
        </h1>
    
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        {/* Search bar */}
        <Input
          type="text"
          placeholder="Search cryptocurrency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />
        {/* Currency selector */}
        <Select value={currency} onValueChange={(val) => setCurrency(val)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD – US Dollar</SelectItem>
            <SelectItem value="EUR">EUR – Euro</SelectItem>
            <SelectItem value="CHF">CHF – Swiss Franc</SelectItem>
            <SelectItem value="GBP">GBP – British Pound</SelectItem>
            <SelectItem value="INR">INR – Indian Rupee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-8 text-center">Loading cryptocurrency data...</div>
      ) : (
        // Crypto table
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Name</TableHead>
              <TableHead className="text-right">Price ({currency})</TableHead>
              <TableHead className="text-right">1h %</TableHead>
              <TableHead className="text-right">24h %</TableHead>
              <TableHead className="text-right">7d %</TableHead>
              <TableHead className="text-right">Market Cap ({currency})</TableHead>
              <TableHead className="text-right">Volume (24h)</TableHead>
              <TableHead className="text-right">Circulating Supply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCryptos.map((coin) => {
              const quote = coin.quote[currency] || {};
              return (
                <TableRow
                  key={coin.id}
                  className="hover:bg-slate-600 cursor-pointer"
                  onClick={() => {
                    setSelectedCrypto(coin); // Save selected crypto
                    router.push(`/dashboard/${coin.id}`); // Navigate
                  }}
                >
                  <TableCell className="font-medium">
                    {coin.name} <span className="text-gray-500">({coin.symbol})</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {quote.price !== undefined
                      ? quote.price.toLocaleString(undefined, {
                          style: "currency",
                          currency: currency,
                        })
                      : "–"}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      quote.percent_change_1h >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {quote.percent_change_1h?.toFixed(2)}%
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      quote.percent_change_24h >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {quote.percent_change_24h?.toFixed(2)}%
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      quote.percent_change_7d >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {quote.percent_change_7d?.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {quote.market_cap !== undefined
                      ? quote.market_cap.toLocaleString(undefined, {
                          style: "currency",
                          currency: currency,
                          maximumFractionDigits: 0,
                        })
                      : "–"}
                  </TableCell>
                  <TableCell className="text-right">
                    {quote.volume_24h !== undefined
                      ? quote.volume_24h.toLocaleString(undefined, {
                          style: "currency",
                          currency: currency,
                          maximumFractionDigits: 0,
                        })
                      : "–"}
                  </TableCell>
                  <TableCell className="text-right">
                    {coin.circulating_supply
                      ? coin.circulating_supply.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })
                      : "–"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
