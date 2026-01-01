/**
 * VITA Project Master Configuration
 * ================================
 * Valorized Intangible Token Assets - The Human Capital Stock Exchange on Mantle
 *
 * This file contains all project constants, network configurations,
 * and the core valuation logic for the VITA protocol.
 */

// ============================================================================
// NETWORK CONFIGURATION
// ============================================================================

export const MANTLE_TESTNET = {
  chainId: 5001,
  chainName: "Mantle Testnet",
  rpcUrl: "https://rpc.testnet.mantle.xyz",
  currency: {
    name: "Mantle",
    symbol: "MNT",
    decimals: 18,
  },
  blockExplorer: "https://explorer.testnet.mantle.xyz",
  // Modular DA for storing productivity metadata at low cost
  features: ["modular-da", "evm-compatible", "zk-validity-proofs"],
} as const;

export const MANTLE_MAINNET = {
  chainId: 5000,
  chainName: "Mantle Mainnet",
  rpcUrl: "https://rpc.mantle.xyz",
  currency: {
    name: "Mantle",
    symbol: "MNT",
    decimals: 18,
  },
  blockExplorer: "https://explorer.mantle.xyz",
  features: ["modular-da", "evm-compatible", "zk-validity-proofs"],
} as const;

// ============================================================================
// ERC-3643 / T-REX PROTOCOL CONFIGURATION
// ============================================================================

export const ERC3643_CONFIG = {
  // Token standard for permissioned RWA tokens
  standard: "ERC-3643",
  protocolName: "T-REX",

  // Identity layer for KYC/AML compliance
  identityLayer: "ONCHAINID",

  // Claim topics for VITA-specific verification
  claimTopics: {
    KYC_VERIFIED: 1,
    AML_CLEARED: 2,
    ACCREDITED_INVESTOR: 3,
    WORKER_VERIFIED: 4,
    PRODUCTIVITY_SCORE: 5,
  },

  // Compliance modules to be deployed
  complianceModules: [
    "CountryAllowModule",
    "MaxBalanceModule",
    "TransferRestrictModule",
    "WorkerEligibilityModule", // Custom VITA module
  ],
} as const;

// ============================================================================
// CHAINLINK FUNCTIONS CONFIGURATION
// ============================================================================

export const CHAINLINK_CONFIG = {
  // Subscription management
  subscriptionId: 0, // To be set after subscription creation

  // DON (Decentralized Oracle Network) settings
  donId: "fun-mantle-testnet-1", // Mantle testnet DON

  // Data sources for productivity verification
  dataSources: {
    github: {
      baseUrl: "https://api.github.com",
      metrics: ["commits", "stars", "pull_requests", "issues_closed"],
    },
    upwork: {
      baseUrl: "https://www.upwork.com/api",
      metrics: ["hours_worked", "jobs_completed", "success_rate"],
    },
  },

  // Gas limits for Chainlink Functions
  gasLimit: 300_000,

  // Callback gas limit
  callbackGasLimit: 100_000,
} as const;

// ============================================================================
// VALUATION MODEL
// ============================================================================

/**
 * VITA Valuation Formula:
 * V = (H × R) × S_AI × e^(-λt)
 *
 * Where:
 * - V: Tokenized Value (Mint limit in USD)
 * - H: Pledged Hours (Verified by GitHub/Upwork)
 * - R: Market Rate (Oracle-fed USD rate for the specific skill)
 * - S_AI: AI Reliability Score (Historical delivery consistency, 0-1)
 * - e^(-λt): Time Decay (Future value discount)
 * - λ: Decay constant (typically 0.1 for annual decay)
 * - t: Time in years until fulfillment
 */
export const VALUATION_CONFIG = {
  // Decay constant (λ) - higher = faster depreciation
  decayConstant: 0.1,

  // Minimum AI reliability score to mint tokens
  minReliabilityScore: 0.5,

  // Maximum pledgeable hours per token
  maxPledgedHours: 1000,

  // Skill categories and their base rates (USD/hour)
  skillRates: {
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
  },

  // Valuation precision (decimals)
  precision: 18,
} as const;

/**
 * Calculate tokenized value using the VITA formula
 * V = (H × R) × S_AI × e^(-λt)
 */
export function calculateTokenValue(
  pledgedHours: number,
  hourlyRate: number,
  reliabilityScore: number,
  timeToFulfillmentYears: number
): number {
  const { decayConstant } = VALUATION_CONFIG;

  // Base value: Hours × Rate
  const baseValue = pledgedHours * hourlyRate;

  // Apply AI reliability multiplier
  const adjustedValue = baseValue * reliabilityScore;

  // Apply time decay: e^(-λt)
  const timeDecay = Math.exp(-decayConstant * timeToFulfillmentYears);

  // Final tokenized value
  const tokenValue = adjustedValue * timeDecay;

  return tokenValue;
}

// ============================================================================
// ZK-SNARK CONFIGURATION (Proof of Fulfillment)
// ============================================================================

export const ZK_CONFIG = {
  // Circuit framework
  framework: "Circom",
  prover: "SnarkJS",

  // Proof types
  proofTypes: {
    TASK_COMPLETION: "proof_of_fulfillment",
    HOURS_WORKED: "proof_of_hours",
    CODE_CONTRIBUTION: "proof_of_contribution",
  },

  // Circuit parameters
  circuitParams: {
    // Number of constraints (approximate)
    constraintSize: 100_000,
    // Proving key size
    provingKeySize: "50MB",
  },
} as const;

// ============================================================================
// YIELD MECHANISM (mETH Integration)
// ============================================================================

export const YIELD_CONFIG = {
  // Mantle Liquid Staking Protocol
  stakingProtocol: "mETH",

  // Yield distribution
  yieldDistribution: {
    // 20% of yield goes back to the worker (Hackathon requirement)
    workerShare: 0.2,
    // 70% to token holders
    holderShare: 0.7,
    // 10% protocol fee
    protocolFee: 0.1,
  },

  // Minimum collateral for soft-staking
  minCollateralUSD: 100,

  // Collateralization ratio
  collateralRatio: 1.5, // 150% collateralized
} as const;

// ============================================================================
// FRONTEND CONFIGURATION
// ============================================================================

export const FRONTEND_CONFIG = {
  // Framework
  framework: "Next.js 14",
  router: "App Router",

  // Styling
  styling: ["Tailwind CSS", "Shadcn/UI"],

  // Charts for vitality graphs
  charting: "Recharts",

  // Blockchain libraries
  web3Libs: ["Viem", "Wagmi", "TanStack Query"],

  // Theme
  theme: {
    primary: "#00D9FF", // Mantle cyan
    secondary: "#1a1a2e",
    accent: "#7B61FF",
  },
} as const;

// ============================================================================
// CONTRACT ADDRESSES (To be populated after deployment)
// ============================================================================

export const CONTRACT_ADDRESSES = {
  testnet: {
    // ERC-3643 Core
    vitaToken: "" as `0x${string}`,
    identityRegistry: "" as `0x${string}`,
    identityRegistryStorage: "" as `0x${string}`,
    trustedIssuersRegistry: "" as `0x${string}`,
    claimTopicsRegistry: "" as `0x${string}`,
    modularCompliance: "" as `0x${string}`,

    // VITA Custom
    productivityOracle: "" as `0x${string}`,
    valuationEngine: "" as `0x${string}`,
    yieldDistributor: "" as `0x${string}`,
    proofVerifier: "" as `0x${string}`,

    // External
    mETH: "" as `0x${string}`,
    chainlinkRouter: "" as `0x${string}`,
  },
  mainnet: {
    vitaToken: "" as `0x${string}`,
    identityRegistry: "" as `0x${string}`,
    identityRegistryStorage: "" as `0x${string}`,
    trustedIssuersRegistry: "" as `0x${string}`,
    claimTopicsRegistry: "" as `0x${string}`,
    modularCompliance: "" as `0x${string}`,
    productivityOracle: "" as `0x${string}`,
    valuationEngine: "" as `0x${string}`,
    yieldDistributor: "" as `0x${string}`,
    proofVerifier: "" as `0x${string}`,
    mETH: "" as `0x${string}`,
    chainlinkRouter: "" as `0x${string}`,
  },
} as const;

// ============================================================================
// HACKATHON COMPLIANCE
// ============================================================================

export const HACKATHON_CONFIG = {
  // Deployment requirements
  deployment: {
    verifyOnMantlescan: true,
    network: "mantle-testnet",
  },

  // Presentation focus
  theme: "Real Assets, Real Yield, Real Builders",
  mantleVision2026: true,

  // Ethics requirement
  ethics: {
    yieldBackFeature: true,
    workerYieldPercentage: 0.2, // 20%
  },
} as const;

// ============================================================================
// PROJECT METADATA
// ============================================================================

export const PROJECT_META = {
  name: "VITA",
  fullName: "Valorized Intangible Token Assets",
  tagline: "The Human Capital Stock Exchange on Mantle",
  description:
    "Tokenize projected future productivity (Gig worker hours) as compliant, yield-bearing RWAs.",
  version: "0.1.0",
  license: "MIT",
  repository: "https://github.com/vita-protocol/vita",
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type SkillCategory = keyof typeof VALUATION_CONFIG.skillRates;
export type ClaimTopic = keyof typeof ERC3643_CONFIG.claimTopics;
export type ProofType = keyof typeof ZK_CONFIG.proofTypes;
export type Network = "testnet" | "mainnet";
