import { NextResponse } from "next/server";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, defineChain } from "viem";

// Define Mantle Sepolia chain if not available in viem/chains by default
const mantleSepolia = defineChain({
    id: 5003,
    name: "Mantle Sepolia Testnet",
    nativeCurrency: { name: "Mantle", symbol: "MNT", decimals: 18 },
    rpcUrls: {
        default: { http: ["https://rpc.sepolia.mantle.xyz"] },
    },
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { githubUsername, workerAddress } = body;

        if (!githubUsername || !workerAddress) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // 1. Setup Oracle Account
        const privateKey = process.env.AI_ORACLE_PRIVATE_KEY;
        if (!privateKey) {
            console.error("AI_ORACLE_PRIVATE_KEY not set");
            return NextResponse.json({ error: "Oracle Configuration Error" }, { status: 500 });
        }

        const account = privateKeyToAccount(`0x${privateKey}`);

        // 2. Simulate Valuation (Randomized for Demo)
        // In production, this would call LangChain/OpenAI/GitHub API
        const vitalityScore = Math.floor(Math.random() * (1000 - 800) + 800); // 800-1000
        const reliabilityScore = Math.floor(Math.random() * (100 - 90) + 90); // 90-100
        const pledgedHours = 160; // Hardcoded for demo
        const hourlyRate = 150; // Hardcoded for demo
        const tokenValue = BigInt(pledgedHours * hourlyRate) * BigInt(1e18); // 18 decimals

        // Skill Category: 0=SOLIDITY
        const skillCategory = 0;

        // Validity: 24 hours
        const validUntil = BigInt(Math.floor(Date.now() / 1000) + 86400);

        // Nonce: We should ideally fetch this from contract, but for demo we can use a random large number 
        // or rely on frontend passing it. Let's make frontend pass it, or just use timestamp as nonce for simplicity in this hackathon demo.
        // Ideally: read nonces(workerAddress) from contract.
        // For now: timestamp to ensure uniqueness.
        const nonce = BigInt(Date.now());

        // 3. Structured Data (EIP-712)
        // Matches VitaTokenV2.sol definition
        const domain = {
            name: "VITA Protocol",
            version: "2",
            chainId: 5003,
            verifyingContract: process.env.NEXT_PUBLIC_VITA_TOKEN_V2_ADDRESS as `0x${string}`,
        } as const;

        const types = {
            VitalityAttestation: [
                { name: "worker", type: "address" },
                { name: "githubUsername", type: "string" },
                { name: "vitalityScore", type: "uint256" },
                { name: "reliabilityScore", type: "uint256" },
                { name: "pledgedHours", type: "uint256" },
                { name: "skillCategory", type: "uint8" },
                { name: "tokenValue", type: "uint256" },
                { name: "validUntil", type: "uint256" },
                { name: "nonce", type: "uint256" },
            ],
        } as const;

        const message = {
            worker: workerAddress as `0x${string}`,
            githubUsername,
            vitalityScore: BigInt(vitalityScore),
            reliabilityScore: BigInt(reliabilityScore),
            pledgedHours: BigInt(pledgedHours),
            skillCategory,
            tokenValue,
            validUntil,
            nonce,
        };

        // 4. Sign Data
        const signature = await account.signTypedData({
            domain,
            types,
            primaryType: "VitalityAttestation",
            message,
        });

        const { r, s, v } = parseSignature(signature);

        return NextResponse.json({
            success: true,
            data: {
                attestation: {
                    worker: workerAddress,
                    githubUsername,
                    vitalityScore: vitalityScore.toString(),
                    reliabilityScore: reliabilityScore.toString(),
                    pledgedHours: pledgedHours.toString(),
                    skillCategory,
                    tokenValue: tokenValue.toString(),
                    validUntil: validUntil.toString(),
                    nonce: nonce.toString()
                },
                signature: { r, s, v }
            }
        });

    } catch (error) {
        console.error("Valuation Error:", error);
        return NextResponse.json({ error: "Valuation Failed" }, { status: 500 });
    }
}

function parseSignature(signature: string) {
    const r = "0x" + signature.slice(2, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);
    return { r, s, v };
}
