const { ethers } = require("hardhat");
require("dotenv").config();

// Simulation of Chainlink Functions / AI Oracle Agent
async function main() {
    console.log("🤖 VITA Valuation Agent starting...");

    // 1. Configuration
    const PRIVATE_KEY = process.env.MANTLE_PRIVATE_KEY;
    if (!PRIVATE_KEY) throw new Error("MANTLE_PRIVATE_KEY not set");

    const VITA_TOKEN_ADDRESS = process.env.VITA_TOKEN_ADDRESS || "0x36987d58D3ba97462c241B52598aacd7B8C77228"; // Mantle Sepolia
    const WORKER_ADDRESS = process.env.WORKER_ADDRESS || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Default Hardhat account 0
    // Default to a real user if not set
    const GITHUB_USER = process.env.GITHUB_USER || "areycruzer";

    const wallet = new ethers.Wallet(PRIVATE_KEY);
    console.log(`🔑 Oracle Signer: ${wallet.address}`);
    console.log(`🎯 Evaluating Worker: ${WORKER_ADDRESS} (${GITHUB_USER})`);

    // 2. Real GitHub Data Fetch
    console.log("\n📡 Fetching GitHub Data...");
    let githubData = {
        commitVelocity: 0,
        repoStars: 0,
        mergedPRs: 0,
        issuesClosed: 0
    };

    try {
        const headers = { "User-Agent": "VITA-Oracle-Agent" };
        // Fetch User Profile
        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers });
        if (!userRes.ok) throw new Error(`GitHub User Fetch Failed: ${userRes.statusText}`);
        const userJson = await userRes.json();

        // Fetch Repos for Star Count
        const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`);
        if (!reposRes.ok) throw new Error(`GitHub Repos Fetch Failed: ${reposRes.statusText}`);
        const reposJson = await reposRes.json();

        // Calculate Stats
        const totalStars = reposJson.reduce((acc, repo) => acc + repo.stargazers_count, 0);

        // Proxy "Commit Velocity" using public events (rough approximation)
        const eventsRes = await fetch(`https://api.github.com/users/${GITHUB_USER}/events?per_page=30`);
        const eventsJson = eventsRes.ok ? await eventsRes.json() : [];
        const pushEvents = eventsJson.filter(e => e.type === "PushEvent").length;

        githubData = {
            commitVelocity: pushEvents * 2, // Extrapolate weekly velocity roughly
            repoStars: totalStars,
            mergedPRs: userJson.public_repos, // Using repo count as proxy for activity complexity
            followers: userJson.followers
        };

        console.log(`   - GitHub User: ${userJson.name || GITHUB_USER}`);
        console.log(`   - Public Repos: ${userJson.public_repos}`);
        console.log(`   - Total Stars: ${githubData.repoStars}`);
        console.log(`   - Recent Push Events: ${pushEvents}`);
        console.log(`   - Est. Commit Velocity: ${githubData.commitVelocity}`);

    } catch (error) {
        console.warn("⚠️  GitHub API Error (Rate Limit?):", error.message);
        console.log("   -> Falling back to mock data for demo...");
        githubData = { commitVelocity: 45, repoStars: 120 };
    }

    // 3. AI Vitality Score Calculation (VITA Formula)
    console.log("\n🧠 Calculating Vitality Score...");
    let calculatedScore = 800; // Base baseline
    calculatedScore += (githubData.commitVelocity * 2);
    calculatedScore += (githubData.repoStars * 0.5);
    // Bonus for followers
    if (githubData.followers) calculatedScore += (githubData.followers * 0.1);

    if (calculatedScore > 1000) calculatedScore = 1000;

    const vitalityScore = Math.floor(calculatedScore);
    const reliabilityScore = 95;
    const pledgedHours = 160;

    console.log(`   - Vitality Score (S_AI): ${vitalityScore}/1000`);

    // 4. Calculate Token Value
    // User Request: "Use 1 mnt only hardcoded"
    // Interpreting as fixed output of 1 Unit (1 * 10^18)
    const tokenValue = ethers.parseEther("1");

    console.log(`   - Token Value (Hardcoded): ${ethers.formatEther(tokenValue)} VITA`); // Should be 1.0

    // 5. Generate EIP-712 Signature
    console.log("\n✍️  Generating Attestation...");

    const domain = {
        name: "VITA Protocol",
        version: "2",
        chainId: 5003, // Mantle Sepolia
        verifyingContract: VITA_TOKEN_ADDRESS
    };

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
            { name: "nonce", type: "uint256" }
        ]
    };

    const validUntil = Math.floor(Date.now() / 1000) + 86400; // 24h
    const nonce = Date.now(); // Simple unique nonce for script

    const value = {
        worker: WORKER_ADDRESS,
        githubUsername: GITHUB_USER,
        vitalityScore: vitalityScore,
        reliabilityScore: reliabilityScore,
        pledgedHours: pledgedHours,
        skillCategory: 0, // Solidity Dev
        tokenValue: tokenValue,
        validUntil: validUntil,
        nonce: nonce
    };

    const signature = await wallet.signTypedData(domain, types, value);

    console.log("\n✅ EIP-712 Signature Generated:");
    console.log(signature);
    console.log("\n📋 Struct Data for Contract Call:");
    console.log(JSON.stringify(value, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
        , 2));

    return { signature, value };
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
