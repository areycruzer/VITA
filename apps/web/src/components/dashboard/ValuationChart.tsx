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
        <Card className="col-span-2 shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">Projected Echo Value</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0f172a",
                                border: "1px solid #1e293b",
                                borderRadius: "8px",
                                color: "#f8fafc",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
