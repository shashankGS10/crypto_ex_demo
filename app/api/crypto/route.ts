/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get("currency")?.toUpperCase() || "USD";

  if (!CMC_API_KEY) {
    console.error("CMC API Key is missing. Check your .env.local file.");
    return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
  }

  console.log("CMC API Key (masked):", CMC_API_KEY.slice(0, 4) + "****");

  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=50&convert=${currency}`;
  try {
    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY!,
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`CMC API error: ${response.status} - ${errorBody}`);
      return NextResponse.json({ error: "Failed to fetch data", details: errorBody }, { status: response.status });
    }

    const json = await response.json();
    return NextResponse.json(json.data);
  } catch (err: any) {
    console.error("CMC API fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
