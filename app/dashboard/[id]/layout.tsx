// app/layout.tsx
import React from 'react';

export const metadata = {
  title: 'Crypto Dashboard',
  description: 'A crypto dashboard inspired by CoinMarketCap',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white font-sans">
        <div className="flex h-screen">
          <main className="flex-grow overflow-y-auto bg-gray-900">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
