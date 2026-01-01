/**
 * VITA Protocol - ZK Input Generator
 * 
 * Generates input.json for the Proof of Work circuit
 * from GitHub commit data.
 */

const { buildPoseidon } = require("circomlibjs");
const crypto = require("crypto");
const fs = require("fs");

/**
 * Convert a hex string to a BigInt field element
 */
function hexToField(hex) {
  // Remove '0x' prefix if present
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  // Take first 31 bytes to fit in field (BN128 field is ~254 bits)
  const truncated = cleanHex.slice(0, 62);
  return BigInt("0x" + truncated);
}

/**
 * Hash a string using SHA256 and convert to field element
 */
function stringToFieldHash(str) {
  const hash = crypto.createHash("sha256").update(str).digest("hex");
  return hexToField(hash);
}

/**
 * Generate a random field element
 */
function randomFieldElement() {
  const bytes = crypto.randomBytes(31);
  return BigInt("0x" + bytes.toString("hex"));
}

/**
 * Generate circuit inputs from GitHub commit data
 */
async function generateProofInput({
  commitSha,
  repoName,
  commitMessage,
  workerAddress,
  timestamp,
  linesOfCode,
  filesChanged,
  contributionScore,
  minLinesThreshold = 10,
}) {
  const poseidon = await buildPoseidon();
  const F = poseidon.F;

  // Generate random values
  const repoSalt = randomFieldElement();
  const nonce = randomFieldElement();

  // Convert commit SHA to field element
  const commitHash = hexToField(commitSha);

  // Hash repo name
  const repoNameHash = stringToFieldHash(repoName);

  // Hash commit message
  const commitMessageHash = stringToFieldHash(commitMessage);

  // Convert worker address to field element
  const workerAddressField = BigInt(workerAddress);

  // Calculate worker commitment: Poseidon(workerAddress, nonce)
  const workerCommitmentBigInt = poseidon([workerAddressField, nonce]);
  const workerCommitment = F.toObject(workerCommitmentBigInt);

  // Build the input object
  const input = {
    // Public inputs
    commitHash: commitHash.toString(),
    workerCommitment: workerCommitment.toString(),
    timestamp: timestamp.toString(),
    minLinesThreshold: minLinesThreshold.toString(),

    // Private inputs
    repoNameHash: repoNameHash.toString(),
    repoSalt: repoSalt.toString(),
    commitMessageHash: commitMessageHash.toString(),
    workerAddress: workerAddressField.toString(),
    nonce: nonce.toString(),
    linesOfCode: linesOfCode.toString(),
    filesChanged: filesChanged.toString(),
    contributionScore: contributionScore.toString(),
  };

  return input;
}

/**
 * Generate and save input.json
 */
async function main() {
  // Example: Generate proof for a sample commit
  const sampleCommit = {
    commitSha: "abc123def456789012345678901234567890abcd",
    repoName: "user/private-project",
    commitMessage: "feat: implement user authentication",
    workerAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f10AB3",
    timestamp: Math.floor(Date.now() / 1000),
    linesOfCode: 150,
    filesChanged: 5,
    contributionScore: 85, // AI-computed score 0-100
    minLinesThreshold: 10,
  };

  console.log("Generating ZK proof input for commit:", sampleCommit.commitSha);

  const input = await generateProofInput(sampleCommit);

  // Save to file
  const outputPath = process.argv[2] || "input.json";
  fs.writeFileSync(outputPath, JSON.stringify(input, null, 2));

  console.log(`\n✅ Input saved to ${outputPath}`);
  console.log("\nPublic signals:");
  console.log("  commitHash:", input.commitHash);
  console.log("  workerCommitment:", input.workerCommitment);
  console.log("  timestamp:", input.timestamp);
  console.log("  minLinesThreshold:", input.minLinesThreshold);

  console.log("\nPrivate signals (kept secret in ZK proof):");
  console.log("  repoNameHash: [hidden]");
  console.log("  workerAddress: [hidden]");
  console.log("  linesOfCode:", sampleCommit.linesOfCode);
  console.log("  filesChanged:", sampleCommit.filesChanged);
  console.log("  contributionScore:", sampleCommit.contributionScore);

  return input;
}

// Export for use as module
module.exports = { generateProofInput, hexToField, stringToFieldHash };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
