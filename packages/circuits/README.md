# VITA Protocol - ZK Circuits

Zero-Knowledge circuits for proving GitHub contributions without revealing repository details.

## Overview

The `proof_of_work.circom` circuit allows workers to prove they have made valid commits to repositories without revealing:
- Repository name
- Commit message content  
- Exact files changed

Only the commitment hash and quality metrics are revealed publicly.

## Circuit Structure

### proof_of_work.circom

**Public Inputs:**
- `commitHash` - SHA-1 hash of the git commit
- `workerCommitment` - Poseidon(workerAddress, nonce) binding proof to worker
- `timestamp` - Unix timestamp of the commit
- `minLinesThreshold` - Minimum lines of code required

**Private Inputs:**
- `repoNameHash` - Hash of repository name (keeps repo private)
- `repoSalt` - Random salt for repo hash
- `commitMessageHash` - Hash of commit message
- `workerAddress` - Worker's Ethereum address
- `nonce` - Random nonce for commitment
- `linesOfCode` - Lines changed in commit
- `filesChanged` - Files modified
- `contributionScore` - AI-computed score (0-100)

**Outputs:**
- `workProofHash` - Final commitment to the work
- `qualityScore` - Derived quality metric
- `repoCommitment` - Commitment to repo (for dedup)

## Setup

### Prerequisites

1. Install Circom:
```bash
curl -Ls https://github.com/iden3/circom/releases/download/v2.1.6/circom-linux-amd64 -o /usr/local/bin/circom
chmod +x /usr/local/bin/circom
```

2. Install snarkjs:
```bash
npm install -g snarkjs
```

3. Download Powers of Tau (for circuit setup):
```bash
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_16.ptau -O pot16_final.ptau
```

### Compile Circuit

```bash
pnpm compile
```

This outputs:
- `build/proof_of_work.r1cs` - Constraint system
- `build/proof_of_work_js/` - WASM for witness generation
- `build/proof_of_work.sym` - Symbol table

### Generate Proving Key

```bash
pnpm setup
```

This creates `build/proof_of_work.zkey` for proof generation.

### Export Verification Key

```bash
pnpm export-vkey
```

Creates `verification_key.json` for off-chain verification.

### Export Solidity Verifier

```bash
pnpm export-verifier
```

Generates `../contracts/contracts/verifiers/Groth16Verifier.sol`.

## Usage

### 1. Generate Input

```bash
node scripts/generate_input.js
```

Or programmatically:

```javascript
const { generateProofInput } = require('./scripts/generate_input');

const input = await generateProofInput({
  commitSha: 'abc123...',
  repoName: 'user/private-repo',
  commitMessage: 'feat: add feature',
  workerAddress: '0x...',
  timestamp: Date.now() / 1000,
  linesOfCode: 150,
  filesChanged: 5,
  contributionScore: 85
});
```

### 2. Generate Proof

```bash
pnpm prove
```

Or use the script:

```javascript
const { generateProof } = require('./scripts/prove');

const { proof, publicSignals } = await generateProof(
  'input.json',
  'build/proof_of_work_js/proof_of_work.wasm',
  'build/proof_of_work.zkey'
);
```

### 3. Verify On-Chain

```solidity
// In Solidity
Groth16Verifier verifier = Groth16Verifier(verifierAddress);
bool valid = verifier.verifyProof(pA, pB, pC, pubSignals);
```

## Files

```
circuits/
├── circuits/
│   ├── proof_of_work.circom    # Main proof of work circuit
│   └── merkle_tree.circom      # Merkle tree verification helper
├── scripts/
│   ├── generate_input.js       # Generate circuit inputs
│   └── prove.js                # Generate and verify proofs
├── build/                      # Compiled circuit artifacts
├── package.json
└── README.md
```

## Security Considerations

1. **Salt uniqueness**: Always use unique random salts for repo commitments
2. **Nonce management**: Track used nonces to prevent replay attacks
3. **Trusted setup**: The powers of tau ceremony must be trusted
4. **Timestamp validation**: Verify timestamps are within acceptable range

## Integration with VitaToken

The ZK proofs integrate with VitaToken via:

1. **WorkProofRegistry**: Registers verified proofs on-chain
2. **VitaTokenV2.submitWorkProof()**: Attach proof to minted tokens
3. **VitaTokenV2.mintEchoWithProof()**: Mint with ZK verification required

## License

MIT
