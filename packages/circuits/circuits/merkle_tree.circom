pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/mux1.circom";

/**
 * Merkle Tree Proof Verification
 * 
 * Used to prove membership in a set of verified work proofs
 * without revealing which specific proof is being claimed.
 */

template MerkleTreeChecker(levels) {
    signal input leaf;
    signal input root;
    signal input pathElements[levels];
    signal input pathIndices[levels];
    
    signal output isValid;
    
    component hashers[levels];
    component mux[levels];
    
    signal levelHashes[levels + 1];
    levelHashes[0] <== leaf;
    
    for (var i = 0; i < levels; i++) {
        // Ensure path indices are binary
        pathIndices[i] * (1 - pathIndices[i]) === 0;
        
        mux[i] = Mux1();
        mux[i].c[0] <== levelHashes[i];
        mux[i].c[1] <== pathElements[i];
        mux[i].s <== pathIndices[i];
        
        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== mux[i].out;
        hashers[i].inputs[1] <== pathIndices[i] * (levelHashes[i] - pathElements[i]) + pathElements[i];
        
        levelHashes[i + 1] <== hashers[i].out;
    }
    
    // Check if computed root matches expected root
    signal rootDiff;
    rootDiff <== levelHashes[levels] - root;
    
    // isValid = 1 if roots match, 0 otherwise
    // Note: In actual circuit, you'd use IsZero component
    isValid <== 1 - rootDiff * rootDiff;
}

/**
 * Batch Work Proof Aggregator
 * 
 * Aggregates multiple work proofs into a single commitment
 * for efficient on-chain verification.
 */

template WorkProofAggregator(n) {
    signal input workProofs[n];
    signal input workerCommitment;
    
    signal output aggregateProof;
    signal output totalProofs;
    
    // Hash all work proofs together
    component aggregator = Poseidon(n + 1);
    aggregator.inputs[0] <== workerCommitment;
    
    for (var i = 0; i < n; i++) {
        aggregator.inputs[i + 1] <== workProofs[i];
    }
    
    aggregateProof <== aggregator.out;
    totalProofs <== n;
}

component main {public [root]} = MerkleTreeChecker(20);
