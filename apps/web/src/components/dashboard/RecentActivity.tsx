"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { formatEther, parseAbiItem } from "viem";
import { CheckCircle2, Loader2 } from "lucide-react";
import { CONTRACTS, EXPLORER_URL } from "@/lib/contracts";

interface Activity {
    type: "mint" | "transfer";
    amount: string;
    txHash: string;
    timestamp: number;
}

function formatTimeAgo(timestamp: number): string {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
}

export function RecentActivity() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchActivities() {
            if (!address || !publicClient) {
                setIsLoading(false);
                return;
            }

            try {
                // Get current block number and calculate a reasonable range
                // Mantle Sepolia RPC limits to 10,000 blocks per query
                const currentBlock = await publicClient.getBlockNumber();
                const fromBlock = currentBlock > 10000n ? currentBlock - 10000n : 0n;

                // Fetch Transfer events where user is recipient (minting)
                const logs = await publicClient.getLogs({
                    address: CONTRACTS.VITA_TOKEN_V2 as `0x${string}`,
                    event: parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)"),
                    args: {
                        to: address,
                    },
                    fromBlock: fromBlock,
                    toBlock: "latest",
                });

                // Get block timestamps for recent logs (limit to last 10)
                const recentLogs = logs.slice(-10).reverse();
                const activitiesWithTime: Activity[] = [];

                for (const log of recentLogs.slice(0, 5)) {
                    const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
                    const isMint = log.args.from === "0x0000000000000000000000000000000000000000";

                    activitiesWithTime.push({
                        type: isMint ? "mint" : "transfer",
                        amount: formatEther(log.args.value || 0n),
                        txHash: log.transactionHash,
                        timestamp: Number(block.timestamp),
                    });
                }

                setActivities(activitiesWithTime);
            } catch (error) {
                console.error("Failed to fetch activities:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchActivities();
    }, [address, publicClient]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>No activity yet.</p>
                <p className="text-sm">Pledge productivity to mint $VITA tokens.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity, i) => (
                <a
                    key={`${activity.txHash}-${i}`}
                    href={`${EXPLORER_URL}/tx/${activity.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm text-white font-medium">
                                {activity.type === "mint" ? "Minted" : "Received"} {parseFloat(activity.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })} VITA
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                                Tx: {activity.txHash.slice(0, 6)}...{activity.txHash.slice(-4)}
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                        {formatTimeAgo(activity.timestamp)}
                    </div>
                </a>
            ))}
        </div>
    );
}
