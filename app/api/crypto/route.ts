/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY; // Ensure your CoinMarketCap API key is set in env

export async function GET(request: Request) {
  // Parse query param for currency (default to USD if not provided)
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get("currency")?.toUpperCase() || "USD";

  // CoinMarketCap API endpoint for top 50 cryptocurrencies by market cap
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=50&convert=${currency}`;
  try {
    // Fetch data from CoinMarketCap API with the required header&#8203;:contentReference[oaicite:0]{index=0}
    const response = await fetch(url, {
      headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY! }
    });
    if (!response.ok) {
      throw new Error(`CMC API error: ${response.status}`);
    }
    const json = await response.json();
    // Return only the data array (list of crypto info) as JSON&#8203;:contentReference[oaicite:1]{index=1}
    return NextResponse.json(json.data);
  } catch (err: any) {
    console.error("CMC API fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
