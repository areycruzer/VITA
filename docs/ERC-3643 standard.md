# ERC-3643 Repository: Official T-REX Protocol Implementation

## Key Points
- **ERC-3643 Overview**: This repository implements the ERC-3643 standard, known as T-REX (Token for Regulated EXchanges), a suite of Solidity smart contracts for issuing, managing, and transferring compliant security tokens on Ethereum.
- **Core Purpose**: Enables on-chain compliance validation for permissioned tokens, ensuring regulatory adherence through identity verification, claim topics, and modular transfer rules.
- **Repository Stats**: As of January 1, 2026, it has 100 stars, 75 forks, and 5 watchers on GitHub, licensed under GNU General Public License v3.0 (GPL-3.0).
- **Key Components**: Includes ONCHAINID for identity management, registries for trusted issuers and claims, modular compliance for transfer rules, and the main security token contract.
- **Accessibility**: Open-source with comprehensive tests, deployment scripts, and documentation; suitable for developers building regulated DeFi applications.

## Repository Structure
The repository is organized into core directories for contracts, tests, documentation, and utilities, following standard Hardhat project conventions.

| Directory/File | Description | Key Files/Subdirs |
|---------------|-------------|-------------------|
| **contracts/** | Core Solidity implementations of ERC-3643 components. | Subdirs: compliance, factory, proxy, registry, roles, token, _testContracts |
| **docs/** | Documentation assets. | TREX-WhitePaper.pdf, img/ (images like T-REX Components.png) |
| **test/** | TypeScript test suites using Hardhat. | Subdirs: authorities, fixtures, registries, token; Files: agentRole.test.ts, compliance.test.ts, etc. |
| **scripts/** | Deployment and utility scripts. | flatten.js |
| **.github/workflows/** | CI/CD pipelines. | publish-prerelease.yml, publish-release.yml, push_checking.yml |
| **Root Files** | Configuration and metadata. | package.json, hardhat.config.ts, README.md, LICENSE.md |

## Getting Started
- Clone: `git clone https://github.com/ERC-3643/ERC-3643.git`
- Install: `npm ci`
- Compile: `hardhat compile`
- Test: `hardhat test`
- Detailed docs: Refer to the T-REX whitepaper and [Tokeny documentation](https://docs.tokeny.com/docs/smart-contracts).

---

## Comprehensive Survey of the ERC-3643 (T-REX) Repository

### Introduction to ERC-3643 and T-REX
The ERC-3643 standard, formalized as EIP-3643, represents a pivotal advancement in blockchain-based financial instruments by introducing permissioned tokens that inherently enforce regulatory compliance on-chain. Unlike traditional ERC-20 or ERC-721 tokens, ERC-3643 tokens—branded under the T-REX protocol—integrate identity verification, claim-based attestations, and dynamic transfer restrictions directly into the smart contract logic. This ensures that every token transfer is validated against predefined rules, such as investor eligibility, jurisdictional limits, and holding caps, without relying on off-chain oracles or centralized gatekeepers.

Developed by Tokeny Solutions and open-sourced under the ERC-3643 organization, this repository serves as the canonical implementation. It supports Ethereum Virtual Machine (EVM)-compatible chains and emphasizes modularity, upgradeability, and auditability. As of the latest release (v4.1.6), the protocol has undergone rigorous security audits, including a perfect 10/10 score from Hacken, underscoring its robustness for production use in tokenized securities.

The T-REX ecosystem revolves around four foundational pillars:
1. **ONCHAINID**: A user's on-chain identity contract (per ERC-734/735) storing keys and claims.
2. **Registries**: Centralized ledgers for trusted issuers, claim topics, and eligible identities.
3. **Compliance Engine**: Modular ruleset validator for transfers.
4. **Security Token**: The ERC-3643 compliant token contract interfacing with the above.

This survey provides an exhaustive breakdown of the repository's architecture, file structure, key artifacts, and implementation details, drawing from the source code, changelog, and associated documentation.

### Detailed File Tree and Organization
The repository adopts a monorepo structure optimized for Hardhat development, with TypeScript for tests, Solhint/ESLint for linting, and Prettier for formatting. Below is the complete recursive directory tree, compiled from the repository's contents API.

```
ERC-3643/
├── .github/
│   └── workflows/
│       ├── publish-prerelease.yml (CI/CD for pre-releases)
│       ├── publish-release.yml (CI/CD for releases)
│       └── push_checking.yml (Linting and test checks on push)
├── .husky/
│   ├── commit-msg (Git hook for commit linting)
│   └── pre-commit (Git hook for pre-commit checks)
├── contracts/
│   ├── _testContracts/
│   │   ├── ClaimIssuerTrick.sol (Test mock for claim issuers, 308 bytes)
│   │   ├── MockContract.sol (General testing mock, 553 bytes)
│   │   ├── OIDImports.sol (Test imports for on-chain IDs, 276 bytes)
│   │   ├── TestERC20.sol (ERC-20 mock for token testing, 4311 bytes)
│   │   └── v_3_5_2/ (Legacy v3.5.2 test artifacts)
│   │       ├── LegacyIA.sol (Legacy implementation authority)
│   │       ├── LegacyProxy.sol (Legacy proxy)
│   │       └── LegacyToken_3_5_2.sol (Legacy token v3.5.2)
│   ├── compliance/
│   │   ├── legacy/
│   │   │   ├── BasicCompliance.sol (Basic compliance logic, 7780 bytes)
│   │   │   ├── DefaultCompliance.sol (Default setup, 4706 bytes)
│   │   │   └── ICompliance.sol (Compliance interface, 8741 bytes)
│   │   └── modular/
│   │       ├── IModularCompliance.sol (Modular interface, 10854 bytes)
│   │       ├── MCStorage.sol (Modular storage, 4336 bytes)
│   │       ├── ModularCompliance.sol (Core modular engine, 11455 bytes)
│   │       └── modules/
│   │           ├── AbstractModule.sol (Base module, 5572 bytes)
│   │           ├── AbstractModuleUpgradeable.sol (Upgradeable base, 7259 bytes)
│   │           ├── IModule.sol (Module interface, 8978 bytes)
│   │           ├── ModuleProxy.sol (Module proxy, 4097 bytes)
│   │           └── TestModule.sol (Test module, 6615 bytes)
│   ├── factory/
│   │   ├── ITREXFactory.sol (Factory interface, 9823 bytes)
│   │   ├── ITREXGateway.sol (Gateway interface, 18221 bytes)
│   │   ├── TREXFactory.sol (Deployment factory, 16003 bytes)
│   │   └── TREXGateway.sol (Gateway implementation, 14159 bytes)
│   ├── proxy/
│   │   ├── AbstractProxy.sol (Base proxy, 6218 bytes)
│   │   ├── ClaimTopicsRegistryProxy.sol (Proxy for claim topics, 5189 bytes)
│   │   ├── IdentityRegistryProxy.sol (Proxy for identities, 5648 bytes)
│   │   ├── IdentityRegistryStorageProxy.sol (Storage proxy, 5193 bytes)
│   │   ├── ModularComplianceProxy.sol (Compliance proxy, 5186 bytes)
│   │   ├── TokenProxy.sol (Token proxy, 6212 bytes)
│   │   └── TrustedIssuersRegistryProxy.sol (Issuers proxy, 5194 bytes)
│   │   ├── authority/ (Subdir for authority proxies)
│   │   └── interface/ (Subdir for proxy interfaces)
│   ├── registry/
│   │   ├── implementation/
│   │   │   ├── ClaimTopicsRegistry.sol (Claim topics impl, 5351 bytes)
│   │   │   ├── IdentityRegistry.sol (Identity impl, 12047 bytes)
│   │   │   ├── IdentityRegistryStorage.sol (Storage impl, 8580 bytes)
│   │   │   └── TrustedIssuersRegistry.sol (Issuers impl, 10060 bytes)
│   │   ├── interface/
│   │   │   ├── IClaimTopicsRegistry.sol (Claim topics interface, 5304 bytes)
│   │   │   ├── IIdentityRegistry.sol (Identity interface, 12692 bytes)
│   │   │   ├── IIdentityRegistryStorage.sol (Storage interface, 9915 bytes)
│   │   │   └── ITrustedIssuersRegistry.sol (Issuers interface, 8846 bytes)
│   │   └── storage/
│   │       ├── CTRStorage.sol (Claim topics storage, 4153 bytes)
│   │       ├── IRSStorage.sol (Issuers storage, 4560 bytes)
│   │       ├── IRStorage.sol (Identity storage, 4585 bytes)
│   │       └── TIRStorage.sol (Trusted issuers storage, 4590 bytes)
│   ├── roles/
│   │   ├── AgentRole.sol (Agent access control, 4764 bytes)
│   │   ├── AgentRoleUpgradeable.sol (Upgradeable agent role, 4809 bytes)
│   │   └── Roles.sol (Base roles, 4799 bytes)
│   └── token/
│       ├── IToken.sol (Token interface, 22506 bytes)
│       ├── Token.sol (Token implementation, 22748 bytes)
│       └── TokenStorage.sol (Token storage, 5065 bytes)
├── docs/
│   ├── TREX-WhitePaper.pdf (Protocol whitepaper, ~1.97 MB)
│   └── img/
│       ├── T-REX Components.png (Diagram of components)
│       ├── T-REX.png (Main logo)
│       ├── Xmas T-REX.png (Themed image)
│       └── tokeny.png (Tokeny branding)
├── scripts/
│   └── flatten.js (Contract flattening script, 1707 bytes)
├── test/
│   ├── agentRole.test.ts (Agent role tests, 4772 bytes)
│   ├── compliance.test.ts (Compliance tests, 17496 bytes)
│   ├── factory.test.ts (Factory tests, 16102 bytes)
│   └── gateway.test.ts (Gateway tests, 67566 bytes)
│   ├── authorities/
│   │   └── trex-implementation-authority.test.ts (Authority tests)
│   ├── fixtures/
│   │   ├── deploy-compliance.fixture.ts (Compliance deployment fixture)
│   │   └── deploy-full-suite.fixture.ts (Full suite deployment fixture)
│   ├── registries/
│   │   ├── claim-topics-registry.test.ts (Claim topics tests)
│   │   ├── identity-registry-storage.test.ts (Storage tests)
│   │   ├── identity-registry.test.ts (Identity tests)
│   │   └── trusted-issuers-registry.test.ts (Issuers tests)
│   └── token/
│       ├── token-information.test.ts (Info tests)
│       ├── token-recovery.test.ts (Recovery tests)
│       └── token-transfer.test.ts (Transfer tests)
├── .eslintrc.json (ESLint config, 1652 bytes)
├── .gitattributes (Git attributes, 33 bytes)
├── .gitignore (Ignore rules, 160 bytes)
├── .prettierrc.json (Prettier config, 72 bytes)
├── .solcover.js (Coverage config, 177 bytes)
├── .solhint.json (Solhint config, 1137 bytes)
├── .solhintignore (Solhint ignores, 24 bytes)
├── CHANGELOG.md (Release notes, 17547 bytes)
├── CONTRIBUTING.md (Contribution guide, 2382 bytes)
├── LICENSE.md (GPL-3.0 license, 35149 bytes)
├── README.md (Main readme, 3226 bytes)
├── commitlint.config.js (Commit linting, 401 bytes)
├── hardhat.config.ts (Hardhat config, 633 bytes)
├── index.d.ts (TypeScript declarations, 2682 bytes)
├── index.js (Entry point, 6102 bytes)
├── package-lock.json (Dependencies lock, 458413 bytes)
└── package.json (Project metadata, 2418 bytes)
└── tsconfig.json (TypeScript config, 201 bytes)
```

This tree highlights the modular design, with proxies enabling upgradeability via ERC-1967 and ERC-1822 standards. Test coverage is extensive, focusing on critical paths like transfers and registry verifications.

### Core Smart Contracts: Technical Breakdown
The contracts directory houses the heart of the T-REX protocol. All contracts are written in Solidity ^0.8.0, inheriting from OpenZeppelin libraries for security (e.g., Ownable, Pausable).

#### Token Module (contracts/token/)
- **IToken.sol**: Defines the ERC-3643 interface, extending ERC-20/ERC-777 with compliance hooks like `transferWithCompliance(address to, uint256 amount)`. Includes events for minting, burning, and agent management.
- **Token.sol**: Main implementation, integrating with IdentityRegistry for eligibility checks. Supports pausing, blacklisting, and recovery functions.
- **TokenStorage.sol**: Separates storage for upgradability, mapping balances, allowances, and compliance data.

#### Registry Module (contracts/registry/)
- **ClaimTopicsRegistry**: Manages valid claim topics (e.g., KYC status as topic 100). Functions: `addTopic(uint256 topic)`, `isClaimTopicTrusted(uint256 topic)`.
- **IdentityRegistry**: Verifies investor eligibility by cross-referencing ONCHAINID claims against trusted issuers/topics. Key method: `isVerified(address identity, uint256[] calldata validTopics)`.
- **TrustedIssuersRegistry**: Whitelists claim issuers per topic. Supports granular permissions: `addTrustedIssuer(uint256 topic, address issuer)`.
- Storage contracts (e.g., IRStorage.sol) use diamond patterns for efficient upgrades.

#### Compliance Module (contracts/compliance/)
- **Legacy**: Basic/DefaultCompliance for simple rules; ICompliance interface for hooks like `canTransfer(address from, address to, uint256 amount)`.
- **Modular**: Advanced engine with pluggable modules (e.g., MaxBalanceModule for holding limits, CountryRestrictModule for geo-fencing).
  - **ModularCompliance.sol**: Orchestrates module execution via `callModuleFunction(bytes4 selector, bytes calldata data)`.
  - Modules dir: Includes AbstractModule for base logic, with specifics like TransferFeesModule (v4.1.0 addition for fee collection) and TimeTransferLimitsModule (batch operations in v4.1.6).

#### Factory and Proxy (contracts/factory/ & proxy/)
- **TREXFactory.sol**: Deploys full T-REX suites in one transaction, auto-creating ONCHAINIDs. Requires Identity Factory address (breaking change in v4.1.0).
- **TREXGateway.sol**: Centralized entrypoint for fee-managed deployments, deployer whitelisting, and public toggles.
- Proxies: ERC-1967 compliant, with AbstractProxy handling delegate calls. Storage slot updated in v4.1.3 to avoid explorer conflicts.

#### Roles (contracts/roles/)
- AgentRole.sol: RBAC for token agents (e.g., transfer agents). Upgradeable variant for proxies.

### Testing and Deployment
The test/ directory uses Chai/Mocha via Hardhat, with 100%+ coverage targeted. Fixtures (e.g., deploy-full-suite.fixture.ts) simulate end-to-end deployments. Scripts like flatten.js aid in ABI generation for verifiers.

| Test Category | Files | Focus Areas |
|---------------|-------|-------------|
| **Core Components** | agentRole.test.ts, compliance.test.ts | Role assignment, transfer validations |
| **Factory/Gateway** | factory.test.ts, gateway.test.ts | Deployment flows, fee calculations |
| **Registries** | claim-topics-registry.test.ts, etc. | Verification logic, gas optimizations |
| **Token** | token-transfer.test.ts, etc. | Mint/burn, recovery, info queries |
| **Fixtures** | deploy-*.fixture.ts | Suite setups for integration |

CI/CD via GitHub Actions enforces linting (Solhint for Solidity, ESLint for TS) and automated testing on PRs.

### Changelog Highlights
The CHANGELOG.md tracks evolution from v4.0.0 (modular overhaul, audited by Hacken) to v4.1.6 (batch limits, token listing restrictions). Notable updates:
- **v4.1.6**: Time transfer limits, token whitelisting/blacklisting modules; commercial licensing for IP modules.
- **v4.1.4**: ERC-1967 upgradeability for modules via AbstractModuleUpgradeable.
- **v4.1.0**: Breaking changes (e.g., factory requires ID factory); new modules like SupplyLimit, MaxBalance, TransferFees.
- **v4.0.0**: Modular compliance, factory deployment; removed redundant functions for interface coherence.

Earlier versions (pre-v4) focused on legacy compliance and storage mappings.

### Contribution and Licensing
**CONTRIBUTING.md** outlines GitHub Flow: Fork, branch from main, add tests, lint (Solhint/ESLint), use Gitmoji for commits. Bug reports require reproduction steps and expected vs. actual behavior.

**LICENSE.md** is the full GNU GPL v3.0 text, emphasizing copyleft: Derivatives must be open-sourced under GPL. No warranties; contributions imply GPL acceptance. Key sections include freedoms to run/modify/distribute, with anti-tivoization clauses for hardware.

### Documentation and External Resources
The whitepaper (TREX-WhitePaper.pdf) details the protocol's architecture, though text extraction is limited— it covers pillars like ONCHAINID and validators, with diagrams in img/. For function-level specs, see [Tokeny Docs](https://docs.tokeny.com/docs/smart-contracts), which describe:
- **ONCHAINID**: Claim addition/verification per ERC-735.
- **Transfer Manager**: Pre/post-transfer hooks.
- **Rules**: Investor caps, distribution limits.

The repo links to EIP-3643 and Tokeny's site for deeper dives.

This repository stands as a mature, compliant foundation for tokenized assets, balancing innovation with regulatory needs. Developers should audit integrations, especially proxies, for chain-specific behaviors.

## Key Citations
- [GitHub Repository Overview](https://github.com/ERC-3643/ERC-3643)
- [T-REX Documentation](https://docs.tokeny.com/docs/smart-contracts)
- [EIP-3643 Standard](https://eips.ethereum.org/EIPS/eip-3643)
- [Hacken Audit Report](https://tokeny.com/hacken-grants-tokenization-protocol-erc3643-a-10-10-security-audit-score/)
