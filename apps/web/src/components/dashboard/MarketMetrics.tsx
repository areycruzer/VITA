"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, Coins, Activity, Lock } from "lucide-react";
import { motion } from "framer-motion";

const metrics = [
    {
        label: "mETH APY",
        value: "3.42%",
        trend: "+0.12%",
        icon: Activity,
        color: "text-emerald-400",
        chartColor: "bg-emerald-400"
    },
    {
        label: "VITA Price",
        value: "$12.84",
        trend: "+5.6%",
        icon: Coins,
        color: "text-blue-400",
        chartColor: "bg-blue-400"
    },
    {
        label: "TVL",
        value: "$4.2M",
        trend: "+12%",
        icon: Lock,
        color: "text-purple-400",
        chartColor: "bg-purple-400"
    }
];

export function MarketMetrics() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {metrics.map((metric, i) => (
                <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                >
                    <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{metric.label}</span>
                            <metric.icon className={`h-4 w-4 ${metric.color}`} />
                        </div>

                        <div className="flex items-end justify-between">
                            <div>
                                <div className="text-2xl font-light text-white tracking-tight">{metric.value}</div>
                                <div className={`text-xs font-mono ${metric.color} flex items-center gap-1 mt-1`}>
                                    <TrendingUp className="h-3 w-3" />
                                    {metric.trend}
                                </div>
                            </div>

                            {/* Micro Sparkline Visualization */}
                            <div className="flex items-end gap-[2px] h-8 opacity-50">
                                {[40, 60, 45, 70, 65, 85, 80].map((h, j) => (
                                    <div
                                        key={j}
                                        className={`w-1 rounded-sm ${metric.chartColor}`}
                                        style={{ height: `${h}%`, opacity: 0.3 + (j * 0.1) }}
                                    />
                                ))}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
