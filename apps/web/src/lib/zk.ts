
/**
 * ZK Proof Service
 * 
 * Handles generation of Zero-Knowledge proofs for the VITA Protocol.
 * currently uses mock generation if circuits are not compiled.
 */

// Types for Groth16 Proof (matches snarkjs output)
export interface Groth16Proof {
    pi_a: [string, string];
    pi_b: [[string, string], [string, string]];
    pi_c: [string, string];
    protocol: string;
    curve: string;
}

export interface Groth16PublicSignals extends Array<string> { }

export interface WorkProofInput {
    commitHash: string; // BigInt string
    workerAddress: string; // BigInt string
    timestamp: string;
    repoNameHash: string;
    repoSalt: string;
    commitMessageHash: string;
    nonce: string;
    linesOfCode: string;
    filesChanged: string;
    contributionScore: string;
}

export interface FullProof {
    proof: Groth16Proof;
    publicSignals: Groth16PublicSignals;
}

// @ts-ignore
import * as snarkjs from 'snarkjs';


// @ts-ignore
import { buildPoseidon } from 'circomlibjs';

/**
 * Generate a ZK Proof for the work submission
 * With real data, we must satisfy the circuit constraints:
 * workerCommitment === Poseidon(workerAddress, nonce)
 */
export async function generateWorkProof(input: WorkProofInput): Promise<FullProof> {
    console.log("Generating Real ZK Proof for input:", input);

    try {
        // 1. Initialize Poseidon
        const poseidon = await buildPoseidon();
        const F = poseidon.F;

        // 2. Format inputs to BigInts/Strings as required
        // Note: Commit hash "123456789" is decimal. If hex "0x...", convert to BigInt.
        const workerAddrBigInt = BigInt(input.workerAddress);
        const nonceBigInt = BigInt(input.nonce);

        // 3. Compute workerCommitment = Poseidon([workerAddress, nonce])
        const workerCommitmentRaw = poseidon([workerAddrBigInt, nonceBigInt]);
        const workerCommitment = F.toString(workerCommitmentRaw);

        console.log("Computed Worker Commitment:", workerCommitment);

        // 4. Construct full circuit input
        const circuitInput = {
            commitHash: input.commitHash,
            workerCommitment: workerCommitment,
            timestamp: input.timestamp,
            minLinesThreshold: "50", // Hardcoded threshold matching circuit/contract

            repoNameHash: input.repoNameHash,
            repoSalt: input.repoSalt,
            commitMessageHash: input.commitMessageHash,
            workerAddress: input.workerAddress,
            nonce: input.nonce,
            linesOfCode: input.linesOfCode,
            filesChanged: input.filesChanged,
            contributionScore: input.contributionScore
        };

        console.log("Circuit Input:", JSON.stringify(circuitInput, (_, v) => typeof v === 'bigint' ? v.toString() : v));

        // 5. Generate Proof
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            circuitInput,
            "/zk/proof_of_work.wasm",
            "/zk/proof_of_work_final.zkey"
        );

        return { proof, publicSignals };
    } catch (error) {
        console.error("ZK Proof generation failed:", error);
        throw new Error("Failed to generate ZK proof. Ensure inputs are valid.");
    }
}

/**
 * Format proof for Solidity verifier call
 * Converts strings to the array format expected by the contract
 */
export function formatProofForContract(proof: Groth16Proof, publicSignals: Groth16PublicSignals) {
    return {
        pA: [BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1])] as [bigint, bigint],
        pB: [
            [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
            [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])]
        ] as [[bigint, bigint], [bigint, bigint]],
        pC: [BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])] as [bigint, bigint],
        pubSignals: publicSignals.map(s => BigInt(s)) // Ensure public signals are BigInts
    };
}
