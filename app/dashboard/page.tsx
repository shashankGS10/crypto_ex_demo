"use client";
import FullTable from "@/components/FullTable";
import CoinListCard from "@/components/CoinListCard";
import FearGreedCard from "@/components/FearGreedCard";
import DominanceChart from "@/components/DominanceChart";
import CMC100Card from "@/components/CMC100Card";
import Globe from "@/components/Globe";
import Top10List from "@/components/Top10List";


export default function Dashboard() {
  return (
    <div className="px-4 py-6 bg-neutral-950 text-neutral-100 min-h-screen">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Left column */}
        <div className="space-y-6">
          <CoinListCard title="Most Visited" type="mostVisited" />
          <CoinListCard title="Trending on DexScan" type="trending" />
        </div>

        {/* Middle column */}
        <div className="space-y-4">
          <FearGreedCard />
          <div className="space-y-2">
        <Top10List/>
        </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <CMC100Card />
          
          <DominanceChart />
        </div>
        <Globe />
        
      </div>
      {/* FullTable of all coins (existing component) */}
      <div className="mt-8">
        <FullTable />
      </div>
    </div>
  );
}