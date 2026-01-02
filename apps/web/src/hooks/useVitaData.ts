import { useAccount, useReadContract } from "wagmi";
import { VITA_TOKEN_V2_ADDRESS } from "@/lib/contracts"; // Assume Abis are exported or we inline ABI
// If ABI is not in lib/contracts, we might need to import from JSON or define minimal ABI here.

// Minimal ABI for data we need
const vitaAbi = [
    {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ type: "uint256" }],
    },
    {
        type: "function",
        name: "totalSupply",
        stateMutability: "view",
        inputs: [],
        outputs: [{ type: "uint256" }],
    },
    {
        type: "function",
        name: "getWorkerProfile",
        stateMutability: "view",
        inputs: [{ name: "worker", type: "address" }],
        outputs: [
            {
                components: [
                    { name: "githubUsername", type: "string" },
                    { name: "totalMinted", type: "uint256" },
                    { name: "totalFulfilled", type: "uint256" },
                    { name: "lastMintTimestamp", type: "uint256" },
                    { name: "vitalityScore", type: "uint256" },
                    { name: "isVerified", type: "bool" },
                    { name: "zkProofCount", type: "uint256" },
                    { name: "stakedCollateral", type: "uint256" }
                ],
                name: "",
                type: "tuple"
            }
        ]
    }
] as const;

export function useVitaData() {
    const { address } = useAccount();

    const { data: balance, refetch: refetchBalance } = useReadContract({
        address: VITA_TOKEN_V2_ADDRESS as `0x${string}`,
        abi: vitaAbi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    const { data: profile, refetch: refetchProfile } = useReadContract({
        address: VITA_TOKEN_V2_ADDRESS as `0x${string}`,
        abi: vitaAbi,
        functionName: "getWorkerProfile",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    return {
        balance: balance ? Number(balance) / 1e18 : 0,
        profile,
        refetch: () => {
            refetchBalance();
            refetchProfile();
        }
    };
}
