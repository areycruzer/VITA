// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IMETH.sol";

/**
 * @title MockMETH
 * @notice Mock implementation of mETH for testing
 * @dev Simulates mETH staking behavior without actual Ethereum staking
 */

contract MockMETH is IMETH {
    string public name = "Mock mETH";
    string public symbol = "mETH";
    uint8 public decimals = 18;
    
    uint256 public totalSupply;
    uint256 private _exchangeRate = 1e18; // 1:1 initially
    uint256 private _totalPooledEther;
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    // Unstake requests
    struct Request {
        address requester;
        uint256 mETHAmount;
        uint256 ethAmount;
        bool claimed;
    }
    
    uint256 private _nextRequestId;
    mapping(uint256 => Request) private _requests;
    
    // Events
    event Staked(address indexed user, uint256 ethAmount, uint256 mETHAmount);
    event UnstakeRequested(address indexed user, uint256 requestId, uint256 mETHAmount);
    event UnstakeClaimed(address indexed user, uint256 requestId, uint256 ethAmount);
    event ExchangeRateUpdated(uint256 newRate);
    
    constructor() {
        _nextRequestId = 1;
    }
    
    // ============================================
    // Staking Functions
    // ============================================
    
    function stake() external payable override returns (uint256 mETHAmount) {
        require(msg.value > 0, "Must stake > 0");
        
        mETHAmount = ethToMETH(msg.value);
        
        _balances[msg.sender] += mETHAmount;
        totalSupply += mETHAmount;
        _totalPooledEther += msg.value;
        
        emit Staked(msg.sender, msg.value, mETHAmount);
        
        return mETHAmount;
    }
    
    function unstakeRequest(uint256 mETHAmount) external override returns (uint256 requestId) {
        require(_balances[msg.sender] >= mETHAmount, "Insufficient balance");
        
        uint256 ethAmount = mETHToETH(mETHAmount);
        
        _balances[msg.sender] -= mETHAmount;
        totalSupply -= mETHAmount;
        
        requestId = _nextRequestId++;
        _requests[requestId] = Request({
            requester: msg.sender,
            mETHAmount: mETHAmount,
            ethAmount: ethAmount,
            claimed: false
        });
        
        emit UnstakeRequested(msg.sender, requestId, mETHAmount);
        
        return requestId;
    }
    
    function claimUnstakeRequest(uint256 requestId) external override {
        Request storage request = _requests[requestId];
        
        require(request.requester == msg.sender, "Not your request");
        require(!request.claimed, "Already claimed");
        require(address(this).balance >= request.ethAmount, "Insufficient ETH");
        
        request.claimed = true;
        _totalPooledEther -= request.ethAmount;
        
        (bool success, ) = msg.sender.call{value: request.ethAmount}("");
        require(success, "ETH transfer failed");
        
        emit UnstakeClaimed(msg.sender, requestId, request.ethAmount);
    }
    
    // ============================================
    // Exchange Rate Functions
    // ============================================
    
    function exchangeRate() external view override returns (uint256) {
        return _exchangeRate;
    }
    
    function mETHToETH(uint256 mETHAmount) public view override returns (uint256) {
        return (mETHAmount * _exchangeRate) / 1e18;
    }
    
    function ethToMETH(uint256 ethAmount) public view override returns (uint256) {
        return (ethAmount * 1e18) / _exchangeRate;
    }
    
    function totalPooledEther() external view override returns (uint256) {
        return _totalPooledEther;
    }
    
    // ============================================
    // ERC20 Functions
    // ============================================
    
    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) external override returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        return true;
    }
    
    function approve(address spender, uint256 amount) external override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        require(_balances[from] >= amount, "Insufficient balance");
        require(_allowances[from][msg.sender] >= amount, "Insufficient allowance");
        
        _balances[from] -= amount;
        _balances[to] += amount;
        _allowances[from][msg.sender] -= amount;
        
        return true;
    }
    
    // ============================================
    // Testing Functions
    // ============================================
    
    /**
     * @notice Simulate yield accrual by increasing exchange rate
     * @param newRate New exchange rate (1e18 = 1:1)
     */
    function setExchangeRate(uint256 newRate) external {
        _exchangeRate = newRate;
        emit ExchangeRateUpdated(newRate);
    }
    
    /**
     * @notice Simulate yield accrual by percentage
     * @param basisPoints Yield in basis points (100 = 1%)
     */
    function simulateYield(uint256 basisPoints) external {
        _exchangeRate = (_exchangeRate * (10000 + basisPoints)) / 10000;
        emit ExchangeRateUpdated(_exchangeRate);
    }
    
    /**
     * @notice Get unstake request details
     */
    function getUnstakeRequest(uint256 requestId) 
        external 
        view 
        returns (
            address requester,
            uint256 mETHAmount,
            uint256 ethAmount,
            bool claimed
        ) 
    {
        Request storage request = _requests[requestId];
        return (
            request.requester,
            request.mETHAmount,
            request.ethAmount,
            request.claimed
        );
    }
    
    // Receive ETH for testing
    receive() external payable {}
}
