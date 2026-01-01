// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IValuationEngine
 * @notice Interface for the VITA valuation engine
 * @dev Implements the formula: V = (H × R) × S_AI × e^(-λt)
 */
interface IValuationEngine {
    /// @notice Skill category for rate determination
    enum SkillCategory {
        SOLIDITY_DEV,
        FRONTEND_DEV,
        BACKEND_DEV,
        FULLSTACK_DEV,
        DEVOPS,
        DATA_SCIENCE,
        AI_ML,
        DESIGN,
        WRITING,
        MARKETING
    }

    /// @notice Worker valuation data
    struct WorkerValuation {
        address worker;
        uint256 pledgedHours;
        SkillCategory skill;
        uint256 reliabilityScore; // 18 decimals, max 1e18 = 100%
        uint256 timeToFulfillment; // in seconds
        uint256 calculatedValue;
        uint256 timestamp;
    }

    /// @notice Calculate tokenized value for a worker
    /// @param pledgedHours Number of hours pledged
    /// @param skill Skill category for rate lookup
    /// @param reliabilityScore AI reliability score (0-1e18)
    /// @param timeToFulfillment Time until fulfillment in seconds
    /// @return value Calculated tokenized value in USD (18 decimals)
    function calculateValue(
        uint256 pledgedHours,
        SkillCategory skill,
        uint256 reliabilityScore,
        uint256 timeToFulfillment
    ) external view returns (uint256 value);

    /// @notice Get the hourly rate for a skill category
    /// @param skill Skill category
    /// @return rate Hourly rate in USD (18 decimals)
    function getSkillRate(SkillCategory skill) external view returns (uint256 rate);

    /// @notice Update skill rate (admin only)
    /// @param skill Skill category
    /// @param newRate New hourly rate in USD (18 decimals)
    function updateSkillRate(SkillCategory skill, uint256 newRate) external;

    /// @notice Get decay constant (lambda)
    /// @return lambda Decay constant (18 decimals)
    function getDecayConstant() external view returns (uint256 lambda);

    /// @notice Emitted when a valuation is calculated
    event ValuationCalculated(
        address indexed worker,
        uint256 pledgedHours,
        SkillCategory skill,
        uint256 reliabilityScore,
        uint256 value
    );

    /// @notice Emitted when a skill rate is updated
    event SkillRateUpdated(SkillCategory indexed skill, uint256 oldRate, uint256 newRate);
}
