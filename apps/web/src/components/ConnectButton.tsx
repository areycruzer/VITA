"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function ConnectButton() {
    const { address, isConnected, chain } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="outline" disabled className="bg-background/50">
                <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
        );
    }

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-2">
                {/* Network Badge */}
                <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors hidden sm:flex">
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    {chain?.name || "Mantle Testnet"}
                </Badge>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="border-border bg-card hover:bg-accent hover:text-accent-foreground font-mono">
                            {address.slice(0, 6)}...{address.slice(-4)}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56" align="end">
                        <div className="grid gap-4">
                            <div className="space-y-1">
                                <h4 className="font-medium leading-none">Wallet Connected</h4>
                                <p className="text-xs text-muted-foreground">
                                    Connected to {chain?.name}
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => disconnect()}
                                className="w-full justify-start"
                            >
                                <LogOut className="mr-2 h-4 w-4" /> Disconnect
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        );
    }

    return (
        <Button
            onClick={() => {
                const connector = connectors.find((c) => c.id === "injected") || connectors[0];
                if (connector) {
                    connect({ connector });
                } else {
                    alert("No wallet found. Please install Metamask.");
                }
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
        </Button>
    );
}
