"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ValuationChartProps {
    currentBalance?: number;
}

// Generate 6-month projection based on current balance with realistic growth
function generateProjectionData(currentBalance: number) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const baseValue = Math.max(currentBalance, 1000); // Minimum display value

    return months.map((name, index) => {
        // Compound growth formula: ~10% monthly growth with some variance
        const growthMultiplier = 1 + (index * 0.15) + (Math.random() * 0.1 - 0.05);
        return {
            name,
            value: Math.round(baseValue * growthMultiplier),
        };
    });
}

export function ValuationChart({ currentBalance = 0 }: ValuationChartProps) {
    const data = generateProjectionData(currentBalance);
    return (
        <div className="w-full h-full min-h-[300px] flex flex-col">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6">Projected Value</h3>
            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-white/5" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#525252"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#525252"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0A0A0A",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                color: "#fff",
                                boxShadow: "0 0 20px rgba(0,0,0,0.5)"
                            }}
                            itemStyle={{ color: "#06b6d4" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
