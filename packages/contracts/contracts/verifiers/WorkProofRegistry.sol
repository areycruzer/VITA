// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Groth16Verifier.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title WorkProofRegistry
 * @notice Registry for verified ZK proofs of work
 * @dev Tracks which work proofs have been submitted and prevents double-claiming
 */

contract WorkProofRegistry is Ownable, ReentrancyGuard {
    // ============================================
    // State Variables
    // ============================================
    
    Groth16Verifier public immutable verifier;
    
    // Mapping from workProofHash to submission status
    mapping(uint256 => bool) public submittedProofs;
    
    // Mapping from workerCommitment to their work proof hashes
    mapping(uint256 => uint256[]) public workerProofs;
    
    // Mapping from repoCommitment to prevent same repo being claimed twice
    mapping(uint256 => bool) public claimedRepos;
    
    // Minimum quality score required (0-100)
    uint256 public minQualityScore = 50;
    
    // Minimum timestamp (prevents old work claims)
    uint256 public minTimestamp;
    
    // Total verified proofs
    uint256 public totalProofs;
    
    // ============================================
    // Events
    // ============================================
    
    event WorkProofSubmitted(
        uint256 indexed workProofHash,
        uint256 indexed workerCommitment,
        uint256 qualityScore,
        uint256 timestamp
    );
    
    event MinQualityScoreUpdated(uint256 oldScore, uint256 newScore);
    event MinTimestampUpdated(uint256 oldTimestamp, uint256 newTimestamp);
    
    // ============================================
    // Errors
    // ============================================
    
    error ProofAlreadySubmitted();
    error RepoAlreadyClaimd();
    error QualityScoreTooLow();
    error TimestampTooOld();
    error InvalidProof();
    
    // ============================================
    // Constructor
    // ============================================
    
    constructor(address _verifier) Ownable(msg.sender) {
        verifier = Groth16Verifier(_verifier);
        minTimestamp = block.timestamp - 365 days; // Accept work from last year
    }
    
    // ============================================
    // External Functions
    // ============================================
    
    /**
     * @notice Submit a ZK proof of work
     * @param _pA Proof point A
     * @param _pB Proof point B
     * @param _pC Proof point C
     * @param _pubSignals Public signals [workProofHash, qualityScore, repoCommitment, commitHash, workerCommitment, timestamp, minLinesThreshold]
     */
    function submitWorkProof(
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[7] calldata _pubSignals
    ) external nonReentrant returns (uint256 workProofHash) {
        workProofHash = _pubSignals[0];
        uint256 qualityScore = _pubSignals[1];
        uint256 repoCommitment = _pubSignals[2];
        uint256 workerCommitment = _pubSignals[4];
        uint256 timestamp = _pubSignals[5];
        
        // Check proof hasn't been submitted
        if (submittedProofs[workProofHash]) {
            revert ProofAlreadySubmitted();
        }
        
        // Check repo hasn't been claimed
        if (claimedRepos[repoCommitment]) {
            revert RepoAlreadyClaimd();
        }
        
        // Check quality score meets minimum
        if (qualityScore < minQualityScore) {
            revert QualityScoreTooLow();
        }
        
        // Check timestamp is recent enough
        if (timestamp < minTimestamp) {
            revert TimestampTooOld();
        }
        
        // Verify the ZK proof
        bool valid = verifier.verifyProof(_pA, _pB, _pC, _pubSignals);
        if (!valid) {
            revert InvalidProof();
        }
        
        // Record the proof
        submittedProofs[workProofHash] = true;
        claimedRepos[repoCommitment] = true;
        workerProofs[workerCommitment].push(workProofHash);
        totalProofs++;
        
        emit WorkProofSubmitted(
            workProofHash,
            workerCommitment,
            qualityScore,
            timestamp
        );
        
        return workProofHash;
    }
    
    /**
     * @notice Get number of proofs for a worker
     */
    function getWorkerProofCount(uint256 workerCommitment) external view returns (uint256) {
        return workerProofs[workerCommitment].length;
    }
    
    /**
     * @notice Get all proof hashes for a worker
     */
    function getWorkerProofHashes(uint256 workerCommitment) external view returns (uint256[] memory) {
        return workerProofs[workerCommitment];
    }
    
    /**
     * @notice Check if a work proof has been submitted
     */
    function isProofSubmitted(uint256 workProofHash) external view returns (bool) {
        return submittedProofs[workProofHash];
    }
    
    // ============================================
    // Admin Functions
    // ============================================
    
    function setMinQualityScore(uint256 _minScore) external onlyOwner {
        require(_minScore <= 100, "Score must be <= 100");
        emit MinQualityScoreUpdated(minQualityScore, _minScore);
        minQualityScore = _minScore;
    }
    
    function setMinTimestamp(uint256 _minTimestamp) external onlyOwner {
        emit MinTimestampUpdated(minTimestamp, _minTimestamp);
        minTimestamp = _minTimestamp;
    }
}
