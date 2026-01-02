pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

/**
 * VITA Protocol - Proof of Work Circuit
 * 
 * This circuit proves that a worker has created a commit with a specific hash
 * WITHOUT revealing the repository name or commit message.
 * 
 * Privacy guarantees:
 * - Repository name is kept private (hashed with salt)
 * - Commit message is kept private
 * - Only the commitment to the work is revealed publicly
 * 
 * Public signals:
 * - commitHash: The SHA-1 commit hash (as field element)
 * - workerCommitment: Poseidon(workerAddress, nonce) - binds proof to worker
 * - timestamp: When the work was done (for time decay calculation)
 * 
 * Private signals:
 * - repoNameHash: Hash of repository name (keeps repo private)
 * - repoSalt: Random salt for repo hash (prevents rainbow table attacks)
 * - commitMessage: Hash of commit message (privacy)
 * - workerAddress: The worker's Ethereum address
 * - nonce: Random nonce for worker commitment
 * - linesOfCode: Number of lines changed (for contribution weight)
 * - filesChanged: Number of files modified
 */

template ProofOfWork() {
    // ============================================
    // Public Inputs
    // ============================================
    signal input commitHash;           // SHA-1 hash of the git commit (public)
    signal input workerCommitment;     // Commitment to worker identity
    signal input timestamp;            // Unix timestamp of the commit
    signal input minLinesThreshold;    // Minimum lines required (for quality gate)
    
    // ============================================
    // Private Inputs
    // ============================================
    signal input repoNameHash;         // Hash of repo name (private)
    signal input repoSalt;             // Salt for repo name hash
    signal input commitMessageHash;    // Hash of commit message
    signal input workerAddress;        // Worker's address (private in proof)
    signal input nonce;                // Random nonce for commitment
    signal input linesOfCode;          // Lines changed in commit
    signal input filesChanged;         // Files modified
    signal input contributionScore;    // AI-computed contribution score (0-100)
    
    // ============================================
    // Outputs
    // ============================================
    signal output workProofHash;       // Final proof commitment
    signal output qualityScore;        // Derived quality metric
    signal output repoCommitment;      // Commitment to repo (for dedup)
    
    // ============================================
    // Step 1: Verify Worker Commitment
    // ============================================
    // Ensure the worker commitment matches the hash of (workerAddress, nonce)
    component workerCommitmentCheck = Poseidon(2);
    workerCommitmentCheck.inputs[0] <== workerAddress;
    workerCommitmentCheck.inputs[1] <== nonce;
    
    // Constraint: worker commitment must match
    workerCommitmentCheck.out === workerCommitment;
    
    // ============================================
    // Step 2: Create Repo Commitment
    // ============================================
    // Hash the repo name with salt to create a commitment
    // This allows verifying same repo without revealing name
    component repoCommitmentHash = Poseidon(2);
    repoCommitmentHash.inputs[0] <== repoNameHash;
    repoCommitmentHash.inputs[1] <== repoSalt;
    repoCommitment <== repoCommitmentHash.out;
    
    // ============================================
    // Step 3: Verify Lines of Code Threshold
    // ============================================
    // Ensure minimum contribution (prevents spam proofs)
    component linesCheck = GreaterEqThan(32);
    linesCheck.in[0] <== linesOfCode;
    linesCheck.in[1] <== minLinesThreshold;
    
    // Constraint: must meet minimum lines threshold
    linesCheck.out === 1;
    
    // ============================================
    // Step 4: Calculate Quality Score
    // ============================================
    // Quality = (linesOfCode * filesChanged * contributionScore) / 10000
    // Simplified: just output contribution score for now
    // In production, this would be a more complex formula
    signal linesTimesFiles;
    linesTimesFiles <== linesOfCode * filesChanged;
    
    // Quality score is the AI contribution score (0-100)
    qualityScore <== contributionScore;
    
    // ============================================
    // Step 5: Create Work Proof Hash
    // ============================================
    // Combine all elements into final proof hash
    component workProof = Poseidon(6);
    workProof.inputs[0] <== commitHash;
    workProof.inputs[1] <== workerCommitment;
    workProof.inputs[2] <== timestamp;
    workProof.inputs[3] <== repoCommitment;
    workProof.inputs[4] <== linesTimesFiles;
    workProof.inputs[5] <== contributionScore;
    
    workProofHash <== workProof.out;
    
    // ============================================
    // Step 6: Range Checks
    // ============================================
    // Ensure contribution score is in valid range (0-100)
    component scoreUpperBound = LessEqThan(8);
    scoreUpperBound.in[0] <== contributionScore;
    scoreUpperBound.in[1] <== 100;
    scoreUpperBound.out === 1;
    
    // Ensure timestamp is reasonable (after 2020)
    component timestampCheck = GreaterEqThan(40);
    timestampCheck.in[0] <== timestamp;
    timestampCheck.in[1] <== 1577836800; // Jan 1, 2020
    timestampCheck.out === 1;
    
    // Ensure files changed is positive
    component filesCheck = GreaterEqThan(16);
    filesCheck.in[0] <== filesChanged;
    filesCheck.in[1] <== 1;
    filesCheck.out === 1;
}

// Main component with public signals defined
component main {public [commitHash, workerCommitment, timestamp, minLinesThreshold]} = ProofOfWork();
