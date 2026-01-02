# VITA Protocol

### Decentralized Credit Score for the AI Age

The "Human Capital Stock Exchange" powered by Mantle

[![Mantle](https://img.shields.io/badge/Built%20on-Mantle-black?style=for-the-badge&logo=ethereum)](https://www.mantle.xyz/)
[![Mantle DA](https://img.shields.io/badge/Powered%20By-Mantle%20DA-green?style=for-the-badge)](https://www.mantle.xyz/)

---

## ⚡ The Mantle Power: 100x Cheaper Proofs with EigenDA

VITA leverages **Mantle DA (Data Availability)** to store millions of worker productivity proofs at **1/100th the cost** of Ethereum L1. By offloading data to EigenDA, we make it economically viable to mint a ZK-proof for every single commit.

| Operation | Ethereum L1 | Mantle L2 + DA | Savings |
|-----------|-------------|----------------|---------|
| ZK Proof Storage | ~$20.00 | ~$0.005 | **99.97%** |
| Identity Update | ~$15.00 | ~$0.01 | **99.93%** |

---

## 🚨 The Problem: The $1.5T Gig Economy Liquidity Crisis

The gig economy is broken. **70 million workers** worldwide create immense value, but face an impossible liquidity trap:

<table>
<tr>
<td width="50%">

### 💸 Payment Delays
- Net-30 to Net-90 invoice cycles
- 35% of freelancers wait 2+ months for payment
- Cash flow gaps kill businesses

</td>
<td width="50%">

### 🏦 Capital Exclusion  
- No credit history = No loans
- Gig work seen as "unstable income"
- 87% of freelancers denied traditional financing

</td>
</tr>
<tr>
<td width="50%">

### 📉 Undervaluation
- Skills and reputation aren't fungible assets
- Years of expertise can't be leveraged
- No way to "invest" in yourself

</td>
<td width="50%">

### 🔒 Platform Lock-in
- Reputation trapped in siloed platforms
- Can't transfer credibility across marketplaces
- Platforms extract 20-30% fees

</td>
</tr>
</table>

**The Result:** Talented workers are trapped in a cycle of financial precarity, unable to access the capital their human capital deserves.

---

## 💡 The Solution: VITA Protocol

**VITA** creates the first **compliant, programmable security token** that transforms verified human productivity into a tradeable, stakeable, yield-generating on-chain asset.

<div align="center">

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│    🧑‍💻 WORKER         →      🤖 AI ORACLE      →      🪙 $VITA           │
│                                                                         │
│    Pledges future         Calculates real-time      Security token      │
│    productivity via       valuation using our       minted on Mantle    │
│    GitHub commits         VITA Formula              with ZK privacy     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│    📈 STAKE → EARN         🔄 TRADE               🏦 YIELD              │
│                                                                         │
│    Auto-stake to mETH      Transfer productivity  20% worker            │
│    for 1.36% APY           rights on secondary    70% holders           │
│    Native Mantle yield     markets (ERC-3643)     10% protocol          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

</div>

### How It Works

1. **Pledge Productivity** — Connect GitHub, specify hours pledged
2. **AI Valuation** — Our oracle analyzes commit history, calculates your vitality score
3. **Mint $VITA** — EIP-712 signed tokens minted on Mantle
4. **Auto-Stake** — Collateral soft-staked to mETH for native yield
5. **Earn & Trade** — Receive yield from work completion, trade tokens freely

---

## 🏗️ Architecture

```
vita-protocol/
├── apps/
│   └── web/                    # Next.js 14 Frontend
│       ├── dashboard/          # Vitality Dashboard (Recharts)
│       └── pledge/             # Pledge Productivity Flow
│
├── packages/
│   ├── contracts/              # Solidity Smart Contracts
│   │   ├── VitaTokenV2.sol     # Main token (ERC-3643 + ZK + mETH)
│   │   ├── ValuationEngine.sol # VITA Formula implementation
│   │   ├── METHStaking.sol     # Mantle liquid staking integration
│   │   └── verifiers/          # Groth16 ZK proof verification
│   │
│   ├── circuits/               # Circom ZK Circuits
│   │   └── proof_of_work.circom
│   │
│   └── config/                 # Shared configuration
```

---

## 🔬 Technical Excellence

### 1️⃣ Mantle Data Availability (DA) Layer

We leverage Mantle's modular architecture for **95% gas reduction** compared to Ethereum L1:

| Operation | Ethereum L1 | Mantle L2 | Savings |
|-----------|-------------|-----------|---------|
| Token Mint | ~$50 | ~$0.02 | **99.96%** |
| ZK Proof Verify | ~$200 | ~$0.50 | **99.75%** |
| Stake/Unstake | ~$80 | ~$0.03 | **99.96%** |

**Why Mantle?**
- **EigenDA Integration** — Decentralized data availability at scale
- **Optimistic Rollup** — Ethereum security with L2 speed
- **mETH Native Yield** — 1.36% APY on staked collateral
- **EVM Compatibility** — Full Solidity support, easy deployment

### 2️⃣ ERC-3643: The Security Token Standard

VITA implements the **T-REX (Token for Regulated EXchanges)** protocol:

```solidity
// Compliant identity verification
interface IIdentityRegistry {
    function isVerified(address _userAddress) external view returns (bool);
    function investorCountry(address _userAddress) external view returns (uint16);
}

// Compliance rules engine
interface IModularCompliance {
    function canTransfer(address _from, address _to, uint256 _value) 
        external view returns (bool);
}
```

**Compliance Features:**
- ✅ On-chain identity verification via OnchainID
- ✅ Jurisdictional transfer restrictions
- ✅ Modular compliance rules
- ✅ Forced transfers for legal compliance
- ✅ Pause/freeze mechanisms

### 3️⃣ Zero-Knowledge Privacy Layer

Our Circom circuit proves work without revealing repository details:

```circom
template ProofOfWork() {
    // Private inputs (hidden)
    signal input repoName;          // Your private repo
    signal input rawCommits[256];   // Commit details
    
    // Public inputs (verified on-chain)
    signal input commitHash;        // Merkle root of commits
    signal input timestamp;         // Time of proof
    
    // Outputs
    signal output workProofHash;    // Verified proof
    signal output qualityScore;     // Code quality metric
}
```

**Privacy Guarantees:**
- 🔐 Repo names never revealed on-chain
- 🔐 Commit contents stay private
- 🔐 Only aggregate metrics published
- 🔐 Groth16 proofs for O(1) verification

### 4️⃣ The VITA Formula

Our AI oracle calculates worker value using:

$$V = (H \times R) \times S_{AI} \times e^{-\lambda t}$$

| Variable | Description | Source |
|----------|-------------|--------|
| $H$ | Hours pledged | Worker input |
| $R$ | Hourly rate (USD) | Market data |
| $S_{AI}$ | AI Vitality Score (0-100) | GitHub metrics |
| $\lambda$ | Decay constant | `0.0001` |
| $t$ | Time elapsed | Block timestamp |

**Vitality Score Components:**
- Commit frequency (30%)
- Code complexity (25%)
- Pull request acceptance rate (20%)
- Issue resolution time (15%)
- Documentation quality (10%)

---

## 📦 Deployed Contracts

### Mantle Sepolia Testnet (Chain ID: 5003)

| Contract | Address | Explorer |
|----------|---------|----------|
| VitaTokenV2 | `0x36987d58D3ba97462c241B52598aacd7B8C77228` | [View](https://sepolia.mantlescan.xyz/address/0x36987d58D3ba97462c241B52598aacd7B8C77228) |
| VitaToken | `0x4d0F0e709b1c81853f3a99925B00cFe085044c79` | [View](https://sepolia.mantlescan.xyz/address/0x4d0F0e709b1c81853f3a99925B00cFe085044c79) |
| ValuationEngine | `0xa7BC6695258f5fC5E07c5561bE2c65342AC7b745` | [View](https://sepolia.mantlescan.xyz/address/0xa7BC6695258f5fC5E07c5561bE2c65342AC7b745) |
| Groth16Verifier | `0x47371C3244D60C89D6e5Ab49E972cA07D427Dc37` | [View](https://sepolia.mantlescan.xyz/address/0x47371C3244D60C89D6e5Ab49E972cA07D427Dc37) |
| WorkProofRegistry | `0x008aceeD352DC93DB3B15E4466f8Ad71316D0dCd` | [View](https://sepolia.mantlescan.xyz/address/0x008aceeD352DC93DB3B15E4466f8Ad71316D0dCd) |
| METHStaking | `0xcC06e475e8863129fEaC7eFecE9851B4a489738e` | [View](https://sepolia.mantlescan.xyz/address/0xcC06e475e8863129fEaC7eFecE9851B4a489738e) |
| MockMETH | `0x9A02E56cE3D8858ff72bfbDb83085AE5CfAE7031` | [View](https://sepolia.mantlescan.xyz/address/0x9A02E56cE3D8858ff72bfbDb83085AE5CfAE7031) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/vita-protocol.git
cd vita-protocol

# Install dependencies
pnpm install

# Set up environment variables
cp packages/contracts/.env.example packages/contracts/.env
```

### Environment Variables

```env
# packages/contracts/.env
MANTLE_PRIVATE_KEY=your_private_key_here
MANTLESCAN_API_KEY=your_mantlescan_api_key

# apps/web/.env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_VITA_CONTRACT=0x...
```

### Development

```bash
# Start local node
pnpm --filter contracts dev

# Run tests (32 passing)
pnpm --filter contracts test

# Start frontend
pnpm --filter web dev
```

### Deployment

```bash
# Deploy to Mantle Testnet
cd packages/contracts
npx hardhat run scripts/deploy-mantle.ts --network mantleTestnet

# Verify contracts
# Automatic if MANTLESCAN_API_KEY is set
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm coverage

# Run specific test file
pnpm test test/VitaTokenV2.test.ts
```

**Test Coverage:**
- 32 passing tests
- Core token operations
- Valuation engine calculations
- ZK proof verification
- mETH staking integration

---

## 🛣️ Roadmap

### Phase 1: Foundation ✅
- [x] ERC-3643 compliant token
- [x] AI valuation oracle
- [x] ZK privacy layer
- [x] mETH staking integration
- [x] Mantle testnet deployment

### Phase 2: Growth 🔄
- [ ] Multi-platform integration (GitLab, Linear, Jira)
- [ ] Secondary market DEX
- [ ] Governance token ($VITA-GOV)
- [ ] Mobile app

### Phase 3: Scale 📈
- [ ] Institutional partnerships
- [ ] Cross-chain bridges
- [ ] Enterprise SaaS offering
- [ ] Mainnet launch

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m 'feat: add amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🔗 Links

- **Website:** [vita-protocol.xyz](https://vita-protocol.xyz)
- **Documentation:** [docs.vita-protocol.xyz](https://docs.vita-protocol.xyz)
- **Twitter:** [@VitaProtocol](https://twitter.com/VitaProtocol)
- **Discord:** [Join our community](https://discord.gg/vitaprotocol)

---

<div align="center">
  
  **Built with ❤️ for the Mantle Global Hackathon 2024**
  
  <sub>Empowering the future of human capital</sub>
  
</div>
