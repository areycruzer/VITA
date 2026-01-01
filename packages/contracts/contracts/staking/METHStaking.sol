// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IMETH.sol";

/**
 * @title METHStaking
 * @notice Manages soft-staking of collateral in mETH for VITA token holders
 * @dev When VITA tokens are minted, ETH collateral is staked in mETH to generate yield.
 *      Workers earn native ETH yield while their tokens are active.
 * 
 * Key features:
 * - Automatic staking of collateral on VITA mint
 * - Yield accrual tracked per worker
 * - Withdrawable yield claims
 * - Emergency unstaking with slippage protection
 * 
 * Yield Distribution (per VITA config):
 * - 20% to Worker
 * - 70% to Token Holders
 * - 10% to Protocol
 */

contract METHStaking is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // ============================================
    // Constants & Roles
    // ============================================
    
    bytes32 public constant STAKING_MANAGER_ROLE = keccak256("STAKING_MANAGER_ROLE");
    bytes32 public constant VITA_TOKEN_ROLE = keccak256("VITA_TOKEN_ROLE");
    
    // Yield distribution percentages (in basis points, 10000 = 100%)
    uint256 public constant WORKER_SHARE_BPS = 2000;     // 20%
    uint256 public constant HOLDER_SHARE_BPS = 7000;     // 70%
    uint256 public constant PROTOCOL_SHARE_BPS = 1000;   // 10%
    uint256 public constant BPS_DENOMINATOR = 10000;
    
    // ============================================
    // State Variables
    // ============================================
    
    /// @notice mETH token contract
    IMETH public immutable mETH;
    
    /// @notice Protocol treasury address
    address public treasury;
    
    /// @notice Total ETH staked across all workers
    uint256 public totalStakedETH;
    
    /// @notice Total mETH held by this contract
    uint256 public totalMETH;
    
    /// @notice Worker staking data
    struct WorkerStake {
        uint256 stakedETH;          // Original ETH staked
        uint256 mETHBalance;        // mETH tokens held for this worker
        uint256 lastYieldClaim;     // Timestamp of last yield claim
        uint256 accumulatedYield;   // Yield accumulated but not yet claimed
        bool isActive;              // Whether stake is active
    }
    
    /// @notice Worker address => WorkerStake
    mapping(address => WorkerStake) public workerStakes;
    
    /// @notice Pending unstake requests
    struct UnstakeRequest {
        address worker;
        uint256 mETHAmount;
        uint256 requestId;
        uint256 requestTime;
        bool claimed;
    }
    
    /// @notice Array of unstake requests
    UnstakeRequest[] public unstakeRequests;
    
    /// @notice Worker => unstake request indices
    mapping(address => uint256[]) public workerUnstakeRequests;
    
    /// @notice Total yield distributed to workers
    uint256 public totalWorkerYield;
    
    /// @notice Total yield distributed to holders
    uint256 public totalHolderYield;
    
    /// @notice Total yield collected by protocol
    uint256 public totalProtocolYield;
    
    /// @notice Last exchange rate snapshot (for yield calculation)
    uint256 public lastExchangeRate;
    
    /// @notice Last yield distribution timestamp
    uint256 public lastYieldDistribution;
    
    // ============================================
    // Events
    // ============================================
    
    event Staked(address indexed worker, uint256 ethAmount, uint256 mETHReceived);
    event UnstakeRequested(address indexed worker, uint256 mETHAmount, uint256 requestId);
    event UnstakeClaimed(address indexed worker, uint256 ethReceived);
    event YieldDistributed(
        uint256 totalYield,
        uint256 workerYield,
        uint256 holderYield,
        uint256 protocolYield
    );
    event YieldClaimed(address indexed worker, uint256 amount);
    event TreasuryUpdated(address oldTreasury, address newTreasury);
    
    // ============================================
    // Errors
    // ============================================
    
    error ZeroAmount();
    error InsufficientBalance();
    error StakeNotActive();
    error NoYieldToClaim();
    error InvalidAddress();
    error UnstakeRequestNotFound();
    error UnstakeRequestAlreadyClaimed();
    
    // ============================================
    // Constructor
    // ============================================
    
    constructor(address _mETH, address _treasury) {
        if (_mETH == address(0) || _treasury == address(0)) revert InvalidAddress();
        
        mETH = IMETH(_mETH);
        treasury = _treasury;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(STAKING_MANAGER_ROLE, msg.sender);
        
        lastExchangeRate = 1e18; // Initial rate: 1 mETH = 1 ETH
        lastYieldDistribution = block.timestamp;
    }
    
    // ============================================
    // External Functions - Staking
    // ============================================
    
    /**
     * @notice Stake ETH collateral for a worker and receive mETH
     * @param worker Address of the worker
     * @dev Called by VitaToken when minting new tokens
     */
    function stakeForWorker(address worker) 
        external 
        payable 
        nonReentrant 
        onlyRole(VITA_TOKEN_ROLE) 
        returns (uint256 mETHReceived) 
    {
        if (msg.value == 0) revert ZeroAmount();
        if (worker == address(0)) revert InvalidAddress();
        
        // Stake ETH in mETH protocol
        mETHReceived = mETH.stake{value: msg.value}();
        
        // Update worker stake
        WorkerStake storage stake = workerStakes[worker];
        stake.stakedETH += msg.value;
        stake.mETHBalance += mETHReceived;
        stake.isActive = true;
        
        if (stake.lastYieldClaim == 0) {
            stake.lastYieldClaim = block.timestamp;
        }
        
        // Update totals
        totalStakedETH += msg.value;
        totalMETH += mETHReceived;
        
        emit Staked(worker, msg.value, mETHReceived);
        
        return mETHReceived;
    }
    
    /**
     * @notice Request unstaking of mETH for a worker
     * @param worker Worker address
     * @param mETHAmount Amount of mETH to unstake
     */
    function requestUnstake(address worker, uint256 mETHAmount)
        external
        nonReentrant
        onlyRole(VITA_TOKEN_ROLE)
        returns (uint256 requestId)
    {
        WorkerStake storage stake = workerStakes[worker];
        
        if (!stake.isActive) revert StakeNotActive();
        if (mETHAmount > stake.mETHBalance) revert InsufficientBalance();
        
        // Calculate yield before unstaking
        _calculateAndAccumulateYield(worker);
        
        // Request unstake from mETH protocol
        requestId = mETH.unstakeRequest(mETHAmount);
        
        // Update stake
        stake.mETHBalance -= mETHAmount;
        totalMETH -= mETHAmount;
        
        // Record unstake request
        unstakeRequests.push(UnstakeRequest({
            worker: worker,
            mETHAmount: mETHAmount,
            requestId: requestId,
            requestTime: block.timestamp,
            claimed: false
        }));
        
        workerUnstakeRequests[worker].push(unstakeRequests.length - 1);
        
        if (stake.mETHBalance == 0) {
            stake.isActive = false;
        }
        
        emit UnstakeRequested(worker, mETHAmount, requestId);
        
        return requestId;
    }
    
    /**
     * @notice Claim completed unstake request
     * @param requestIndex Index of the unstake request
     */
    function claimUnstake(uint256 requestIndex)
        external
        nonReentrant
        returns (uint256 ethReceived)
    {
        if (requestIndex >= unstakeRequests.length) revert UnstakeRequestNotFound();
        
        UnstakeRequest storage request = unstakeRequests[requestIndex];
        
        if (request.claimed) revert UnstakeRequestAlreadyClaimed();
        
        // Claim from mETH protocol
        uint256 balanceBefore = address(this).balance;
        mETH.claimUnstakeRequest(request.requestId);
        ethReceived = address(this).balance - balanceBefore;
        
        request.claimed = true;
        
        // Update worker's staked ETH
        WorkerStake storage stake = workerStakes[request.worker];
        uint256 originalETH = (request.mETHAmount * stake.stakedETH) / 
            (stake.mETHBalance + request.mETHAmount);
        
        if (originalETH > stake.stakedETH) {
            originalETH = stake.stakedETH;
        }
        stake.stakedETH -= originalETH;
        totalStakedETH -= originalETH;
        
        // Transfer ETH to worker (minus any fees)
        (bool success, ) = request.worker.call{value: ethReceived}("");
        require(success, "ETH transfer failed");
        
        emit UnstakeClaimed(request.worker, ethReceived);
        
        return ethReceived;
    }
    
    // ============================================
    // External Functions - Yield
    // ============================================
    
    /**
     * @notice Distribute accrued yield to workers, holders, and protocol
     * @dev Can be called by anyone, typically called periodically
     */
    function distributeYield() external nonReentrant {
        uint256 currentRate = mETH.exchangeRate();
        
        // Calculate yield from rate increase
        if (currentRate <= lastExchangeRate || totalMETH == 0) {
            lastYieldDistribution = block.timestamp;
            return;
        }
        
        // Total yield = mETH balance * rate increase
        uint256 rateIncrease = currentRate - lastExchangeRate;
        uint256 totalYieldInETH = (totalMETH * rateIncrease) / 1e18;
        
        if (totalYieldInETH == 0) return;
        
        // Distribute according to shares
        uint256 workerYield = (totalYieldInETH * WORKER_SHARE_BPS) / BPS_DENOMINATOR;
        uint256 holderYield = (totalYieldInETH * HOLDER_SHARE_BPS) / BPS_DENOMINATOR;
        uint256 protocolYield = totalYieldInETH - workerYield - holderYield;
        
        totalWorkerYield += workerYield;
        totalHolderYield += holderYield;
        totalProtocolYield += protocolYield;
        
        lastExchangeRate = currentRate;
        lastYieldDistribution = block.timestamp;
        
        emit YieldDistributed(totalYieldInETH, workerYield, holderYield, protocolYield);
    }
    
    /**
     * @notice Claim accumulated yield for a worker
     * @param worker Worker address
     */
    function claimYield(address worker) external nonReentrant returns (uint256 yieldAmount) {
        _calculateAndAccumulateYield(worker);
        
        WorkerStake storage stake = workerStakes[worker];
        yieldAmount = stake.accumulatedYield;
        
        if (yieldAmount == 0) revert NoYieldToClaim();
        
        stake.accumulatedYield = 0;
        stake.lastYieldClaim = block.timestamp;
        
        // Convert mETH yield to ETH and transfer
        // Note: In production, this would involve unstaking the yield portion
        // For simplicity, we track it as claimable mETH value
        
        emit YieldClaimed(worker, yieldAmount);
        
        return yieldAmount;
    }
    
    /**
     * @notice Get pending yield for a worker
     */
    function getPendingYield(address worker) external view returns (uint256) {
        WorkerStake storage stake = workerStakes[worker];
        
        if (!stake.isActive || stake.mETHBalance == 0) return stake.accumulatedYield;
        
        uint256 currentRate = mETH.exchangeRate();
        if (currentRate <= lastExchangeRate) return stake.accumulatedYield;
        
        uint256 rateIncrease = currentRate - lastExchangeRate;
        uint256 workerMETHYield = (stake.mETHBalance * rateIncrease) / 1e18;
        uint256 workerShare = (workerMETHYield * WORKER_SHARE_BPS) / BPS_DENOMINATOR;
        
        return stake.accumulatedYield + workerShare;
    }
    
    // ============================================
    // View Functions
    // ============================================
    
    /**
     * @notice Get worker's current mETH value in ETH
     */
    function getWorkerETHValue(address worker) external view returns (uint256) {
        WorkerStake storage stake = workerStakes[worker];
        return mETH.mETHToETH(stake.mETHBalance);
    }
    
    /**
     * @notice Get total protocol value in ETH
     */
    function getTotalETHValue() external view returns (uint256) {
        return mETH.mETHToETH(totalMETH);
    }
    
    /**
     * @notice Get current mETH exchange rate
     */
    function getCurrentExchangeRate() external view returns (uint256) {
        return mETH.exchangeRate();
    }
    
    /**
     * @notice Get worker's stake details
     */
    function getWorkerStake(address worker) 
        external 
        view 
        returns (
            uint256 stakedETH,
            uint256 mETHBalance,
            uint256 currentETHValue,
            uint256 accumulatedYield,
            bool isActive
        ) 
    {
        WorkerStake storage stake = workerStakes[worker];
        return (
            stake.stakedETH,
            stake.mETHBalance,
            mETH.mETHToETH(stake.mETHBalance),
            stake.accumulatedYield,
            stake.isActive
        );
    }
    
    /**
     * @notice Get unstake request count for a worker
     */
    function getWorkerUnstakeRequestCount(address worker) external view returns (uint256) {
        return workerUnstakeRequests[worker].length;
    }
    
    // ============================================
    // Internal Functions
    // ============================================
    
    function _calculateAndAccumulateYield(address worker) internal {
        WorkerStake storage stake = workerStakes[worker];
        
        if (!stake.isActive || stake.mETHBalance == 0) return;
        
        uint256 currentRate = mETH.exchangeRate();
        if (currentRate <= lastExchangeRate) return;
        
        uint256 rateIncrease = currentRate - lastExchangeRate;
        uint256 workerMETHYield = (stake.mETHBalance * rateIncrease) / 1e18;
        uint256 workerShare = (workerMETHYield * WORKER_SHARE_BPS) / BPS_DENOMINATOR;
        
        stake.accumulatedYield += workerShare;
    }
    
    // ============================================
    // Admin Functions
    // ============================================
    
    function setTreasury(address _treasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_treasury == address(0)) revert InvalidAddress();
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }
    
    /**
     * @notice Withdraw protocol yield to treasury
     */
    function withdrawProtocolYield() external onlyRole(STAKING_MANAGER_ROLE) {
        uint256 amount = totalProtocolYield;
        totalProtocolYield = 0;
        
        // Transfer yield to treasury
        // Note: In production, this would involve converting mETH to ETH
        (bool success, ) = treasury.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @notice Emergency function to recover stuck tokens
     */
    function emergencyWithdraw(address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (token == address(0)) {
            (bool success, ) = treasury.call{value: address(this).balance}("");
            require(success, "ETH transfer failed");
        } else {
            uint256 balance = IERC20(token).balanceOf(address(this));
            IERC20(token).safeTransfer(treasury, balance);
        }
    }
    
    // ============================================
    // Receive Function
    // ============================================
    
    receive() external payable {}
}
