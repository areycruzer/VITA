/**
 * VitaTokenV2 ABI (Simplified for frontend)
 */
export const VITA_TOKEN_V2_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function workerNonces(address worker) view returns (uint256)",
  "function workerProfiles(address worker) view returns (uint256 totalMinted, uint256 lastMintTimestamp, uint8 skillCategory, uint256 vitalityScore)",
  "function pendingYield(address worker) view returns (uint256)",
  "function initialized() view returns (bool)",
  
  // Write functions
  "function mintEcho(address worker, uint8 skillCategory, uint256 pledgedHours, uint256 vitalityScore, uint256 reliabilityScore, uint256 mintAmount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) payable",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function claimYield()",
  
  // Events
  "event ProductivityEchoed(address indexed worker, uint256 amount, uint8 skillCategory, uint256 vitalityScore)",
  "event YieldClaimed(address indexed worker, uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
] as const;

export const VALUATION_ENGINE_ABI = [
  "function calculateValuation(uint8 skillCategory, uint256 pledgedHours, uint256 vitalityScore, uint256 fulfillmentDays) view returns (uint256 value)",
  "function getDetailedValuation(uint8 skillCategory, uint256 pledgedHours, uint256 vitalityScore, uint256 fulfillmentDays) view returns (uint256 baseValue, uint256 aiAdjustedValue, uint256 finalValue, uint256 decayFactor)",
  "function skillRates(uint8 category) view returns (uint256)",
] as const;

export const METH_STAKING_ABI = [
  "function workerStakes(address worker) view returns (uint256 methBalance, uint256 ethValueAtStake, uint256 stakedAt)",
  "function getWorkerStakeValue(address worker) view returns (uint256 currentEthValue, uint256 yieldAccrued)",
  "function totalStakedETH() view returns (uint256)",
  "function currentExchangeRate() view returns (uint256)",
] as const;

export const WORK_PROOF_REGISTRY_ABI = [
  "function isProofUsed(bytes32 proofHash) view returns (bool)",
  "function workerProofCount(address worker) view returns (uint256)",
  "function getWorkerProofs(address worker) view returns (bytes32[])",
] as const;
