// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ComplianceEngine
 * @notice "T-REX Lite" Compliance Engine for ERC-3643
 * @dev Enforces jurisdictional rules and investor limits for VITA tokens.
 */
contract ComplianceEngine is AccessControl {
    bytes32 public constant COMPLIANCE_OFFICER_ROLE = keccak256("COMPLIANCE_OFFICER_ROLE");

    // Mapping of Country Code (ISO 3166) -> Boolean (Is Allowed)
    mapping(uint16 => bool) public allowedCountries;

    // Mapping of Wallet -> Investor Type (0=Retail, 1=Accredited, 2=Institutional)
    mapping(address => uint8) public investorType;
    
    // Mapping of Wallet -> Country Code
    mapping(address => uint16) public walletCountry;

    // Caps per investor type
    mapping(uint8 => uint256) public holdingCaps;

    event CountryStatusUpdated(uint16 countryCode, bool allowed);
    event InvestorRegistered(address indexed investor, uint8 investorType, uint16 countryCode);
    event HoldingCapUpdated(uint8 investorType, uint256 cap);

    error CountryNotAllowed(uint16 countryCode);
    error HoldingCapExceeded(uint256 balance, uint256 cap);
    error SenderNotVerified();
    error ReceiverNotVerified();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMPLIANCE_OFFICER_ROLE, msg.sender);

        // Default: Initialize Caps (0=Retail: 10k, 1=Accredited: 1M, 2=Inst: Unlimited)
        holdingCaps[0] = 10000 * 10**18; 
        holdingCaps[1] = 1000000 * 10**18;
        holdingCaps[2] = type(uint256).max;
    }

    /**
     * @notice Check if a transfer is compliant
     * @param from Sender address
     * @param to Receiver address
     * @param amount Amount being transferred
     * @param toBalance Receiver's current balance
     */
    function checkCompliance(
        address from,
        address to,
        uint256 amount,
        uint256 toBalance
    ) external view returns (bool) {
        // 1. Skip checks for minting/burning (from/to == 0)
        if (from == address(0) || to == address(0)) return true;

        // 2. Sender Check
        // In full T-REX, senders must also be current on KYC, here we check simple registration
        if (walletCountry[from] == 0) revert SenderNotVerified();

        // 3. Receiver Check (Country)
        uint16 country = walletCountry[to];
        if (country == 0) revert ReceiverNotVerified();
        if (!allowedCountries[country]) revert CountryNotAllowed(country);

        // 4. Receiver Check (Caps)
        uint8 invType = investorType[to];
        if (toBalance + amount > holdingCaps[invType]) {
            revert HoldingCapExceeded(toBalance + amount, holdingCaps[invType]);
        }

        return true;
    }

    // ============================================================================
    // ADMIN FUNCTIONS
    // ============================================================================

    function registerInvestor(address investor, uint8 _type, uint16 _country) external onlyRole(COMPLIANCE_OFFICER_ROLE) {
        investorType[investor] = _type;
        walletCountry[investor] = _country;
        emit InvestorRegistered(investor, _type, _country);
    }

    function setCountryStatus(uint16 countryCode, bool allowed) external onlyRole(COMPLIANCE_OFFICER_ROLE) {
        allowedCountries[countryCode] = allowed;
        emit CountryStatusUpdated(countryCode, allowed);
    }

    function setHoldingCap(uint8 _type, uint256 cap) external onlyRole(COMPLIANCE_OFFICER_ROLE) {
        holdingCaps[_type] = cap;
        emit HoldingCapUpdated(_type, cap);
    }
}
