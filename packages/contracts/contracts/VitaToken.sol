// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title VitaToken
 * @notice ERC-3643 compliant token with AI-attested minting via EIP-712 signatures
 * @dev Implements the VITA Protocol for tokenizing human capital as RWAs
 * 
 * Key Features:
 * - ERC-3643 (T-REX) compliance for permissioned transfers
 * - mintEcho function that only accepts AI-signed attestations
 * - Valuation based on: V = (H × R) × S_AI × e^(-λt)
 * - 20% yield-back mechanism for workers
 */
contract VitaToken is EIP712, AccessControl, ReentrancyGuard, Pausable {
    using ECDSA for bytes32;

    // ============================================================================
    // CONSTANTS & ROLES
    // ============================================================================

    bytes32 public constant AI_ORACLE_ROLE = keccak256("AI_ORACLE_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    string public constant name = "VITA Token";
    string public constant symbol = "VITA";
    uint8 public constant decimals = 18;

    // EIP-712 type hash for VitalityAttestation
    bytes32 public constant VITALITY_ATTESTATION_TYPEHASH = keccak256(
        "VitalityAttestation(address worker,string githubUsername,uint256 vitalityScore,uint256 reliabilityScore,uint256 pledgedHours,uint8 skillCategory,uint256 tokenValue,uint256 validUntil,uint256 nonce)"
    );

    // ============================================================================
    // ENUMS & STRUCTS
    // ============================================================================

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

    struct VitalityAttestation {
        address worker;
        string githubUsername;
        uint256 vitalityScore;      // Scaled by 1e16 (max 100 * 1e16)
        uint256 reliabilityScore;   // Scaled by 1e18 (0-1 * 1e18)
        uint256 pledgedHours;
        SkillCategory skillCategory;
        uint256 tokenValue;         // Token amount in wei
        uint256 validUntil;         // Unix timestamp
        uint256 nonce;
    }

    struct WorkerProfile {
        string githubUsername;
        uint256 totalMinted;
        uint256 totalFulfilled;
        uint256 lastMintTimestamp;
        uint256 vitalityScore;
        bool isVerified;
    }

    struct TokenMetadata {
        address worker;
        uint256 pledgedHours;
        SkillCategory skill;
        uint256 tokenValue;
        uint256 mintTimestamp;
        uint256 fulfillmentDeadline;
        bool isFulfilled;
    }

    // ============================================================================
    // STATE VARIABLES
    // ============================================================================

    // ERC-20 state
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Worker profiles
    mapping(address => WorkerProfile) public workerProfiles;

    // Token metadata (tokenId => metadata)
    mapping(uint256 => TokenMetadata) public tokenMetadata;
    uint256 public nextTokenId;

    // Nonce tracking to prevent replay attacks
    mapping(address => uint256) public nonces;

    // Used attestation hashes
    mapping(bytes32 => bool) public usedAttestations;

    // Yield distribution
    uint256 public constant WORKER_YIELD_SHARE = 2000; // 20% (basis points)
    uint256 public constant HOLDER_YIELD_SHARE = 7000; // 70%
    uint256 public constant PROTOCOL_FEE = 1000;       // 10%
    uint256 public constant BASIS_POINTS = 10000;

    // Collateral tracking
    uint256 public totalCollateral;
    mapping(address => uint256) public workerCollateral;
    mapping(address => uint256) public pendingWorkerYield;

    // ============================================================================
    // EVENTS
    // ============================================================================

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    event VitaMinted(
        address indexed worker,
        uint256 indexed tokenId,
        uint256 tokenValue,
        uint256 pledgedHours,
        SkillCategory skill,
        uint256 vitalityScore
    );

    event WorkerVerified(
        address indexed worker,
        string githubUsername
    );

    event AttestationUsed(
        bytes32 indexed attestationHash,
        address indexed worker,
        address indexed signer
    );

    event YieldDistributed(
        uint256 indexed tokenId,
        uint256 workerAmount,
        uint256 holderAmount,
        uint256 protocolAmount
    );

    event WorkerYieldClaimed(
        address indexed worker,
        uint256 amount
    );

    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================

    constructor() EIP712("VITA Protocol", "1") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(AI_ORACLE_ROLE, msg.sender);
        _grantRole(COMPLIANCE_ROLE, msg.sender);
    }

    // ============================================================================
    // CORE: mintEcho - AI-ATTESTED MINTING
    // ============================================================================

    /**
     * @notice Mint VITA tokens using an AI-signed attestation
     * @dev Only accepts valid EIP-712 signatures from authorized AI oracles
     * @param attestation The vitality attestation data
     * @param v Signature v component
     * @param r Signature r component
     * @param s Signature s component
     * @return tokenId The ID of the minted token position
     */
    function mintEcho(
        VitalityAttestation calldata attestation,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant whenNotPaused returns (uint256 tokenId) {
        // Verify the attestation hasn't expired
        require(block.timestamp <= attestation.validUntil, "Attestation expired");

        // Verify the caller is the worker in the attestation
        require(attestation.worker == msg.sender, "Caller is not the attested worker");

        // Verify nonce
        require(attestation.nonce > nonces[msg.sender], "Invalid nonce");

        // Calculate attestation hash
        bytes32 attestationHash = _hashAttestation(attestation);

        // Verify attestation hasn't been used
        require(!usedAttestations[attestationHash], "Attestation already used");

        // Recover signer from signature
        bytes32 digest = _hashTypedDataV4(attestationHash);
        address signer = ECDSA.recover(digest, v, r, s);

        // Verify signer has AI_ORACLE_ROLE
        require(hasRole(AI_ORACLE_ROLE, signer), "Invalid AI oracle signature");

        // Mark attestation as used
        usedAttestations[attestationHash] = true;
        nonces[msg.sender] = attestation.nonce;

        // Generate token ID
        tokenId = nextTokenId++;

        // Store token metadata
        tokenMetadata[tokenId] = TokenMetadata({
            worker: msg.sender,
            pledgedHours: attestation.pledgedHours,
            skill: attestation.skillCategory,
            tokenValue: attestation.tokenValue,
            mintTimestamp: block.timestamp,
            fulfillmentDeadline: attestation.validUntil + 365 days, // 1 year to fulfill
            isFulfilled: false
        });

        // Update worker profile
        WorkerProfile storage profile = workerProfiles[msg.sender];
        profile.githubUsername = attestation.githubUsername;
        profile.totalMinted += attestation.tokenValue;
        profile.lastMintTimestamp = block.timestamp;
        profile.vitalityScore = attestation.vitalityScore;
        profile.isVerified = true;

        // Mint tokens to worker
        _mint(msg.sender, attestation.tokenValue);

        emit VitaMinted(
            msg.sender,
            tokenId,
            attestation.tokenValue,
            attestation.pledgedHours,
            attestation.skillCategory,
            attestation.vitalityScore
        );

        emit AttestationUsed(attestationHash, msg.sender, signer);

        return tokenId;
    }

    // ============================================================================
    // ERC-20 FUNCTIONS (with ERC-3643 compliance hooks)
    // ============================================================================

    function transfer(address to, uint256 amount) external returns (bool) {
        _beforeTokenTransfer(msg.sender, to, amount);
        _transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        _beforeTokenTransfer(from, to, amount);
        allowance[from][msg.sender] -= amount;
        _transfer(from, to, amount);
        return true;
    }

    // ============================================================================
    // YIELD DISTRIBUTION
    // ============================================================================

    /**
     * @notice Distribute yield to a specific token position
     * @dev 20% to worker, 70% to holders, 10% protocol fee
     */
    function distributeYield(uint256 tokenId) external payable nonReentrant {
        require(msg.value > 0, "No yield to distribute");
        TokenMetadata storage meta = tokenMetadata[tokenId];
        require(meta.worker != address(0), "Token does not exist");

        uint256 workerAmount = (msg.value * WORKER_YIELD_SHARE) / BASIS_POINTS;
        uint256 holderAmount = (msg.value * HOLDER_YIELD_SHARE) / BASIS_POINTS;
        uint256 protocolAmount = msg.value - workerAmount - holderAmount;

        // Credit worker's pending yield
        pendingWorkerYield[meta.worker] += workerAmount;

        // TODO: Distribute holderAmount to token holders proportionally
        // TODO: Send protocolAmount to treasury

        emit YieldDistributed(tokenId, workerAmount, holderAmount, protocolAmount);
    }

    /**
     * @notice Claim accumulated worker yield
     */
    function claimWorkerYield() external nonReentrant {
        uint256 amount = pendingWorkerYield[msg.sender];
        require(amount > 0, "No yield to claim");

        pendingWorkerYield[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Yield transfer failed");

        emit WorkerYieldClaimed(msg.sender, amount);
    }

    // ============================================================================
    // COMPLIANCE (ERC-3643 HOOKS)
    // ============================================================================

    /**
     * @notice Check if a transfer is compliant
     * @dev Override this to integrate with full ERC-3643 compliance modules
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal view {
        // Skip checks for minting/burning
        if (from == address(0) || to == address(0)) return;

        // TODO: Integrate with Identity Registry
        // require(identityRegistry.isVerified(to), "Receiver not verified");

        // TODO: Integrate with Modular Compliance
        // require(compliance.canTransfer(from, to, amount), "Transfer not compliant");

        // Basic check: receiver must be verified or compliance role
        // In production, this would check ONCHAINID
        if (!hasRole(COMPLIANCE_ROLE, to)) {
            require(workerProfiles[to].isVerified, "Receiver not verified");
        }
    }

    // ============================================================================
    // ADMIN FUNCTIONS
    // ============================================================================

    function addAIOracle(address oracle) external onlyRole(ADMIN_ROLE) {
        grantRole(AI_ORACLE_ROLE, oracle);
    }

    function removeAIOracle(address oracle) external onlyRole(ADMIN_ROLE) {
        revokeRole(AI_ORACLE_ROLE, oracle);
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function verifyWorker(address worker, string calldata githubUsername) 
        external 
        onlyRole(COMPLIANCE_ROLE) 
    {
        workerProfiles[worker].githubUsername = githubUsername;
        workerProfiles[worker].isVerified = true;
        emit WorkerVerified(worker, githubUsername);
    }

    // ============================================================================
    // VIEW FUNCTIONS
    // ============================================================================

    function getWorkerProfile(address worker) 
        external 
        view 
        returns (WorkerProfile memory) 
    {
        return workerProfiles[worker];
    }

    function getTokenMetadata(uint256 tokenId) 
        external 
        view 
        returns (TokenMetadata memory) 
    {
        return tokenMetadata[tokenId];
    }

    function isAttestationUsed(bytes32 attestationHash) 
        external 
        view 
        returns (bool) 
    {
        return usedAttestations[attestationHash];
    }

    function getCurrentNonce(address worker) 
        external 
        view 
        returns (uint256) 
    {
        return nonces[worker];
    }

    function DOMAIN_SEPARATOR() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    // ============================================================================
    // INTERNAL FUNCTIONS
    // ============================================================================

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal {
        require(balanceOf[from] >= amount, "Insufficient balance");
        totalSupply -= amount;
        balanceOf[from] -= amount;
        emit Transfer(from, address(0), amount);
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(balanceOf[from] >= amount, "Insufficient balance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }

    function _hashAttestation(VitalityAttestation calldata attestation) 
        internal 
        pure 
        returns (bytes32) 
    {
        return keccak256(
            abi.encode(
                VITALITY_ATTESTATION_TYPEHASH,
                attestation.worker,
                keccak256(bytes(attestation.githubUsername)),
                attestation.vitalityScore,
                attestation.reliabilityScore,
                attestation.pledgedHours,
                attestation.skillCategory,
                attestation.tokenValue,
                attestation.validUntil,
                attestation.nonce
            )
        );
    }

    // ============================================================================
    // RECEIVE
    // ============================================================================

    receive() external payable {
        totalCollateral += msg.value;
    }
}
