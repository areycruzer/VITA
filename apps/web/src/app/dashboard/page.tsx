"use client";

import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { PledgeModal } from "@/components/dashboard/PledgeModal";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { MarketMetrics } from "@/components/dashboard/MarketMetrics";
import { ValuationChart } from "@/components/dashboard/ValuationChart";
import { useVitaData } from "@/hooks/useVitaData";
import { formatEther } from "viem";
import { Activity, Briefcase, Zap, TrendingUp, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { balance, profile, refetch } = useVitaData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Overview / Performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Status</div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-white">System Normal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <MarketMetrics />

      {/* Bento Grid Layout - 3 Columns */}
      <BentoGrid className="grid-cols-1 md:grid-cols-3 gap-4">

        {/* 1. Main Balance Card (Large, Col 1-2, Row 1) */}
        <BentoCard className="md:col-span-2 glass-liquid p-6 sm:p-8 flex flex-col justify-between min-h-[300px] sm:min-h-[350px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-primary/10 text-primary border border-primary/20">
                <Activity className="h-6 w-6" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs font-mono text-muted-foreground border border-white/5 hover:bg-white/5 bg-black/20 backdrop-blur-md">
                    VIEW MANIFEST <ChevronDown className="ml-2 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#0A0A0A] border-white/10 text-muted-foreground font-mono text-xs">
                  <DropdownMenuItem>Contract: 0x...</DropdownMenuItem>
                  <DropdownMenuItem>RPC: Mantle Sepolia</DropdownMenuItem>
                  <DropdownMenuItem>Gas: 0.001 Gwei</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="pt-8">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Total Vitality</h2>
              <div className="text-6xl md:text-7xl font-light tracking-tighter text-white bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50">
                {balance ? Math.floor(balance).toLocaleString() : "0"}
                <span className="text-2xl text-muted-foreground/50 ml-4 font-normal">VITA</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4 relative z-10">
            <PledgeModal onSuccess={refetch} />
          </div>
        </BentoCard>

        {/* 2. Worker Profile Stats (Col 3, Row 1) */}
        <div className="flex flex-col gap-4 h-full">
          <BentoCard className="glass-liquid p-6 flex flex-col justify-between flex-1 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 p-16 bg-purple-500/10 blur-[60px] rounded-full translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-400 mb-4 border border-purple-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1 font-mono uppercase tracking-wider">Lifetime Minted</div>
              <div className="text-4xl font-light text-white tracking-tight">
                {profile ? Math.floor(Number(formatEther(profile.totalMinted))).toLocaleString() : "0"}
              </div>
              <div className="mt-2 text-xs text-green-400 flex items-center gap-1 font-mono bg-green-900/20 w-fit px-2 py-1 rounded">
                <TrendingUp className="h-3 w-3" /> +12% this month
              </div>
            </div>
          </BentoCard>

          <BentoCard className="glass-liquid p-6 flex flex-col justify-between flex-1 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 p-16 bg-orange-500/10 blur-[60px] rounded-full translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 w-fit rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Zap className="h-5 w-5" />
              </div>
              {/* Trust Score Badge */}
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono animate-pulse">
                <Activity className="h-3 w-3" />
                TRUST SCORE: 98
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1 font-mono uppercase tracking-wider">Reliability Score</div>
              <div className="text-4xl font-light text-white tracking-tight">98<span className="text-xl text-muted-foreground">/100</span></div>
              <div className="mt-4 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 w-[98%]" />
              </div>
            </div>
          </BentoCard>
        </div>

        {/* 3. Valuation Chart (Col 1-2, Row 2) */}
        <BentoCard className="md:col-span-2 glass-liquid p-6 min-h-[350px]">
          <ValuationChart currentBalance={balance || 0} />
        </BentoCard>

        {/* 4. Recent Activity (Col 3, Row 2) - Tall */}
        <BentoCard className="glass-liquid p-6 flex flex-col h-full min-h-[350px]">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <RecentActivity />
          </div>
        </BentoCard>

      </BentoGrid>
    </div>
  );
}

