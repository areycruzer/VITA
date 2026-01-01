"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACTS, CHAIN_ID, VITA_DOMAIN, SKILL_RATES } from "./contracts";
import { VITA_TOKEN_V2_ABI, VALUATION_ENGINE_ABI, METH_STAKING_ABI } from "./abis";

/**
 * Hook to get worker's VITA token balance
 */
export function useVitaBalance() {
  const { address } = useAccount();
  
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.VITA_TOKEN_V2 as `0x${string}`,
    abi: VITA_TOKEN_V2_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    balance: data ? formatEther(data as bigint) : "0",
    balanceRaw: data as bigint | undefined,
    isLoading,
    refetch,
  };
}

/**
 * Hook to get worker's profile from VitaToken
 */
export function useWorkerProfile() {
  const { address } = useAccount();
  
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.VITA_TOKEN_V2 as `0x${string}`,
    abi: VITA_TOKEN_V2_ABI,
    functionName: "workerProfiles",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const profile = data as [bigint, bigint, number, bigint] | undefined;
  
  return {
    totalMinted: profile ? formatEther(profile[0]) : "0",
    lastMintTimestamp: profile ? Number(profile[1]) : 0,
    skillCategory: profile ? profile[2] : 0,
    vitalityScore: profile ? Number(profile[3]) : 0,
    isLoading,
    refetch,
  };
}

/**
 * Hook to get worker's pending yield
 */
export function usePendingYield() {
  const { address } = useAccount();
  
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.VITA_TOKEN_V2 as `0x${string}`,
    abi: VITA_TOKEN_V2_ABI,
    functionName: "pendingYield",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    pendingYield: data ? formatEther(data as bigint) : "0",
    pendingYieldRaw: data as bigint | undefined,
    isLoading,
    refetch,
  };
}

/**
 * Hook to get worker's mETH staking details
 */
export function useStakingDetails() {
  const { address } = useAccount();
  
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.METH_STAKING as `0x${string}`,
    abi: METH_STAKING_ABI,
    functionName: "getWorkerStakeValue",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const stakeData = data as [bigint, bigint] | undefined;
  
  return {
    currentEthValue: stakeData ? formatEther(stakeData[0]) : "0",
    yieldAccrued: stakeData ? formatEther(stakeData[1]) : "0",
    isLoading,
    refetch,
  };
}

/**
 * Hook to calculate valuation using ValuationEngine
 */
export function useValuation(
  skillCategory: number,
  pledgedHours: number,
  vitalityScore: number,
  fulfillmentDays: number = 0
) {
  const { data, isLoading } = useReadContract({
    address: CONTRACTS.VALUATION_ENGINE as `0x${string}`,
    abi: VALUATION_ENGINE_ABI,
    functionName: "getDetailedValuation",
    args: [skillCategory, BigInt(pledgedHours), BigInt(vitalityScore), BigInt(fulfillmentDays)],
    query: {
      enabled: pledgedHours > 0 && vitalityScore > 0,
    },
  });

  const valuation = data as [bigint, bigint, bigint, bigint] | undefined;
  
  return {
    baseValue: valuation ? formatEther(valuation[0]) : "0",
    aiAdjustedValue: valuation ? formatEther(valuation[1]) : "0",
    finalValue: valuation ? formatEther(valuation[2]) : "0",
    decayFactor: valuation ? Number(valuation[3]) / 1e18 : 1,
    hourlyRate: SKILL_RATES[skillCategory] || 100,
    isLoading,
  };
}

/**
 * Hook to mint VITA tokens via mintEcho
 */
export function useMintEcho() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mint = async (params: {
    worker: `0x${string}`;
    skillCategory: number;
    pledgedHours: number;
    vitalityScore: number;
    reliabilityScore: number;
    mintAmount: bigint;
    deadline: number;
    v: number;
    r: `0x${string}`;
    s: `0x${string}`;
    value?: bigint;
  }) => {
    writeContract({
      address: CONTRACTS.VITA_TOKEN_V2 as `0x${string}`,
      abi: VITA_TOKEN_V2_ABI,
      functionName: "mintEcho",
      args: [
        params.worker,
        params.skillCategory,
        BigInt(params.pledgedHours),
        BigInt(params.vitalityScore),
        BigInt(params.reliabilityScore),
        params.mintAmount,
        BigInt(params.deadline),
        params.v,
        params.r,
        params.s,
      ],
      value: params.value,
    });
  };

  return {
    mint,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to claim pending yield
 */
export function useClaimYield() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const claim = () => {
    writeContract({
      address: CONTRACTS.VITA_TOKEN_V2 as `0x${string}`,
      abi: VITA_TOKEN_V2_ABI,
      functionName: "claimYield",
    });
  };

  return {
    claim,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to get worker's nonce for EIP-712 signing
 */
export function useWorkerNonce() {
  const { address } = useAccount();
  
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.VITA_TOKEN_V2 as `0x${string}`,
    abi: VITA_TOKEN_V2_ABI,
    functionName: "workerNonces",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    nonce: data ? Number(data) : 0,
    isLoading,
    refetch,
  };
}

/**
 * Export domain for EIP-712 signing
 */
export { VITA_DOMAIN };
