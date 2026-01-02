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
        const { githubUsername, workerAddress, pledgedHours, skillCategory } = body;

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

        // 2. Fetch REAL GitHub Data
        let commitVelocity = 0;
        let totalStars = 0;
        let accountAgeDays = 365;
        let followers = 0;
        let repoCount = 0;

        try {
            const headers: Record<string, string> = {
                "User-Agent": "VITA-Protocol-Oracle",
                "Accept": "application/vnd.github.v3+json",
            };
            if (process.env.GITHUB_API_TOKEN) {
                headers["Authorization"] = `Bearer ${process.env.GITHUB_API_TOKEN}`;
            }

            // Fetch user data
            const userRes = await fetch(`https://api.github.com/users/${githubUsername}`, { headers });
            if (userRes.ok) {
                const userData = await userRes.json();
                accountAgeDays = Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24));
                followers = userData.followers || 0;
                repoCount = userData.public_repos || 0;
            }

            // Fetch repos for stars
            const reposRes = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100`, { headers });
            if (reposRes.ok) {
                const repos = await reposRes.json();
                totalStars = repos.reduce((sum: number, repo: { stargazers_count?: number }) => sum + (repo.stargazers_count || 0), 0);
            }

            // Fetch events for commit velocity
            const eventsRes = await fetch(`https://api.github.com/users/${githubUsername}/events?per_page=100`, { headers });
            if (eventsRes.ok) {
                const events = await eventsRes.json();
                const periodStart = new Date();
                periodStart.setDate(periodStart.getDate() - 30);
                const pushEvents = events.filter((e: { type: string; created_at: string }) =>
                    e.type === "PushEvent" && new Date(e.created_at) >= periodStart
                );
                const commitCount = pushEvents.reduce((sum: number, e: { payload?: { commits?: unknown[] } }) =>
                    sum + (e.payload?.commits?.length || 0), 0
                );
                commitVelocity = commitCount / 30;
            }
        } catch (githubError) {
            console.warn("GitHub API error, using defaults:", githubError);
        }

        // 3. Calculate REAL Vitality Score (same logic as valuation.js)
        const velocityScore = Math.min(commitVelocity / 2, 1);
        const starsScore = Math.min(Math.log10(totalStars + 1) / 3, 1);
        const maturityScore = Math.min(accountAgeDays / 730, 1);
        const followersScore = Math.min(Math.log10(followers + 1) / 3, 1);
        const repoQualityScore = repoCount > 0 ? Math.min((totalStars / repoCount) / 10, 1) : 0;

        const reliabilityScore = Math.max(0.1, Math.min(1,
            velocityScore * 0.3 +
            starsScore * 0.2 +
            repoQualityScore * 0.2 +
            maturityScore * 0.15 +
            followersScore * 0.15
        ));

        // Vitality score (0-1000 scale)
        const vitalityScore = Math.floor(reliabilityScore * 1000);

        // 4. Use user-provided values or sensible defaults
        const hours = pledgedHours || 160;
        const skill = skillCategory ?? 0;
        const SKILL_RATES: Record<number, number> = { 0: 150, 1: 100, 2: 120, 3: 130, 4: 110, 5: 140, 6: 160, 7: 90, 8: 60, 9: 70 };
        const hourlyRate = SKILL_RATES[skill] || 100;

        // 5. VITA Formula: V = (H * R) * S_AI
        const baseValuation = BigInt(hours * hourlyRate);
        const scoreMultiplier = BigInt(vitalityScore);
        const tokenValue = (baseValuation * scoreMultiplier * BigInt(1e18)) / BigInt(1000);

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
            reliabilityScore: BigInt(Math.floor(reliabilityScore * 100)), // Convert 0.0-1.0 to 0-100
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
                    reliabilityScore: Math.floor(reliabilityScore * 100).toString(), // 0-100 scale
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
        console.error("Error details:", error instanceof Error ? error.message : String(error));
        console.error("Stack:", error instanceof Error ? error.stack : "No stack");
        return NextResponse.json({
            error: "Valuation Failed",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

function parseSignature(signature: string) {
    const r = "0x" + signature.slice(2, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);
    return { r, s, v };
}
