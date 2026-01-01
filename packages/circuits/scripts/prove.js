/**
 * VITA Protocol - ZK Proof Generator
 * 
 * Generates a Groth16 proof for the Proof of Work circuit.
 */

const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

async function generateProof(inputPath, wasmPath, zkeyPath) {
  console.log("📦 Loading input...");
  const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));

  console.log("⚙️  Generating witness...");
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    wasmPath,
    zkeyPath
  );

  console.log("✅ Proof generated!");
  console.log("\nPublic signals:");
  publicSignals.forEach((signal, i) => {
    console.log(`  [${i}]: ${signal}`);
  });

  return { proof, publicSignals };
}

async function verifyProof(proof, publicSignals, vkeyPath) {
  console.log("\n🔍 Verifying proof...");
  const vkey = JSON.parse(fs.readFileSync(vkeyPath, "utf8"));
  const verified = await snarkjs.groth16.verify(vkey, publicSignals, proof);

  if (verified) {
    console.log("✅ Proof is valid!");
  } else {
    console.log("❌ Proof is invalid!");
  }

  return verified;
}

async function exportCalldata(proof, publicSignals) {
  // Format proof for Solidity verifier
  const calldata = await snarkjs.groth16.exportSolidityCallData(
    proof,
    publicSignals
  );

  // Parse the calldata
  const calldataParts = calldata.split(",");

  // Extract proof components
  const proofA = JSON.parse(calldataParts[0]);
  const proofB = JSON.parse(calldataParts[1] + "," + calldataParts[2]);
  const proofC = JSON.parse(calldataParts[3]);
  const pubSignals = JSON.parse(calldataParts.slice(4).join(","));

  return {
    a: proofA,
    b: proofB,
    c: proofC,
    input: pubSignals,
    // Raw calldata for direct contract call
    rawCalldata: calldata,
  };
}

async function main() {
  const buildDir = path.join(__dirname, "..", "build");
  const inputPath = process.argv[2] || path.join(__dirname, "..", "input.json");

  // Check if build artifacts exist
  const wasmPath = path.join(buildDir, "proof_of_work_js", "proof_of_work.wasm");
  const zkeyPath = path.join(buildDir, "proof_of_work.zkey");
  const vkeyPath = path.join(__dirname, "..", "verification_key.json");

  if (!fs.existsSync(wasmPath)) {
    console.error("❌ Circuit not compiled. Run: pnpm compile");
    console.error("   Then run: pnpm setup");
    process.exit(1);
  }

  if (!fs.existsSync(zkeyPath)) {
    console.error("❌ ZKey not generated. Run: pnpm setup");
    console.error("   Note: You need a powers of tau file (pot16_final.ptau)");
    process.exit(1);
  }

  // Generate proof
  const { proof, publicSignals } = await generateProof(
    inputPath,
    wasmPath,
    zkeyPath
  );

  // Verify proof
  if (fs.existsSync(vkeyPath)) {
    await verifyProof(proof, publicSignals, vkeyPath);
  }

  // Export Solidity calldata
  const calldata = await exportCalldata(proof, publicSignals);

  // Save outputs
  fs.writeFileSync(
    path.join(__dirname, "..", "proof.json"),
    JSON.stringify(proof, null, 2)
  );
  fs.writeFileSync(
    path.join(__dirname, "..", "public.json"),
    JSON.stringify(publicSignals, null, 2)
  );
  fs.writeFileSync(
    path.join(__dirname, "..", "calldata.json"),
    JSON.stringify(calldata, null, 2)
  );

  console.log("\n📄 Files saved:");
  console.log("   proof.json - Raw proof");
  console.log("   public.json - Public signals");
  console.log("   calldata.json - Solidity calldata");

  console.log("\n🔗 To verify on-chain, call:");
  console.log("   verifier.verifyProof(a, b, c, input)");
  console.log("   with values from calldata.json");
}

module.exports = { generateProof, verifyProof, exportCalldata };

if (require.main === module) {
  main().catch(console.error);
}
