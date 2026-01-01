import { expect } from "chai";
import { ethers } from "hardhat";
import { WorkProofRegistry, MockVerifier } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("WorkProofRegistry", function () {
    let registry: WorkProofRegistry;
    let verifier: MockVerifier;
    let owner: HardhatEthersSigner;
    let user1: HardhatEthersSigner;

    // Mock Proof Data
    const pA = [0, 0];
    const pB = [[0, 0], [0, 0]];
    const pC = [0, 0];

    // _pubSignals indices
    // 0: workProofHash
    // 1: qualityScore
    // 2: repoCommitment
    // 3: commitHash
    // 4: workerCommitment
    // 5: timestamp
    // 6: minLines

    const validQuality = 80;

    beforeEach(async function () {
        [owner, user1] = await ethers.getSigners();

        // Deploy Mock Verifier
        const MockVerifierFactory = await ethers.getContractFactory("MockVerifier");
        verifier = (await MockVerifierFactory.deploy()) as MockVerifier;
        await verifier.waitForDeployment();

        // Deploy Registry
        const RegistryFactory = await ethers.getContractFactory("WorkProofRegistry");
        registry = (await RegistryFactory.deploy(await verifier.getAddress())) as WorkProofRegistry;
        await registry.waitForDeployment();
    });

    it("Should accept a valid proof", async function () {
        const timestamp = Math.floor(Date.now() / 1000);
        const signals = [101, validQuality, 201, 301, 401, timestamp, 10];

        await expect(registry.connect(user1).submitWorkProof(pA as any, pB as any, pC as any, signals as any))
            .to.emit(registry, "WorkProofSubmitted")
            .withArgs(101, 401, validQuality, timestamp);

        expect(await registry.isProofSubmitted(101)).to.be.true;
        expect(await registry.getWorkerProofCount(401)).to.equal(1);
    });

    it("Should reject duplicate proof hash", async function () {
        const timestamp = Math.floor(Date.now() / 1000);
        const signals = [102, validQuality, 202, 302, 402, timestamp, 10];

        await registry.submitWorkProof(pA as any, pB as any, pC as any, signals as any);

        await expect(registry.submitWorkProof(pA as any, pB as any, pC as any, signals as any))
            .to.be.revertedWithCustomError(registry, "ProofAlreadySubmitted");
    });

    it("Should reject low quality score", async function () {
        const timestamp = Math.floor(Date.now() / 1000);
        const badQuality = 40; // Default min is 50
        const signals = [103, badQuality, 203, 303, 403, timestamp, 10];

        await expect(registry.submitWorkProof(pA as any, pB as any, pC as any, signals as any))
            .to.be.revertedWithCustomError(registry, "QualityScoreTooLow");
    });

    it("Should fail if verifier rejects", async function () {
        await verifier.setShouldPass(false);

        const timestamp = Math.floor(Date.now() / 1000);
        const signals = [104, validQuality, 204, 304, 404, timestamp, 10];

        await expect(registry.submitWorkProof(pA as any, pB as any, pC as any, signals as any))
            .to.be.revertedWithCustomError(registry, "InvalidProof");
    });

    it("Should only allow owner to update settings", async function () {
        await expect(registry.connect(user1).setMinQualityScore(10))
            .to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");

        await expect(registry.connect(owner).setMinQualityScore(60))
            .to.emit(registry, "MinQualityScoreUpdated")
            .withArgs(50, 60); // Default was 50

        expect(await registry.minQualityScore()).to.equal(60);
    });
});
