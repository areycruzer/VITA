// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IYieldDistributor
 * @notice Interface for distributing yield from mETH staking
 * @dev Implements the 20% yield-back feature for workers
 */
interface IYieldDistributor {
    /// @notice Yield distribution breakdown
    struct YieldDistribution {
        uint256 workerShare;    // 20% to worker
        uint256 holderShare;    // 70% to token holders
        uint256 protocolFee;    // 10% protocol fee
        uint256 totalYield;
        uint256 timestamp;
    }

    /// @notice Deposit collateral for yield generation
    /// @param amount Amount of MNT to deposit
    function depositCollateral(uint256 amount) external payable;

    /// @notice Withdraw collateral
    /// @param amount Amount to withdraw
    function withdrawCollateral(uint256 amount) external;

    /// @notice Distribute accumulated yield
    /// @param tokenId VITA token ID for distribution
    function distributeYield(uint256 tokenId) external;

    /// @notice Claim worker's yield share
    function claimWorkerYield() external;

    /// @notice Get pending yield for a worker
    /// @param worker Worker address
    /// @return amount Pending yield amount
    function getPendingWorkerYield(address worker) external view returns (uint256 amount);

    /// @notice Get total collateral deposited
    /// @return total Total collateral in the protocol
    function getTotalCollateral() external view returns (uint256 total);

    /// @notice Emitted when collateral is deposited
    event CollateralDeposited(address indexed depositor, uint256 amount);

    /// @notice Emitted when yield is distributed
    event YieldDistributed(
        uint256 indexed tokenId,
        uint256 workerAmount,
        uint256 holderAmount,
        uint256 protocolAmount
    );

    /// @notice Emitted when worker claims yield
    event WorkerYieldClaimed(address indexed worker, uint256 amount);
}
