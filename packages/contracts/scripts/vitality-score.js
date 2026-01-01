/**
 * VITA Vitality Score Generator
 * ==============================
 * Generates AI-attested Vitality Scores with EIP-712 signatures.
 * 
 * This script:
 * 1. Fetches GitHub metrics via valuation.js
 * 2. Calls local LLM (or mock) to generate Vitality Score
 * 3. Creates EIP-712 signed message for on-chain verification
 */

const { ethers } = require("ethers");
const {
  fetchGitHubMetrics,
  calculateReliabilityScore,
  calculateTokenValue,
  SKILL_RATES,
} = require("./valuation");

require("dotenv").config();

// ============================================================================
// EIP-712 DOMAIN & TYPES
// ============================================================================

const EIP712_DOMAIN = {
  name: "VITA Protocol",
  version: "1",
  chainId: 5001, // Mantle Testnet
  verifyingContract: "", // Set after deployment
};

const VITALITY_ATTESTATION_TYPES = {
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
};

// Skill category enum (must match Solidity)
const SkillCategory = {
  SOLIDITY_DEV: 0,
  FRONTEND_DEV: 1,
  BACKEND_DEV: 2,
  FULLSTACK_DEV: 3,
  DEVOPS: 4,
  DATA_SCIENCE: 5,
  AI_ML: 6,
  DESIGN: 7,
  WRITING: 8,
  MARKETING: 9,
};

// ============================================================================
// LOCAL LLM / MOCK VITALITY ANALYZER
// ============================================================================

/**
 * Generate Vitality Score using local LLM or mock
 * In production, this would call Ollama, LM Studio, or similar
 */
async function generateVitalityScore(metrics, skillCategory) {
  // Check if local LLM is available (Ollama)
  const useLLM = process.env.USE_LOCAL_LLM === "true";

  if (useLLM) {
    return await callLocalLLM(metrics, skillCategory);
  } else {
    return mockVitalityAnalysis(metrics, skillCategory);
  }
}

/**
 * Call local LLM (Ollama) for vitality analysis
 */
async function callLocalLLM(metrics, skillCategory) {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";

  const prompt = `You are a developer productivity analyst for a DeFi protocol that tokenizes human capital.

Analyze these GitHub metrics for a ${skillCategory} developer and provide a Vitality Score (0-100):

GitHub Metrics:
- Commit Velocity: ${metrics.commitVelocity.toFixed(2)} commits/day
- Total Stars: ${metrics.totalStars}
- Repository Count: ${metrics.repoCount}
- Account Age: ${metrics.accountAgeDays} days
- Followers: ${metrics.followers}

Consider:
1. Consistency of contributions
2. Quality indicators (stars per repo)
3. Community engagement
4. Experience level

Respond with ONLY a JSON object:
{"vitalityScore": <0-100>, "reasoning": "<brief explanation>"}`;

  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "llama2",
        prompt,
        stream: false,
        format: "json",
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.response);

    return {
      vitalityScore: Math.min(100, Math.max(0, result.vitalityScore)),
      reasoning: result.reasoning,
      source: "local-llm",
      model: process.env.OLLAMA_MODEL || "llama2",
    };
  } catch (error) {
    console.log("⚠️  Local LLM unavailable, falling back to mock:", error.message);
    return mockVitalityAnalysis(metrics, skillCategory);
  }
}

/**
 * Mock vitality analysis (deterministic for testing)
 */
function mockVitalityAnalysis(metrics, skillCategory) {
  // Base score from reliability
  const reliabilityScore = calculateReliabilityScore(metrics);
  let baseScore = reliabilityScore * 70; // Max 70 from reliability

  // Bonus for high commit velocity
  if (metrics.commitVelocity > 1) baseScore += 10;
  if (metrics.commitVelocity > 3) baseScore += 5;

  // Bonus for stars
  if (metrics.totalStars > 100) baseScore += 5;
  if (metrics.totalStars > 1000) baseScore += 5;

  // Bonus for account maturity
  if (metrics.accountAgeDays > 365) baseScore += 3;
  if (metrics.accountAgeDays > 730) baseScore += 2;

  // Skill-specific adjustments
  const highDemandSkills = ["SOLIDITY_DEV", "AI_ML", "DATA_SCIENCE"];
  if (highDemandSkills.includes(skillCategory)) {
    baseScore *= 1.1;
  }

  const vitalityScore = Math.min(100, Math.max(0, Math.round(baseScore)));

  const reasoning = generateMockReasoning(metrics, vitalityScore, skillCategory);

  return {
    vitalityScore,
    reasoning,
    source: "mock-analyzer",
    model: "vita-heuristic-v1",
  };
}

function generateMockReasoning(metrics, score, skill) {
  const levels = {
    high: score >= 75,
    medium: score >= 50 && score < 75,
    low: score < 50,
  };

  if (levels.high) {
    return `Exceptional ${skill} developer. Strong commit velocity (${metrics.commitVelocity.toFixed(1)}/day) and significant community recognition (${metrics.totalStars} stars). High reliability for RWA tokenization.`;
  } else if (levels.medium) {
    return `Solid ${skill} developer with consistent contributions. ${metrics.repoCount} repositories demonstrate active development. Moderate risk profile for tokenization.`;
  } else {
    return `Developing ${skill} profile. Limited historical data available. Consider smaller initial tokenization with milestone-based unlocks.`;
  }
}

// ============================================================================
// EIP-712 SIGNATURE GENERATOR
// ============================================================================

/**
 * Create EIP-712 signed attestation for on-chain verification
 */
async function createSignedAttestation(
  workerAddress,
  githubUsername,
  vitalityScore,
  reliabilityScore,
  pledgedHours,
  skillCategory,
  tokenValue,
  validityDays,
  verifyingContract
) {
  // Get signer (AI Oracle private key)
  const privateKey = process.env.AI_ORACLE_PRIVATE_KEY || process.env.MANTLE_PRIVATE_KEY;
  if (!privateKey || privateKey === "your_private_key_here") {
    throw new Error("AI_ORACLE_PRIVATE_KEY or MANTLE_PRIVATE_KEY not set in .env");
  }

  const signer = new ethers.Wallet(privateKey);

  // Set domain with verifying contract
  const domain = {
    ...EIP712_DOMAIN,
    verifyingContract: verifyingContract || ethers.ZeroAddress,
  };

  // Create attestation data
  const validUntil = Math.floor(Date.now() / 1000) + validityDays * 24 * 60 * 60;
  const nonce = Date.now(); // Simple nonce, production should use contract nonce

  // Scale scores to 18 decimals for Solidity
  const scaledVitalityScore = ethers.parseUnits(vitalityScore.toString(), 16); // Max 100 * 10^16
  const scaledReliabilityScore = ethers.parseUnits(reliabilityScore.toFixed(18), 18);

  const attestation = {
    worker: workerAddress,
    githubUsername,
    vitalityScore: scaledVitalityScore,
    reliabilityScore: scaledReliabilityScore,
    pledgedHours: BigInt(pledgedHours),
    skillCategory: SkillCategory[skillCategory] ?? SkillCategory.FULLSTACK_DEV,
    tokenValue: ethers.parseUnits(tokenValue.toFixed(2), 18),
    validUntil: BigInt(validUntil),
    nonce: BigInt(nonce),
  };

  // Sign the attestation
  const signature = await signer.signTypedData(
    domain,
    VITALITY_ATTESTATION_TYPES,
    attestation
  );

  // Split signature
  const sig = ethers.Signature.from(signature);

  return {
    attestation: {
      ...attestation,
      vitalityScore: attestation.vitalityScore.toString(),
      reliabilityScore: attestation.reliabilityScore.toString(),
      tokenValue: attestation.tokenValue.toString(),
      validUntil: Number(attestation.validUntil),
      nonce: Number(attestation.nonce),
    },
    signature,
    v: sig.v,
    r: sig.r,
    s: sig.s,
    signer: signer.address,
    domain,
  };
}

// ============================================================================
// FULL PIPELINE
// ============================================================================

/**
 * Complete vitality score generation and signing pipeline
 */
async function generateSignedVitalityAttestation(
  workerAddress,
  githubUsername,
  pledgedHours,
  skillCategory,
  timeToFulfillmentDays,
  verifyingContract
) {
  console.log("\n" + "=".repeat(60));
  console.log("VITA Vitality Score Generator");
  console.log("=".repeat(60));

  // Step 1: Fetch GitHub metrics
  console.log(`\n📊 Fetching GitHub metrics for @${githubUsername}...`);
  const metrics = await fetchGitHubMetrics(githubUsername);

  // Step 2: Calculate reliability score
  console.log("\n🧮 Calculating Reliability Score...");
  const reliabilityScore = calculateReliabilityScore(metrics);
  console.log("   S_AI:", (reliabilityScore * 100).toFixed(2) + "%");

  // Step 3: Generate Vitality Score with LLM
  console.log("\n🤖 Generating Vitality Score...");
  const vitalityResult = await generateVitalityScore(metrics, skillCategory);
  console.log("   Score:", vitalityResult.vitalityScore + "/100");
  console.log("   Source:", vitalityResult.source);
  console.log("   Reasoning:", vitalityResult.reasoning);

  // Step 4: Calculate token value
  console.log("\n💰 Calculating Token Value...");
  const valuation = calculateTokenValue(
    pledgedHours,
    skillCategory,
    reliabilityScore,
    timeToFulfillmentDays
  );
  console.log("   Formula:", valuation.formula);
  console.log("   Token Value: $" + valuation.tokenValue.toFixed(2));

  // Step 5: Create EIP-712 signed attestation
  console.log("\n✍️  Creating EIP-712 Signed Attestation...");
  const signedAttestation = await createSignedAttestation(
    workerAddress,
    githubUsername,
    vitalityResult.vitalityScore,
    reliabilityScore,
    pledgedHours,
    skillCategory,
    valuation.tokenValue,
    7, // Valid for 7 days
    verifyingContract
  );
  console.log("   Signer:", signedAttestation.signer);
  console.log("   Valid Until:", new Date(signedAttestation.attestation.validUntil * 1000).toISOString());

  console.log("\n" + "=".repeat(60));

  return {
    metrics,
    reliabilityScore,
    vitalityResult,
    valuation,
    signedAttestation,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  EIP712_DOMAIN,
  VITALITY_ATTESTATION_TYPES,
  SkillCategory,
  generateVitalityScore,
  createSignedAttestation,
  generateSignedVitalityAttestation,
};

// ============================================================================
// CLI EXECUTION
// ============================================================================

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 5) {
    console.log(
      "Usage: node vitality-score.js <worker_address> <github_username> <pledged_hours> <skill_category> <days_to_fulfillment> [verifying_contract]"
    );
    console.log("\nSkill categories:", Object.keys(SkillCategory).join(", "));
    console.log(
      "\nExample: node vitality-score.js 0x123...abc vitalik 100 SOLIDITY_DEV 90"
    );
    process.exit(1);
  }

  const [workerAddress, username, hours, skill, days, contract] = args;

  generateSignedVitalityAttestation(
    workerAddress,
    username,
    parseInt(hours),
    skill,
    parseInt(days),
    contract || ethers.ZeroAddress
  )
    .then((result) => {
      console.log("\n📋 Signed Attestation (for contract call):");
      console.log(JSON.stringify(result.signedAttestation, null, 2));
    })
    .catch((error) => {
      console.error("Error:", error.message);
      process.exit(1);
    });
}
