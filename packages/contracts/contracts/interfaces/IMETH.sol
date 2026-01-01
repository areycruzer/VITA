// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IMETH
 * @notice Interface for Mantle's mETH liquid staking token
 * @dev mETH is a value-accruing liquid staking receipt token for ETH
 *      Users deposit ETH and receive mETH that accrues staking rewards
 */
interface IMETH {
    /**
     * @notice Stake ETH to receive mETH
     * @return Amount of mETH received
     */
    function stake() external payable returns (uint256);
    
    /**
     * @notice Request unstaking of mETH
     * @param mETHAmount Amount of mETH to unstake
     * @return requestId ID of the unstake request
     */
    function unstakeRequest(uint256 mETHAmount) external returns (uint256 requestId);
    
    /**
     * @notice Claim unstaked ETH after waiting period
     * @param requestId ID of the unstake request
     */
    function claimUnstakeRequest(uint256 requestId) external;
    
    /**
     * @notice Get the exchange rate of mETH to ETH
     * @return Exchange rate (mETH per ETH, scaled by 1e18)
     */
    function exchangeRate() external view returns (uint256);
    
    /**
     * @notice Convert mETH amount to ETH value
     * @param mETHAmount Amount of mETH
     * @return ETH value
     */
    function mETHToETH(uint256 mETHAmount) external view returns (uint256);
    
    /**
     * @notice Convert ETH amount to mETH value
     * @param ethAmount Amount of ETH
     * @return mETH value
     */
    function ethToMETH(uint256 ethAmount) external view returns (uint256);
    
    /**
     * @notice Total ETH staked in the protocol
     */
    function totalPooledEther() external view returns (uint256);
    
    /**
     * @notice ERC20 functions
     */
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/**
 * @title IStakingManager
 * @notice Interface for mETH staking manager contract
 */
interface IStakingManager {
    function stake(uint256 minMETHAmount) external payable returns (uint256);
    function unstakeRequest(uint256 mETHAmount, uint256 minETHAmount) external returns (uint256);
    function claimUnstakeRequest(uint256 requestId) external;
}
