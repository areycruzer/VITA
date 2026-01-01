// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IProductivityOracle
 * @notice Interface for the Chainlink Functions-powered productivity oracle
 * @dev Fetches and verifies off-chain productivity data from GitHub/Upwork
 */
interface IProductivityOracle {
    /// @notice Data source for productivity verification
    enum DataSource {
        GITHUB,
        UPWORK
    }

    /// @notice Productivity metrics from external sources
    struct ProductivityMetrics {
        address worker;
        DataSource source;
        uint256 commits;           // GitHub commits
        uint256 pullRequests;      // GitHub PRs merged
        uint256 stars;             // GitHub stars earned
        uint256 hoursWorked;       // Upwork hours
        uint256 jobsCompleted;     // Upwork jobs
        uint256 successRate;       // Upwork success rate (18 decimals)
        uint256 lastUpdated;
    }

    /// @notice Request productivity data verification
    /// @param worker Worker address
    /// @param source Data source (GitHub/Upwork)
    /// @param externalId External identifier (GitHub username or Upwork ID)
    /// @return requestId Chainlink Functions request ID
    function requestProductivityData(
        address worker,
        DataSource source,
        string calldata externalId
    ) external returns (bytes32 requestId);

    /// @notice Get latest productivity metrics for a worker
    /// @param worker Worker address
    /// @return metrics Latest productivity metrics
    function getProductivityMetrics(address worker) external view returns (ProductivityMetrics memory metrics);

    /// @notice Calculate AI reliability score based on metrics
    /// @param worker Worker address
    /// @return score Reliability score (0-1e18)
    function calculateReliabilityScore(address worker) external view returns (uint256 score);

    /// @notice Emitted when productivity data is requested
    event ProductivityDataRequested(
        bytes32 indexed requestId,
        address indexed worker,
        DataSource source
    );

    /// @notice Emitted when productivity data is fulfilled
    event ProductivityDataFulfilled(
        bytes32 indexed requestId,
        address indexed worker,
        uint256 reliabilityScore
    );
}
