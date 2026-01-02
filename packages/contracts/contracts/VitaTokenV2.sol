// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./staking/METHStaking.sol";
import "./verifiers/Groth16Verifier.sol";
import "./verifiers/WorkProofRegistry.sol";
import "./compliance/ComplianceEngine.sol";

/**
 * @title VitaTokenV2
 * @notice Enhanced VitaToken with mETH staking and ZK proof verification
 * @dev Extends the base VitaToken with:
 *      - Automatic mETH staking on mint (soft-staking collateral)
 *      - ZK proof verification for Proof of Work claims
 *      - Enhanced yield distribution from mETH staking rewards
 * 
 * When VITA tokens are minted, the underlying ETH collateral is automatically
 * staked in mETH to generate native yield for the worker.
 */
contract VitaTokenV2 is EIP712, AccessControl, ReentrancyGuard, Pausable {
    using ECDSA for bytes32;

    // ============================================================================
    // CONSTANTS & ROLES
    // ============================================================================

    bytes32 public constant AI_ORACLE_ROLE = keccak256("AI_ORACLE_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ZK_VERIFIER_ROLE = keccak256("ZK_VERIFIER_ROLE");

    string public constant name = "VITA Token V2";
    string public constant symbol = "VITA";
    uint8 public constant decimals = 18;

    bytes32 public constant VITALITY_ATTESTATION_TYPEHASH = keccak256(
        "VitalityAttestation(address worker,string githubUsername,uint256 vitalityScore,uint256 reliabilityScore,uint256 pledgedHours,uint8 skillCategory,uint256 tokenValue,uint256 validUntil,uint256 nonce)"
    );

    // ============================================================================
    // ENUMS & STRUCTS
    // ============================================================================

    enum SkillCategory {
        SOLIDITY_DEV, FRONTEND_DEV, BACKEND_DEV, FULLSTACK_DEV,
        DEVOPS, DATA_SCIENCE, AI_ML, DESIGN, WRITING, MARKETING
    }

    struct VitalityAttestation {
        address worker;
        string githubUsername;
        uint256 vitalityScore;
        uint256 reliabilityScore;
        uint256 pledgedHours;
        SkillCategory skillCategory;
        uint256 tokenValue;
        uint256 validUntil;
        uint256 nonce;
    }

    struct WorkerProfile {
        string githubUsername;
        uint256 totalMinted;
        uint256 totalFulfilled;
        uint256 lastMintTimestamp;
        uint256 vitalityScore;
        bool isVerified;
        uint256 zkProofCount;        // Number of ZK proofs submitted
        uint256 stakedCollateral;     // ETH collateral staked in mETH
    }

    struct TokenMetadata {
        address worker;
        uint256 pledgedHours;
        SkillCategory skill;
        uint256 tokenValue;
        uint256 mintTimestamp;
        uint256 fulfillmentDeadline;
        bool isFulfilled;
        uint256 collateralStaked;     // ETH collateral for this position
        uint256 zkWorkProofHash;      // ZK proof hash if verified
    }

    // ============================================================================
    // STATE VARIABLES
    // ============================================================================

    // ERC-20 state
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Core state
    mapping(address => WorkerProfile) public workerProfiles;
    mapping(uint256 => TokenMetadata) public tokenMetadata;
    uint256 public nextTokenId;
    mapping(address => uint256) public nonces;
    mapping(bytes32 => bool) public usedAttestations;

    // Yield distribution constants
    uint256 public constant WORKER_YIELD_SHARE = 2000;
    uint256 public constant HOLDER_YIELD_SHARE = 7000;
    uint256 public constant PROTOCOL_FEE = 1000;
    uint256 public constant BASIS_POINTS = 10000;

    // Collateral tracking
    uint256 public totalCollateral;
    mapping(address => uint256) public workerCollateral;
    mapping(address => uint256) public pendingWorkerYield;

    // ============================================================================
    // INTEGRATION CONTRACTS
    // ============================================================================

    /// @notice mETH staking contract for soft-staking collateral
    METHStaking public methStaking;

    /// @notice ZK proof verifier
    Groth16Verifier public zkVerifier;

    /// @notice ZK work proof registry
    WorkProofRegistry public workProofRegistry;

    /// @notice T-REX Compliance Engine
    ComplianceEngine public complianceEngine;

    /// @notice Protocol treasury
    address public treasury;

    /// @notice Whether mETH staking is enabled
    bool public stakingEnabled;

    /// @notice Whether ZK verification is required for minting
    bool public zkVerificationRequired;

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
        uint256 vitalityScore,
        uint256 collateralStaked
    );

    event CollateralStaked(
        address indexed worker,
        uint256 ethAmount,
        uint256 mETHReceived
    );

    event ZKProofVerified(
        address indexed worker,
        uint256 indexed tokenId,
        uint256 workProofHash,
        uint256 qualityScore
    );

    event WorkerVerified(address indexed worker, string githubUsername);
    event AttestationUsed(bytes32 indexed attestationHash, address indexed worker, address indexed signer);
    event YieldDistributed(uint256 indexed tokenId, uint256 workerAmount, uint256 holderAmount, uint256 protocolAmount);
    event WorkerYieldClaimed(address indexed worker, uint256 amount);
    event StakingContractUpdated(address indexed oldContract, address indexed newContract);
    event ZKVerifierUpdated(address indexed oldVerifier, address indexed newVerifier);

    // ============================================================================
    // ERRORS
    // ============================================================================

    error AttestationExpired();
    error NotAttestedWorker();
    error InvalidNonce();
    error AttestationAlreadyUsed();
    error InvalidOracleSignature();
    error InsufficientCollateral();
    error ZKProofRequired();
    error InvalidZKProof();
    error StakingNotEnabled();
    error ReceiverNotVerified();
    error NoYieldToClaim();
    error TransferFailed();

    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================

    constructor(
        address _treasury
    ) EIP712("VITA Protocol", "2") {
        treasury = _treasury;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(AI_ORACLE_ROLE, msg.sender);
        _grantRole(COMPLIANCE_ROLE, msg.sender);
    }

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    /**
     * @notice Initialize integration contracts
     */
    function initialize(
        address _methStaking,
        address _zkVerifier,
        address _workProofRegistry
    ) external onlyRole(ADMIN_ROLE) {
        if (_methStaking != address(0)) {
            emit StakingContractUpdated(address(methStaking), _methStaking);
            methStaking = METHStaking(payable(_methStaking));
            stakingEnabled = true;
        }
        
        if (_zkVerifier != address(0)) {
            emit ZKVerifierUpdated(address(zkVerifier), _zkVerifier);
            zkVerifier = Groth16Verifier(_zkVerifier);
        }
        
        if (_workProofRegistry != address(0)) {
            workProofRegistry = WorkProofRegistry(_workProofRegistry);
        }
    }

    function setComplianceEngine(address _engine) external onlyRole(ADMIN_ROLE) {
        complianceEngine = ComplianceEngine(_engine);
    }

    // ============================================================================
    // CORE: mintEcho WITH mETH STAKING
    // ============================================================================

    /**
     * @notice Mint VITA tokens with automatic mETH staking
     * @dev Accepts ETH as collateral and stakes it in mETH for yield
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
    ) external payable nonReentrant whenNotPaused returns (uint256 tokenId) {
        // Validate attestation
        if (block.timestamp > attestation.validUntil) revert AttestationExpired();
        if (attestation.worker != msg.sender) revert NotAttestedWorker();
        if (attestation.nonce <= nonces[msg.sender]) revert InvalidNonce();

        bytes32 attestationHash = _hashAttestation(attestation);
        if (usedAttestations[attestationHash]) revert AttestationAlreadyUsed();

        // Verify signature
        bytes32 digest = _hashTypedDataV4(attestationHash);
        address signer = ECDSA.recover(digest, v, r, s);
        if (!hasRole(AI_ORACLE_ROLE, signer)) revert InvalidOracleSignature();

        // Mark attestation as used
        usedAttestations[attestationHash] = true;
        nonces[msg.sender] = attestation.nonce;

        // Generate token ID
        tokenId = nextTokenId++;

        // Stake collateral in mETH if provided and staking is enabled
        uint256 mETHReceived = 0;
        if (msg.value > 0 && stakingEnabled && address(methStaking) != address(0)) {
            mETHReceived = methStaking.stakeForWorker{value: msg.value}(msg.sender);
            
            emit CollateralStaked(msg.sender, msg.value, mETHReceived);
        }

        // Store token metadata
        tokenMetadata[tokenId] = TokenMetadata({
            worker: msg.sender,
            pledgedHours: attestation.pledgedHours,
            skill: attestation.skillCategory,
            tokenValue: attestation.tokenValue,
            mintTimestamp: block.timestamp,
            fulfillmentDeadline: attestation.validUntil + 365 days,
            isFulfilled: false,
            collateralStaked: msg.value,
            zkWorkProofHash: 0
        });

        // Update worker profile
        WorkerProfile storage profile = workerProfiles[msg.sender];
        profile.githubUsername = attestation.githubUsername;
        profile.totalMinted += attestation.tokenValue;
        profile.lastMintTimestamp = block.timestamp;
        profile.vitalityScore = attestation.vitalityScore;
        profile.isVerified = true;
        profile.stakedCollateral += msg.value;

        // Update collateral tracking
        totalCollateral += msg.value;
        workerCollateral[msg.sender] += msg.value;

        // Mint tokens
        _mint(msg.sender, attestation.tokenValue);

        emit VitaMinted(
            msg.sender,
            tokenId,
            attestation.tokenValue,
            attestation.pledgedHours,
            attestation.skillCategory,
            attestation.vitalityScore,
            msg.value
        );

        emit AttestationUsed(attestationHash, msg.sender, signer);

        return tokenId;
    }

    // ============================================================================
    // ZK PROOF VERIFICATION
    // ============================================================================

    /**
     * @notice Submit and verify a ZK proof of work for a token
     * @param tokenId Token ID to attach proof to
     * @param _pA Proof point A
     * @param _pB Proof point B
     * @param _pC Proof point C
     * @param _pubSignals Public signals
     */
    function submitWorkProof(
        uint256 tokenId,
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[7] calldata _pubSignals
    ) external nonReentrant {
        TokenMetadata storage meta = tokenMetadata[tokenId];
        require(meta.worker == msg.sender, "Not token owner");
        require(meta.zkWorkProofHash == 0, "Proof already submitted");

        // Verify the ZK proof
        bool valid = zkVerifier.verifyProof(_pA, _pB, _pC, _pubSignals);
        if (!valid) revert InvalidZKProof();

        // Store work proof hash
        uint256 workProofHash = _pubSignals[0];
        uint256 qualityScore = _pubSignals[1];
        
        meta.zkWorkProofHash = workProofHash;

        // Update worker profile
        workerProfiles[msg.sender].zkProofCount++;

        // If work proof registry exists, register the proof
        if (address(workProofRegistry) != address(0)) {
            workProofRegistry.submitWorkProof(_pA, _pB, _pC, _pubSignals);
        }

        emit ZKProofVerified(msg.sender, tokenId, workProofHash, qualityScore);
    }

    /**
     * @notice Mint with ZK proof verification required
     * @dev Use when zkVerificationRequired is true
     */
    function mintEchoWithProof(
        VitalityAttestation calldata attestation,
        uint8 v,
        bytes32 r,
        bytes32 s,
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[7] calldata _pubSignals
    ) external payable nonReentrant whenNotPaused returns (uint256 tokenId) {
        if (zkVerificationRequired) {
            // Verify ZK proof first
            bool valid = zkVerifier.verifyProof(_pA, _pB, _pC, _pubSignals);
            if (!valid) revert InvalidZKProof();
        }

        // Then proceed with regular minting
        // Note: We bypass the nonReentrant check here by duplicating the logic
        // In production, refactor to avoid this
        
        if (block.timestamp > attestation.validUntil) revert AttestationExpired();
        if (attestation.worker != msg.sender) revert NotAttestedWorker();
        if (attestation.nonce <= nonces[msg.sender]) revert InvalidNonce();

        bytes32 attestationHash = _hashAttestation(attestation);
        if (usedAttestations[attestationHash]) revert AttestationAlreadyUsed();

        bytes32 digest = _hashTypedDataV4(attestationHash);
        address signer = ECDSA.recover(digest, v, r, s);
        if (!hasRole(AI_ORACLE_ROLE, signer)) revert InvalidOracleSignature();

        usedAttestations[attestationHash] = true;
        nonces[msg.sender] = attestation.nonce;

        tokenId = nextTokenId++;

        uint256 mETHReceived = 0;
        if (msg.value > 0 && stakingEnabled && address(methStaking) != address(0)) {
            mETHReceived = methStaking.stakeForWorker{value: msg.value}(msg.sender);
            emit CollateralStaked(msg.sender, msg.value, mETHReceived);
        }

        tokenMetadata[tokenId] = TokenMetadata({
            worker: msg.sender,
            pledgedHours: attestation.pledgedHours,
            skill: attestation.skillCategory,
            tokenValue: attestation.tokenValue,
            mintTimestamp: block.timestamp,
            fulfillmentDeadline: attestation.validUntil + 365 days,
            isFulfilled: false,
            collateralStaked: msg.value,
            zkWorkProofHash: _pubSignals[0] // Store the work proof hash
        });

        WorkerProfile storage profile = workerProfiles[msg.sender];
        profile.githubUsername = attestation.githubUsername;
        profile.totalMinted += attestation.tokenValue;
        profile.lastMintTimestamp = block.timestamp;
        profile.vitalityScore = attestation.vitalityScore;
        profile.isVerified = true;
        profile.stakedCollateral += msg.value;
        profile.zkProofCount++;

        totalCollateral += msg.value;
        workerCollateral[msg.sender] += msg.value;

        _mint(msg.sender, attestation.tokenValue);

        emit VitaMinted(
            msg.sender, tokenId, attestation.tokenValue, attestation.pledgedHours,
            attestation.skillCategory, attestation.vitalityScore, msg.value
        );
        emit AttestationUsed(attestationHash, msg.sender, signer);
        emit ZKProofVerified(msg.sender, tokenId, _pubSignals[0], _pubSignals[1]);

        return tokenId;
    }

    // ============================================================================
    // mETH STAKING YIELD FUNCTIONS
    // ============================================================================

    /**
     * @notice Claim mETH staking yield for a worker
     */
    function claimStakingYield() external nonReentrant returns (uint256 yieldAmount) {
        if (!stakingEnabled || address(methStaking) == address(0)) {
            revert StakingNotEnabled();
        }

        yieldAmount = methStaking.claimYield(msg.sender);
        
        if (yieldAmount == 0) revert NoYieldToClaim();

        emit WorkerYieldClaimed(msg.sender, yieldAmount);
        
        return yieldAmount;
    }

    /**
     * @notice Get pending staking yield for a worker
     */
    function getPendingStakingYield(address worker) external view returns (uint256) {
        if (!stakingEnabled || address(methStaking) == address(0)) {
            return 0;
        }
        return methStaking.getPendingYield(worker);
    }

    /**
     * @notice Get worker's staked mETH value in ETH
     */
    function getWorkerStakedValue(address worker) external view returns (uint256) {
        if (!stakingEnabled || address(methStaking) == address(0)) {
            return workerCollateral[worker];
        }
        return methStaking.getWorkerETHValue(worker);
    }

    // ============================================================================
    // ERC-20 FUNCTIONS
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
    // ADMIN FUNCTIONS
    // ============================================================================

    function setStakingEnabled(bool _enabled) external onlyRole(ADMIN_ROLE) {
        stakingEnabled = _enabled;
    }

    function setZKVerificationRequired(bool _required) external onlyRole(ADMIN_ROLE) {
        zkVerificationRequired = _required;
    }

    function setTreasury(address _treasury) external onlyRole(ADMIN_ROLE) {
        treasury = _treasury;
    }

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

    function getWorkerProfile(address worker) external view returns (WorkerProfile memory) {
        return workerProfiles[worker];
    }

    function getTokenMetadata(uint256 tokenId) external view returns (TokenMetadata memory) {
        return tokenMetadata[tokenId];
    }

    function isAttestationUsed(bytes32 attestationHash) external view returns (bool) {
        return usedAttestations[attestationHash];
    }

    function getCurrentNonce(address worker) external view returns (uint256) {
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

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal view {
        if (from == address(0) || to == address(0)) return;

        // T-REX Compliance Check
        if (address(complianceEngine) != address(0)) {
            // Reverts if non-compliant
            complianceEngine.checkCompliance(from, to, amount, balanceOf[to]);
        }

        if (!hasRole(COMPLIANCE_ROLE, to) && !workerProfiles[to].isVerified) {
            revert ReceiverNotVerified();
        }
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

    receive() external payable {
        totalCollateral += msg.value;
    }
}
