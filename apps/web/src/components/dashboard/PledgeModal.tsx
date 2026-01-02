"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, CheckCircle2, Zap, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";

// Minimal ABI for mintEcho
const VITA_ABI = [
    {
        type: "function",
        name: "mintEcho",
        stateMutability: "payable",
        inputs: [
            {
                name: "attestation",
                type: "tuple",
                components: [
                    { name: "worker", type: "address" },
                    { name: "githubUsername", type: "string" },
                    { name: "vitalityScore", type: "uint256" },
                    { name: "reliabilityScore", type: "uint256" },
                    { name: "pledgedHours", type: "uint256" },
                    { name: "skillCategory", type: "uint8" },
                    { name: "tokenValue", type: "uint256" },
                    { name: "validUntil", type: "uint256" },
                    { name: "nonce", type: "uint256" }
                ]
            },
            { name: "v", type: "uint8" },
            { name: "r", type: "bytes32" },
            { name: "s", type: "bytes32" }
        ],
        outputs: [{ type: "uint256" }]
    }
] as const;

export function PledgeModal() {
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [githubUser, setGithubUser] = useState("");
    const [attestationData, setAttestationData] = useState<any>(null);
    const [signatureData, setSignatureData] = useState<any>(null);

    const { address } = useAccount();
    const { writeContract, data: hash, isPending: isMinting, error: mintError } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep(1);
                setProgress(0);
                setAttestationData(null);
                setSignatureData(null);
                setGithubUser("");
            }, 500);
        }
    }, [isOpen]);

    // Handle analysis and API call
    useEffect(() => {
        if (step === 2 && !attestationData) {
            let progressTimer: NodeJS.Timeout;

            const runAnalysis = async () => {
                // Start animation
                progressTimer = setInterval(() => {
                    setProgress((prev) => (prev < 90 ? prev + 10 : prev));
                }, 200);

                try {
                    const res = await fetch("/api/valuation", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            githubUsername: githubUser,
                            workerAddress: address
                        }),
                    });

                    const json = await res.json();

                    if (!res.ok) throw new Error(json.error || "Analysis failed");

                    setAttestationData(json.data.attestation);
                    setSignatureData(json.data.signature);

                    clearInterval(progressTimer);
                    setProgress(100);
                    setTimeout(() => setStep(3), 500);

                } catch (error) {
                    console.error(error);
                    clearInterval(progressTimer);
                    setStep(1); // Go back on error
                    alert("Valuation failed. Check console.");
                }
            };

            runAnalysis();

            return () => clearInterval(progressTimer);
        }
    }, [step, githubUser, address, attestationData]);

    const handleMint = () => {
        if (!attestationData || !signatureData) return;

        writeContract({
            address: CONTRACTS.VITA_TOKEN_V2 as `0x${string}`,
            abi: VITA_ABI,
            functionName: "mintEcho",
            args: [
                attestationData,
                signatureData.v,
                signatureData.r,
                signatureData.s
            ],
            // You can add value: parseEther("0.1") here if you want to test collateral staking
        });
    };

    useEffect(() => {
        if (isConfirmed) {
            setIsOpen(false);
            // Optional: Trigger a toast or refresh data
        }
    }, [isConfirmed]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan">
                    <Zap className="mr-2 h-4 w-4" /> New Pledge
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Tokenize Productivity</DialogTitle>
                    <DialogDescription>
                        Turn your future work hours into tradeable $VITA assets.
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="github">GitHub Profile</Label>
                            <Input
                                id="github"
                                placeholder="https://github.com/username"
                                className="col-span-3 bg-secondary border-input"
                                value={githubUser}
                                onChange={(e) => setGithubUser(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Hourly Rate (Verified)</Label>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
                                <span className="text-sm font-medium">Solidity Developer</span>
                                <Badge variant="outline" className="border-green-500/20 text-green-500">$150/hr</Badge>
                            </div>
                        </div>
                        <Button
                            onClick={() => setStep(2)}
                            className="w-full"
                            disabled={!githubUser || !address}
                        >
                            <Github className="mr-2 h-4 w-4" /> Connect & Analyze
                        </Button>
                        {!address && <p className="text-xs text-red-500 text-center">Please connect wallet first</p>}
                    </div>
                )}

                {step === 2 && (
                    <div className="py-8 space-y-6 text-center">
                        <div className="relative w-16 h-16 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-spin border-t-primary" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">{progress}%</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg animate-pulse">AI Valuation Engine Running...</h3>
                            <p className="text-sm text-muted-foreground">Analyzing commit velocity, code complexity, and market demand.</p>
                        </div>
                        <Progress value={progress} className="w-full h-2" />
                    </div>
                )}

                {step === 3 && attestationData && (
                    <div className="py-4 space-y-6">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium mb-2">
                                <CheckCircle2 className="h-4 w-4" /> Valuation Complete
                            </div>
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                                {(Number(attestationData.tokenValue) / 1e18).toLocaleString()} $VITA
                            </h1>
                            <p className="text-muted-foreground">
                                Based on <span className="text-foreground font-medium">{attestationData.pledgedHours} hours</span> at <span className="text-foreground font-medium">$150/hr</span>
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Reliability Score</span>
                                <span className="font-mono text-primary">{attestationData.reliabilityScore}/100</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Vitality Score</span>
                                <span className="font-mono">{attestationData.vitalityScore}</span>
                            </div>
                        </div>

                        {mintError && (
                            <div className="flex items-center gap-2 p-2 rounded bg-red-500/10 text-red-500 text-xs">
                                <AlertCircle className="h-4 w-4" />
                                Minting failed. {mintError.message.slice(0, 50)}...
                            </div>
                        )}

                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleMint}
                            disabled={isMinting || isConfirming}
                        >
                            {isMinting ? "Confirm in Wallet..." : isConfirming ? "Minting..." : "Mint Tokens"}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
