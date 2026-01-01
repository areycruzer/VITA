/**
 * VITA Protocol Contract Addresses
 * Mantle Sepolia Testnet (Chain ID: 5003)
 * 
 * Last deployed: 2026-01-01
 */

export const CHAIN_ID = 5003;
// export const CHAIN_ID = 31337;

export const CONTRACTS = {
  VITA_TOKEN_V2: "0x36987d58D3ba97462c241B52598aacd7B8C77228",
  VITA_TOKEN: "0x4d0F0e709b1c81853f3a99925B00cFe085044c79",
  VALUATION_ENGINE: "0xa7BC6695258f5fC5E07c5561bE2c65342AC7b745",
  GROTH16_VERIFIER: "0x47371C3244D60C89D6e5Ab49E972cA07D427Dc37",
  WORK_PROOF_REGISTRY: "0x008aceeD352DC93DB3B15E4466f8Ad71316D0dCd",
  METH_STAKING: "0xcC06e475e8863129fEaC7eFecE9851B4a489738e",
  MOCK_METH: "0x9A02E56cE3D8858ff72bfbDb83085AE5CfAE7031",
} as const;

export const EXPLORER_URL = "https://sepolia.mantlescan.xyz";

export const RPC_URL = "https://rpc.sepolia.mantle.xyz";

// EIP-712 Domain for VitaToken signing
export const VITA_DOMAIN = {
  name: "VitaToken",
  version: "1",
  chainId: CHAIN_ID,
  verifyingContract: CONTRACTS.VITA_TOKEN_V2,
} as const;

// Skill categories matching smart contract enum
export const SKILL_CATEGORIES = {
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
} as const;

export const SKILL_LABELS: Record<number, string> = {
  0: "Solidity Developer",
  1: "Frontend Developer",
  2: "Backend Developer",
  3: "Fullstack Developer",
  4: "DevOps Engineer",
  5: "Data Scientist",
  6: "AI/ML Engineer",
  7: "Designer",
  8: "Technical Writer",
  9: "Marketing",
};

// Market rates (USD/hour)
export const SKILL_RATES: Record<number, number> = {
  0: 150, // Solidity
  1: 100, // Frontend
  2: 120, // Backend
  3: 130, // Fullstack
  4: 110, // DevOps
  5: 140, // Data Science
  6: 160, // AI/ML
  7: 90,  // Design
  8: 60,  // Writing
  9: 70,  // Marketing
};
