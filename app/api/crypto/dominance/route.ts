import { NextResponse } from 'next/server';

// This is a placeholder - replace with your actual data source or logic
async function getDominanceData() {
  // **IMPORTANT:** Replace this with your actual data fetching logic.
  // This is just an example using hardcoded data.  You would likely
  // fetch this data from a database, external API, or calculate it
  // based on your cached crypto data.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: 'Bitcoin', value: 59.73 },
        { name: 'Ethereum', value: 9.82 },
        { name: 'Others', value: 30.45 }, //Ensure it adds upto 100
      ]);
    }, 500); // Simulate a small delay
  });
}

export async function GET() {
  try {
    const dominanceData = await getDominanceData();
    return NextResponse.json(dominanceData);
  } catch (error) {
    console.error("Error fetching dominance data:", error);
    return NextResponse.json({ error: 'Failed to fetch dominance data' }, { status: 500 });
  }
}
