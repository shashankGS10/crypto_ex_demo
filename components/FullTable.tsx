"use client";

import { useEffect, useState, useMemo } from "react";
import { useCryptoStore } from "@/store/useCryptoStore";
import { fetchCryptoData } from "@/utils/apiService";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import {
   
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";

import {Input} from "@/components/ui/input";

export default function FullTable() {
  const cryptos = useCryptoStore((state) => state.cryptos);
  const setCryptos = useCryptoStore((state) => state.setCryptos);
  const currency = useCryptoStore((state) => state.selectedCurrency);
  const setCurrency = useCryptoStore((state) => state.setSelectedCurrency);
  const setSelectedCrypto = useCryptoStore((state) => state.setSelectedCrypto);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("market_cap");  // default sort by Market Cap
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch crypto data on initial load and whenever currency changes
  useEffect(() => {
    setError(null);
    setLoading(true);
    fetchCryptoData(currency).then(data => {
      setCryptos(data);
      setLoading(false);
    }).catch((err) => {
      setError(`Unable to load data: ${err.message}`);
      setLoading(false);
    });
  }, [currency, setCryptos]);

  // Filter cryptos based on search query (by name or symbol, case-insensitive)&#8203;:contentReference[oaicite:8]{index=8}
  const filteredCryptos = useMemo(() => {
    const query = search.toLowerCase();
    return cryptos.filter(coin => {
      if (!query) return true;
      return coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query);
    });
  }, [cryptos, search]);

  // Sort the filtered list based on selected sort field (descending by default)
  const sortedCryptos = useMemo(() => {
    return [...filteredCryptos].sort((a, b) => {
      // Get the values to compare based on sortField
      const aQuote = a.quote[currency] || {};
      const bQuote = b.quote[currency] || {};
      let aVal: number, bVal: number;
      switch (sortField) {
        case "price":
          aVal = aQuote.price ?? 0;
          bVal = bQuote.price ?? 0;
          break;
        case "percent_change_1h":
          aVal = aQuote.percent_change_1h ?? 0;
          bVal = bQuote.percent_change_1h ?? 0;
          break;
        case "percent_change_24h":
          aVal = aQuote.percent_change_24h ?? 0;
          bVal = bQuote.percent_change_24h ?? 0;
          break;
        case "percent_change_7d":
          aVal = aQuote.percent_change_7d ?? 0;
          bVal = bQuote.percent_change_7d ?? 0;
          break;
        case "volume_24h":
          aVal = aQuote.volume_24h ?? 0;
          bVal = bQuote.volume_24h ?? 0;
          break;
        case "circulating_supply":
          aVal = a.circulating_supply ?? 0;
          bVal = b.circulating_supply ?? 0;
          break;
        case "market_cap":
        default:
          aVal = aQuote.market_cap ?? 0;
          bVal = bQuote.market_cap ?? 0;
      }
      // Sort descending: higher value first
      return bVal - aVal;
    });
  }, [filteredCryptos, sortField, currency]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <>
    <div className="p-4 bg-gradient-to-r from-black via-blue-800 to-black text-white border-gray-600 rounded-xl border-2">
      {/* Dashboard Controls: Search and selectors */}
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
        {/* Sort-by selector */}
        <Select value={sortField} onValueChange={(val) => setSortField(val)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="percent_change_1h">1h % Change</SelectItem>
            <SelectItem value="percent_change_24h">24h % Change</SelectItem>
            <SelectItem value="percent_change_7d">7d % Change</SelectItem>
            <SelectItem value="market_cap">Market Cap</SelectItem>
            <SelectItem value="volume_24h">Volume (24h)</SelectItem>
            <SelectItem value="circulating_supply">Circulating Supply</SelectItem>
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
            {sortedCryptos.map((coin) => {
              const quote = coin.quote[currency] || {};
              return (
                <TableRow 
                  key={coin.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCrypto(coin)}  // select coin for potential detail view
                >
                  <TableCell className="font-medium">{coin.name} <span className="text-gray-500">({coin.symbol})</span></TableCell>
                  <TableCell className="text-right">
                    {quote.price !== undefined 
                      ? quote.price.toLocaleString(undefined, { style: "currency", currency: currency }) 
                      : "–"}
                  </TableCell>
                  <TableCell className={`text-right ${quote.percent_change_1h >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {quote.percent_change_1h?.toFixed(2)}%
                  </TableCell>
                  <TableCell className={`text-right ${quote.percent_change_24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {quote.percent_change_24h?.toFixed(2)}%
                  </TableCell>
                  <TableCell className={`text-right ${quote.percent_change_7d >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {quote.percent_change_7d?.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {quote.market_cap !== undefined 
                      ? quote.market_cap.toLocaleString(undefined, { style: "currency", currency: currency, maximumFractionDigits: 0 }) 
                      : "–"}
                  </TableCell>
                  <TableCell className="text-right">
                    {quote.volume_24h !== undefined 
                      ? quote.volume_24h.toLocaleString(undefined, { style: "currency", currency: currency, maximumFractionDigits: 0 }) 
                      : "–"}
                  </TableCell>
                  <TableCell className="text-right">
                    {coin.circulating_supply 
                      ? coin.circulating_supply.toLocaleString(undefined, { maximumFractionDigits: 0 }) 
                      : "–"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
    </>
  );
}
