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
import { Scanline } from "@/components/ui/scanline";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

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

export function PledgeModal({ onSuccess }: { onSuccess?: () => void }) {
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
                    setTimeout(() => setStep(3), 800);

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
        });
    };

    useEffect(() => {
        if (isConfirmed) {
            setIsOpen(false);
            if (onSuccess) onSuccess();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#007AFF', '#65D3D1', '#ffffff'] // Cyber Blue, Teal, White
            });
        }
    }, [isConfirmed, onSuccess]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20">
                    <Zap className="mr-2 h-4 w-4" /> Pledge Productivity
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] border-white/10 glass-liquid">
                <DialogHeader>
                    <DialogTitle className="text-xl font-medium tracking-tight text-white">Tokenize Productivity</DialogTitle>
                    <DialogDescription className="text-muted-foreground/80">
                        Turn your future work hours into tradeable $VITA assets.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative min-h-[300px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid gap-6 py-4"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="github" className="text-xs font-mono text-muted-foreground uppercase tracking-widest">GitHub Profile</Label>
                                    <Input
                                        id="github"
                                        placeholder="https://github.com/username"
                                        className="col-span-3 bg-white/5 border-white/10 text-white font-mono"
                                        value={githubUser}
                                        onChange={(e) => setGithubUser(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Hourly Rate (Verified)</Label>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                        <span className="text-sm font-medium text-white">Solidity Developer</span>
                                        <Badge variant="outline" className="border-green-500/20 text-green-500 bg-green-500/10">$150/hr</Badge>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setStep(2)}
                                    className="w-full mt-4"
                                    disabled={!githubUser || !address}
                                >
                                    <Github className="mr-2 h-4 w-4" /> Connect & Analyze
                                </Button>
                                {!address && <p className="text-xs text-red-500 text-center font-mono">Please connect wallet first</p>}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-6"
                            >
                                <Scanline />
                                <div className="relative w-20 h-20 mx-auto">
                                    <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin border-t-primary" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-sm font-bold text-primary font-mono">{progress}%</span>
                                    </div>
                                </div>
                                <div className="space-y-2 z-10">
                                    <h3 className="font-semibold text-lg text-white animate-pulse">Running VITA Valuation...</h3>
                                    <div className="text-xs font-mono text-muted-foreground space-y-1">
                                        <p>{">"} Analyzing commit velocity...</p>
                                        <p>{">"} Verifying code complexity...</p>
                                        <p>{">"} Calculating market demand...</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && attestationData && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-4 space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-mono uppercase tracking-widest mb-2 border border-green-500/20">
                                        <CheckCircle2 className="h-3 w-3" /> Valuation Complete
                                    </div>
                                    <h1 className="text-5xl font-light tracking-tighter text-white">
                                        {(Number(attestationData.tokenValue) / 1e18).toLocaleString()} <span className="text-xl text-muted-foreground">VITA</span>
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        Based on <span className="text-white font-medium">{attestationData.pledgedHours} hours</span> at <span className="text-white font-medium">$150/hr</span>
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-mono text-xs uppercase">Reliability Score</span>
                                        <span className="font-mono text-primary font-medium">{attestationData.reliabilityScore}/100</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${attestationData.reliabilityScore}%` }} />
                                    </div>

                                    <div className="flex justify-between text-sm pt-2">
                                        <span className="text-muted-foreground font-mono text-xs uppercase">Vitality Score</span>
                                        <span className="font-mono text-white font-medium">{attestationData.vitalityScore}</span>
                                    </div>
                                </div>

                                {mintError && (
                                    <div className="flex items-center gap-2 p-2 rounded bg-red-500/10 text-red-500 text-xs font-mono border border-red-500/20">
                                        <AlertCircle className="h-4 w-4" />
                                        Minting failed. {mintError.message.slice(0, 50)}...
                                    </div>
                                )}

                                <Button
                                    className="w-full bg-white text-black hover:bg-white/90 font-medium h-12 text-base"
                                    onClick={handleMint}
                                    disabled={isMinting || isConfirming}
                                >
                                    {isMinting ? "Confirming..." : isConfirming ? "Minting to Chain..." : "Mint VITA Echo"}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
