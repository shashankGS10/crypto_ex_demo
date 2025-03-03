"use client";

import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { LineChart } from '@mui/x-charts/LineChart';
import { fetchCryptoData } from "@/utils/apiService";

// Mock historical data to match the image
const mockHistoricalData = [
    { timestamp: '2023-01-01', price: 17000 },
    { timestamp: '2023-01-15', price: 17500 },
    { timestamp: '2023-01-29', price: 18500 },
    { timestamp: '2023-02-12', price: 19000 },
    { timestamp: '2023-02-26', price: 19500 },
];

export default function CMC100Card() {
    const [btcData, setBtcData] = useState(null);
    const [dates, setDates] = useState(mockHistoricalData.map(item => new Date(item.timestamp)));
    const [prices, setPrices] = useState(mockHistoricalData.map(item => item.price));
    const [currentPrice, setCurrentPrice] = useState(90404.43); // Mock current price
    const [percentageChange, setPercentageChange] = useState(3.10); // Mock percentage change

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCryptoData('USD');
                const btc = data.find(item => item.symbol === 'BTC');
                if (btc) {
                    setBtcData(btc);
                    // Here you would typically fetch more recent price data
                    // and update the chart with it.
                    // For this example, we're using mock data.

                    // Mock updating current price and percentage change
                    // In real app, get this from API
                    setCurrentPrice(90404.43);
                    setPercentageChange(3.10);
                }
            } catch (error) {
                console.error('Error fetching crypto data:', error);
            }
        };

        fetchData();
    }, []);

    //const price = btcData?.quote?.USD?.price || 0;
    //const change24h = btcData?.quote?.USD?.percent_change_24h || 0;

    return (
        <motion.div
            className="p-4 rounded-xl bg-[#1F1F2E] shadow-lg border border-gray-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-gray-200 font-semibold mb-2">BTC Price</h2>
            <p className="text-xl text-white">${currentPrice.toFixed(2)}</p>
            <p className="text-green-500"> {/* Always green as per screenshot */}
                ▲ {percentageChange.toFixed(2)}% {/* No Math.abs as it's always positive */}
            </p>
            <div className="mt-2 h-40">
                <LineChart
                    xAxis={[{ data: dates, scaleType: 'time', label: 'Date' }]}
                    series={[{ data: prices, label: `BTC Price`, area: true, color: '#2dd4bf' }]}
                    height={200}
                    width={400}
                    // Add styling to match the screenshot
                    sx={{
                        '.MuiLineElement-root': {
                            strokeWidth: 0, // Remove the line
                        },
                        '.MuiAreaElement-root': {
                            fill: '#2dd4bf', // Turquoise color
                            opacity: 1, //Solid color
                        },
                        '.MuiAxis-root': {
                            color: 'white',
                        },
                        '.MuiGridLines-root': {
                            stroke: 'rgba(255,255,255,0.1)',
                        },
                        '.MuiTypography-root': {
                            fill: 'white',
                        },
                        '.MuiLineChart-legend': {
                            display: 'none', // Hide the legend
                        },
                        '.MuiDataGrid-virtualScrollerRenderZone': {
                            color: 'white',
                        },
                        background: 'transparent',
                        '.MuiMarkElement-root': { // Added to style the data point circles
                            stroke: 'white',   // White border
                            strokeWidth: 2,      // Adjust thickness as needed
                            fill: 'white',      // Turquoise fill
                            r: 4,                // Radius of the circles
                        },
                    }}
                    slotProps={{
                        xAxis: {
                            label: 'Date',
                            labelProps: {
                                style: {
                                    fill: 'white', // X-axis label color
                                },
                            },
                        },
                    }}
                />
            </div>
        </motion.div>
    );
}
