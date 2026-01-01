"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useEffect } from "react";

export function ConnectButton() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium opacity-50 cursor-not-allowed">
                Connect Wallet
            </button>
        );
    }

    if (isConnected && address) {
        return (
            <button
                onClick={() => disconnect()}
                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors"
            >
                {address.slice(0, 6)}...{address.slice(-4)}
            </button>
        );
    }

    return (
        <button
            onClick={() => {
                const connector = connectors.find((c) => c.id === "injected") || connectors[0];
                if (connector) {
                    connect({ connector });
                } else {
                    alert("No wallet found. Please install Metamask.");
                }
            }}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
            Connect Wallet
        </button>
    );
}
