// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IProductivityOracle.sol";

/**
 * @title ProductivityOracle
 * @notice Chainlink Functions-powered oracle for GitHub/Upwork productivity data
 * @dev Fetches off-chain metrics and calculates AI reliability scores
 */
contract ProductivityOracle is FunctionsClient, Ownable, IProductivityOracle {
    using FunctionsRequest for FunctionsRequest.Request;

    // ============================================================================
    // CONSTANTS
    // ============================================================================

    uint256 public constant PRECISION = 1e18;

    // ============================================================================
    // STATE
    // ============================================================================

    /// @notice Chainlink Functions subscription ID
    uint64 public subscriptionId;

    /// @notice Chainlink Functions DON ID
    bytes32 public donId;

    /// @notice Gas limit for Chainlink Functions callback
    uint32 public callbackGasLimit = 300_000;

    /// @notice JavaScript source code for GitHub metrics
    string public githubSource;

    /// @notice Mapping of request ID to worker address
    mapping(bytes32 => address) public requestToWorker;

    /// @notice Mapping of request ID to data source
    mapping(bytes32 => DataSource) public requestToSource;

    /// @notice Worker productivity metrics
    mapping(address => ProductivityMetrics) public productivityData;

    /// @notice Mapping of external IDs to worker addresses
    mapping(string => address) public externalIdToWorker;

    // ============================================================================
    // EVENTS
    // ============================================================================

    event SourceCodeUpdated(DataSource indexed source);
    event ConfigUpdated(uint64 subscriptionId, bytes32 donId);

    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================

    constructor(
        address router,
        uint64 _subscriptionId,
        bytes32 _donId
    ) FunctionsClient(router) Ownable(msg.sender) {
        subscriptionId = _subscriptionId;
        donId = _donId;
    }

    // ============================================================================
    // ORACLE FUNCTIONS
    // ============================================================================

    /**
     * @notice Request productivity data from GitHub/Upwork
     * @param worker Worker's Ethereum address
     * @param source Data source (GITHUB or UPWORK)
     * @param externalId GitHub username or Upwork ID
     * @return requestId Chainlink Functions request ID
     */
    function requestProductivityData(
        address worker,
        DataSource source,
        string calldata externalId
    ) external override returns (bytes32 requestId) {
        require(bytes(externalId).length > 0, "External ID required");

        // Build the Chainlink Functions request
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(githubSource);

        // Set arguments
        string[] memory args = new string[](2);
        args[0] = externalId;
        args[1] = "30"; // 30 day period
        req.setArgs(args);

        // Send request
        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            callbackGasLimit,
            donId
        );

        // Store request metadata
        requestToWorker[requestId] = worker;
        requestToSource[requestId] = source;
        externalIdToWorker[externalId] = worker;

        emit ProductivityDataRequested(requestId, worker, source);

        return requestId;
    }

    /**
     * @notice Chainlink Functions callback
     * @dev Called by the DON with the result
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        address worker = requestToWorker[requestId];
        require(worker != address(0), "Unknown request");

        if (err.length > 0) {
            // Handle error - emit event but don't revert
            return;
        }

        // Decode response
        // Format: commitVelocity (uint64), totalStars (uint64), repoCount (uint32), accountAge (uint32)
        uint256 packed = abi.decode(response, (uint256));

        uint256 commitVelocity = (packed >> 192) & 0xFFFFFFFFFFFFFFFF;
        uint256 totalStars = (packed >> 128) & 0xFFFFFFFFFFFFFFFF;
        uint256 repoCount = (packed >> 64) & 0xFFFFFFFFFFFFFFFF;
        uint256 accountAge = packed & 0xFFFFFFFFFFFFFFFF;

        // Store metrics
        ProductivityMetrics storage metrics = productivityData[worker];
        metrics.worker = worker;
        metrics.source = requestToSource[requestId];
        metrics.commits = commitVelocity;
        metrics.stars = totalStars;
        metrics.hoursWorked = repoCount * 10; // Rough estimate
        metrics.lastUpdated = block.timestamp;

        // Calculate reliability score
        uint256 score = _calculateScore(commitVelocity, totalStars, repoCount, accountAge);
        metrics.successRate = score;

        emit ProductivityDataFulfilled(requestId, worker, score);

        // Cleanup
        delete requestToWorker[requestId];
        delete requestToSource[requestId];
    }

    /**
     * @notice Get latest productivity metrics for a worker
     */
    function getProductivityMetrics(address worker) 
        external 
        view 
        override 
        returns (ProductivityMetrics memory metrics) 
    {
        return productivityData[worker];
    }

    /**
     * @notice Calculate AI reliability score from metrics
     */
    function calculateReliabilityScore(address worker) 
        external 
        view 
        override 
        returns (uint256 score) 
    {
        ProductivityMetrics memory metrics = productivityData[worker];
        return _calculateScore(
            metrics.commits,
            metrics.stars,
            metrics.pullRequests,
            365 // Default account age
        );
    }

    // ============================================================================
    // INTERNAL
    // ============================================================================

    function _calculateScore(
        uint256 commitVelocity,
        uint256 stars,
        uint256 repos,
        uint256 accountAge
    ) internal pure returns (uint256) {
        // Weights (must sum to PRECISION)
        uint256 velocityWeight = 3e17;  // 30%
        uint256 starsWeight = 25e16;    // 25%
        uint256 repoWeight = 2e17;      // 20%
        uint256 maturityWeight = 25e16; // 25%

        // Normalize metrics (cap at 100%)
        uint256 velocityScore = commitVelocity > 200 ? PRECISION : (commitVelocity * PRECISION) / 200;
        uint256 starsScore = stars > 1000 ? PRECISION : (stars * PRECISION) / 1000;
        uint256 repoScore = repos > 50 ? PRECISION : (repos * PRECISION) / 50;
        uint256 maturityScore = accountAge > 730 ? PRECISION : (accountAge * PRECISION) / 730;

        // Weighted sum
        uint256 score = 
            (velocityScore * velocityWeight) / PRECISION +
            (starsScore * starsWeight) / PRECISION +
            (repoScore * repoWeight) / PRECISION +
            (maturityScore * maturityWeight) / PRECISION;

        // Ensure minimum score of 10%
        return score < 1e17 ? 1e17 : score;
    }

    // ============================================================================
    // ADMIN
    // ============================================================================

    function setGithubSource(string calldata source) external onlyOwner {
        githubSource = source;
        emit SourceCodeUpdated(DataSource.GITHUB);
    }

    function setConfig(uint64 _subscriptionId, bytes32 _donId) external onlyOwner {
        subscriptionId = _subscriptionId;
        donId = _donId;
        emit ConfigUpdated(_subscriptionId, _donId);
    }

    function setCallbackGasLimit(uint32 _limit) external onlyOwner {
        callbackGasLimit = _limit;
    }

    /**
     * @notice Manually set productivity data (for testing/backup)
     */
    function setProductivityData(
        address worker,
        uint256 commits,
        uint256 stars,
        uint256 prs
    ) external onlyOwner {
        ProductivityMetrics storage metrics = productivityData[worker];
        metrics.worker = worker;
        metrics.commits = commits;
        metrics.stars = stars;
        metrics.pullRequests = prs;
        metrics.lastUpdated = block.timestamp;
        metrics.successRate = _calculateScore(commits, stars, prs, 365);
    }
}
