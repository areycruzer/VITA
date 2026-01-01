"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, CheckCircle2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PledgeModal() {
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep(1);
                setProgress(0);
            }, 500);
        }
    }, [isOpen]);

    // Simulate analysis
    useEffect(() => {
        if (step === 2) {
            const timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        setStep(3);
                        return 100;
                    }
                    return prev + 5;
                });
            }, 100);
            return () => clearInterval(timer);
        }
    }, [step]);

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
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Hourly Rate (Verified)</Label>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
                                <span className="text-sm font-medium">Solidity Developer</span>
                                <Badge variant="outline" className="border-green-500/20 text-green-500">$150/hr</Badge>
                            </div>
                        </div>
                        <Button onClick={() => setStep(2)} className="w-full">
                            <Github className="mr-2 h-4 w-4" /> Connect & Analyze
                        </Button>
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

                {step === 3 && (
                    <div className="py-4 space-y-6">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium mb-2">
                                <CheckCircle2 className="h-4 w-4" /> Valuation Complete
                            </div>
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                                24,000 $VITA
                            </h1>
                            <p className="text-muted-foreground">
                                Based on <span className="text-foreground font-medium">160 hours</span> at <span className="text-foreground font-medium">$150/hr</span>
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Reliability Score</span>
                                <span className="font-mono text-primary">98/100</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Minting Fee</span>
                                <span className="font-mono">0.05 METH</span>
                            </div>
                        </div>

                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsOpen(false)}>
                            Mint Tokens
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
