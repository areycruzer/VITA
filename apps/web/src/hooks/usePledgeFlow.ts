"use client";

import { useState, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { VITA_TOKEN_V2_ABI } from "@/lib/abis";

// GitHub Profile interface
export interface GitHubProfile {
    username: string;
    avatar: string;
    repos: number;
    commits: number;
    stars: number;
    followers: number;
}

// Attestation data from API
export interface AttestationData {
    worker: string;
    githubUsername: string;
    vitalityScore: string;
    reliabilityScore: string;
    pledgedHours: string;
    skillCategory: number;
    tokenValue: string;
    validUntil: string;
    nonce: string;
}

// Signature components
export interface SignatureData {
    r: string;
    s: string;
    v: number;
}

// Flow state
export type PledgeFlowStatus = "idle" | "fetching_github" | "github_success" | "valuating" | "valuation_success" | "minting" | "mint_success" | "error";

interface UsePledgeFlowReturn {
    // State
    status: PledgeFlowStatus;
    error: string | null;
    githubProfile: GitHubProfile | null;
    attestation: AttestationData | null;
    signature: SignatureData | null;
    txHash: string | undefined;

    // Actions
    fetchGitHubProfile: (username: string) => Promise<void>;
    getValuation: (pledgedHours: number, skillCategory: number) => Promise<void>;
    mintTokens: () => Promise<void>;
    reset: () => void;
}

export function usePledgeFlow(): UsePledgeFlowReturn {
    const { address } = useAccount();

    // State
    const [status, setStatus] = useState<PledgeFlowStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null);
    const [attestation, setAttestation] = useState<AttestationData | null>(null);
    const [signature, setSignature] = useState<SignatureData | null>(null);

    // Contract write
    const { writeContract, data: txHash, isPending } = useWriteContract();
    const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

    // Fetch real GitHub profile
    const fetchGitHubProfile = useCallback(async (username: string) => {
        if (!username.trim()) {
            setError("Please enter a GitHub username");
            return;
        }

        setStatus("fetching_github");
        setError(null);

        try {
            const headers: Record<string, string> = {
                "User-Agent": "VITA-Protocol",
                "Accept": "application/vnd.github.v3+json",
            };

            const [userRes, reposRes, eventsRes] = await Promise.all([
                fetch(`https://api.github.com/users/${username}`, { headers }),
                fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers }),
                fetch(`https://api.github.com/users/${username}/events?per_page=100`, { headers }),
            ]);

            if (!userRes.ok) {
                throw new Error("GitHub user not found");
            }

            const userData = await userRes.json();
            const repos = reposRes.ok ? await reposRes.json() : [];
            const events = eventsRes.ok ? await eventsRes.json() : [];

            const totalStars = repos.reduce(
                (sum: number, r: { stargazers_count?: number }) => sum + (r.stargazers_count || 0),
                0
            );
            const pushEvents = events.filter((e: { type: string }) => e.type === "PushEvent");
            const commitCount = pushEvents.reduce(
                (sum: number, e: { payload?: { commits?: unknown[] } }) => sum + (e.payload?.commits?.length || 0),
                0
            );

            setGithubProfile({
                username: userData.login,
                avatar: userData.avatar_url,
                repos: userData.public_repos || 0,
                commits: commitCount,
                stars: totalStars,
                followers: userData.followers || 0,
            });

            setStatus("github_success");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch GitHub data");
            setStatus("error");
        }
    }, []);

    // Get valuation from API (calls real GitHub API on backend too)
    const getValuation = useCallback(async (pledgedHours: number, skillCategory: number) => {
        if (!githubProfile || !address) {
            setError("GitHub profile or wallet not connected");
            return;
        }

        setStatus("valuating");
        setError(null);

        try {
            const response = await fetch("/api/valuation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    githubUsername: githubProfile.username,
                    workerAddress: address,
                    pledgedHours,
                    skillCategory,
                }),
            });

            if (!response.ok) {
                throw new Error("Valuation API failed");
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || "Valuation failed");
            }

            setAttestation(data.data.attestation);
            setSignature(data.data.signature);
            setStatus("valuation_success");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Valuation failed");
            setStatus("error");
        }
    }, [githubProfile, address]);

    // Mint tokens on Mantle Sepolia
    const mintTokens = useCallback(async () => {
        if (!attestation || !signature || !address) {
            setError("Missing attestation or signature");
            return;
        }

        setStatus("minting");
        setError(null);

        try {
            writeContract({
                address: CONTRACTS.VITA_TOKEN_V2 as `0x${string}`,
                abi: VITA_TOKEN_V2_ABI,
                functionName: "mintEcho",
                args: [
                    {
                        worker: attestation.worker as `0x${string}`,
                        githubUsername: attestation.githubUsername,
                        vitalityScore: BigInt(attestation.vitalityScore),
                        reliabilityScore: BigInt(attestation.reliabilityScore),
                        pledgedHours: BigInt(attestation.pledgedHours),
                        skillCategory: attestation.skillCategory,
                        tokenValue: BigInt(attestation.tokenValue),
                        validUntil: BigInt(attestation.validUntil),
                        nonce: BigInt(attestation.nonce),
                    },
                    signature.v,
                    signature.r as `0x${string}`,
                    signature.s as `0x${string}`,
                ],
            });

            // Status will be updated when tx confirms
        } catch (err) {
            setError(err instanceof Error ? err.message : "Minting failed");
            setStatus("error");
        }
    }, [attestation, signature, address, writeContract]);

    // Reset flow
    const reset = useCallback(() => {
        setStatus("idle");
        setError(null);
        setGithubProfile(null);
        setAttestation(null);
        setSignature(null);
    }, []);

    // Update status when tx confirms
    if (txConfirmed && status === "minting") {
        setStatus("mint_success");
    }

    return {
        status,
        error,
        githubProfile,
        attestation,
        signature,
        txHash,
        fetchGitHubProfile,
        getValuation,
        mintTokens,
        reset,
    };
}
