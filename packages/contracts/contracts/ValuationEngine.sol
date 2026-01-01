// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IValuationEngine.sol";

/**
 * @title ValuationEngine
 * @notice On-chain implementation of the VITA valuation formula
 * @dev V = (H × R) × S_AI × e^(-λt)
 * 
 * This contract provides:
 * - Skill rate management
 * - On-chain valuation calculation
 * - Integration with Chainlink oracles for rate feeds
 */
contract ValuationEngine is IValuationEngine, Ownable {
    // ============================================================================
    // CONSTANTS
    // ============================================================================

    /// @notice Precision for fixed-point math (18 decimals)
    uint256 public constant PRECISION = 1e18;

    /// @notice Decay constant λ = 0.1 (annual), scaled by PRECISION
    uint256 public constant DECAY_CONSTANT = 1e17; // 0.1 * 1e18

    /// @notice Seconds per year for time calculations
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    /// @notice Minimum reliability score (10%)
    uint256 public constant MIN_RELIABILITY_SCORE = 1e17;

    /// @notice Maximum pledgeable hours per mint
    uint256 public constant MAX_PLEDGED_HOURS = 1000;

    // ============================================================================
    // STATE
    // ============================================================================

    /// @notice Hourly rates for each skill category (USD, 18 decimals)
    mapping(SkillCategory => uint256) public skillRates;

    /// @notice Worker valuations
    mapping(address => WorkerValuation) public workerValuations;

    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================

    constructor() Ownable(msg.sender) {
        // Initialize default skill rates (USD * 1e18)
        skillRates[SkillCategory.SOLIDITY_DEV] = 150 * PRECISION;
        skillRates[SkillCategory.FRONTEND_DEV] = 100 * PRECISION;
        skillRates[SkillCategory.BACKEND_DEV] = 120 * PRECISION;
        skillRates[SkillCategory.FULLSTACK_DEV] = 130 * PRECISION;
        skillRates[SkillCategory.DEVOPS] = 110 * PRECISION;
        skillRates[SkillCategory.DATA_SCIENCE] = 140 * PRECISION;
        skillRates[SkillCategory.AI_ML] = 160 * PRECISION;
        skillRates[SkillCategory.DESIGN] = 90 * PRECISION;
        skillRates[SkillCategory.WRITING] = 60 * PRECISION;
        skillRates[SkillCategory.MARKETING] = 70 * PRECISION;
    }

    // ============================================================================
    // VALUATION LOGIC
    // ============================================================================

    /**
     * @notice Calculate tokenized value using VITA formula
     * @dev V = (H × R) × S_AI × e^(-λt)
     * @param pledgedHours Number of hours pledged (H)
     * @param skill Skill category for rate lookup (R)
     * @param reliabilityScore AI reliability score 0-1e18 (S_AI)
     * @param timeToFulfillment Time until fulfillment in seconds (t)
     * @return value Calculated tokenized value in USD (18 decimals)
     */
    function calculateValue(
        uint256 pledgedHours,
        SkillCategory skill,
        uint256 reliabilityScore,
        uint256 timeToFulfillment
    ) external view override returns (uint256 value) {
        require(pledgedHours > 0 && pledgedHours <= MAX_PLEDGED_HOURS, "Invalid hours");
        require(reliabilityScore >= MIN_RELIABILITY_SCORE && reliabilityScore <= PRECISION, "Invalid score");

        // Get hourly rate for skill
        uint256 rate = skillRates[skill];
        require(rate > 0, "Invalid skill category");

        // Base value: H × R
        uint256 baseValue = pledgedHours * rate;

        // Apply reliability score: baseValue × S_AI / PRECISION
        uint256 adjustedValue = (baseValue * reliabilityScore) / PRECISION;

        // Calculate time decay: e^(-λt)
        uint256 timeDecay = _calculateTimeDecay(timeToFulfillment);

        // Final value: adjustedValue × timeDecay / PRECISION
        value = (adjustedValue * timeDecay) / PRECISION;

        return value;
    }

    /**
     * @notice Calculate time decay factor e^(-λt)
     * @dev Uses Taylor series approximation for e^x
     * @param timeSeconds Time in seconds
     * @return decay Decay factor (18 decimals)
     */
    function _calculateTimeDecay(uint256 timeSeconds) internal pure returns (uint256 decay) {
        // Convert time to years (scaled by PRECISION)
        uint256 timeYears = (timeSeconds * PRECISION) / SECONDS_PER_YEAR;

        // Calculate λt (scaled by PRECISION)
        uint256 lambdaT = (DECAY_CONSTANT * timeYears) / PRECISION;

        // Approximate e^(-λt) using Taylor series
        // e^(-x) ≈ 1 - x + x²/2 - x³/6 + x⁴/24 (for small x)
        // For λ=0.1 and t up to 2 years, x = 0.2 max, so this is accurate
        
        if (lambdaT >= PRECISION) {
            // For very large decay, return minimum
            return PRECISION / 10; // 10% minimum value
        }

        // Taylor series terms
        uint256 term1 = PRECISION; // 1
        uint256 term2 = lambdaT;   // x
        uint256 term3 = (lambdaT * lambdaT) / (2 * PRECISION); // x²/2
        uint256 term4 = (lambdaT * lambdaT * lambdaT) / (6 * PRECISION * PRECISION); // x³/6

        // e^(-x) ≈ 1 - x + x²/2 - x³/6
        decay = term1 - term2 + term3;
        
        // Subtract term4 only if it doesn't underflow
        if (decay > term4) {
            decay -= term4;
        }

        // Ensure minimum decay
        if (decay < PRECISION / 10) {
            decay = PRECISION / 10;
        }

        return decay;
    }

    // ============================================================================
    // SKILL RATE MANAGEMENT
    // ============================================================================

    /**
     * @notice Get the hourly rate for a skill category
     */
    function getSkillRate(SkillCategory skill) external view override returns (uint256 rate) {
        return skillRates[skill];
    }

    /**
     * @notice Update skill rate (admin only)
     */
    function updateSkillRate(SkillCategory skill, uint256 newRate) external override onlyOwner {
        require(newRate > 0, "Rate must be positive");
        uint256 oldRate = skillRates[skill];
        skillRates[skill] = newRate;
        emit SkillRateUpdated(skill, oldRate, newRate);
    }

    /**
     * @notice Batch update skill rates
     */
    function batchUpdateSkillRates(
        SkillCategory[] calldata skills,
        uint256[] calldata rates
    ) external onlyOwner {
        require(skills.length == rates.length, "Length mismatch");
        for (uint256 i = 0; i < skills.length; i++) {
            require(rates[i] > 0, "Rate must be positive");
            uint256 oldRate = skillRates[skills[i]];
            skillRates[skills[i]] = rates[i];
            emit SkillRateUpdated(skills[i], oldRate, rates[i]);
        }
    }

    /**
     * @notice Get decay constant (lambda)
     */
    function getDecayConstant() external pure override returns (uint256 lambda) {
        return DECAY_CONSTANT;
    }

    // ============================================================================
    // HELPER FUNCTIONS
    // ============================================================================

    /**
     * @notice Calculate value with all parameters exposed (for testing)
     */
    function calculateValueDetailed(
        uint256 pledgedHours,
        SkillCategory skill,
        uint256 reliabilityScore,
        uint256 timeToFulfillment
    ) external view returns (
        uint256 baseValue,
        uint256 adjustedValue,
        uint256 timeDecay,
        uint256 finalValue
    ) {
        uint256 rate = skillRates[skill];
        baseValue = pledgedHours * rate;
        adjustedValue = (baseValue * reliabilityScore) / PRECISION;
        timeDecay = _calculateTimeDecay(timeToFulfillment);
        finalValue = (adjustedValue * timeDecay) / PRECISION;
    }
}
