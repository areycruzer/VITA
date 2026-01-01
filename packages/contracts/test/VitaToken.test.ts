import { expect } from "chai";
import { ethers } from "hardhat";
import { VitaToken, ValuationEngine } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("VitaToken", function () {
  let vitaToken: VitaToken;
  let valuationEngine: ValuationEngine;
  let owner: SignerWithAddress;
  let aiOracle: SignerWithAddress;
  let worker: SignerWithAddress;
  let investor: SignerWithAddress;

  // EIP-712 domain
  const DOMAIN_NAME = "VITA Protocol";
  const DOMAIN_VERSION = "1";

  // Skill categories
  const SkillCategory = {
    SOLIDITY_DEV: 0,
    FRONTEND_DEV: 1,
    BACKEND_DEV: 2,
    FULLSTACK_DEV: 3,
    DEVOPS: 4,
    DATA_SCIENCE: 5,
    AI_ML: 6,
    DESIGN: 7,
    WRITING: 8,
    MARKETING: 9,
  };

  beforeEach(async function () {
    [owner, aiOracle, worker, investor] = await ethers.getSigners();

    // Deploy VitaToken
    const VitaToken = await ethers.getContractFactory("VitaToken");
    vitaToken = await VitaToken.deploy();
    await vitaToken.waitForDeployment();

    // Deploy ValuationEngine
    const ValuationEngine = await ethers.getContractFactory("ValuationEngine");
    valuationEngine = await ValuationEngine.deploy();
    await valuationEngine.waitForDeployment();

    // Grant AI_ORACLE_ROLE to aiOracle
    const AI_ORACLE_ROLE = await vitaToken.AI_ORACLE_ROLE();
    await vitaToken.grantRole(AI_ORACLE_ROLE, aiOracle.address);
  });

  describe("Deployment", function () {
    it("Should have correct name and symbol", async function () {
      expect(await vitaToken.name()).to.equal("VITA Token");
      expect(await vitaToken.symbol()).to.equal("VITA");
    });

    it("Should have 18 decimals", async function () {
      expect(await vitaToken.decimals()).to.equal(18);
    });

    it("Should grant admin roles to deployer", async function () {
      const ADMIN_ROLE = await vitaToken.ADMIN_ROLE();
      expect(await vitaToken.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should have AI oracle role assigned", async function () {
      const AI_ORACLE_ROLE = await vitaToken.AI_ORACLE_ROLE();
      expect(await vitaToken.hasRole(AI_ORACLE_ROLE, aiOracle.address)).to.be.true;
    });
  });

  describe("mintEcho - AI-Attested Minting", function () {
    async function createSignedAttestation(
      worker: string,
      githubUsername: string,
      vitalityScore: bigint,
      reliabilityScore: bigint,
      pledgedHours: bigint,
      skillCategory: number,
      tokenValue: bigint,
      validUntil: bigint,
      nonce: bigint,
      signer: SignerWithAddress
    ) {
      const vitaTokenAddress = await vitaToken.getAddress();
      const chainId = (await ethers.provider.getNetwork()).chainId;

      const domain = {
        name: DOMAIN_NAME,
        version: DOMAIN_VERSION,
        chainId: chainId,
        verifyingContract: vitaTokenAddress,
      };

      const types = {
        VitalityAttestation: [
          { name: "worker", type: "address" },
          { name: "githubUsername", type: "string" },
          { name: "vitalityScore", type: "uint256" },
          { name: "reliabilityScore", type: "uint256" },
          { name: "pledgedHours", type: "uint256" },
          { name: "skillCategory", type: "uint8" },
          { name: "tokenValue", type: "uint256" },
          { name: "validUntil", type: "uint256" },
          { name: "nonce", type: "uint256" },
        ],
      };

      const attestation = {
        worker,
        githubUsername,
        vitalityScore,
        reliabilityScore,
        pledgedHours,
        skillCategory,
        tokenValue,
        validUntil,
        nonce,
      };

      const signature = await signer.signTypedData(domain, types, attestation);
      const sig = ethers.Signature.from(signature);

      return { attestation, v: sig.v, r: sig.r, s: sig.s };
    }

    it("Should mint tokens with valid AI attestation", async function () {
      const currentBlock = await ethers.provider.getBlock("latest");
      const validUntil = BigInt(currentBlock!.timestamp + 86400); // Valid for 1 day
      const nonce = BigInt(Date.now());

      const { attestation, v, r, s } = await createSignedAttestation(
        worker.address,
        "testuser",
        85n * 10n ** 16n, // 85% vitality score
        8n * 10n ** 17n,  // 0.8 reliability score
        100n,             // 100 pledged hours
        SkillCategory.SOLIDITY_DEV,
        ethers.parseEther("12000"), // $12,000 token value
        validUntil,
        nonce,
        aiOracle
      );

      // Mint via mintEcho
      await expect(vitaToken.connect(worker).mintEcho(attestation, v, r, s))
        .to.emit(vitaToken, "VitaMinted")
        .withArgs(
          worker.address,
          0n, // First token ID
          ethers.parseEther("12000"),
          100n,
          SkillCategory.SOLIDITY_DEV,
          85n * 10n ** 16n
        );

      // Check balance
      expect(await vitaToken.balanceOf(worker.address)).to.equal(
        ethers.parseEther("12000")
      );

      // Check total supply
      expect(await vitaToken.totalSupply()).to.equal(ethers.parseEther("12000"));
    });

    it("Should reject expired attestation", async function () {
      const currentBlock = await ethers.provider.getBlock("latest");
      const validUntil = BigInt(currentBlock!.timestamp - 1); // Already expired
      const nonce = BigInt(Date.now());

      const { attestation, v, r, s } = await createSignedAttestation(
        worker.address,
        "testuser",
        85n * 10n ** 16n,
        8n * 10n ** 17n,
        100n,
        SkillCategory.SOLIDITY_DEV,
        ethers.parseEther("12000"),
        validUntil,
        nonce,
        aiOracle
      );

      await expect(
        vitaToken.connect(worker).mintEcho(attestation, v, r, s)
      ).to.be.revertedWith("Attestation expired");
    });

    it("Should reject attestation signed by non-oracle", async function () {
      const currentBlock = await ethers.provider.getBlock("latest");
      const validUntil = BigInt(currentBlock!.timestamp + 86400);
      const nonce = BigInt(Date.now());

      // Sign with investor (not an oracle)
      const { attestation, v, r, s } = await createSignedAttestation(
        worker.address,
        "testuser",
        85n * 10n ** 16n,
        8n * 10n ** 17n,
        100n,
        SkillCategory.SOLIDITY_DEV,
        ethers.parseEther("12000"),
        validUntil,
        nonce,
        investor // Wrong signer!
      );

      await expect(
        vitaToken.connect(worker).mintEcho(attestation, v, r, s)
      ).to.be.revertedWith("Invalid AI oracle signature");
    });

    it("Should reject attestation for wrong worker", async function () {
      const currentBlock = await ethers.provider.getBlock("latest");
      const validUntil = BigInt(currentBlock!.timestamp + 86400);
      const nonce = BigInt(Date.now());

      const { attestation, v, r, s } = await createSignedAttestation(
        investor.address, // Wrong worker address
        "testuser",
        85n * 10n ** 16n,
        8n * 10n ** 17n,
        100n,
        SkillCategory.SOLIDITY_DEV,
        ethers.parseEther("12000"),
        validUntil,
        nonce,
        aiOracle
      );

      await expect(
        vitaToken.connect(worker).mintEcho(attestation, v, r, s)
      ).to.be.revertedWith("Caller is not the attested worker");
    });

    it("Should reject replay attack (same attestation used twice)", async function () {
      const currentBlock = await ethers.provider.getBlock("latest");
      const validUntil = BigInt(currentBlock!.timestamp + 86400);
      const nonce = BigInt(Date.now());

      const { attestation, v, r, s } = await createSignedAttestation(
        worker.address,
        "testuser",
        85n * 10n ** 16n,
        8n * 10n ** 17n,
        100n,
        SkillCategory.SOLIDITY_DEV,
        ethers.parseEther("12000"),
        validUntil,
        nonce,
        aiOracle
      );

      // First mint should succeed
      await vitaToken.connect(worker).mintEcho(attestation, v, r, s);

      // Second mint with same attestation should fail (nonce already used)
      await expect(
        vitaToken.connect(worker).mintEcho(attestation, v, r, s)
      ).to.be.revertedWith("Invalid nonce");
    });

    it("Should update worker profile after minting", async function () {
      const currentBlock = await ethers.provider.getBlock("latest");
      const validUntil = BigInt(currentBlock!.timestamp + 86400);
      const nonce = BigInt(Date.now());

      const { attestation, v, r, s } = await createSignedAttestation(
        worker.address,
        "vitalik",
        85n * 10n ** 16n,
        8n * 10n ** 17n,
        100n,
        SkillCategory.SOLIDITY_DEV,
        ethers.parseEther("12000"),
        validUntil,
        nonce,
        aiOracle
      );

      await vitaToken.connect(worker).mintEcho(attestation, v, r, s);

      const profile = await vitaToken.getWorkerProfile(worker.address);
      expect(profile.githubUsername).to.equal("vitalik");
      expect(profile.totalMinted).to.equal(ethers.parseEther("12000"));
      expect(profile.isVerified).to.be.true;
      expect(profile.vitalityScore).to.equal(85n * 10n ** 16n);
    });
  });

  describe("ERC-20 Functions", function () {
    beforeEach(async function () {
      // Mint some tokens first
      const currentBlock = await ethers.provider.getBlock("latest");
      const validUntil = BigInt(currentBlock!.timestamp + 86400);
      const nonce = BigInt(Date.now());

      const { attestation, v, r, s } = await createSignedAttestation(
        worker.address,
        "testuser",
        85n * 10n ** 16n,
        8n * 10n ** 17n,
        100n,
        SkillCategory.SOLIDITY_DEV,
        ethers.parseEther("1000"),
        validUntil,
        nonce,
        aiOracle
      );

      await vitaToken.connect(worker).mintEcho(attestation, v, r, s);

      // Verify investor so they can receive tokens
      await vitaToken.verifyWorker(investor.address, "investor");
    });

    async function createSignedAttestation(
      worker: string,
      githubUsername: string,
      vitalityScore: bigint,
      reliabilityScore: bigint,
      pledgedHours: bigint,
      skillCategory: number,
      tokenValue: bigint,
      validUntil: bigint,
      nonce: bigint,
      signer: SignerWithAddress
    ) {
      const vitaTokenAddress = await vitaToken.getAddress();
      const chainId = (await ethers.provider.getNetwork()).chainId;

      const domain = {
        name: DOMAIN_NAME,
        version: DOMAIN_VERSION,
        chainId: chainId,
        verifyingContract: vitaTokenAddress,
      };

      const types = {
        VitalityAttestation: [
          { name: "worker", type: "address" },
          { name: "githubUsername", type: "string" },
          { name: "vitalityScore", type: "uint256" },
          { name: "reliabilityScore", type: "uint256" },
          { name: "pledgedHours", type: "uint256" },
          { name: "skillCategory", type: "uint8" },
          { name: "tokenValue", type: "uint256" },
          { name: "validUntil", type: "uint256" },
          { name: "nonce", type: "uint256" },
        ],
      };

      const attestation = {
        worker,
        githubUsername,
        vitalityScore,
        reliabilityScore,
        pledgedHours,
        skillCategory,
        tokenValue,
        validUntil,
        nonce,
      };

      const signature = await signer.signTypedData(domain, types, attestation);
      const sig = ethers.Signature.from(signature);

      return { attestation, v: sig.v, r: sig.r, s: sig.s };
    }

    it("Should transfer tokens between verified users", async function () {
      await vitaToken.connect(worker).transfer(investor.address, ethers.parseEther("100"));
      expect(await vitaToken.balanceOf(investor.address)).to.equal(ethers.parseEther("100"));
      expect(await vitaToken.balanceOf(worker.address)).to.equal(ethers.parseEther("900"));
    });

    it("Should approve and transferFrom", async function () {
      await vitaToken.connect(worker).approve(investor.address, ethers.parseEther("200"));
      expect(await vitaToken.allowance(worker.address, investor.address)).to.equal(
        ethers.parseEther("200")
      );

      await vitaToken
        .connect(investor)
        .transferFrom(worker.address, investor.address, ethers.parseEther("200"));
      expect(await vitaToken.balanceOf(investor.address)).to.equal(ethers.parseEther("200"));
    });
  });

  describe("Yield Distribution", function () {
    it("Should distribute yield with 20% to worker", async function () {
      // First mint tokens
      const currentBlock = await ethers.provider.getBlock("latest");
      const validUntil = BigInt(currentBlock!.timestamp + 86400);
      const nonce = BigInt(Date.now());

      const domain = {
        name: DOMAIN_NAME,
        version: DOMAIN_VERSION,
        chainId: (await ethers.provider.getNetwork()).chainId,
        verifyingContract: await vitaToken.getAddress(),
      };

      const types = {
        VitalityAttestation: [
          { name: "worker", type: "address" },
          { name: "githubUsername", type: "string" },
          { name: "vitalityScore", type: "uint256" },
          { name: "reliabilityScore", type: "uint256" },
          { name: "pledgedHours", type: "uint256" },
          { name: "skillCategory", type: "uint8" },
          { name: "tokenValue", type: "uint256" },
          { name: "validUntil", type: "uint256" },
          { name: "nonce", type: "uint256" },
        ],
      };

      const attestation = {
        worker: worker.address,
        githubUsername: "testuser",
        vitalityScore: 85n * 10n ** 16n,
        reliabilityScore: 8n * 10n ** 17n,
        pledgedHours: 100n,
        skillCategory: SkillCategory.SOLIDITY_DEV,
        tokenValue: ethers.parseEther("1000"),
        validUntil,
        nonce,
      };

      const signature = await aiOracle.signTypedData(domain, types, attestation);
      const sig = ethers.Signature.from(signature);

      await vitaToken.connect(worker).mintEcho(attestation, sig.v, sig.r, sig.s);

      // Distribute yield
      const yieldAmount = ethers.parseEther("1");
      await vitaToken.connect(investor).distributeYield(0, { value: yieldAmount });

      // Check worker's pending yield (20%)
      const pendingYield = await vitaToken.pendingWorkerYield(worker.address);
      expect(pendingYield).to.equal(ethers.parseEther("0.2"));
    });

    it("Should allow worker to claim yield", async function () {
      // Setup: mint tokens and distribute yield
      const currentBlock = await ethers.provider.getBlock("latest");
      const validUntil = BigInt(currentBlock!.timestamp + 86400);
      const nonce = BigInt(Date.now());

      const domain = {
        name: DOMAIN_NAME,
        version: DOMAIN_VERSION,
        chainId: (await ethers.provider.getNetwork()).chainId,
        verifyingContract: await vitaToken.getAddress(),
      };

      const types = {
        VitalityAttestation: [
          { name: "worker", type: "address" },
          { name: "githubUsername", type: "string" },
          { name: "vitalityScore", type: "uint256" },
          { name: "reliabilityScore", type: "uint256" },
          { name: "pledgedHours", type: "uint256" },
          { name: "skillCategory", type: "uint8" },
          { name: "tokenValue", type: "uint256" },
          { name: "validUntil", type: "uint256" },
          { name: "nonce", type: "uint256" },
        ],
      };

      const attestation = {
        worker: worker.address,
        githubUsername: "testuser",
        vitalityScore: 85n * 10n ** 16n,
        reliabilityScore: 8n * 10n ** 17n,
        pledgedHours: 100n,
        skillCategory: SkillCategory.SOLIDITY_DEV,
        tokenValue: ethers.parseEther("1000"),
        validUntil,
        nonce,
      };

      const signature = await aiOracle.signTypedData(domain, types, attestation);
      const sig = ethers.Signature.from(signature);

      await vitaToken.connect(worker).mintEcho(attestation, sig.v, sig.r, sig.s);
      await vitaToken.connect(investor).distributeYield(0, { value: ethers.parseEther("1") });

      // Get worker balance before claim
      const balanceBefore = await ethers.provider.getBalance(worker.address);

      // Claim yield
      const tx = await vitaToken.connect(worker).claimWorkerYield();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      // Check balance increased
      const balanceAfter = await ethers.provider.getBalance(worker.address);
      expect(balanceAfter).to.equal(balanceBefore + ethers.parseEther("0.2") - gasUsed);

      // Check pending yield is now 0
      expect(await vitaToken.pendingWorkerYield(worker.address)).to.equal(0);
    });
  });
});

describe("ValuationEngine", function () {
  let valuationEngine: ValuationEngine;

  const PRECISION = BigInt(10) ** BigInt(18);

  beforeEach(async function () {
    const ValuationEngine = await ethers.getContractFactory("ValuationEngine");
    valuationEngine = await ValuationEngine.deploy();
    await valuationEngine.waitForDeployment();
  });

  describe("Skill Rates", function () {
    it("Should have correct default rates", async function () {
      // Solidity dev: $150/hr
      const solidityRate = await valuationEngine.getSkillRate(0);
      expect(solidityRate).to.equal(150n * PRECISION);

      // AI/ML dev: $160/hr
      const aiMlRate = await valuationEngine.getSkillRate(6);
      expect(aiMlRate).to.equal(160n * PRECISION);
    });

    it("Should allow owner to update rates", async function () {
      await valuationEngine.updateSkillRate(0, 200n * PRECISION);
      expect(await valuationEngine.getSkillRate(0)).to.equal(200n * PRECISION);
    });
  });

  describe("Valuation Calculation", function () {
    it("Should calculate value correctly for immediate fulfillment", async function () {
      // 100 hours, Solidity Dev ($150/hr), 80% reliability, 0 time
      const value = await valuationEngine.calculateValue(
        100n,
        0n, // SOLIDITY_DEV
        8n * 10n ** 17n, // 0.8 reliability
        0n // immediate
      );

      // Expected: 100 * 150 * 0.8 = $12,000
      expect(value).to.equal(12000n * PRECISION);
    });

    it("Should apply time decay for future fulfillment", async function () {
      const oneYear = 365n * 24n * 60n * 60n; // 1 year in seconds

      // 100 hours, Solidity Dev, 100% reliability, 1 year
      const value = await valuationEngine.calculateValue(
        100n,
        0n, // SOLIDITY_DEV
        PRECISION, // 100% reliability
        oneYear
      );

      // Expected: 100 * 150 * 1.0 * e^(-0.1*1) ≈ $15,000 * 0.905 ≈ $13,575
      // With Taylor approximation it will be slightly different
      const baseValue = 15000n * PRECISION;
      
      // Value should be less than base due to decay
      expect(value).to.be.lt(baseValue);
      // But not too much less (decay for 1 year should be ~90%)
      expect(value).to.be.gt((baseValue * 80n) / 100n);
    });

    it("Should return detailed valuation breakdown", async function () {
      const [baseValue, adjustedValue, timeDecay, finalValue] =
        await valuationEngine.calculateValueDetailed(
          100n,
          0n, // SOLIDITY_DEV
          8n * 10n ** 17n, // 0.8 reliability
          0n // immediate
        );

      expect(baseValue).to.equal(100n * 150n * PRECISION);
      expect(adjustedValue).to.equal(100n * 150n * 8n * 10n ** 17n); // scaled
      expect(timeDecay).to.equal(PRECISION); // No decay for t=0
      expect(finalValue).to.equal(12000n * PRECISION);
    });
  });
});
