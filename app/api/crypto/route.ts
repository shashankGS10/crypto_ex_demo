// eslint-disable @typescript-eslint/no-unused-vars

import { NextResponse } from 'next/server';

const API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
const API_KEY = process.env.CMC_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const convert = searchParams.get('convert') || 'USD';
  const category = searchParams.get('category') || 'trending';

  let queryParams = `?limit=50&convert=${convert}`;
  if (category === 'recentlyAdded') queryParams += '&sort=date_added';
  if (category === 'mostViewed') queryParams += '&sort=volume_24h';

  try {
    const response = await fetch(`${API_URL}${queryParams}`, {
      headers: { 'X-CMC_PRO_API_KEY': API_KEY! },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ data: data.data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
