"use client";

import { Hammer } from "lucide-react";

export default function GovernancePage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-700">
            <div className="p-4 rounded-full bg-white/5 border border-white/10">
                <Hammer className="w-12 h-12 text-white/40" />
            </div>

            <div className="space-y-2 max-w-md">
                <h1 className="text-3xl font-light tracking-tight text-white mb-2">Governance Console</h1>
                <p className="text-white/40">
                    The $VITA Governance Portal is currently in closed alpha on the Mantle Sepolia testnet.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mt-8">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors cursor-not-allowed">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                        <span className="text-[10px] font-mono text-white/30 uppercase">Proposal</span>
                    </div>
                    <h3 className="font-medium mb-1">VIP-1: Reward Emission</h3>
                    <p className="text-xs text-white/40">Adjust parameters for mETH yields.</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors cursor-not-allowed">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-2 w-2 rounded-full bg-green-500/50" />
                        <span className="text-[10px] font-mono text-white/30 uppercase">Active</span>
                    </div>
                    <h3 className="font-medium mb-1">VIP-2: Oracle Whitelist</h3>
                    <p className="text-xs text-white/40">Add new GitHub data providers.</p>
                </div>
            </div>

            <div className="pt-8 border-t border-white/5 w-full max-w-md">
                <p className="text-xs text-white/30 font-mono">
                    VITA Protocol Governance Token ($VITA-GOV) required.
                </p>
            </div>
        </div>
    );
}
