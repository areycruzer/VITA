import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("=".repeat(60));
  console.log("VITA Protocol Deployment");
  console.log("=".repeat(60));
  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "MNT"
  );
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("=".repeat(60));

  const deployedAddresses: Record<string, string> = {};

  // ============================================================================
  // 1. Deploy ValuationEngine
  // ============================================================================
  console.log("\n📦 Deploying ValuationEngine...");
  const ValuationEngine = await ethers.getContractFactory("ValuationEngine");
  const valuationEngine = await ValuationEngine.deploy();
  await valuationEngine.waitForDeployment();
  deployedAddresses.valuationEngine = await valuationEngine.getAddress();
  console.log("✅ ValuationEngine deployed to:", deployedAddresses.valuationEngine);

  // ============================================================================
  // 2. Deploy VitaToken
  // ============================================================================
  console.log("\n📦 Deploying VitaToken...");
  const VitaToken = await ethers.getContractFactory("VitaToken");
  const vitaToken = await VitaToken.deploy();
  await vitaToken.waitForDeployment();
  deployedAddresses.vitaToken = await vitaToken.getAddress();
  console.log("✅ VitaToken deployed to:", deployedAddresses.vitaToken);

  // ============================================================================
  // 3. Deploy ProductivityOracle (if Chainlink router available)
  // ============================================================================
  const chainlinkRouter = process.env.CHAINLINK_FUNCTIONS_ROUTER;
  const subscriptionId = process.env.CHAINLINK_FUNCTIONS_ID;

  if (chainlinkRouter && subscriptionId && chainlinkRouter !== "") {
    console.log("\n📦 Deploying ProductivityOracle...");
    const ProductivityOracle = await ethers.getContractFactory("ProductivityOracle");
    const productivityOracle = await ProductivityOracle.deploy(
      chainlinkRouter,
      BigInt(subscriptionId),
      ethers.encodeBytes32String("fun-mantle-testnet-1")
    );
    await productivityOracle.waitForDeployment();
    deployedAddresses.productivityOracle = await productivityOracle.getAddress();
    console.log("✅ ProductivityOracle deployed to:", deployedAddresses.productivityOracle);

    // Load GitHub source code
    const githubSourcePath = path.join(__dirname, "chainlink", "github-source.js");
    if (fs.existsSync(githubSourcePath)) {
      const githubSource = fs.readFileSync(githubSourcePath, "utf8");
      await productivityOracle.setGithubSource(githubSource);
      console.log("   ✅ GitHub source code set");
    }
  } else {
    console.log("\n⚠️  Skipping ProductivityOracle (Chainlink not configured)");
    console.log("   Set CHAINLINK_FUNCTIONS_ROUTER and CHAINLINK_FUNCTIONS_ID in .env");
  }

  // ============================================================================
  // 4. Deploy ZK Verifier
  // ============================================================================
  console.log("\n📦 Deploying Groth16Verifier...");
  const Groth16Verifier = await ethers.getContractFactory("Groth16Verifier");
  const zkVerifier = await Groth16Verifier.deploy();
  await zkVerifier.waitForDeployment();
  deployedAddresses.groth16Verifier = await zkVerifier.getAddress();
  console.log("✅ Groth16Verifier deployed to:", deployedAddresses.groth16Verifier);

  // ============================================================================
  // 5. Deploy WorkProofRegistry
  // ============================================================================
  console.log("\n📦 Deploying WorkProofRegistry...");
  const WorkProofRegistry = await ethers.getContractFactory("WorkProofRegistry");
  const workProofRegistry = await WorkProofRegistry.deploy(deployedAddresses.groth16Verifier);
  await workProofRegistry.waitForDeployment();
  deployedAddresses.workProofRegistry = await workProofRegistry.getAddress();
  console.log("✅ WorkProofRegistry deployed to:", deployedAddresses.workProofRegistry);

  // ============================================================================
  // 6. Deploy MockMETH (for testnet) or use real mETH on mainnet
  // ============================================================================
  let mETHAddress: string;
  const chainId = (await ethers.provider.getNetwork()).chainId;
  const isTestnet = chainId === BigInt(5003) || chainId === BigInt(31337);

  if (isTestnet) {
    console.log("\n📦 Deploying MockMETH (testnet)...");
    const MockMETH = await ethers.getContractFactory("MockMETH");
    const mockMETH = await MockMETH.deploy();
    await mockMETH.waitForDeployment();
    mETHAddress = await mockMETH.getAddress();
    deployedAddresses.mockMETH = mETHAddress;
    console.log("✅ MockMETH deployed to:", mETHAddress);

    // Fund MockMETH with ETH for unstaking tests
    const fundTx = await deployer.sendTransaction({
      to: mETHAddress,
      value: ethers.parseEther("10"),
    });
    await fundTx.wait();
    console.log("   ✅ MockMETH funded with 10 ETH");
  } else {
    // Use real mETH on mainnet
    mETHAddress = process.env.METH_ADDRESS || "0x..."; // Real mETH address
    console.log("\n⚠️  Using real mETH at:", mETHAddress);
  }

  // ============================================================================
  // 7. Deploy METHStaking
  // ============================================================================
  console.log("\n📦 Deploying METHStaking...");
  const METHStaking = await ethers.getContractFactory("METHStaking");
  const methStaking = await METHStaking.deploy(mETHAddress, deployer.address);
  await methStaking.waitForDeployment();
  deployedAddresses.methStaking = await methStaking.getAddress();
  console.log("✅ METHStaking deployed to:", deployedAddresses.methStaking);

  // ============================================================================
  // 8. Deploy VitaTokenV2 (with ZK + mETH integration)
  // ============================================================================
  console.log("\n📦 Deploying VitaTokenV2...");
  const VitaTokenV2 = await ethers.getContractFactory("VitaTokenV2");
  const vitaTokenV2 = await VitaTokenV2.deploy(deployer.address);
  await vitaTokenV2.waitForDeployment();
  deployedAddresses.vitaTokenV2 = await vitaTokenV2.getAddress();
  console.log("✅ VitaTokenV2 deployed to:", deployedAddresses.vitaTokenV2);

  // ============================================================================
  // 9. Configure VitaTokenV2
  // ============================================================================
  console.log("\n⚙️  Configuring VitaTokenV2...");

  // Initialize with integration contracts
  await vitaTokenV2.initialize(
    deployedAddresses.methStaking,
    deployedAddresses.groth16Verifier,
    deployedAddresses.workProofRegistry
  );
  console.log("   ✅ VitaTokenV2 initialized with integrations");

  // Grant VITA_TOKEN_ROLE on METHStaking
  const VITA_TOKEN_ROLE = await methStaking.VITA_TOKEN_ROLE();
  await methStaking.grantRole(VITA_TOKEN_ROLE, deployedAddresses.vitaTokenV2);
  console.log("   ✅ VitaTokenV2 granted VITA_TOKEN_ROLE on METHStaking");

  // ============================================================================
  // 10. Configure VitaToken (original)
  // ============================================================================
  console.log("\n⚙️  Configuring VitaToken...");
  const AI_ORACLE_ROLE = await vitaToken.AI_ORACLE_ROLE();
  console.log("   AI Oracle Role:", AI_ORACLE_ROLE);
  console.log("   Deployer has AI Oracle role:", await vitaToken.hasRole(AI_ORACLE_ROLE, deployer.address));

  // ============================================================================
  // Summary
  // ============================================================================
  console.log("\n" + "=".repeat(60));
  console.log("Deployment Summary");
  console.log("=".repeat(60));
  for (const [name, address] of Object.entries(deployedAddresses)) {
    console.log(`${name}: ${address}`);
  }
  console.log("=".repeat(60));

  // Save deployment addresses to file
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const network = (await ethers.provider.getNetwork()).name;

  const deploymentFile = path.join(deploymentsDir, `${chainId}-${network}.json`);

  fs.writeFileSync(
    deploymentFile,
    JSON.stringify(
      {
        network,
        chainId: chainId.toString(),
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: deployedAddresses,
      },
      null,
      2
    )
  );
  console.log(`\n📄 Deployment saved to: ${deploymentFile}`);

  return deployedAddresses;
}

main()
  .then((addresses) => {
    console.log("\n🎉 Deployment complete!");
    console.log("\nNext steps:");
    console.log("1. Verify contracts on Mantlescan:");
    console.log(`   npx hardhat verify --network mantleTestnet ${addresses.vitaToken}`);
    console.log(`   npx hardhat verify --network mantleTestnet ${addresses.vitaTokenV2} ${addresses.vitaToken ? '"' + addresses.vitaToken + '"' : ''}`);
    console.log(`   npx hardhat verify --network mantleTestnet ${addresses.valuationEngine}`);
    console.log(`   npx hardhat verify --network mantleTestnet ${addresses.groth16Verifier}`);
    console.log("2. Configure Chainlink Functions subscription");
    console.log("3. Add additional AI Oracle signers if needed");
    console.log("4. Compile ZK circuits and export verifier: cd packages/circuits && pnpm full-setup");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
