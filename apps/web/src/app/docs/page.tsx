"use client";

import { motion } from "framer-motion";
import { Book, FileText, Code2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">

            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl font-light tracking-tight text-white">Documentation</h1>
                <p className="text-xl text-white/40 font-light max-w-2xl">
                    Learn how to valorize your human capital and integrate with the VITA Protocol.
                </p>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-3 gap-6">

                {/* Card 1 */}
                <Link href="#" className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all">
                    <Book className="w-8 h-8 text-cyan-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2 group-hover:text-cyan-400 transition-colors">Quick Start</h3>
                    <p className="text-sm text-white/40 mb-4">
                        Connect your GitHub and mint your first VITA token in under 5 minutes.
                    </p>
                    <div className="flex items-center text-xs text-cyan-400 font-mono">
                        Start Reading <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                {/* Card 2 */}
                <Link href="#" className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all">
                    <FileText className="w-8 h-8 text-violet-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2 group-hover:text-violet-400 transition-colors">Valuation Paper</h3>
                    <p className="text-sm text-white/40 mb-4">
                        Deep dive into the math behind the Vitality Formula and human capital pricing.
                    </p>
                    <div className="flex items-center text-xs text-violet-400 font-mono">
                        Read Paper <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                {/* Card 3 */}
                <Link href="#" className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all">
                    <Code2 className="w-8 h-8 text-emerald-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2 group-hover:text-emerald-400 transition-colors">Contracts</h3>
                    <p className="text-sm text-white/40 mb-4">
                        Technical reference for ERC-3643, ZK Verifiers, and mETH Staking.
                    </p>
                    <div className="flex items-center text-xs text-emerald-400 font-mono">
                        View Reference <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

            </div>

            {/* API Reference */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                <h2 className="text-2xl font-light mb-4">Developer SDK</h2>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-sm text-white/60 mb-6">
                    <span className="text-purple-400">npm</span> install @vita-protocol/sdk
                </div>
                <p className="text-white/40 text-sm">
                    Build custom integrations or analytic dashboards on top of the VITA liquidity layer.
                </p>
            </div>

        </div>
    );
}
