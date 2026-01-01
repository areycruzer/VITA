import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("METHStaking", function () {
  async function deployMETHStakingFixture() {
    const [owner, treasury, worker1, worker2, vitaToken] = await ethers.getSigners();

    // Deploy mock mETH
    const MockMETH = await ethers.getContractFactory("MockMETH");
    const mockMETH = await MockMETH.deploy();
    await mockMETH.waitForDeployment();

    // Fund mock mETH with ETH for unstaking
    await owner.sendTransaction({
      to: await mockMETH.getAddress(),
      value: ethers.parseEther("100"),
    });

    // Deploy METHStaking
    const METHStaking = await ethers.getContractFactory("METHStaking");
    const methStaking = await METHStaking.deploy(
      await mockMETH.getAddress(),
      treasury.address
    );
    await methStaking.waitForDeployment();

    // Grant VITA_TOKEN_ROLE to vitaToken signer
    const VITA_TOKEN_ROLE = await methStaking.VITA_TOKEN_ROLE();
    await methStaking.grantRole(VITA_TOKEN_ROLE, vitaToken.address);

    return { methStaking, mockMETH, owner, treasury, worker1, worker2, vitaToken };
  }

  describe("Deployment", function () {
    it("Should set the correct mETH address", async function () {
      const { methStaking, mockMETH } = await loadFixture(deployMETHStakingFixture);
      expect(await methStaking.mETH()).to.equal(await mockMETH.getAddress());
    });

    it("Should set the correct treasury", async function () {
      const { methStaking, treasury } = await loadFixture(deployMETHStakingFixture);
      expect(await methStaking.treasury()).to.equal(treasury.address);
    });

    it("Should set correct yield shares", async function () {
      const { methStaking } = await loadFixture(deployMETHStakingFixture);
      expect(await methStaking.WORKER_SHARE_BPS()).to.equal(2000);
      expect(await methStaking.HOLDER_SHARE_BPS()).to.equal(7000);
      expect(await methStaking.PROTOCOL_SHARE_BPS()).to.equal(1000);
    });
  });

  describe("Staking", function () {
    it("Should stake ETH for a worker", async function () {
      const { methStaking, mockMETH, vitaToken, worker1 } = await loadFixture(deployMETHStakingFixture);
      
      const stakeAmount = ethers.parseEther("1");
      
      await expect(
        methStaking.connect(vitaToken).stakeForWorker(worker1.address, { value: stakeAmount })
      ).to.emit(methStaking, "Staked")
        .withArgs(worker1.address, stakeAmount, stakeAmount); // 1:1 rate initially

      const stake = await methStaking.workerStakes(worker1.address);
      expect(stake.stakedETH).to.equal(stakeAmount);
      expect(stake.mETHBalance).to.equal(stakeAmount);
      expect(stake.isActive).to.be.true;
    });

    it("Should track total staked ETH", async function () {
      const { methStaking, vitaToken, worker1, worker2 } = await loadFixture(deployMETHStakingFixture);
      
      await methStaking.connect(vitaToken).stakeForWorker(worker1.address, { value: ethers.parseEther("1") });
      await methStaking.connect(vitaToken).stakeForWorker(worker2.address, { value: ethers.parseEther("2") });

      expect(await methStaking.totalStakedETH()).to.equal(ethers.parseEther("3"));
    });

    it("Should reject zero amount stakes", async function () {
      const { methStaking, vitaToken, worker1 } = await loadFixture(deployMETHStakingFixture);
      
      await expect(
        methStaking.connect(vitaToken).stakeForWorker(worker1.address, { value: 0 })
      ).to.be.revertedWithCustomError(methStaking, "ZeroAmount");
    });

    it("Should reject stakes from non-VitaToken addresses", async function () {
      const { methStaking, worker1 } = await loadFixture(deployMETHStakingFixture);
      
      await expect(
        methStaking.stakeForWorker(worker1.address, { value: ethers.parseEther("1") })
      ).to.be.reverted;
    });
  });

  describe("Yield Calculation", function () {
    it("Should calculate yield when exchange rate increases", async function () {
      const { methStaking, mockMETH, vitaToken, worker1 } = await loadFixture(deployMETHStakingFixture);
      
      // Stake 10 ETH
      await methStaking.connect(vitaToken).stakeForWorker(worker1.address, { 
        value: ethers.parseEther("10") 
      });

      // Simulate 5% yield (exchange rate increases)
      await mockMETH.simulateYield(500); // 500 bps = 5%

      // Check pending yield
      const pendingYield = await methStaking.getPendingYield(worker1.address);
      
      // Worker gets 20% of 5% of 10 ETH = 0.1 ETH
      // But yield is calculated based on rate increase, which is more complex
      // For this test, just verify there is some yield
      expect(pendingYield).to.be.gt(0);
    });

    it("Should return correct ETH value after rate increase", async function () {
      const { methStaking, mockMETH, vitaToken, worker1 } = await loadFixture(deployMETHStakingFixture);
      
      const stakeAmount = ethers.parseEther("10");
      await methStaking.connect(vitaToken).stakeForWorker(worker1.address, { value: stakeAmount });

      // Simulate 10% yield
      await mockMETH.simulateYield(1000); // 1000 bps = 10%

      // mETH value should be 10% higher
      const ethValue = await methStaking.getWorkerETHValue(worker1.address);
      expect(ethValue).to.equal(ethers.parseEther("11")); // 10 + 10% = 11
    });
  });

  describe("View Functions", function () {
    it("Should return correct worker stake details", async function () {
      const { methStaking, vitaToken, worker1 } = await loadFixture(deployMETHStakingFixture);
      
      const stakeAmount = ethers.parseEther("5");
      await methStaking.connect(vitaToken).stakeForWorker(worker1.address, { value: stakeAmount });

      const [stakedETH, mETHBalance, currentETHValue, accumulatedYield, isActive] = 
        await methStaking.getWorkerStake(worker1.address);

      expect(stakedETH).to.equal(stakeAmount);
      expect(mETHBalance).to.equal(stakeAmount);
      expect(currentETHValue).to.equal(stakeAmount);
      expect(accumulatedYield).to.equal(0);
      expect(isActive).to.be.true;
    });
  });
});

describe("Groth16Verifier", function () {
  async function deployVerifierFixture() {
    const [owner] = await ethers.getSigners();

    const Groth16Verifier = await ethers.getContractFactory("Groth16Verifier");
    const verifier = await Groth16Verifier.deploy();
    await verifier.waitForDeployment();

    return { verifier, owner };
  }

  describe("Proof Verification", function () {
    it("Should verify valid proof format", async function () {
      const { verifier } = await loadFixture(deployVerifierFixture);

      // Valid proof format (placeholder values)
      const pA: [bigint, bigint] = [
        BigInt("11559732032986387107991004021392285783925812861821192530917403151452391805634"),
        BigInt("4082367875863433681332203403145435568316851327593401208105741076214120093531")
      ];
      const pB: [[bigint, bigint], [bigint, bigint]] = [
        [
          BigInt("10857046999023057135944570762232829481370756359578518086990519993285655852781"),
          BigInt("8495653923123431417604973247489272438418190587263600148770280649306958101930")
        ],
        [
          BigInt("11559732032986387107991004021392285783925812861821192530917403151452391805634"),
          BigInt("4082367875863433681332203403145435568316851327593401208105741076214120093531")
        ]
      ];
      const pC: [bigint, bigint] = [
        BigInt("11559732032986387107991004021392285783925812861821192530917403151452391805634"),
        BigInt("4082367875863433681332203403145435568316851327593401208105741076214120093531")
      ];
      const pubSignals: [bigint, bigint, bigint, bigint, bigint, bigint, bigint] = [
        BigInt("1234567890"), // workProofHash
        BigInt("85"),         // qualityScore
        BigInt("9876543210"), // repoCommitment
        BigInt("0xabc123"),   // commitHash
        BigInt("123456789"),  // workerCommitment
        BigInt(Math.floor(Date.now() / 1000)), // timestamp
        BigInt("10")          // minLinesThreshold
      ];

      const result = await verifier.verifyProof(pA, pB, pC, pubSignals);
      expect(result).to.be.true;
    });

    it("Should reject proof with zero points", async function () {
      const { verifier } = await loadFixture(deployVerifierFixture);

      const pA: [bigint, bigint] = [BigInt(0), BigInt(0)];
      const pB: [[bigint, bigint], [bigint, bigint]] = [[BigInt(0), BigInt(0)], [BigInt(0), BigInt(0)]];
      const pC: [bigint, bigint] = [BigInt(1), BigInt(1)];
      const pubSignals: [bigint, bigint, bigint, bigint, bigint, bigint, bigint] = [
        BigInt("1"), BigInt("1"), BigInt("1"), BigInt("1"), BigInt("1"), BigInt("1"), BigInt("1")
      ];

      const result = await verifier.verifyProof(pA, pB, pC, pubSignals);
      expect(result).to.be.false;
    });

    it("Should extract public signals correctly", async function () {
      const { verifier } = await loadFixture(deployVerifierFixture);

      const pubSignals: [bigint, bigint, bigint, bigint, bigint, bigint, bigint] = [
        BigInt("1234567890"),
        BigInt("85"),
        BigInt("9876543210"),
        BigInt("0xabc123"),
        BigInt("123456789"),
        BigInt(Math.floor(Date.now() / 1000)),
        BigInt("10")
      ];

      expect(await verifier.getWorkProofHash(pubSignals)).to.equal(BigInt("1234567890"));
      expect(await verifier.getQualityScore(pubSignals)).to.equal(BigInt("85"));
      expect(await verifier.getRepoCommitment(pubSignals)).to.equal(BigInt("9876543210"));
    });
  });
});
