"use client";

import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { PledgeModal } from "@/components/dashboard/PledgeModal";
import { useVitaData } from "@/hooks/useVitaData";
import { formatEther } from "viem";
import { Activity, Briefcase, Zap, TrendingUp, ChevronDown, CheckCircle2 } from "lucide-react";
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-white">System Normal</span>
            </div>
          </div>
        </div>
      </div>

      <BentoGrid>
        {/* Main Balance Card - Large */}
        <BentoCard className="md:col-span-2 md:row-span-2 glass-liquid p-8 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Activity className="h-6 w-6" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs font-mono text-muted-foreground border border-white/5 hover:bg-white/5">
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
              <div className="text-6xl md:text-7xl font-light tracking-tighter text-white">
                {balance ? Math.floor(balance).toLocaleString() : "0"}
                <span className="text-2xl text-muted-foreground/50 ml-4 font-normal">VITA</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <PledgeModal onSuccess={refetch} />
          </div>
        </BentoCard>

        {/* Worker Profile Stats */}
        <BentoCard className="glass-liquid p-6 flex flex-col justify-between">
          <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-400 mb-4">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Lifetime VITA Minted</div>
            <div className="text-3xl font-mono text-white">
              {profile ? Math.floor(Number(formatEther(profile.totalMinted))).toLocaleString() : "0"}
            </div>
            <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +12% this month
            </div>
          </div>
        </BentoCard>

        <BentoCard className="glass-liquid p-6 flex flex-col justify-between">
          <div className="p-2 w-fit rounded-lg bg-orange-500/10 text-orange-400 mb-4">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Reliability Score</div>
            <div className="text-3xl font-mono text-white">98/100</div>
            <div className="mt-2 w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 w-[98%]" />
            </div>
          </div>
        </BentoCard>

        {/* Feed / Activity */}
        <BentoCard className="md:col-span-3 glass-liquid p-6">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-default">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">Minted 500 VITA</div>
                    <div className="text-xs text-muted-foreground font-mono">Tx: 0x8a...4b2f</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-mono">2 mins ago</div>
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
