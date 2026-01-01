
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Configuring contracts with account:", deployer.address);

    // Load deployed addresses
    const deploymentPath = path.join(__dirname, "../deployments/mantle-sepolia.json");
    if (!fs.existsSync(deploymentPath)) {
        throw new Error("Deployment file not found!");
    }
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    const contracts = deployment.contracts;

    console.log("Loaded contract addresses:", contracts);

    // Get contract instances
    const VitaTokenV2 = await ethers.getContractFactory("VitaTokenV2");
    const vitaTokenV2 = VitaTokenV2.attach(contracts.vitaTokenV2);

    const METHStaking = await ethers.getContractFactory("METHStaking");
    const methStaking = METHStaking.attach(contracts.methStaking);

    // 1. Initialize VitaTokenV2
    console.log("Initializing VitaTokenV2...");
    try {
        const initTx = await vitaTokenV2.initialize(
            contracts.methStaking,
            contracts.groth16Verifier,
            contracts.workProofRegistry
        );
        await initTx.wait();
        console.log("✅ VitaTokenV2 initialized");
    } catch (error) {
        if (error.message.includes("Initializable: contract is already initialized")) {
            console.log("✅ VitaTokenV2 already initialized");
        } else {
            console.log("⚠️ Initialization failed or already done:", error.message);
        }
    }

    // 2. Grant VITA_TOKEN_ROLE
    console.log("Granting VITA_TOKEN_ROLE...");
    const VITA_TOKEN_ROLE = await methStaking.VITA_TOKEN_ROLE();
    try {
        const grantTx = await methStaking.grantRole(VITA_TOKEN_ROLE, contracts.vitaTokenV2);
        await grantTx.wait();
        console.log("✅ VITA_TOKEN_ROLE granted");
    } catch (error) {
        console.log("⚠️ Granting role failed:", error.message);
    }

    console.log("Configuration complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
