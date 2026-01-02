"use client";

import { motion } from "framer-motion";
import { Layers, ExternalLink, Calendar, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";

const MOCK_ECHOES = [
    {
        id: 1,
        tokenId: "2400",
        date: "2024-12-28",
        amount: "2,400",
        repo: "vita-protocol/contracts",
        status: "Staked",
        apy: "3.42%",
        hash: "0x31d4...2bc9"
    },
    {
        id: 2,
        tokenId: "1850",
        date: "2024-11-15",
        amount: "1,850",
        repo: "vita-protocol/web",
        status: "Liquid",
        apy: "-",
        hash: "0x9a2b...4f1e"
    }
];

export default function MyEchoesPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-white mb-2">
                        My Echoes
                    </h1>
                    <p className="text-muted-foreground font-mono text-sm">
                        Manage your tokenized productivity assets
                    </p>
                </div>
                <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <Layers className="w-6 h-6 text-cyan-400" />
                </div>
            </div>

            {/* Bento Stats */}
            <BentoGrid className="grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <BentoCard className="glass-liquid p-6 flex flex-col justify-between relative overflow-hidden min-h-[160px]">
                    <div className="relative z-10">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-mono">Total Minted</div>
                        <div className="text-4xl font-light text-white tracking-tight">
                            4,250 <span className="text-lg text-muted-foreground ml-1">VITA</span>
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 p-24 bg-cyan-500/20 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                </BentoCard>

                <BentoCard className="glass-liquid p-6 flex flex-col justify-between relative overflow-hidden min-h-[160px]">
                    <div className="relative z-10">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-mono">Staking APY</div>
                        <div className="text-4xl font-light text-emerald-400 tracking-tight">3.42%</div>
                        <div className="text-xs text-emerald-500/50 font-mono mt-1">mETH Native Yield</div>
                    </div>
                    <div className="absolute right-0 bottom-0 p-24 bg-emerald-500/20 blur-[80px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />
                </BentoCard>

                <BentoCard className="glass-liquid p-6 flex flex-col justify-between relative overflow-hidden min-h-[160px]">
                    <div className="relative z-10">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-mono">Next Unlock</div>
                        <div className="text-4xl font-light text-white tracking-tight">14d <span className="text-lg text-muted-foreground">12h</span></div>
                    </div>
                    <div className="absolute right-0 bottom-0 p-24 bg-purple-500/20 blur-[80px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />
                </BentoCard>
            </BentoGrid>

            {/* Recent Mints List */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest pl-1">Recent Mints</h3>

                <div className="grid gap-3">
                    {MOCK_ECHOES.map((echo) => (
                        <BentoCard key={echo.id} className="p-0 glass-liquid overflow-hidden border-white/5 group hover:border-white/10 transition-colors">
                            <div className="p-4 md:p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors shrink-0">
                                        <Layers className="w-5 h-5 text-white/60" />
                                    </div>
                                    <div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-1">
                                            <span className="text-lg font-medium text-white tracking-tight">VITA #{echo.tokenId}</span>
                                            <span className={`text-[10px] px-2 py-0.5 w-fit rounded-full border font-mono uppercase tracking-wider ${echo.status === 'Staked' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                                {echo.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {echo.date}</span>
                                            <span className="hidden md:flex items-center gap-1.5"><Clock className="w-3 h-3" /> {echo.repo}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right flex items-center gap-6 md:gap-12 pl-4">
                                    <div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Amount</div>
                                        <div className="text-lg md:text-xl font-light text-white">{echo.amount}</div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Yield</div>
                                        <div className="text-lg md:text-xl font-light text-emerald-400">{echo.apy}</div>
                                    </div>

                                    <Link href={`https://sepolia.mantlescan.xyz/tx/${echo.hash}`} target="_blank" className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                                        <ExternalLink className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </BentoCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
