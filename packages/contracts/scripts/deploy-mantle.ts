import { ethers, run, network } from "hardhat";
import fs from "fs";
import path from "path";

/**
 * VITA Protocol - Mantle Testnet Deployment Script
 * 
 * Deploys all contracts and verifies them on Mantlescan.
 * 
 * Usage:
 *   npx hardhat run scripts/deploy-mantle.ts --network mantleTestnet
 * 
 * Prerequisites:
 *   - PRIVATE_KEY in .env
 *   - MANTLESCAN_API_KEY in .env (for verification)
 *   - MNT tokens for gas (get from faucet: https://faucet.testnet.mantle.xyz)
 */

interface DeployedContract {
  name: string;
  address: string;
  constructorArgs: any[];
  verified: boolean;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function verifyContract(
  address: string,
  constructorArgs: any[],
  contractName?: string
): Promise<boolean> {
  console.log(`   📝 Verifying ${contractName || address}...`);
  
  try {
    await run("verify:verify", {
      address,
      constructorArguments: constructorArgs,
    });
    console.log(`   ✅ Verified!`);
    return true;
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log(`   ✅ Already verified`);
      return true;
    }
    console.log(`   ⚠️  Verification failed: ${error.message}`);
    return false;
  }
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkName = network.name;
  const chainId = (await ethers.provider.getNetwork()).chainId;

  console.log("\n" + "═".repeat(70));
  console.log("   🚀 VITA Protocol - Mantle Testnet Deployment");
  console.log("═".repeat(70));
  console.log(`\n📋 Deployment Configuration:`);
  console.log(`   Network:     ${networkName}`);
  console.log(`   Chain ID:    ${chainId}`);
  console.log(`   Deployer:    ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`   Balance:     ${ethers.formatEther(balance)} MNT`);
  
  if (balance < ethers.parseEther("0.1")) {
    console.log("\n⚠️  WARNING: Low balance! Get testnet MNT from:");
    console.log("   https://faucet.testnet.mantle.xyz");
  }
  
  console.log("\n" + "─".repeat(70));

  const deployedContracts: DeployedContract[] = [];
  const deployedAddresses: Record<string, string> = {};

  // ============================================================================
  // 1. Deploy ValuationEngine
  // ============================================================================
  console.log("\n[1/8] 📦 Deploying ValuationEngine...");
  const ValuationEngine = await ethers.getContractFactory("ValuationEngine");
  const valuationEngine = await ValuationEngine.deploy();
  await valuationEngine.waitForDeployment();
  const valuationEngineAddr = await valuationEngine.getAddress();
  deployedAddresses.valuationEngine = valuationEngineAddr;
  deployedContracts.push({
    name: "ValuationEngine",
    address: valuationEngineAddr,
    constructorArgs: [],
    verified: false,
  });
  console.log(`   ✅ ValuationEngine: ${valuationEngineAddr}`);

  // ============================================================================
  // 2. Deploy VitaToken (original)
  // ============================================================================
  console.log("\n[2/8] 📦 Deploying VitaToken...");
  const VitaToken = await ethers.getContractFactory("VitaToken");
  const vitaToken = await VitaToken.deploy();
  await vitaToken.waitForDeployment();
  const vitaTokenAddr = await vitaToken.getAddress();
  deployedAddresses.vitaToken = vitaTokenAddr;
  deployedContracts.push({
    name: "VitaToken",
    address: vitaTokenAddr,
    constructorArgs: [],
    verified: false,
  });
  console.log(`   ✅ VitaToken: ${vitaTokenAddr}`);

  // ============================================================================
  // 3. Deploy Groth16Verifier (ZK)
  // ============================================================================
  console.log("\n[3/8] 📦 Deploying Groth16Verifier...");
  const Groth16Verifier = await ethers.getContractFactory("Groth16Verifier");
  const zkVerifier = await Groth16Verifier.deploy();
  await zkVerifier.waitForDeployment();
  const zkVerifierAddr = await zkVerifier.getAddress();
  deployedAddresses.groth16Verifier = zkVerifierAddr;
  deployedContracts.push({
    name: "Groth16Verifier",
    address: zkVerifierAddr,
    constructorArgs: [],
    verified: false,
  });
  console.log(`   ✅ Groth16Verifier: ${zkVerifierAddr}`);

  // ============================================================================
  // 4. Deploy WorkProofRegistry
  // ============================================================================
  console.log("\n[4/8] 📦 Deploying WorkProofRegistry...");
  const WorkProofRegistry = await ethers.getContractFactory("WorkProofRegistry");
  const workProofRegistry = await WorkProofRegistry.deploy(zkVerifierAddr);
  await workProofRegistry.waitForDeployment();
  const workProofRegistryAddr = await workProofRegistry.getAddress();
  deployedAddresses.workProofRegistry = workProofRegistryAddr;
  deployedContracts.push({
    name: "WorkProofRegistry",
    address: workProofRegistryAddr,
    constructorArgs: [zkVerifierAddr],
    verified: false,
  });
  console.log(`   ✅ WorkProofRegistry: ${workProofRegistryAddr}`);

  // ============================================================================
  // 5. Deploy MockMETH (for testnet)
  // ============================================================================
  console.log("\n[5/8] 📦 Deploying MockMETH...");
  const MockMETH = await ethers.getContractFactory("MockMETH");
  const mockMETH = await MockMETH.deploy();
  await mockMETH.waitForDeployment();
  const mockMETHAddr = await mockMETH.getAddress();
  deployedAddresses.mockMETH = mockMETHAddr;
  deployedContracts.push({
    name: "MockMETH",
    address: mockMETHAddr,
    constructorArgs: [],
    verified: false,
  });
  console.log(`   ✅ MockMETH: ${mockMETHAddr}`);

  // Fund MockMETH with ETH for unstaking
  console.log("   💰 Funding MockMETH with 1 MNT...");
  const fundTx = await deployer.sendTransaction({
    to: mockMETHAddr,
    value: ethers.parseEther("1"),
  });
  await fundTx.wait();
  console.log(`   ✅ MockMETH funded`);

  // ============================================================================
  // 6. Deploy METHStaking
  // ============================================================================
  console.log("\n[6/8] 📦 Deploying METHStaking...");
  const METHStaking = await ethers.getContractFactory("METHStaking");
  const methStaking = await METHStaking.deploy(mockMETHAddr, deployer.address);
  await methStaking.waitForDeployment();
  const methStakingAddr = await methStaking.getAddress();
  deployedAddresses.methStaking = methStakingAddr;
  deployedContracts.push({
    name: "METHStaking",
    address: methStakingAddr,
    constructorArgs: [mockMETHAddr, deployer.address],
    verified: false,
  });
  console.log(`   ✅ METHStaking: ${methStakingAddr}`);

  // ============================================================================
  // 7. Deploy VitaTokenV2 (with ZK + mETH integration)
  // ============================================================================
  console.log("\n[7/8] 📦 Deploying VitaTokenV2...");
  const VitaTokenV2 = await ethers.getContractFactory("VitaTokenV2");
  const vitaTokenV2 = await VitaTokenV2.deploy(deployer.address);
  await vitaTokenV2.waitForDeployment();
  const vitaTokenV2Addr = await vitaTokenV2.getAddress();
  deployedAddresses.vitaTokenV2 = vitaTokenV2Addr;
  deployedContracts.push({
    name: "VitaTokenV2",
    address: vitaTokenV2Addr,
    constructorArgs: [deployer.address],
    verified: false,
  });
  console.log(`   ✅ VitaTokenV2: ${vitaTokenV2Addr}`);

  // ============================================================================
  // 8. Configure Contracts
  // ============================================================================
  console.log("\n[8/8] ⚙️  Configuring contracts...");
  
  // Initialize VitaTokenV2 with integration contracts
  console.log("   → Initializing VitaTokenV2...");
  const initTx = await vitaTokenV2.initialize(
    methStakingAddr,
    zkVerifierAddr,
    workProofRegistryAddr
  );
  await initTx.wait();
  console.log("   ✅ VitaTokenV2 initialized");

  // Grant VITA_TOKEN_ROLE on METHStaking
  console.log("   → Granting VITA_TOKEN_ROLE to VitaTokenV2...");
  const VITA_TOKEN_ROLE = await methStaking.VITA_TOKEN_ROLE();
  const grantTx = await methStaking.grantRole(VITA_TOKEN_ROLE, vitaTokenV2Addr);
  await grantTx.wait();
  console.log("   ✅ Role granted");

  // ============================================================================
  // Deployment Summary
  // ============================================================================
  console.log("\n" + "═".repeat(70));
  console.log("   📋 DEPLOYMENT SUMMARY");
  console.log("═".repeat(70));
  
  for (const contract of deployedContracts) {
    console.log(`   ${contract.name.padEnd(20)} ${contract.address}`);
  }

  // Save deployment to file
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentData = {
    network: networkName,
    chainId: chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: deployedAddresses,
    contractDetails: deployedContracts,
  };

  const deploymentFile = path.join(deploymentsDir, `mantle-testnet.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2));
  console.log(`\n   📄 Deployment saved to: ${deploymentFile}`);

  // ============================================================================
  // Verify Contracts
  // ============================================================================
  if (process.env.MANTLESCAN_API_KEY) {
    console.log("\n" + "═".repeat(70));
    console.log("   🔍 VERIFYING CONTRACTS ON MANTLESCAN");
    console.log("═".repeat(70));
    
    // Wait for block confirmations
    console.log("\n   ⏳ Waiting 30 seconds for block confirmations...");
    await delay(30000);

    for (const contract of deployedContracts) {
      contract.verified = await verifyContract(
        contract.address,
        contract.constructorArgs,
        contract.name
      );
      await delay(2000); // Rate limiting
    }

    // Update deployment file with verification status
    deploymentData.contractDetails = deployedContracts;
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2));
  } else {
    console.log("\n⚠️  MANTLESCAN_API_KEY not set. Skipping verification.");
    console.log("   To verify manually, run:");
    for (const contract of deployedContracts) {
      const args = contract.constructorArgs.length > 0 
        ? ` --constructor-args ${contract.constructorArgs.join(" ")}` 
        : "";
      console.log(`   npx hardhat verify --network mantleTestnet ${contract.address}${args}`);
    }
  }

  // ============================================================================
  // Final Summary
  // ============================================================================
  console.log("\n" + "═".repeat(70));
  console.log("   🎉 DEPLOYMENT COMPLETE!");
  console.log("═".repeat(70));
  console.log("\n   📍 Contract Addresses:");
  console.log(`      VitaToken:         ${deployedAddresses.vitaToken}`);
  console.log(`      VitaTokenV2:       ${deployedAddresses.vitaTokenV2}`);
  console.log(`      ValuationEngine:   ${deployedAddresses.valuationEngine}`);
  console.log(`      Groth16Verifier:   ${deployedAddresses.groth16Verifier}`);
  console.log(`      WorkProofRegistry: ${deployedAddresses.workProofRegistry}`);
  console.log(`      METHStaking:       ${deployedAddresses.methStaking}`);
  console.log(`      MockMETH:          ${deployedAddresses.mockMETH}`);
  
  console.log("\n   🔗 View on Mantlescan:");
  console.log(`      https://explorer.testnet.mantle.xyz/address/${deployedAddresses.vitaTokenV2}`);
  
  console.log("\n   📚 Next Steps:");
  console.log("      1. Update frontend with contract addresses");
  console.log("      2. Configure Chainlink Functions subscription");
  console.log("      3. Add AI oracle signers");
  console.log("      4. Deploy frontend to Vercel");
  
  console.log("\n" + "═".repeat(70) + "\n");

  return deployedAddresses;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
