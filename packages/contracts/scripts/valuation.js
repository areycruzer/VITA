/**
 * VITA Valuation Engine
 * =====================
 * Implements the VITA valuation formula and Chainlink Functions integration.
 * 
 * Formula: V = (H × R) × S_AI × e^(-λt)
 * 
 * Where:
 * - V: Tokenized Value (Mint limit in USD)
 * - H: Pledged Hours
 * - R: Market Rate (USD/hour for skill)
 * - S_AI: AI Reliability Score (0-1)
 * - e^(-λt): Time Decay
 * - λ: Decay constant (0.1 annual)
 * - t: Time in years
 */

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// ============================================================================
// CONFIGURATION
// ============================================================================

const SKILL_RATES = {
  SOLIDITY_DEV: 150,
  FRONTEND_DEV: 100,
  BACKEND_DEV: 120,
  FULLSTACK_DEV: 130,
  DEVOPS: 110,
  DATA_SCIENCE: 140,
  AI_ML: 160,
  DESIGN: 90,
  WRITING: 60,
  MARKETING: 70,
};

const DECAY_CONSTANT = 0.1; // λ = 0.1 (annual decay)
const PRECISION = 18; // 18 decimals

// ============================================================================
// GITHUB METRICS FETCHER (For local testing)
// ============================================================================

/**
 * Fetch GitHub metrics for a user (local version, for testing)
 * In production, this runs on Chainlink DON via github-source.js
 */
async function fetchGitHubMetrics(username, periodDays = 30) {
  const headers = {
    "User-Agent": "VITA-Protocol",
    Accept: "application/vnd.github.v3+json",
  };

  // Add token if available
  if (process.env.GITHUB_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_API_TOKEN}`;
  }

  try {
    // Fetch user data
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) throw new Error(`GitHub API error: ${userRes.status}`);
    const userData = await userRes.json();

    // Fetch repos
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    );
    const repos = await reposRes.json();

    // Fetch events
    const eventsRes = await fetch(
      `https://api.github.com/users/${username}/events?per_page=100`,
      { headers }
    );
    const events = await eventsRes.json();

    // Calculate metrics
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - periodDays);

    const pushEvents = events.filter((event) => {
      if (event.type !== "PushEvent") return false;
      return new Date(event.created_at) >= periodStart;
    });

    const commitCount = pushEvents.reduce(
      (sum, event) => sum + (event.payload?.commits?.length || 0),
      0
    );

    const commitVelocity = commitCount / periodDays;

    const accountAgeDays = Math.floor(
      (Date.now() - new Date(userData.created_at)) / (1000 * 60 * 60 * 24)
    );

    return {
      username,
      commitVelocity,
      totalStars,
      repoCount: repos.length,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      accountAgeDays,
      periodDays,
      rawCommits: commitCount,
    };
  } catch (error) {
    console.error("GitHub API Error:", error);
    throw error;
  }
}

// ============================================================================
// VITALITY SCORE CALCULATOR
// ============================================================================

/**
 * Calculate AI Reliability Score (S_AI) from GitHub metrics
 * Returns a score between 0 and 1
 */
function calculateReliabilityScore(metrics) {
  // Weights for different factors
  const weights = {
    commitVelocity: 0.3, // Consistent contribution
    stars: 0.2, // Community recognition
    repoQuality: 0.2, // Code quality proxy
    accountMaturity: 0.15, // Experience
    followers: 0.15, // Influence
  };

  // Normalize each metric to 0-1 scale
  // Commit velocity: 1+ commits/day is excellent
  const velocityScore = Math.min(metrics.commitVelocity / 2, 1);

  // Stars: logarithmic scale, 1000+ stars is excellent
  const starsScore = Math.min(Math.log10(metrics.totalStars + 1) / 3, 1);

  // Repo quality: ratio of starred repos
  const repoQualityScore =
    metrics.repoCount > 0
      ? Math.min((metrics.totalStars / metrics.repoCount) / 10, 1)
      : 0;

  // Account maturity: 2+ years is mature
  const maturityScore = Math.min(metrics.accountAgeDays / 730, 1);

  // Followers: logarithmic scale
  const followersScore = Math.min(Math.log10(metrics.followers + 1) / 3, 1);

  // Weighted sum
  const reliabilityScore =
    velocityScore * weights.commitVelocity +
    starsScore * weights.stars +
    repoQualityScore * weights.repoQuality +
    maturityScore * weights.accountMaturity +
    followersScore * weights.followers;

  // Ensure minimum score of 0.1 for active users
  return Math.max(0.1, Math.min(reliabilityScore, 1));
}

// ============================================================================
// VITA VALUATION FORMULA
// ============================================================================

/**
 * Calculate tokenized value using VITA formula
 * V = (H × R) × S_AI × e^(-λt)
 * 
 * @param {number} pledgedHours - Hours pledged (H)
 * @param {string} skillCategory - Skill category for rate lookup
 * @param {number} reliabilityScore - AI reliability score (S_AI, 0-1)
 * @param {number} timeToFulfillmentDays - Time until fulfillment (t)
 * @returns {Object} Valuation details
 */
function calculateTokenValue(
  pledgedHours,
  skillCategory,
  reliabilityScore,
  timeToFulfillmentDays
) {
  // Get hourly rate (R)
  const hourlyRate = SKILL_RATES[skillCategory] || SKILL_RATES.FULLSTACK_DEV;

  // Base value: H × R
  const baseValue = pledgedHours * hourlyRate;

  // Convert days to years for decay calculation
  const timeYears = timeToFulfillmentDays / 365;

  // Time decay: e^(-λt)
  const timeDecay = Math.exp(-DECAY_CONSTANT * timeYears);

  // Final value: (H × R) × S_AI × e^(-λt)
  const tokenValue = baseValue * reliabilityScore * timeDecay;

  // Convert to wei (18 decimals)
  const tokenValueWei = ethers.parseUnits(tokenValue.toFixed(PRECISION), PRECISION);

  return {
    pledgedHours,
    skillCategory,
    hourlyRate,
    baseValue,
    reliabilityScore,
    timeToFulfillmentDays,
    timeYears,
    timeDecay,
    tokenValue,
    tokenValueWei: tokenValueWei.toString(),
    formula: `V = (${pledgedHours} × $${hourlyRate}) × ${reliabilityScore.toFixed(4)} × e^(-${DECAY_CONSTANT} × ${timeYears.toFixed(4)})`,
  };
}

// ============================================================================
// FULL VALUATION PIPELINE
// ============================================================================

/**
 * Complete valuation pipeline: GitHub → Metrics → Score → Value
 */
async function valuateWorker(
  githubUsername,
  pledgedHours,
  skillCategory,
  timeToFulfillmentDays
) {
  console.log("\n" + "=".repeat(60));
  console.log("VITA Valuation Engine");
  console.log("=".repeat(60));

  // Step 1: Fetch GitHub metrics
  console.log(`\n📊 Fetching GitHub metrics for @${githubUsername}...`);
  const metrics = await fetchGitHubMetrics(githubUsername);
  console.log("   Commit Velocity:", metrics.commitVelocity.toFixed(2), "commits/day");
  console.log("   Total Stars:", metrics.totalStars);
  console.log("   Repositories:", metrics.repoCount);
  console.log("   Account Age:", metrics.accountAgeDays, "days");

  // Step 2: Calculate reliability score
  console.log("\n🤖 Calculating AI Reliability Score...");
  const reliabilityScore = calculateReliabilityScore(metrics);
  console.log("   S_AI:", (reliabilityScore * 100).toFixed(2) + "%");

  // Step 3: Calculate token value
  console.log("\n💰 Calculating Token Value...");
  const valuation = calculateTokenValue(
    pledgedHours,
    skillCategory,
    reliabilityScore,
    timeToFulfillmentDays
  );
  console.log("   Formula:", valuation.formula);
  console.log("   Base Value: $" + valuation.baseValue.toLocaleString());
  console.log("   Time Decay:", (valuation.timeDecay * 100).toFixed(2) + "%");
  console.log("   Final Value: $" + valuation.tokenValue.toFixed(2));

  console.log("\n" + "=".repeat(60));

  return {
    githubUsername,
    metrics,
    reliabilityScore,
    valuation,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  SKILL_RATES,
  DECAY_CONSTANT,
  fetchGitHubMetrics,
  calculateReliabilityScore,
  calculateTokenValue,
  valuateWorker,
};

// ============================================================================
// CLI EXECUTION
// ============================================================================

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 4) {
    console.log("Usage: node valuation.js <github_username> <pledged_hours> <skill_category> <days_to_fulfillment>");
    console.log("\nSkill categories:", Object.keys(SKILL_RATES).join(", "));
    console.log("\nExample: node valuation.js vitalik 100 SOLIDITY_DEV 90");
    process.exit(1);
  }

  const [username, hours, skill, days] = args;

  valuateWorker(username, parseInt(hours), skill, parseInt(days))
    .then((result) => {
      console.log("\n📋 Full Result:");
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error("Error:", error.message);
      process.exit(1);
    });
}
