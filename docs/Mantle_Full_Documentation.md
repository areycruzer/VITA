# Mantle Full Documentation (A to Z)

Compiled on: 2026-01-01

---

## Source: index

# Overviews | Network

Mantle Network is an EVM-compatible scaling solution for Ethereum built as a **ZK Validity Layer 2 (L2)**. All contracts and tools that run on Ethereum can be used on Mantle with minimal modification. Leveraging its modular architecture, Mantle separates execution, data availability, proof generation, and settlement into independent modules. Mantle now uses **ZK validity proofs** together with innovative data availability solutions to provide lower-cost and more accessible data availability while fully inheriting Ethereum’s security guarantees.

Our protocol design philosophy aims to offer users a less costly and more user-friendly experience, provide developers with a simpler and more flexible development environment, and deliver a comprehensive set of infrastructure for the next wave of mass-adopted dApps.

## Key Features of Mantle Network

* **Built as a Rollup**
  * Utilizes Ethereum validators and consensus protocols to significantly reduce gas fees, decrease latency, and increase throughput. Users can customize transaction confirmation requirements to provide near real-time confirmation latency with minimal security settings.
* **Modular Architecture**
  * Unlike traditional monolithic chains that execute transaction execution, consensus, settlement, and storage at the same network layer, Mantle separates these functions into individual modules as a modular chain. These include an EVM-compatible execution layer developed by Mantle for transaction execution, a consensus layer and settlement layer completed on Ethereum, and an external DA component.
* **Secured by Ethereum**
  * All L2 state transitions must pass through Ethereum’s verification process via **ZK validity proofs**, ensuring that only mathematically correct state roots are finalized. Once verified by the Ethereum settlement contract, the batch achieves immediate finality without requiring any challenge period.
* **Modular Data Availability**
  * Independent DA modules, such as EigenDA technology. According to internal assessments, this translates to potential cost savings of more than **90%** compared to on-chain L1.


---

## Source: network / introduction / updated-notices

# Updated Notices

- [Limb Upgrade: Ensuring Mantle’s Compatibility with Fusaka](/network/introduction/updated-notices/limb-upgrade-ensuring-mantles-compatibility-with-fusaka.md)
- [Mantle OP Succinct Mainnet Upgrade & Withdrawal Period Transition](/network/introduction/updated-notices/mantle-op-succinct-mainnet-upgrade-and-withdrawal-period-transition.md)
- [Mantle Network Mainnet v2 Everest Upgrade](/network/introduction/updated-notices/mantle-network-mainnet-v2-everest-upgrade.md)
- [EigenDA Migration for Mantle Sepolia](/network/introduction/updated-notices/eigenda-migration-for-mantle-sepolia.md)
- [Mantle Network Mainnet v2 Tectonic Upgrade Guide](/network/introduction/updated-notices/mantle-network-mainnet-v2-tectonic-upgrade-guide.md)


---

## Source: network / introduction / updated-notices / eigenda-migration-for-mantle-sepolia

# EigenDA Migration for Mantle Sepolia

{% hint style="info" %}
This hardfork upgrade is currently only happening on the Mantle Sepolia test network.
{% endhint %}

Welcome to the upgrade guide for migrating your node and applications from v1.0.0 to v1.0.1. Below, we provide tailored instructions for different user roles to ensure a smooth upgrade process.

## What's New in This Upgrade?[​](https://docs-v2.mantle.xyz/intro/migration-guides-sepolia#whats-new-in-this-upgrade) <a href="#whats-new-in-this-upgrade" id="whats-new-in-this-upgrade"></a>

In this hardfork upgrade we will include the following upgrades:

* **Migrate Mantle DA to EigenDA** - With the launch of EigenDA, we will switch Mantle DA powered by EigenDA to EigenDA for a better and more stable DA service!
* **Fix some bugs of MetaTX service** - MetaTX, as a gasless service for Mantle, was found to have a few bugs, which we've modified.

## For Node Operators[​](https://docs-v2.mantle.xyz/intro/migration-guides-sepolia#for-node-operators) <a href="#for-node-operators" id="for-node-operators"></a>

**Node operators should restart their nodes using the new version of Mantle v2 Tectonic (v1.0.1).** Please follow the node running [tutorial](https://docs.mantle.xyz/network/for-node-operators/deployment-guides/testnet-v1.4.1/deploying-a-sepolia-rollup-verifier-replica-node-from-docker) we provide, which contains the running environment requirements and the corresponding steps.

[Changelogs](https://docs.mantle.xyz/network/for-node-operators/network-updates/changelogs/mantle-v2-v1.0.2) corresponding to this hardfork upgrade is available, detailing changes and new features. Review these changelogs to understand post-upgrade alterations and optimizations.

## For Developers[​](https://docs-v2.mantle.xyz/intro/migration-guides-sepolia#for-developers) <a href="#for-developers" id="for-developers"></a>

In this upgrade, we have addressed and optimized a series of bugs and issues that were occurring with the MetaTX service. These improvements are aimed at enhancing the overall stability and performance of MetaTX, ensuring a smoother and more reliable experience for developers utilizing this service.

***

While upgrade operations may cause temporary inconvenience, we believe that with your support and cooperation, we can smoothly finish this upgrade.

If you have any questions or need further assistance regarding to this upgrade, feel free to contact our support team.

Happy upgrading! 🎉🎉🎉


---

## Source: network / introduction / updated-notices / limb-upgrade-ensuring-mantles-compatibility-with-fusaka

# Limb Upgrade: Ensuring Mantle’s Compatibility with Fusaka

### Overview

Mantle Network will complete the **Limb Upgrade** on Sepolia.\
This upgrade ensures full compatibility and stable operation as Ethereum approaches the **Fusaka hard fork**, which includes PeerDAS and the Osaka EVM changes.\
The upgrade will not affect normal user activity and will not modify the network’s economic model.

### Purpose of the Upgrade

Fusaka is a major upcoming Ethereum release introducing deep protocol-level changes across the data availability pipeline, the EVM instruction set, and precompiled contracts. For example, **Peer Data Availability Sampling (PeerDAS)** will become a foundational component of Ethereum’s long-term scalability roadmap, and the newly introduced **CellProofs Blob** format will become the default structure for blob submissions. At the same time, the full set of **Osaka-era EVM behaviors** will be activated.

To ensure that Mantle Network continues to operate safely after Fusaka activation, the Limb Upgrade focuses on three key objectives:

1. Aligning Mantle’s execution layer with Ethereum’s latest EVM semantics.
2. Ensuring the new blob submission and verification flow functions correctly within the rollup architecture.
3. Establishing forward compatibility with the PeerDAS-based data availability pathway.

### What’s New in This Upgrade?

The Limb Upgrade primarily introduces **low-level compatibility updates**. While these changes do not alter developer-facing APIs or smart-contract execution semantics, they are critical for long-term stability.

#### Osaka EVM Compatibility

Mantle’s execution layer will fully support the **Osaka EVM**.\
This includes activation of all EVM behaviors shipped with Ethereum’s Osaka spec, such as:

* New opcodes (e.g., **CLZ** from EIP-7939)
* New precompiled contracts (**EIP-7883** and **EIP-7951**)
* Gas schedule adjustments and EVM logic refinements

#### Updated Blob Handling

The upgrade introduces support for Ethereum’s Fusaka-era **CellProofs-based blob format**.\
Ethereum is migrating from the previous blob structure to a new format designed for PeerDAS sampling. Mantle’s batcher, node derivation pipeline, and Beacon RPC query logic have all been updated accordingly, ensuring that after Fusaka activation, Mantle can continue to reliably read and verify blob data from L1.

#### ZKP Pipeline Alignment

Changes to the blob structure and submission process also require updates in the ZKP pipeline (kona / succinct).\
The goal is to ensure that Mantle’s L2 Output proofs continue to be valid, robust, and compatible with the new data paths, while establishing a foundation for future optimizations in proof generation.

### Impact Assessment

This upgrade has **no impact** on regular users, DApps, or on-chain asset operations.\
It does **not** introduce any modifications to the fee mechanism or protocol economics.

For developers, all application-layer interfaces and contract environments remain fully unchanged — no migration or adaptation is required.

Node operators are the primary group that must pay attention to the upgrade window. They must ensure that all relevant components are updated during the transition to maintain correct node synchronization and interaction with Ethereum L1. Further details are available [here](https://docs.mantle.xyz/network/for-node-operators/network-updates/changelogs/mantle-v2-v1.4.1-limb-upgrade-sepolia).

### Summary

The Limb Upgrade is a critical preparation step for Mantle Network ahead of Ethereum’s Fusaka era.\
After the upgrade, Mantle will:

* Support the new blob submission structure, enabling lower rollup costs
* Benefit directly from PeerDAS improvements on Ethereum L1
* Achieve complete Osaka EVM compatibility

The Mantle team will continue to monitor network conditions and provide updates to the community before and after the upgrade.


---

## Source: network / introduction / updated-notices / mantle-network-mainnet-v2-everest-upgrade

# Mantle Network Mainnet v2 Everest Upgrade

After more than one year of stable operation of Mantle Tectonic, we proudly present the **Everest Upgrade**—a significant leap forward for the Mantle network. This upgrade not only strengthens our existing infrastructure but also prepares us fully for the upcoming **Ethereum Pectra Upgrade**, ensuring seamless compatibility with the Mantle network and laying a solid foundation for future development. As one of the core highlights of the Everest Upgrade, the official launch of **EigenDA** will introduce a revolutionary data availability solution to the network, significantly enhancing the efficiency of data management and security.

## Enhancements in Mantle v2 Everest Compared to Mantle v2 Tectonic <a href="#enhancements-in-mantle-v2-tectonic-compared-to-mantle-v1" id="enhancements-in-mantle-v2-tectonic-compared-to-mantle-v1"></a>

### EigenDA Integration

Mantle has maintained deep collaboration with EigenDA. Before EigenDA's mainnet launch, Mantle used Mantle DA (a third-party DA Layer powered by EigenDA) as its DA Layer. Therefore, when EigenDA went live, we immediately completed the migration on testnet and, after production environment testing, finally migrated on Mantle mainnet. For detailed information about EigenDA, please check [here](https://docs.mantle.xyz/network/system-information/off-chain-system/eigenda).

### L2 Adaptation for Ethereum Pectra Upgrade

Ethereum is about to welcome the highly anticipated Pectra upgrade. As an Ethereum L2, Mantle immediately began adaptation work for the changes brought by the Pectra upgrade, including the new `RequestsHash` field in block headers from EIP-7685, and the new `SetCodeTx` transaction type introduced in EIP-7702.

### New Feature Introduction

Since building on OP Stack Bedrock, Mantle has been committed to enhancing op-geth's functionality through extensibility development. In this upgrade, new RIP-7212 precompiled contract support was introduced, along with the addition of the `eth_getBlockReceipts` jsonRPC interface.

### MetaTX Feature Deprecation

MetaTX, independently developed by Mantle, provided gas fee sponsorship functionality, aiming to minimize barriers for users entering the Mantle ecosystem. With the introduction of EIP-7702 in the Ethereum Pectra upgrade, Mantle will provide the same gas fee sponsorship functionality based on it, therefore MetaTX will no longer be supported.[​](https://docs-v2.mantle.xyz/intro/whats-new-in-mantle-v2#enhancements-in-mantle-v2-tectonic-compared-to-mantle-v1)

[​](https://docs-v2.mantle.xyz/intro/whats-new-in-mantle-v2#distinctions-between-mantle-v2-tectonic-and-op-stack-bedrock)


---

## Source: network / introduction / updated-notices / mantle-network-mainnet-v2-tectonic-upgrade-guide

# Mantle Network Mainnet v2 Tectonic Upgrade Guide

Welcome to the upgrade guide for migrating your node and applications from Mantle Network Mainnet Alpha v1 (Mantle v1) to Mantle Network Mainnet v2 Tectonic (Mantle v2 Tectonic). Below, we provide tailored instructions for different user roles to ensure a smooth upgrade process.

## For Node Operators[​](https://docs-v2.mantle.xyz/intro/migration-guides#for-node-operators) <a href="#for-node-operators" id="for-node-operators"></a>

**Node operators should restart their nodes using the new version of Mantle v2 Tectonic.** Please follow the node running [tutorial](https://docs.mantle.xyz/network/for-node-operators/deployment-guides/mainnet-v1.4.2/deploying-a-rollup-verifier-replica-node-from-docker) we provide, which contains the running environment requirements and the corresponding steps.

[Changelogs](https://docs.mantle.xyz/network/for-node-operators/network-updates/changelogs/mantle-v2-v1.0.0) corresponding to Mantle v2 Tectonic versions are available, detailing changes and new features. Review these changelogs to understand post-upgrade alterations and optimizations.

## For Developers[​](https://docs-v2.mantle.xyz/intro/migration-guides#for-developers) <a href="#for-developers" id="for-developers"></a>

**Developers should ensure your contracts adapt to new features and updates introduced in Mantle v2 Tectonic, such as** [**gas estimation**](https://docs.mantle.xyz/network/system-information/fee-mechanism/estimate-fees#why-we-need-to-use-estimategas)**.** Mantle v2 Tectonic supports multiple contract deployment tools, for more information please check [here](https://docs.mantle.xyz/network/for-developers/how-to-guides/how-to-deploy-smart-contracts).

{% hint style="info" %}

* Mantle v2 has modified and optimized fee mechanisms. When constructing transactions, remember to call the `estimateGas` interface to ensure your transactions execute smoothly and receive appropriate fees. More details [here](https://docs.mantle.xyz/network/system-information/fee-mechanism/estimate-fees).
* Our Goerli testnet has been upgraded to Mantle v2 Tectonic. Developers are advised to check the status of your contracts on this testnet. If any issues arise, it's essential to address and fix them to avoid potential problems on the mainnet and redeploy your contracts.
* Mantle v2 Tectonic introduces a new fee collection which will minimize your transaction fees, for information on optimizing gas fees, please check [here](https://docs.mantle.xyz/network/for-developers/optimize-your-transaction-fees).
  {% endhint %}

## For Users[​](https://docs-v2.mantle.xyz/intro/migration-guides#for-users) <a href="#for-users" id="for-users"></a>

**Users should suspend the use of on-chain products related to Mantle Netork during the upgrade process to avoid assets loss.** For the new features of Mantle v2, please check [here](https://docs.mantle.xyz/network/introduction/whats-new-in-mantle-v2-skadi).

#### Bridge Assets[​](https://docs-v2.mantle.xyz/intro/migration-guides#bridge-assets) <a href="#bridge-assets" id="bridge-assets"></a>

During the upgrade process, we will suspend the use of the bridge, so after the upgrade, you may face the following issues:

* If you have already applied to withdraw your assets on the mainnet and have completed the 7-days challenge period before the upgrade, please withdraw as soon as possible.
* If you haven't withdrawn your assets before the upgrade (no matter if you have completed your challenge period), you will need to prove your withdraw request after the upgrade and then wait for another 7 days.

{% hint style="info" %}

* In Mantle v2 Tectonic, if you need to withdraw your assets via bridge, we have introduced a new two-step withdrawal process. Before entering the 7-days challenge period, you will also need to perform the "prove" operation. For more details, please refer to [this](https://docs.mantle.xyz/network/for-users/how-to-guides/using-mantle-bridge#withdraw-mnt).
* If you want to experience the ultimate trading experience and low transaction fees on Mantle v2 Tectonic, please configure your wallet, for more information please check [here](https://docs.mantle.xyz/network/for-users/how-to-guides/connecting-wallet-to-mantle-network)!
  {% endhint %}

While upgrade operations may cause temporary inconvenience, we believe that with your support and cooperation, we can smoothly transition from Mantle v1 to v2.

If you have any questions or need further assistance regarding Mantle v2 Tectonic, feel free to contact our support team.

Happy upgrading! 🎉🎉🎉


---

## Source: network / introduction / updated-notices / mantle-op-succinct-mainnet-upgrade-and-withdrawal-period-transition

# Mantle OP Succinct Mainnet Upgrade & Withdrawal Period Transition

Mantle is excited to announce our upcoming mainnet upgrade to **OP Succinct**, scheduled to begin on **September 16, 2025**.This upgrade is a monumental step, transitioning Mantle into the largest ZK validity Layer 2 in the ecosystem. By integrating ZK proofs for state validation, we are enhancing security and fundamentally improving the user experience.During this upgrade, we will be deploying essential contract updates. The most significant impact on users will be a dramatic improvement to the Mantle Canonical Bridge withdrawal process.To ensure transparency and prevent confusion during this transition, please review how withdrawals will be handled.

## **The Key Change: From a 7-Day to a 12-Hour Withdrawal**

Previously, as an Optimistic L2, Mantle required a 7-day "challenge period" for all withdrawals via the canonical bridge. This delay is the standard security mechanism for all Optimistic rollups, allowing time for network observers to challenge potentially fraudulent state transitions.With the move to ZK validity, the network’s state is confirmed by cryptographic proofs rather than relying on a challenge window. This allows us to **reduce the withdrawal finalization period from 7 days to just 1 2hours.**&#x48;owever, this change requires a specific transition period to safely finalize the old system and activate the new one.

{% hint style="success" %}
**Why do we choose 12 hours?**

Security Rationale for the 12-Hour Challenge Period While a ZK-proof system theoretically allows for a much shorter challenge period, setting it to 12 hours is a deliberate security measure. This duration serves as a critical safety buffer for the official bridge. In an extreme security event, such as a hack, this window provides the team with the necessary time to respond and mitigate risks, thereby providing maximum protection for user assets.
{% endhint %}

## **The Transition Timeline Explained**

<figure><img src="https://3885809119-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQliZlRNwHhmzesDU1Ksq%2Fuploads%2FQlAM95Fpj3vNhmRKUOQ6%2Fimage.png?alt=media&#x26;token=f19dbcc5-5de8-45c5-a243-cb8e26847cc0" alt=""><figcaption></figcaption></figure>

The upgrade involves a multi-stage rollout. In netshell, rationale for the 7-Day Waiting Period Prior to the ZK Proposer launch, L2 state outputs were submitted using a non-ZK method. According to the security model, these historical outputs must complete their original 7-day challenge period to guarantee their finality and security. Therefore, the parameter update will be executed 7 days after the ZK Proposer is live to ensure all data submitted via the non-ZK method has been securely finalized.Here is the precise schedule and what users initiating withdrawals should expect:

1. **Phase 1: ZK Proofs Begin (After Sep 16, 2025 \~15:00 UTC\*)** Starting on September 16, all new state roots on Mantle will be submitted and verified using ZK proofs.
2. **Phase 2: The Transition Window (Sep 16 – Sep 23)** During this one-week transition window, although new state roots are ZK-proven, the original 7-day challenge period logic will **remain active** in the bridge contracts. This is necessary to securely finalize any remaining state from the Optimistic system.
3. **Phase 3: The New Standard (After Sep 23, 2025 \~15:00 UTC\*)** On September 23, the final contract upgrade activates the new 12-hour withdrawal logic. This new, shorter finalization period will apply to **all pending and all new withdrawals** moving forward.

*\*Note: 15:00 UTC (3:00 PM UTC) is used as the target activation time. Actual activation may vary slightly based on network conditions.*

***

## **Withdrawal Scenarios: What Will Happen to My Funds?**

To make this clear, here are practical examples covering every scenario during the upgrade.

**Scenario 1: Withdrawal initiated BEFORE the upgrade (e.g., Sep 14)**

* **Status:** Your withdrawal is already in the challenge period before the Sep 16 upgrade begins.
* **Result:** You must wait for the **full, original 7-day challenge period**. The new logic does not apply retroactively to withdrawals already finalized under the old Optimistic system.

**Scenario 2: Withdrawal initiated DURING the transition (e.g., Sep 18)**

This is the most critical scenario. You initiated your withdrawal *after* ZK proofs started, but *before* the 12-hour rule was activated.

* **What you see (Sep 18 – Sep 23):** Your withdrawal will enter the legacy 7-day challenge period. The UI will show a 7-day countdown (e.g., "6 days remaining," "5 days remaining," etc.).
* **What happens (On Sep 23, \~15:00 UTC):** The new 12-hour logic is applied to **all** pending withdrawals. Since your wait time (from Sep 18 to Sep 23) is already much longer than 12 hours, your withdrawal will become **immediately claimable** the moment the Sep 23 upgrade is finalized.

**Scenario 3: Withdrawal initiated JUST BEFORE the final activation (e.g., Sep 23 at 14:00 UTC)**

You initiate a withdrawal just one hour before the final upgrade activates.

* **What you see (14:00 – 14:59 UTC):** The UI will temporarily show the legacy 7-day challenge period.
* **What happens (After 15:00 UTC):** The new 12-hour rule activates. The system recalculates your requirement. Since you have already waited 1 hour (from 14:00 to 15:00), your withdrawal timer will automatically update to show only **11 hours remaining**.

Thank you for your patience and support as we complete this landmark upgrade. We are thrilled to deliver the next generation of scaling with the security of ZK validity and a vastly superior bridge experience.<br>


---

## Source: network / introduction / whats-new-in-mantle-v2-skadi

# What's New in Mantle v2 Skadi

The Skadi Upgrade represents a key advancement for the Mantle Network, building on the stable foundation of previous releases to align with the latest Ethereum developments. This upgrade primarily focuses on enabling full support for the Ethereum Prague upgrade (part of the broader Pectra roadmap), introducing optimizations for transaction fee suggestions, and enhancing proof generation capabilities. By incorporating these changes, Mantle continues to improve network efficiency, security, and compatibility with Ethereum's evolving standards.

### Enhancements in Mantle v2 Skadi (v1.3.2) Compared to Previous Versions

This section outlines the key improvements and new features in the Skadi Upgrade, drawing from updates in op-geth v1.3.2 and mantle-v2 v1.3.2. These enhancements ensure Mantle remains at the forefront of Layer 2 scalability while preparing for future Ethereum upgrades.

#### L2 Adaptation for Ethereum Prague Upgrade

Mantle has adapted its Layer 2 infrastructure to fully support the Ethereum Prague upgrade, incorporating several Ethereum Improvement Proposals (EIPs) that introduce new opcodes, transaction types, and system-level optimizations. These changes reduce gas costs, enhance smart contract functionality, and improve overall network performance.Key EIPs integrated:

* **EIP-1153**: Introduces the `TSTORE` and `TLOAD` opcodes, which lower the gas cost for temporary data storage in smart contracts by enabling transient storage.
* **EIP-5656**: Adds the `MCOPY` opcode to optimize memory data copying operations within smart contracts, improving efficiency for data-heavy applications.
* **EIP-6780**: Modifies the behavior of the `SELFDESTRUCT` opcode to enhance security and predictability in contract lifecycle management.
* **EIP-7702**: Supports the new `SetCodeTx` transaction type, allowing for dynamic code updates in accounts and enabling advanced account abstraction features.
* **EIP-2935**: Implements a system contract to store the most recent 8,191 historical block hashes, facilitating better access to historical data for verification and applications.

These adaptations ensure seamless compatibility with the Ethereum Pectra upgrade, allowing Mantle users and developers to leverage the latest Ethereum features without disruption.

#### Adjustments to `eth_maxPriorityFeePerGas` Logic

A significant update in this release modifies the eth\_maxPriorityFeePerGas RPC method to provide more dynamic and accurate fee suggestions based on network conditions. Previously, this method returned a fixed value of zero, which could lead to suboptimal transaction prioritization. Now, it calculates a suggested priority fee dynamically, aligning Mantle's behavior more closely with Ethereum and Optimism standards.These adjustments help users submit transactions with appropriate fees during varying levels of network congestion, improving transaction inclusion rates and user experience.

#### New API for Faster ZKP Proof Generation

To enhance the efficiency of zero-knowledge proof (ZKP) generation, a new JSON-RPC API endpoint, `optimism_safeHeadAtL1Block`, has been added to the op-node. This API allows developers to query the safe head state at a specific Ethereum L1 block, enabling quicker generation of succinct ZKPs for cross-layer verifications and applications.This feature is particularly beneficial for dApps and services relying on fast proof computation, and Mantle will support zkp-based state transition on the mainnet very soon.<br>


---

## Source: network / system-information / architecture

# Architecture

## Architecture Overviews[​](https://docs-v2.mantle.xyz/intro/system-components/architecture#architecture-overviews) <a href="#architecture-overviews" id="architecture-overviews"></a>

<figure><img src="https://3885809119-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQliZlRNwHhmzesDU1Ksq%2Fuploads%2FwUP53PKifXzbJSxUNEB1%2Fimage.png?alt=media&#x26;token=530252a2-88d1-44a8-8326-7922b2dc6a57" alt=""><figcaption></figcaption></figure>

This diagram illustrates how different network modules interact in Mantle v2 Skadi after the upgrade to **ZK Validity Proofs**. It shows how the execution layer, ZK proving module, and EigenDA collaborate to process transactions, store rollup data, generate validity proofs, and publish verified state updates to Ethereum L1.

Let's review the end-to-end transaction processing pipeline to understand how each module participates in Mantle’s architecture.

1. Users send signed transactions to Mantle through RPC nodes, which forward them to the sequencer for processing.
2. The sequencer orders incoming transactions and produces L2 blocks. The **op-batcher** collects batches of L2 blocks at regular intervals (\~7 minutes), encodes and compresses them, and publishes the batch to **EigenDA**. After submitting the batch to EigenDA, the batcher posts the corresponding **commitment** to Ethereum L1, which becomes the canonical data reference for later ZK proving.
3. The **`Mantle-Succinct-Proposer`** periodically submits Mantle’s **ZK validity proofs** to the `MantleSuccinctL2OutputOracle` contract on Ethereum L1.
4. Rollup transaction data is stored on EigenDA and acts as the public data source for ZK proving.

{% hint style="info" %}
If you would like to learn more about on-chain and off-chain design in the Mantle Network, check out the [**on-chain system**](https://docs.mantle.xyz/network/system-information/on-chain-system) and [**off-chain system**](https://docs.mantle.xyz/network/system-information/off-chain-system) pages!
{% endhint %}

## Transaction Pool in Mantle[​](https://docs-v2.mantle.xyz/devs/concepts/tx-lifecycle#transaction-pool-in-mantle) <a href="#transaction-pool-in-mantle" id="transaction-pool-in-mantle"></a>

In Mantle v2, a transaction pool structure similar to Ethereum's mempool is introduced for the temporary storage of transactions until they are included in a block. The introduction of the transaction pool in L2 is aimed at improving transaction packing. With Mantle v2 Tectonic's support for [EIP-1559 transaction types](https://docs.mantle.xyz/network/more/glossary#eip-1559-transaction), users can control the transaction packing speed by manipulating the priority fee in transactions. The transaction pool is used to temporarily store those unpacked transactions.

However, the introduction of the transaction pool also brings certain challenges, such as the impact of Miner Extractable Value (MEV). Therefore, in Mantle v2 Tectonic, the tx pool is designed to be private. If you want to submit a transaction, you need to configure [`op-geth`](https://docs.mantle.xyz/network/off-chain-system/node-introduction#op-geth) to send the transaction to the sequencer. The sequencer will then process transactions in the transaction pool in the order of their base fee and priority fee.


---

## Source: network / system-information / fee-mechanism

# Fee Mechanism

## Understanding Fee Basics on Mantle Network[​](https://docs-v2.mantle.xyz/devs/concepts/tx-fee/overviews#understanding-fee-basics-on-mantle-network) <a href="#understanding-fee-basics-on-mantle-network" id="understanding-fee-basics-on-mantle-network"></a>

Transaction fees on Mantle network are similar to those on Ethereum. However, as Mantle Network operates as a layer 2 (L2) blockchain, there are new paradigms in the fee structure that distinguish it from Ethereum's fees.

As Mantle Network continuously enhances its EVM compatibility, dApps can conveniently adapt to any changes with minimal modifications. Let's explore the two sources of transaction costs on Mantle:

1. [**L2 Execution Fee**](#the-l2-execution-fee)
   * Cost of executing transactions on L2
2. [**L1 Rollup Fee**](#the-l1-rollup-fee)
   * Cost of submitting rollup state root to L1 (distributed equally among users whose transactions are included in the batch)
   * Write data credentials submitted to the DA contract on L1

### The L2 Execution Fee[​](https://docs-v2.mantle.xyz/devs/concepts/tx-fee/overviews#the-l2-execution-fee) <a href="#the-l2-execution-fee" id="the-l2-execution-fee"></a>

Similar to Ethereum, transactions on Mantle Network must pay the gas fee for the computational and storage resources used. Each L2 transaction incurs some execution fees, calculated as the product of the gas used and the gas price associated with the transaction.

Mathematically, this is represented as:

$$
L2ExecutionFee=L2GasPrice∗L2GasUsed
$$

This fee reflects the computational and execution costs of completing transactions on the L2 network. The L2 execution fee paid by users is directly proportional to the computational and network resources consumed by their transactions.

### The L1 Rollup Fee[​](https://docs-v2.mantle.xyz/devs/concepts/tx-fee/overviews#the-l1-rollup-fee) <a href="#the-l1-rollup-fee" id="the-l1-rollup-fee"></a>

All state roots generated on L2 due to transaction execution are published to Ethereum. This step is crucial for the security properties of L2, ensuring that all the latest block data from the L2 network is consistently available on Ethereum L1 for sync nodes.

L2 aggregates states and essential transaction data into batches, publishing them to Ethereum, with the cost distributed among users whose transactions are included in the batch. The L1 rollup Fee is calculated based on factors such as:

* The current gas price on Ethereum
* A fixed `overhead` (a fixed cost for committing data to L1, auto-adjusted and set into gas oracle)
* The scaling factor `scalar`
* Parameters related to the size of the transaction are stored as calldata in L1 called `rollupDataGas`

{% hint style="info" %}
Values such as `overhead` and `scalar` can be obtained through the [`BVM_GasPriceOracle`](https://docs.mantle.xyz/network/system-information/off-chain-system/key-l2-contract-address) contract or [`SystemConfigProxy`](https://docs.mantle.xyz/network/system-information/off-chain-system/key-l2-contract-address) contract.

**We highly recommend fetching the `overhead` and `scalar` from the** [**`BVM_GasPriceOracle`**](https://docs.mantle.xyz/network/system-information/off-chain-system/key-l2-contract-address) **contract.** L1 Contracts may be subject to update delays.
{% endhint %}

Mathematically, this is represented as:

$$
L1RollupFee=(rollupDataGas+overhead)∗L1gasPrice∗scalar
$$

This fee covers the computational costs of integrating and submitting transaction batches from L2 to L1, including the gas needed for data storage and additional overhead. The L1 rollup fee is a crucial component ensuring the overall system's secure operation and also affects the overall transaction costs.

{% hint style="info" %}
For a more in-depth understanding, it is highly recommended to read the Mantle research team's study on fees in Rollups: [Transaction Fees on Rollups](https://www.mantle.xyz/blog/research/transaction-fees-on-rollups)
{% endhint %}

## Understanding Fees on Mantle v2[​](https://docs-v2.mantle.xyz/devs/concepts/tx-fee/overviews#understanding-fees-on-mantle-v2-tectonic) <a href="#understanding-fees-on-mantle-v2-tectonic" id="understanding-fees-on-mantle-v2-tectonic"></a>

In Mantle v2, the introduction of Mantle's native token design incorporates a [`tokenRatio`](#control-of-tokenratio) parameter to adjust the fee:

$$
L2ExecutionFee=L2gasPrice∗L2gasUsed∗tokenRatio
$$

$$
L1RollupFee=(rollupDataGas+overhead)∗L1gasPrice∗tokenRatio∗scalar
$$

### L2 Execution Fee in Mantle v2[​](https://docs-v2.mantle.xyz/devs/concepts/tx-fee/overviews#l2-execution-fee-in-mantle-v2-tectonic) <a href="#l2-execution-fee-in-mantle-v2-tectonic" id="l2-execution-fee-in-mantle-v2-tectonic"></a>

The size of the L2 Execution Fee is primarily influenced by two key factors that directly shape the cost of executing transactions on L2.

$$
L2ExecutionFee=L2gasPrice∗L2gasUsed∗tokenRatio
$$

Let's delve into these factors:

#### **L2 gasUsed - Complexity of Transaction Execution**[**​**](https://docs-v2.mantle.xyz/devs/concepts/tx-fee/overviews#l2-gasused---complexity-of-transaction-execution)

L2 gasUsed is the amount of gas consumed to execute a transaction on layer 2. This value is directly related to the complexity of the transaction and reflects the amount of work involved in executing the contract, computing, and processing the data. As a result, more complex transactions typically require more gas to complete, directly affecting the size of the L2 execution fee. This factor ensures that the transaction fee is proportional to the actual computational resources used.

#### **L2 gasPrice - Depends on the transaction type**[**​**](https://docs-v2.mantle.xyz/devs/concepts/tx-fee/overviews#l2-gasprice---depends-on-the-transaction-type)

L2 gasPrice is the unit price of gas used on L2, which depends on the specific transaction type chosen. L2 gasPrice is calculated differently for different transaction types:

* **For** [**EIP-1559 transaction types**](https://docs.mantle.xyz/network/more/glossary#eip-1559-transaction), L2 gasPrice is affected by the `GasTipCap` parameter, which is a parameter that is issued as a reward to sequencers and can be set to `0` by the user and does not affect the packing of transactions.
* **For** [**legacy transaction types**](https://docs.mantle.xyz/network/more/glossary#legacy-transaction), `GasTipCap` takes the default value (0.1 GWEI). In this case, `eth_gasPrice` is equal to the sum of `GasTipCap` and `BASEFEE`. This mechanism ensures the relative stability of the transaction costs, while providing the user with default values and simplifying the setup of the transaction parameters.

Due to EVM compatibility, transactions on Mantle Network generally have similar `gasUsed` to Ethereum. Gas prices fluctuate with time and congestion, but you can always check the current estimated L2 Gas prices on the public Mantle dashboard. Moreover, as gas fees on Mantle Network are denominated in `$MNT`, transaction costs remain significantly lower than other L2 networks using $ETH as the gas token, even at the same gas price.

{% hint style="info" %}
The ordering of transactions is influenced by various factors. Here are examples illustrating the role of `GasTipCap` and transaction submission order:

1. Suppose Alice initiates a Legacy-type transfer transaction `tx_A`, followed by Bob initiating another Legacy-type transfer transaction `tx_B`. Since `tx_B` comes after `tx_A`, their order follows the First come first serve (FCFS) principle.
2. Suppose Alice initiates an EIP-1559-type transfer transaction `tx_A` and, before it is packed, initiates another `tx_B` with a higher Priority Fee (GasTipCap) than `tx_A`. Due to nonce conflict, the Sequencer rejects `tx_A` with the lower GasTipCap and prioritizes packing `tx_B`.
   {% endhint %}

### L1 Rollup Fee in Mantle v2[​](https://docs-v2.mantle.xyz/devs/concepts/tx-fee/overviews#l1-rollup-fee-in-mantle-v2-tectonic) <a href="#l1-rollup-fee-in-mantle-v2-tectonic" id="l1-rollup-fee-in-mantle-v2-tectonic"></a>

Since the cost of transaction on L1 is much higher than that of transaction on L2, this is the largest part of the total transaction cost, and calculating the cost of L1 is a complex task due to the volatility of gasPrice in L1.

$$
L1RollupFee=(rollupDataGas+overhead)∗L1gasPrice∗tokenRatio∗scalar
$$

Let's delve into these factors:

#### **`rollupDataGas`Calculation**[**​**](https://docs-v2.mantle.xyz/devs/concepts/tx-fee/overviews#rollupdatagas-calculation)

The major portion of the L1 gas fee is `rollupDataGas`, which relates to the size of the transaction stored as calldata in L1, and typically accounts for more than 85% of the L1 GasUsed.

Mantle v2 Tectonic chooses the Op Stack's rollupDataGas calculation, which counts the number of zero bytes and non-zero bytes in the transaction data, with each zero byte costing 4 Gas and each non-zero byte costing 16 Gas, thus:

$$
rollupDataGas=count\_​zero\_​bytes(tx\_​data)∗4+count\_​non\_​zero\_​bytes(tx\_​data)∗16
$$

{% hint style="info" %}
With the EigenDA module online with Mantle Mainnet, only state roots and a limited amount of necessary transaction data are sent to L1, while the transaction batch data is posted to the DA network. For dApps with high gas consumption, they can be executed at the same cost as an ordinary transaction (like a transfer), and the L1 fee will not increase with the complexity of L2 transaction execution. As a result, for transactions with high complexity, this can even save up to more than **90%** of the cost compared to the original L1 rollup fee.
{% endhint %}

#### **Fetch`overhead`and`scalar`**[**​**](https://docs-v2.mantle.xyz/devs/concepts/tx-fee/overviews#fetch-overhead-and-scalar)

`overhead` and `scalar` are currently loaded from configurations, not supporting dynamic changes, you can fetch them from the [`BVM_GasPriceOracle`](https://docs.mantle.xyz/network/system-information/off-chain-system/key-l2-contract-address) contract, while `L1gasPrice` needs to be read from L1 blocks.

#### **Control of tokenRatio**[**​**](https://docs-v2.mantle.xyz/devs/concepts/tx-fee/overviews#control-of-tokenratio)

`tokenRatio` is a parameter adjusting fees in Mantle. By obtaining prices for ETH and MNT from multiple price oracles and calculating their exchange rate (`eth_price/mnt_price`), Mantle v2 Tectonic limits the value of the current `tokenRatio` to the interval of the previous `tokenRatio` to prevent sudden and significant fluctuations in gasPrice caused by abrupt changes in the exchange rate.

Mantle v2 Tectonic introduces a [`BVM_GasPriceOracle`](https://docs.mantle.xyz/network/system-information/off-chain-system/key-l2-contract-address) contract in Layer 2 to manage permissions for setting and updating `tokenRatio`. Users with permission (a multi-signature address managed through [HSM](https://docs.mantle.xyz/network/more/glossary#hardware-security-module-hsm)) can update `tokenRatio` through an L2 transaction, dynamically adjusting gas fees.

## Fee Optimization[​](https://docs-v2.mantle.xyz/devs/concepts/tx-fee/overviews#fee-optimization) <a href="#fee-optimization" id="fee-optimization"></a>

Compared to Mantle v1, Mantle v2 Tectonic has made improvements and optimizations in fee design, including:

* **EIP-1559 Support**: Mantle v2 Tectonic will support various transaction types, including EIP-1559, freeing users from the constraints of old transaction structures. For more details, refer to [this](https://docs.mantle.xyz/network/system-information/fee-mechanism/eip-1559-support).&#x20;

{% hint style="info" %}
**We highly recommend you to set the `baseFee` to `0.02 gwei` and `priorityfee` to `0` in your L2 transaction.** Refer to [this](https://docs.mantle.xyz/network/for-developers/optimize-your-transaction-fees) for more details.
{% endhint %}

* **Fee Estimation**: The `estimateGas` API in Mantle v1 only returns the L2 gas cost, the L1 gas estimation needs to be calculated separately, while in Mantle v2 Tectonic it will support returning the total gas of the user's transaction directly. Developers also need to be mindful of the impact this optimization may have on transaction construction. For more details about how to calculate the gas fee, refer to [this](https://docs.mantle.xyz/network/system-information/fee-mechanism/estimate-fees).

### Mantle v2 Fee Showcase[​](https://docs-v2.mantle.xyz/devs/concepts/tx-fee/overviews#mantle-v2-tectonic-fee-showcase) <a href="#mantle-v2-tectonic-fee-showcase" id="mantle-v2-tectonic-fee-showcase"></a>

|                                | Mantle v2 Tectonic                                                                                         | Mantle v1 Alpha                                                                                            |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Token Transfer**             | [0.0047 MNT](https://mantlescan.xyz/tx/0xba6ed5537f2eae416e0874a98f1523c70e3087225d21a2240864e0f720136b9e) | [0.3715 MNT](https://mantlescan.xyz/tx/0xc05fe72e047b8cdfa2ea6e31c26b0940844d4d7efbaadd9ffa3b2db9db20a139) |
| **ERC-20 Contract Deployment** | [0.1088 MNT](https://mantlescan.xyz/tx/0x84c4ecb184fd198faa44fcbf57c8a0d4512c2993f2dc68d44d3cfd77595ca5b9) | [0.1304 MNT](https://mantlescan.xyz/tx/0xc4562d9622a9a5cc20a8c8aaa0df3b35e92066345835bd5fe95e94cd11fade7b) |


---

## Source: network / system-information / off-chain-system

# Off-Chain System

- [Contract Introduction](/network/system-information/off-chain-system/contract-introduction.md)
- [Node Introduction](/network/system-information/off-chain-system/node-introduction.md)
- [Key L2 Contract Address](/network/system-information/off-chain-system/key-l2-contract-address.md)
- [EigenDA](/network/system-information/off-chain-system/eigenda.md)
- [Introduction](/network/system-information/off-chain-system/eigenda/introduction.md)
- [Architecture](/network/system-information/off-chain-system/eigenda/architecture.md)
- [L1 <--> L2 Data Flow](/network/system-information/off-chain-system/eigenda/l1-less-than-greater-than-l2-data-flow.md)
- [SP1 zkVM](/network/system-information/off-chain-system/sp1-zkvm.md)
- [Introduction](/network/system-information/off-chain-system/sp1-zkvm/introduction.md)
- [SP1 Workflow](/network/system-information/off-chain-system/sp1-zkvm/sp1-workflow.md)


---

## Source: network / system-information / on-chain-system

# On-Chain System

- [Contract Introduction](/network/system-information/on-chain-system/contract-introduction.md)
- [Key L1 Contract Address](/network/system-information/on-chain-system/key-l1-contract-address.md)


---

## Source: network / system-information / risk-management

# Risk Management

Mantle Network is dedicated to providing a secure and reliable layer-2 (L2) scaling solution, with strong risk control being a crucial safeguard. In Mantle's risk analysis comprises three key aspects: **Data Availability**, **Fraud Proofs**, and **Forced Transaction Inclusion**.

## 1. Data Availability[​](https://docs-v2.mantle.xyz/intro/risk-management/overviews#1-data-availability) <a href="#id-1-data-availability" id="id-1-data-availability"></a>

Mantle Network ensures the cornerstone of system security by guaranteeing the availability of data. Through innovative data availability solutions, we ensure the secure availability of data during the process of data transfer between the L2 execution layer and layer 1 (L1). This mechanism not only enhances network stability, but also provides users and developers with a more trustworthy data guarantee.

## 2. Fraud Proofs[​](https://docs-v2.mantle.xyz/intro/risk-management/overviews#2-fraud-proofs) <a href="#id-2-fraud-proofs" id="id-2-fraud-proofs"></a>

Mantle Network addresses potential fraudulent activities by introducing the concept of [Fraud Proofs](https://docs.mantle.xyz/network/more/glossary#fraud-proof--fault-proof). Throughout the entire transaction process, the system actively monitors and verifies the consistency of data. Any attempts to tamper with or forge data are detected by the system and handled accordingly. This ensures the security and fairness of the system, providing users with a secure trading environment.

## 3. Forced Transaction Inclusion[​](https://docs-v2.mantle.xyz/intro/risk-management/overviews#3-forced-transaction-inclusion) <a href="#id-3-forced-transaction-inclusion" id="id-3-forced-transaction-inclusion"></a>

To further enhance system security, Mantle Network has designed the Forced Transaction Inclusion mechanism. In extreme situations where the system encounters insurmountable issues, the Forced Transaction Inclusion allows a quick and secure rollback to L1, ensuring the safety of user assets. This design provides the system with an emergency rescue mechanism, enabling it to confront unpredictable threats at any time.

Through these three key aspects of security assurance, Mantle Network has constructed a robust counter-risk model, offering users and developers a trustworthy L2 scaling solution and driving the healthy development of the entire decentralized ecosystem.

<br>


---

## Source: network / system-information / roadmap

# Roadmap

Mantle Network has now released Mantle Network Mainnet v2 Tectonic (Mantle v2 Tectonic), with several improvements and optimizations for Mantle Network Mainnet Alpha v1 (Mantle v1). For more information, please see the table below.

## Overviews

<figure><img src="https://3885809119-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQliZlRNwHhmzesDU1Ksq%2Fuploads%2FYWovi9AK05lytr7YGKLf%2Fimage.png?alt=media&#x26;token=a40665e9-e5bc-4129-88a3-7f19d830a590" alt=""><figcaption></figcaption></figure>

## 2025 Roadmap

{% stepper %}
{% step %}

### 2025 Q1 - Feature Rollout and Security Enhancement

Focus on rolling out previously designed features and technical advancements, improving network security, optimizing user experience, and enhancing developer support.

#### Key Tasks

* [x] **Security Enhancement**
  * Mantle Network currently utilizes Mantle DA, powered by EigenDA, as its data availability (DA) layer. With the EigenLayer mainnet going live, Mantle plans to upgrade Mantle DA to EigenDA on both the **testnet** and **mainnet** this quarter to ensure stronger DA guarantees.
* [x] **User Experience Optimization**
  * To deliver better price discovery mechanisms and a chain-agnostic user experience, Mantle Network has introduced its unique chain abstraction [solution](https://www.mantle.xyz/blog/education/unveiling-mantles-chain-abstraction). Deployment of this solution on both the **testnet** and **mainnet** is planned for this quarter.
* [x] **Developer Support**
  * Integrate highly anticipated proposals, such as [**RIP-7212**](https://github.com/ethereum/RIPs/blob/master/RIPS/rip-7212.md), into the network. These will be deployed on both the **testnet** and **mainnet** to further enhance the experience for developers working within the Mantle ecosystem.
    {% endstep %}

{% step %}

### 2025 Q2 - Supporting Ethereum Pectra Upgrade

Align with the Ethereum **Pectra Upgrade** to ensure Mantle Network remains technically synchronized with the Ethereum ecosystem.

#### Key Tasks

With the Ethereum Pectra Upgrade underway, Mantle Network will follow the Ethereum community's technical advancements and complete the following tasks:

* [x] Ensure Mantle Network supports the latest Ethereum Virtual Machine (EVM) version.
* [x] Update and optimize OP Stack as necessary.
* [x] Implement [**EIP-7702**](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7702.md) to support batching and gas sponsorship for externally owned accounts (EOA) wallets.
* [x] Finish all related code development and conduct comprehensive testing on the QA network to ensure a stable and secure network upgrade.
  {% endstep %}

{% step %}

### 2025 Q3 - Proof System Rollout and Application Exploration

Launch the testnet for zkVM-based proof systems and conduct more proof-of-concept (POC) experiments to explore multi-scenario chain abstraction applications.

#### Key Tasks

* [x] **zkVM-based Proof System**
  * Mantle Network has chosen **Succinct SP1** as the proof system, enabling fast finality. The testnet launch of this feature is scheduled for this quarter.
* [ ] **Additional POC Experiments**
  * Complete POCs for the following ZKP applications in chain abstraction:
    * [ ] **Intent Settlement Proof**: Validate efficient intent settlement mechanisms within chain abstraction.
    * [ ] **Cross-Chain Proof**: Implement multi-chain light client proof for cross-chain asset issuance, enhancing the security and transparency of cross-chain asset interactions.
      {% endstep %}

{% step %}

### 2025 Q4 - Enhancing Chain Abstraction and Developer Ecosystem

Further refine chain abstraction functionalities and drive the expansion of the developer ecosystem.

#### Key Tasks

* [ ] **Chain Abstraction Functional Validation and POCs**
  * [ ] **Optimized Path Selection**: Implement optimal path selection for multi-cross-chain bridges and decentralized exchanges (DEXs), improving the efficiency and user experience of cross-chain operations.
  * [ ] **Asset Fusion**: Support unified interactions with multiple tokens, increasing asset flexibility.
  * [ ] **One-Click DApp Integration**: Enhance chain abstraction integration tools to enable more DApps to seamlessly join the ecosystem, reducing development complexity.
* [ ] **Developer Ecosystem Development**
  * [ ] Provide comprehensive developer tools and documentation.
  * [ ] Organize technical workshops and hackathons to attract more developers to contribute to the Mantle ecosystem and drive further adoption of chain abstraction solutions.
    {% endstep %}
    {% endstepper %}


---

## Source: network / system-information / transaction-lifecycle

# Transaction Lifecycle

## L2 -> L1 Workflow[​](https://docs-v2.mantle.xyz/devs/concepts/tx-lifecycle#l2---l1-workflow) <a href="#l2---l1-workflow" id="l2---l1-workflow"></a>

### 1. The Initiation[​](https://docs-v2.mantle.xyz/devs/concepts/tx-lifecycle#1-the-initiation) <a href="#id-1-the-initiation" id="id-1-the-initiation"></a>

Wallet users, dApps, or some scripts may wish to utilize a blockchain-based system to transfer funds or execute tasks.

* For users, they have connected to Mantle network by adding the sequencer node's RPC endpoint to their wallet.
* On the other hand, dApps have integrated the [Mantle SDK](https://sdk.mantle.xyz/index.html) and instantiated it to communicate with Mantle network. They are ready to send requests containing the recipient's address and the amount they want to transfer.

As with any other service, this operation requires payment. It is not just for the transfer itself, but also for maintaining a permanent, immutable public record that anyone can verify. Their wallet or dApp must ensure there is a sufficient balance to execute this operation.

* For wallets, things are simpler; as it is easier to calculate the required fee.
* dApps need to do more detailed calculations; for more information, please refer to this [section](https://docs.mantle.xyz/network/system-information/fee-mechanism).

They use the tools at hand to compose a request, sign it using their private keys, and send it to Mantle Network where a sequencer is ready to process it. This is where the transaction first enters Mantle. More details [here](https://docs.mantle.xyz/network/off-chain-system/node-introduction#sequencer).

### 2. The Handling[​](https://docs-v2.mantle.xyz/devs/concepts/tx-lifecycle#2-the-handling) <a href="#id-2-the-handling" id="id-2-the-handling"></a>

The transaction triggers the standard state verification process, executed by the Ethereum Virtual Machine (EVM) software ([`op-geth`](https://docs.mantle.xyz/network/off-chain-system/node-introduction#op-geth)) running on these nodes. This is to ensure that the transaction is fundamentally valid, the necessary fees have been paid, and nothing exceptional has occurred.&#x20;

After block execution, Mantle enters the **batching → DA → proving → L1 finalization** pipeline.

{% hint style="info" %}
It's important to note that state submission doesn't need to be executed after every transaction, but can be chosen to be submitted after a tx-batch.
{% endhint %}

### 3. The Storage[​](https://docs-v2.mantle.xyz/devs/concepts/tx-lifecycle#3-the-storage) <a href="#id-3-the-storage" id="id-3-the-storage"></a>

Unlike typical Rollups, Mantle Network aims for more efficient and cost-effective Data Availability (DA) guarantees. Therefore, it opts for EigenDA, developed based on a third-party DA component. `op-batcher` needs to submit all transaction data (not raw transactions) to EigenDA to ensure the integrity and effectiveness of the L2 network. DA nodes synchronize block data and ensure access to it at any given time in exchange for rewards for providing this service. For more detailed information, please see this section.

EigenDA supports data storage and reverse derivation, ensuring data availability. In addition to data storage, state storage is also crucial.

On Ethereum, there is a complete trust network ready to verify the updated state root stored in the contract. Once a block passes Ethereum's consensus mechanism, it is recorded on the secure chain.&#x20;

### 4. The Proving

After data batches are published to EigenDA, Mantle’s proving system runs **independently** to provide cryptographic validity guarantees for L2 state transitions.\
This process is coordinated by the **Mantle Succinct Proposer**, which periodically checks the latest L2 block progress and decides whether new proofs should be generated.

The proving system retrieves the necessary block data from EigenDA, reconstructs the corresponding L2 state transitions, and generates **ZK Validity Proofs** through Mantle’s proving pipeline.\
These proofs confirm that all included L2 blocks were executed correctly according to the EVM rules.

Once a proof is ready, the Succinct Proposer submits it—together with the associated state root—to the `MantleSuccinctL2OutputOracle` contract on Ethereum.\
After verification on L1, the proven block range becomes **finalized immediately**, without the need for a challenge period.


---

## Source: network / for-node-operators / deployment-guides

# Deployment Guides

- [Mainnet (v1.4.2)](/network/for-node-operators/deployment-guides/mainnet-v1.4.2.md)
- [Deploying a Rollup Verifier/Replica Node From Docker](/network/for-node-operators/deployment-guides/mainnet-v1.4.2/deploying-a-rollup-verifier-replica-node-from-docker.md)
- [Deploying a Rollup Verifier/Replica Node From Binary](/network/for-node-operators/deployment-guides/mainnet-v1.4.2/deploying-a-rollup-verifier-replica-node-from-binary.md)
- [Testnet (v1.4.1)](/network/for-node-operators/deployment-guides/testnet-v1.4.1.md)
- [Deploying a Sepolia Rollup Verifier/Replica Node From Docker](/network/for-node-operators/deployment-guides/testnet-v1.4.1/deploying-a-sepolia-rollup-verifier-replica-node-from-docker.md)


---

## Source: network / for-node-operators / faqs

# FAQs

### How big is the current testnet state?[​](https://docs-v2.mantle.xyz/nodes/faqs#how-big-is-the-current-testnet-state) <a href="#how-big-is-the-current-testnet-state" id="how-big-is-the-current-testnet-state"></a>

You can find details on this subject here: [#approximate-disk-usage](https://docs.mantle.xyz/network/deployment-guides/mainnet-v1.4.2/deploying-a-rollup-verifier-replica-node-from-docker#approximate-disk-usage "mention")

### What does the error "foundryup can't find command" mean when installing Foundry on my server?[​](https://docs-v2.mantle.xyz/nodes/faqs#what-does-the-error-foundryup-cant-find-command-mean-when-installing-foundry-on-my-server) <a href="#what-does-the-error-foundryup-cant-find-command-mean-when-installing-foundry-on-my-server" id="what-does-the-error-foundryup-cant-find-command-mean-when-installing-foundry-on-my-server"></a>

This error occurs when the foundryup script cannot locate the necessary system commands required to complete the installation process. One common solution is to upgrade the version of GNU C Library (glibc) installed on your server to version 2.29 or higher.


---

## Source: network / for-node-operators / network-roles

# Network Roles

Welcome to our Node Deployment service. This service covers different types of nodes, supporting the normal operation and various functionalities of the network. Please follow the instructions below to configure and deploy nodes.

## Available Node Types[​](https://docs-v2.mantle.xyz/nodes/overviews#available-node-types) <a href="#available-node-types" id="available-node-types"></a>

### Verifier Nodes[​](https://docs-v2.mantle.xyz/nodes/overviews#verifier-nodes) <a href="#verifier-nodes" id="verifier-nodes"></a>

[Verifier](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#verifier) nodes are used to verify the validity of transactions and blocks on the chain. It is a crucial component of the network, ensuring the security and reliability of the Mantle Network blockchain. Detailed [Verifier Node Deployment documentation](https://docs.mantle.xyz/network/for-node-operators/deployment-guides) has already been provided.

### Sequencer Nodes[​](https://docs-v2.mantle.xyz/nodes/overviews#sequencer-nodes) <a href="#sequencer-nodes" id="sequencer-nodes"></a>

[Sequencers](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#sequencer) are responsible for sequentially packing transactions into layer-2 blocks, providing a deterministic order for transactions. Currently, Sequencer nodes are not yet open due to security reasons.

### Proposer Nodes[​](https://docs-v2.mantle.xyz/nodes/overviews#proposer-nodes) <a href="#proposer-nodes" id="proposer-nodes"></a>

[Proposer](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#op-proposer) nodes are used to create new state roots and send them to layer 1. Currently, Proposer nodes are not yet open due to security reasons.

### Batcher Nodes[​](https://docs-v2.mantle.xyz/nodes/overviews#batcher-nodes) <a href="#batcher-nodes" id="batcher-nodes"></a>

[Batcher](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#op-batcher) nodes are used to bundle a batch of transactions into a block to improve processing efficiency. Currently, Batcher nodes are not yet open due to security reasons.

### Data Availability (DA) Nodes[​](https://docs-v2.mantle.xyz/nodes/overviews#data-availability-da-nodes) <a href="#data-availability-da-nodes" id="data-availability-da-nodes"></a>

[DA nodes](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#da-nodes) ensure the availability of transaction data. Currently, DA nodes are not yet open due to security reasons.

## Why Run a Rollup Verifier Node?[​](https://docs-v2.mantle.xyz/nodes/overviews#why-run-a-rollup-verifier-node) <a href="#why-run-a-rollup-verifier-node" id="why-run-a-rollup-verifier-node"></a>

There are multiple advantages of running a Rollup Verifier node.

1. It grants many of the benefits of running an Ethereum node, such as the ability to simulate L2 transactions locally without rate-limiting (public RPCs may face such limitations).
2. Allows anyone to verify the work performed by Sequencers by re-deriving output roots and comparing them against those submitted by the Sequencer. In case of a mismatch, verifiers will be able to perform a fault check and claim rewards by submitting fraud proofs on future versions of Mantle Network Mainnet.


---

## Source: network / for-node-operators / network-updates

# Network Updates

- [Changelogs](/network/for-node-operators/network-updates/changelogs.md)
- [Mantle v2 v1.4.2 - Limb Upgrade](/network/for-node-operators/network-updates/changelogs/mantle-v2-v1.4.2-limb-upgrade.md)
- [Mantle v2 v1.4.1 - Limb Upgrade (Sepolia)](/network/for-node-operators/network-updates/changelogs/mantle-v2-v1.4.1-limb-upgrade-sepolia.md)
- [Mantle v2 v1.3.2 - Skadi Upgrade](/network/for-node-operators/network-updates/changelogs/mantle-v2-v1.3.2-skadi-upgrade.md)
- [Mantle v2 v1.3.1 - Skadi Upgrade](/network/for-node-operators/network-updates/changelogs/mantle-v2-v1.3.1-skadi-upgrade.md)
- [Mantle v2 v1.3.0 - Skadi Upgrade (Sepolia)](/network/for-node-operators/network-updates/changelogs/mantle-v2-v1.3.0-skadi-upgrade-sepolia.md)
- [Mantle v2 v1.1.1 - Everest Upgrade](/network/for-node-operators/network-updates/changelogs/mantle-v2-v1.1.1-everest-upgrade.md)
- [Mantle v2 v1.1.0](/network/for-node-operators/network-updates/changelogs/mantle-v2-v1.1.0.md)
- [Mantle v2 v1.0.2](/network/for-node-operators/network-updates/changelogs/mantle-v2-v1.0.2.md)
- [Mantle v2 v1.0.1](/network/for-node-operators/network-updates/changelogs/mantle-v2-v1.0.1.md)
- [Mantle v2 v1.0.0](/network/for-node-operators/network-updates/changelogs/mantle-v2-v1.0.0.md)
- [Mantle v2 v0.5.0](/network/for-node-operators/network-updates/changelogs/mantle-v2-v0.5.0.md)


---

## Source: network / for-developers / common-use-cases

# Common Use Cases

- [Moving Assets and Data](/network/for-developers/common-use-cases/moving-assets-and-data.md)
- [Adding Mantle Wallet Support](/network/for-developers/common-use-cases/adding-mantle-wallet-support.md)
- [Adding Mantle to a CEX](/network/for-developers/common-use-cases/adding-mantle-to-a-cex.md)
- [Adding a Custom Bridge to Mantle](/network/for-developers/common-use-cases/adding-a-custom-bridge-to-mantle.md)


---

## Source: network / for-developers / faqs

# FAQs

## General[​](https://docs-v2.mantle.xyz/devs/dev-guides/faqs#general) <a href="#general" id="general"></a>

* **Does Mantle Network support EIP-1559?**

  **Mantle Network supports EIP-1559.** EIP-1559 is a new transaction method that will be introduced after the Bedrock upgrade of the OP Stack, and will allow transactions on Mantle Network to be executed in a more stable and controlled manner. See [here](https://docs.mantle.xyz/network/system-information/fee-mechanism/eip-1559-support) for more information.
* **Why is the gas fee very high for my transaction?**

  Mantle v2 Tectonic introduces EIP-1559 type transactions and also to further reduce gas fees, the FIFO transaction ordering method is chosen to minimize the impact of the `priorityfee`, so you will need additional settings to optimize your handling fees, for more information check [here](https://docs.mantle.xyz/network/for-developers/optimize-your-transaction-fees).
* **Why is the gas usage so high for my transaction?**

  Unlike most OP Stack-based chains, Mantle chooses to use the MNT native token as the fee for L2 transactions and covers the whole transaction cost (L1 + L2) when calculating the gas usage. Mantle introduces the [tokenRatio](https://docs.mantle.xyz/network/system-information/fee-mechanism#control-of-tokenratio) parameter which helps regulate the price fluctuations between ETH and MNT, when calculating the gas fee, Mantle will multiply with the `tokenRatio` compared to the other L2s' gasUsed (based on ETH). For example, if `tokenRatio` is `3000`, the gas usage will be calculated as `L2GasUsed * 3000 + L1GasUsed * 3000 * scalar`.

  Meanwhile, the gas usage can't reflect the level of gas fees, Mantle still has one of the [cheapest fees](https://docs.mantle.xyz/network/system-information/fee-mechanism#mantle-v2-tectonic-fee-showcase) compared to other L2s.
* **Why did I get an error when I tried to send a transaction on Mantle Network?**

  There are various possibilities for transaction failures. Here, we kindly ask you to ensure that your transaction construction has not been affected by any modifications to fees in Mantle v2 Tectonic. For more details, please refer to [this page](https://docs.mantle.xyz/network/system-information/fee-mechanism/estimate-fees).
* **Why is the value I get by calling the contract's `getL1fee` method so much smaller than the actual L1 fee?**

  This is due to the fact that `MNT` is used as the native gas fee token in Mantle, and you need to use the `tokenRatio` parameter to convert between `MNT` and `ETH` when calculating the L1 fee, for more information, please check [here](https://docs.mantle.xyz/network/system-information/fee-mechanism#understanding-fees-on-mantle-v2-tectonic)!

## Dev Tools[​](https://docs-v2.mantle.xyz/devs/dev-guides/faqs#dev-tools) <a href="#dev-tools" id="dev-tools"></a>

* **Can I use Truffle, Hardhat, and Remix to deploy contracts on Mantle Network?**

  Yes. All the EVM-compatible Web3 libraries, IDEs, development frameworks can be used to deploy on and connect to Mantle Network. This includes, but isn't limited to, popular tools such as:

  * [Remix](https://remix.ethereum.org/)
  * [Truffle](https://trufflesuite.com/docs/)
  * [Hardhat](https://hardhat.org/docs)
  * [Foundry](https://github.com/foundry-rs/foundry)
  * [Web3.js](https://github.com/ethereum/web3.js/)
  * [Ethers.js](https://github.com/ethers-io/ethers.js/)

  You can check more tutorials [here](https://docs.mantle.xyz/network/for-node-operators/deployment-guides).
* **Can I fetch DA transaction details with an API?**

  Currently, the only way to see DA transaction history is via the Explorer frontend. Here's the link for Mantle DA data storage: <https://mantlescan.xyz/batches>
* **Does the RPC rate limit affect Explorer API usage too?**

  Yes. Once the RPC rate limit is reached, access to Explorer API will also be limited.
* **Are there any limits set for batch transaction size?**

  The maximum batch transaction size is derived from the target gas configuration. Mantle Network is the same as other OP Stack-based chains in this regard.
* **Are there any limits set on return log size for `eth_getLogs` RPC call?**

  Yes, it's best practice to limit the range of blocks you are querying in a single request to prevent issues such as timeout errors or overly large responses, in Mantle Network — 10,000 blocks.
* **Does Mantle explorer support proxy contracts？**

  If the contract is detected as a proxy implementation, it can be supported.
* **How to set the token image on Mantlescan?**

  You can submit token update via `https://mantlescan.xyz/tokenupdate/` or `https://mantlescan.xyz/tokenupdate/<address>` (append token contract address).
* **How to add tokens on Mantle's official bridge？**

  You'll need to make a pull request against the Mantle token list repository. After PR is approved, you need to wait a few minutes before you can check the tokens on the bridge. Check more details [here](https://docs.mantle.xyz/network/quick-access#adding-a-token-to-the-list).
* **Does OpenZeppelin defender support EIP1559 transactions?**

  Yes, OpenZeppelin defender support sending EIP1559 transactions now.
* **Why do I get the error "0x5e not defined" when compiling contracts？**

  This error occurs because Mantle's op-geth is not up to date, which doesn't support the `MCOPY(0x5e)` bytecode. To resolve this, specify the compiler version as **0.8.23** or below. And refer [this](https://docs.mantle.xyz/network/the-differences-between-mantle-op-stack-and-ethereum#unsupported-opcodes) to get more unsupported opcodes.
* **Why do I get the error "Missing etherscan key for chain 5000/5003" when verifying contracts on Mantlescan by using Foundry?**

  This error occurs because Foundry had [some bugs](https://github.com/foundry-rs/foundry/issues/7466) on this, we encourage developers to verify contracts via Mantlescan explorer rather than using forge, check [this](https://docs.mantle.xyz/network/how-to-guides/how-to-verify-smart-contracts/use-explorer-to-verify-smart-contracts#compiled-using-foundry) for more details.
* **Is the Opcode `PUSH0` supported in Mantle?**

  Yes, the `PUSH0` opcode is supported in Mantle.


---

## Source: network / for-developers / how-to-guides

# How-to Guides

- [How to Deploy Smart Contracts](/network/for-developers/how-to-guides/how-to-deploy-smart-contracts.md)
- [Use Remix to Deploy Smart Contracts](/network/for-developers/how-to-guides/how-to-deploy-smart-contracts/use-remix-to-deploy-smart-contracts.md)
- [Use Hardhat to Deploy Smart Contracts](/network/for-developers/how-to-guides/how-to-deploy-smart-contracts/use-hardhat-to-deploy-smart-contracts.md)
- [Use Foundry to Deploy Smart Contracts](/network/for-developers/how-to-guides/how-to-deploy-smart-contracts/use-foundry-to-deploy-smart-contracts.md)
- [Use Thirdweb to Deploy Smart Contracts](/network/for-developers/how-to-guides/how-to-deploy-smart-contracts/use-thirdweb-to-deploy-smart-contracts.md)
- [How to Verify Smart Contracts](/network/for-developers/how-to-guides/how-to-verify-smart-contracts.md)
- [Use Hardhat to Verify Smart Contracts](/network/for-developers/how-to-guides/how-to-verify-smart-contracts/use-hardhat-to-verify-smart-contracts.md)
- [Use Foundry to Verify Smart Contracts](/network/for-developers/how-to-guides/how-to-verify-smart-contracts/use-foundry-to-verify-smart-contracts.md)
- [Use Explorer to Verify Smart Contracts](/network/for-developers/how-to-guides/how-to-verify-smart-contracts/use-explorer-to-verify-smart-contracts.md)
- [How to Use Mantle SDK](/network/for-developers/how-to-guides/how-to-use-mantle-sdk.md)
- [Bridging MNT with the Mantle SDK](/network/for-developers/how-to-guides/how-to-use-mantle-sdk/bridging-mnt-with-the-mantle-sdk.md)
- [Bridging ETH with the Mantle SDK](/network/for-developers/how-to-guides/how-to-use-mantle-sdk/bridging-eth-with-the-mantle-sdk.md)
- [Bridging ERC-20 tokens with the Mantle SDK](/network/for-developers/how-to-guides/how-to-use-mantle-sdk/bridging-erc-20-tokens-with-the-mantle-sdk.md)
- [Bridging ERC-721 tokens with the Mantle SDK](/network/for-developers/how-to-guides/how-to-use-mantle-sdk/bridging-erc-721-tokens-with-the-mantle-sdk.md)
- [How to Use Mantle Viem](/network/for-developers/how-to-guides/how-to-use-mantle-viem.md)
- [Bridging MNT with Mantle Viem](/network/for-developers/how-to-guides/how-to-use-mantle-viem/bridging-mnt-with-mantle-viem.md)
- [Bridging ETH with Mantle Viem](/network/for-developers/how-to-guides/how-to-use-mantle-viem/bridging-eth-with-mantle-viem.md)
- [Bridging ERC-20 with Mantle Viem](/network/for-developers/how-to-guides/how-to-use-mantle-viem/bridging-erc-20-with-mantle-viem.md)
- [How to Bridge Your Assets](/network/for-developers/how-to-guides/how-to-bridge-your-assets.md)
- [Bridging Your Standard ERC-20 Token Using the Standard Bridge](/network/for-developers/how-to-guides/how-to-bridge-your-assets/bridging-your-standard-erc-20-token-using-the-standard-bridge.md)
- [Bridging Your Custom ERC-20 Token Using the Standard Bridge](/network/for-developers/how-to-guides/how-to-bridge-your-assets/bridging-your-custom-erc-20-token-using-the-standard-bridge.md)


---

## Source: network / for-developers / optimize-your-transaction-fees

# Optimize Your Transaction Fees

This section will help you to reduce the transaction fees on Mantle v2 Tectonic. Mantle v2 Tectonic introduces a new fee collection mechanism, including EIP-1559 and some native token optimizations, if you want to know more details about our fee collection mechanism, please refer to [this document](https://docs.mantle.xyz/network/system-information/fee-mechanism).

In Mantle v2 Tectonic, with the introduction of the EIP-1559 mechanism, users need to configure the network's `basefee` (the minimum basefee currently set `0.02 gwei`) and `priorityfee` (recommend to set it to 0) configurations in order to optimize the transaction fees. We explain the different development components to optimize the user experience.

## MetaMask[​](https://docs-v2.mantle.xyz/devs/dev-guides/decrease-fee#metamask) <a href="#metamask" id="metamask"></a>

If you are a user of MetaMask for trading or contract deployment and interaction (e.g. using [Remix](https://docs.mantle.xyz/network/for-developers/how-to-guides/how-to-deploy-smart-contracts/use-remix-to-deploy-smart-contracts)), you can set up `basefee` and `priorityfee` in MetaMask to be able to send transactions at a lowest fee. Details can be found [here](https://docs.mantle.xyz/network/for-users/how-to-guides/connecting-wallet-to-mantle-network#configure-your-wallet).

## Hardhat[​](https://docs-v2.mantle.xyz/devs/dev-guides/decrease-fee#hardhat) <a href="#hardhat" id="hardhat"></a>

If you are using [Hardhat](https://docs.mantle.xyz/network/for-developers/how-to-guides/how-to-deploy-smart-contracts/use-hardhat-to-deploy-smart-contracts) for contract deployment and interaction, you can use the default configuration in `hardhat.config.ts` or specify `gasPrice` as the network minimum basefee:

```javascript
const config: HardhatUserConfig = {
  solidity: '0.8.19', // solidity version
  defaultNetwork: 'mantleSepolia', // chosen by default when network isn't specified while running Hardhat
  networks: {
    mantle: {
      url: 'https://rpc.mantle.xyz', //mainnet
      accounts: [process.env.ACCOUNT_PRIVATE_KEY ?? ''],
      // Use the default configuration
    },
    mantleSepolia: {
      url: 'https://rpc.sepolia.mantle.xyz', // Sepolia Testnet
      accounts: [process.env.ACCOUNT_PRIVATE_KEY ?? ''],
      gasPrice: 20000000, // specify the network's minimum basefee as the gas price
    },
  },
};
```

## Foundry[​](https://docs-v2.mantle.xyz/devs/dev-guides/decrease-fee#foundry) <a href="#foundry" id="foundry"></a>

If you are using [Foundry](https://docs.mantle.xyz/network/for-developers/how-to-guides/how-to-deploy-smart-contracts/use-foundry-to-deploy-smart-contracts) for contract deployment and interaction, you need to set it up on the corresponding command line:

### Contracts Deployment[​](https://docs-v2.mantle.xyz/devs/dev-guides/decrease-fee#contracts-deployment) <a href="#contracts-deployment" id="contracts-deployment"></a>

{% hint style="warning" %}
Currently, for users deploying contracts using `forge create`, we strongly recommend using the **legacy** transaction type.

Make sure you are using [the latest version](https://github.com/foundry-rs/foundry/releases) of Foundry, if you are using a version lower than [`2024-07-31`](https://github.com/foundry-rs/foundry/releases/tag/nightly-26a7559758c192911dd39ce7d621a18ef0d419e6), please add `-skip-simulation` to your command line to ensure successful execution!
{% endhint %}

{% tabs %}
{% tab title="Use forge script" %}
When you use the `forge script` for contract deployment, there are different settings for different transaction types:

* **legacy transactions**

  If you are using legacy type transactions, you can use the following command for contract deployment, e.g.

  ```
  forge script --legacy script/Deploy.s.sol:DeploySiege --sig "run()" --rpc-url <mantle_rpc_url> --broadcast
  ```
* **EIP-1559 transactions**

  If you are using EIP-1559 type transactions, you need to set the [`--with-gas-price`](https://book.getfoundry.sh/reference/forge/forge-script#options) parameter to the network minimum basefee, using the following command to deploy the contract, e.g.

  ```
  forge script script/Deploy.s.sol:DeploySiege --sig "run()" --with-gas-price 20000000 --rpc-url <mantle_rpc_url> --broadcast
  ```

{% endtab %}

{% tab title="Use forge create" %}
When you use `forge create` for contract deployment, there are different settings for different transaction types:

* **legacy transactions (recommended)**

  If you are using legacy type transactions, you don't need to do any additional setup, use the following commands for contract deployment, e.g.

  ```sh
  forge create --legacy --rpc-url <mantle_rpc_url> ./script/StorageTest.sol:Storage --private-key <private_key>
  ```
* **EIP-1559 transactions**

  If using EIP-1559 type transactions, you need to set [`--priority-gas-price`](https://book.getfoundry.sh/reference/forge/forge-script#options) to `0`, [`--gas-price`](https://book.getfoundry.sh/reference/forge/forge-script#options) to `20000000` (current network minimum basefee) [`--gas-limit`](https://book.getfoundry.sh/reference/forge/forge-script#options) is `40000000000` and the contract is deployed using the following command, e.g.

  ```sh
  forge create --rpc-url <mantle_rpc_url> ./script/StorageTest.sol:Storage --private-key <private_key> --priority-gas-price 0 --gas-price 20000000 --gas-limit 40000000000
  ```

{% endtab %}
{% endtabs %}


---

## Source: network / for-developers / quick-access

# Quick Access

## Network Details[​](https://docs-v2.mantle.xyz/devs/dev-guides/quick#network-details) <a href="#network-details" id="network-details"></a>

{% tabs %}
{% tab title="Mainnet" %}

| Name              | Description                                       |
| ----------------- | ------------------------------------------------- |
| **RPC URL**       | [https://rpc.mantle.xyz](https://rpc.mantle.xyz/) |
| **WebSocket URL** | wss\://rpc.mantle.xyz                             |
| **Chain ID**      | 5000                                              |
| **Token Symbol**  | MNT                                               |
| **Explorer**      | <https://mantlescan.xyz/>                         |
| {% endtab %}      |                                                   |

{% tab title="Testnet (Sepolia)" %}

| Name              | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| **RPC URL**       | [https://rpc.sepolia.mantle.xyz](https://rpc.sepolia.mantle.xyz/) |
| **WebSocket URL** | N/A                                                               |
| **Chain ID**      | 5003                                                              |
| **Token Symbol**  | MNT                                                               |
| **Explorer**      | <https://sepolia.mantlescan.xyz/>                                 |
| {% endtab %}      |                                                                   |
| {% endtabs %}     |                                                                   |

{% hint style="info" %}
The official Mantle RPC employs **rate limiting** to ensure stability during traffic spikes. If your particular use case involves calling the [Mantle API](https://docs.mantle.xyz/network/for-developers/resources-and-tooling/mantle-api) frequently, you might run into issues that arise due to rate limiting. For such use cases, consider connecting to third-party RPCs instead. You can find the list of available RPC providers [here](https://docs.mantle.xyz/network/for-developers/resources-and-tooling/node-endpoints-and-providers).
{% endhint %}

## Onboarding Tools[​](https://docs-v2.mantle.xyz/devs/dev-guides/quick#onboarding-tools) <a href="#onboarding-tools" id="onboarding-tools"></a>

Here are some useful tools for developers' onboarding.

{% tabs %}
{% tab title="Mainnet" %}

| Name                                      | URL                                                                                                                        |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Faucet**                                | N/A                                                                                                                        |
| **Bridge**                                | <https://app.mantle.xyz/bridge>                                                                                            |
| **Recommended Solidity Compiler Version** | [v0.8.23](https://github.com/ethereum/solidity/releases/tag/v0.8.23) or below                                              |
| **Wrapped MNT Address**                   | [0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8](https://explorer.mantle.xyz/token/0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8) |
| {% endtab %}                              |                                                                                                                            |

{% tab title="Testnet (Sepolia)" %}

<table><thead><tr><th width="306">Name</th><th>URL</th></tr></thead><tbody><tr><td><strong>Faucet</strong></td><td><a href="https://faucet.sepolia.mantle.xyz/">https://faucet.sepolia.mantle.xyz/</a></td></tr><tr><td><strong>Third-party Faucet</strong><em>*</em></td><td>- <a href="https://faucet.quicknode.com/mantle/sepolia">https://faucet.quicknode.com/mantle/sepolia</a><br>- <a href="https://thirdweb.com/mantle-sepolia-testnet/faucet">https://thirdweb.com/mantle-sepolia-testnet/faucet</a></td></tr><tr><td><strong>Bridge</strong></td><td><a href="https://app.mantle.xyz/bridge?network=sepolia">https://app.mantle.xyz/bridge?network=sepolia</a></td></tr><tr><td><strong>Recommended Solidity Compiler Version</strong></td><td><a href="https://github.com/ethereum/solidity/releases/tag/v0.8.23">v0.8.23</a> or below</td></tr><tr><td><strong>Wrapped MNT Address</strong></td><td><a href="https://explorer.sepolia.mantle.xyz/address/0x19f5557E23e9914A18239990f6C70D68FDF0deD5">0x19f5557E23e9914A18239990f6C70D68FDF0deD5</a></td></tr></tbody></table>

*\** You can get MNT tokens directly on the Mantle Sepolia network and no longer need to bridge from Ethereum Sepolia. However, there is a limit to the number of MNT tokens that can be acquired.
{% endtab %}
{% endtabs %}

## Contract Address[​](https://docs-v2.mantle.xyz/devs/dev-guides/quick#contract-address) <a href="#contract-address" id="contract-address"></a>

Mantle as a Layer 2 (L2) system of Ethereum, scales Ethereum by deploying L1 contracts and L2 contracts. The most updated list of addresses of the contracts deployed on Ethereum and Mantle Network is available as follows:

* [L1 Contracts](https://docs.mantle.xyz/network/system-information/on-chain-system/key-l1-contract-address)
* [L2 Contracts](https://docs.mantle.xyz/network/system-information/off-chain-system/key-l2-contract-address)

## Token List[​](https://docs-v2.mantle.xyz/devs/dev-guides/quick#token-list) <a href="#token-list" id="token-list"></a>

The [Mantle Bridge](https://bridge.mantle.xyz/) allows a one-to-many mapping between layer 1 (L1) and layer 2 (L2) tokens, meaning that there can be multiple Mantle implementations of an L1 token.

However, there is always a one-to-one mapping between L1 and L2 tokens listed on the [Mantle token list](https://token-list.mantle.xyz/mantle.tokenlist.json). The token list is used as the source of truth for the Mantle Bridge which is the main portal for moving assets between L1 and L2.

{% hint style="info" %}
If you want to support your token on the Mantle Bridge, we strongly recommend using [this template](https://github.com/mantle-xyz/bridge-token-contracts) for token deployment in order to authorize bridge contracts
{% endhint %}

### Adding a Token to the List[​](https://docs-v2.mantle.xyz/devs/dev-guides/quick#adding-a-token-to-the-list) <a href="#adding-a-token-to-the-list" id="adding-a-token-to-the-list"></a>

If you want to have your token added to the token list, you'll need to make a pull request against the [Mantle token list repository](https://github.com/mantlenetworkio/mantle-token-lists). You'll need the addresses for both the L1 and L2 tokens, as well as a logo for the token.

{% hint style="info" %}
For reference, take a look at [this simple pull request](https://github.com/mantlenetworkio/mantle-token-lists#adding-a-token-to-the-list) that adds a token to the token list.
{% endhint %}

## Tools for Developers

<table data-view="cards" data-full-width="false"><thead><tr><th></th><th data-hidden></th><th data-hidden></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>Endpoints</strong></td><td></td><td></td><td><a href="resources-and-tooling/node-endpoints-and-providers">node-endpoints-and-providers</a></td></tr><tr><td><strong>Mantle API</strong></td><td></td><td></td><td><a href="resources-and-tooling/mantle-api">mantle-api</a></td></tr><tr><td><strong>Oracles</strong></td><td></td><td></td><td><a href="resources-and-tooling/oracles">oracles</a></td></tr><tr><td><strong>Monitors</strong></td><td></td><td></td><td><a href="resources-and-tooling/monitoring">monitoring</a></td></tr><tr><td><strong>Indexers</strong></td><td></td><td></td><td><a href="resources-and-tooling/indexing">indexing</a></td></tr><tr><td><strong>Development Frameworks</strong></td><td></td><td></td><td><a href="resources-and-tooling/development-framework">development-framework</a></td></tr><tr><td><strong>Account Abstraction</strong></td><td></td><td></td><td><a href="resources-and-tooling/account-abstraction">account-abstraction</a></td></tr><tr><td><strong>Wallets</strong></td><td></td><td></td><td><a href="resources-and-tooling/wallet">wallet</a></td></tr></tbody></table>


---

## Source: network / for-developers / resources-and-tooling

# Resources & Tooling

- [Node Endpoints and Providers](/network/for-developers/resources-and-tooling/node-endpoints-and-providers.md)
- [Mantle API](/network/for-developers/resources-and-tooling/mantle-api.md)
- [Oracles](/network/for-developers/resources-and-tooling/oracles.md)
- [Monitoring](/network/for-developers/resources-and-tooling/monitoring.md)
- [Indexing](/network/for-developers/resources-and-tooling/indexing.md)
- [Development Framework](/network/for-developers/resources-and-tooling/development-framework.md)
- [Account Abstraction](/network/for-developers/resources-and-tooling/account-abstraction.md)
- [How to Send Gasless Transaction by Using Biconomy](/network/for-developers/resources-and-tooling/account-abstraction/how-to-send-gasless-transaction-by-using-biconomy.md)
- [Create a Smart Account by using Etherspot](/network/for-developers/resources-and-tooling/account-abstraction/create-a-smart-account-by-using-etherspot.md)
- [Social Login by Using Particle](/network/for-developers/resources-and-tooling/account-abstraction/social-login-by-using-particle.md)
- [Wallet](/network/for-developers/resources-and-tooling/wallet.md)
- [Reown](/network/for-developers/resources-and-tooling/wallet/reown.md): Learn how to use Reown AppKit to enable wallet connections and interact with the Mantle network.
- [Multisig Wallet](/network/for-developers/resources-and-tooling/wallet/multisig-wallet.md)


---

## Source: network / for-developers / the-differences-between-mantle-op-stack-and-ethereum

# The Differences between Mantle, OP Stack, and Ethereum

Mantle is developed based on the OP Stack architecture. While it shares many design similarities with Ethereum, there are differences when transitioning from Ethereum to Mantle.

## Key Differences[​](https://docs-v2.mantle.xyz/devs/dev-guides/diffs#key-differences) with Ethereum <a href="#key-differences" id="key-differences"></a>

### Opcodes[​](https://docs-v2.mantle.xyz/devs/dev-guides/diffs#opcodes) <a href="#opcodes" id="opcodes"></a>

While Mantle aims for Ethereum compatibility, there may be differences in supported opcode sets or their specific implementations. Developers transitioning from Ethereum should review and adjust their smart contracts accordingly. Refer to the table below for detailed information:

<table><thead><tr><th width="193">Opcode</th><th width="230">Solidity equivalent</th><th>Behavior</th></tr></thead><tbody><tr><td><code>COINBASE</code></td><td><code>block.coinbase</code></td><td>In mantle-V2 Tectonic, block coinbase is the <code>SequencerFeeVault</code>, which address is <code>0x4200000000000000000000000000000000000011</code></td></tr><tr><td><code>DIFFICULTY</code></td><td><code>block.difficulty</code></td><td>Random value. As this value is set by the sequencer, it is not as reliably random as the L1 equivalent.</td></tr><tr><td><code>NUMBER</code></td><td><code>block.number</code></td><td>L2 block number</td></tr><tr><td><code>TIMESTAMP</code></td><td><code>block.timestamp</code></td><td>Timestamp of the L2 block</td></tr><tr><td><code>ORIGIN</code></td><td><code>tx.origin</code></td><td>If the transaction is an L1 ⇒ L2 transaction, then <code>tx.origin</code> is set to the <a href="https://community.optimism.io/docs/developers/build/differences/#address-aliasing">aliased address</a> of the address that triggered the L1 ⇒ L2 transaction. Otherwise, this opcode behaves normally.</td></tr><tr><td><code>CALLER</code></td><td><code>msg.sender</code></td><td>If the transaction is an L1 ⇒ L2 transaction, and this is the initial call (rather than an internal transaction from one contract to another), the same <a href="https://community.optimism.io/docs/developers/build/differences/#address-aliasing">address aliasing</a> behavior applies.</td></tr></tbody></table>

#### **Unsupported Opcodes**[**​**](https://docs-v2.mantle.xyz/devs/dev-guides/diffs#unsupported-opcodes)

The following opcodes are not supported in Mantle:

<table><thead><tr><th width="202">Opcode</th><th width="230">Implementation Info</th><th>Behavior</th></tr></thead><tbody><tr><td><code>TLOAD</code>、<code>TSTORE</code></td><td>Introduced in <a href="https://eips.ethereum.org/EIPS/eip-1153">EIP-1153</a></td><td>Manipulate state that behaves almost identically to storage but is discarded after every transaction</td></tr><tr><td><code>MCOPY</code></td><td>Introduced in <a href="https://eips.ethereum.org/EIPS/eip-5656">EIP-5656</a></td><td>An efficient EVM instruction for copying memory areas, enabled in Cancun upgrade</td></tr><tr><td><code>BLOBHASH</code></td><td>Introduced in <a href="https://eips.ethereum.org/EIPS/eip-4844">EIP-4844</a></td><td>Opcode to get versioned hashes, enabled in Cancun upgrade</td></tr><tr><td><code>BLOBBASEFEE</code></td><td>Introduced in <a href="https://eips.ethereum.org/EIPS/eip-7516">EIP-7516</a></td><td>Instruction that returns the current data-blob base-fee, enabled in Cancun upgrade</td></tr></tbody></table>

### Blocks[​](https://docs-v2.mantle.xyz/devs/dev-guides/diffs#blocks) <a href="#blocks" id="blocks"></a>

As a rollup, Mantle's block structure may differ from Ethereum, including block construction time, block size, and more. Developers should familiarize themselves with Mantle's block specifications for optimal integration. Refer to [this](https://community.optimism.io/docs/developers/build/differences/#blocks) for more details.

### Network Specifications[​](https://docs-v2.mantle.xyz/devs/dev-guides/diffs#network-specifications) <a href="#network-specifications" id="network-specifications"></a>

Mantle has distinct network specifications compared to Ethereum, particularly in JSON-RPC differences. Understanding these variances is crucial for a smooth transition to Mantle. Refer to [this](https://community.optimism.io/docs/developers/build/differences/#network-specifications) for more details.

### Transaction Costs[​](https://docs-v2.mantle.xyz/devs/dev-guides/diffs#transaction-costs) <a href="#transaction-costs" id="transaction-costs"></a>

As a rollup on Ethereum, Mantle's transaction cost composition differs from L1. Developers should understand Mantle's fee structure to optimize their applications' performance on Mantle Network. Refer to [this](https://docs.mantle.xyz/network/system-information/fee-mechanism) for more details.

### Solidity Support[​](https://docs-v2.mantle.xyz/devs/dev-guides/diffs#solidity-support) <a href="#solidity-support" id="solidity-support"></a>

Currently Mantle supports [the latest version](https://github.com/ethereum/solidity/releases) of the Solidity. Please make sure that your evm environment version is before (and including) Shanghai.

## Key Differences[​](https://docs-v2.mantle.xyz/devs/dev-guides/diffs#key-differences) with OP Stack <a href="#key-differences" id="key-differences"></a>

### Independent Data Availability (DA)[​](https://docs-v2.mantle.xyz/intro/whats-new-in-mantle-v2#independent-data-availability-da) <a href="#independent-data-availability-da" id="independent-data-availability-da"></a>

Considering Ethereum's current limited number of blobs and the large throughput associated with future Mantle performance enhancements, Mantle chose to use EigenDA as the DA Layer. This significantly reduces transaction fees while making minimal compromises on security guarantees. For more details, please check [here](https://docs.mantle.xyz/network/system-information/off-chain-system/eigenda).

### Migration of Native Tokens in L2[​](https://docs-v2.mantle.xyz/intro/whats-new-in-mantle-v2#migration-of-native-tokens-in-l2) <a href="#migration-of-native-tokens-in-l2" id="migration-of-native-tokens-in-l2"></a>

In Mantle v2 Tectonic, we introduce a highly anticipated feature — the migration of native tokens in L2. In Mantle v2 Tectonic, the flow of MNT tokens in L2 will no longer use the ERC-20 contract. Instead, MNT will be a native Mantle Network L2 asset, instead of a bridged version of its Ethereum ERC-20 counterpart. For more details, please check [here](#migration-of-native-tokens-in-l2).

### Fee Optimization Strategy[​](https://docs-v2.mantle.xyz/intro/whats-new-in-mantle-v2#fee-optimization-strategy) <a href="#fee-optimization-strategy" id="fee-optimization-strategy"></a>

Mantle v2 Tectonic implements a fee optimization strategy using the tokenRatio parameter to adjust the impact of using $MNT as transaction fees. Additionally, we have optimized the `estimateGas` function to directly provide an estimate of the total cost of a transaction. For more details, please check [here](https://docs.mantle.xyz/network/system-information/fee-mechanism).


---

## Source: network / for-developers / troubleshooting

# Troubleshooting

## General[​](https://docs-v2.mantle.xyz/devs/dev-guides/troubleshooting#general) <a href="#general" id="general"></a>

* **Status code: 429 {"error": "API rate limit exceeded"}**

  The official Mantle RPC employs rate limiting to ensure stability during traffic spikes. If your particular use case involves calling the Mantle API frequently, you might run into issues that arise due to rate limiting. In case this happens, please consider connecting to third-party RPCs instead. You can find the list of available RPC providers [here](https://docs.mantle.xyz/network/for-developers/resources-and-tooling/node-endpoints-and-providers).
* **RPC call Error: timeout**

  While calling the methods of our rpc (e.g. debug trace / get logs) to sync data from blocks, you may encounter the 'Timeout' issue, that's because the output of certain calls may be a large amount of data(due to big size blocks or large amount of logs) which may needs more time to be synced.

  So under such situations if the call lacks of timeout parameter or the default timeout settings is too low, it may result in an error of timeout. So it is recommended that you should add a timeout parameter with the call or set higher timeout parameter accordingly to solve the timeout issue.
* **Error: intrinsic gas too low**

  This is due to your `gaslimit` being set too low. The `gaslimit` setting needs to be taken seriously, and we explain why you need the right `gaslimit` [here](https://docs.mantle.xyz/network/system-information/fee-mechanism/estimate-fees#estimate-fees-in-mantle-v2-tectonic)!
* **Error: replacement transaction underpriced**

  This error usually occurs when you need to replace a transaction with the same nonce. Note that if you need to replace an old transaction with a new transaction with the same nonce, you need to set the `gasprice` by **1.1x**!

## Smart Contracts[​](https://docs-v2.mantle.xyz/devs/dev-guides/troubleshooting#smart-contracts) <a href="#smart-contracts" id="smart-contracts"></a>

### Deployment Issues[​](https://docs-v2.mantle.xyz/devs/dev-guides/troubleshooting#deployment-issues) <a href="#deployment-issues" id="deployment-issues"></a>

{% tabs %}
{% tab title="Hardhat" %}

* **Contract deploy error: "max code size exceeded."**

  Set `optimizer` bigger. Such as:

  ```javascript
  module.exports = {
    solidity: {
      version: '0.8.4',
      settings: {
        optimizer: {
          enabled: true,
          runs: 10000,
        },
      },
    },
  };
  ```

{% endtab %}

{% tab title="Foundry" %}

* **"insufficient gas for l1Cost. Please use estimateGas to get gasLimit."**

  The reason for this error is that Mantle's gas model is different from Ethereum, and the `forge script` command broadcasts the transaction without estimating the gas using the provided mantle rpc. You can fix this error by these 2 ways:

  1. Upgrade your Foundry tools version to the latest.
  2. Add `--skip-simulation` to the `forge script` command.
     {% endtab %}
     {% endtabs %}

### Verification Issues[​](https://docs-v2.mantle.xyz/devs/dev-guides/troubleshooting#verification-issues) <a href="#verification-issues" id="verification-issues"></a>

{% tabs %}
{% tab title="Hardhat" %}

* **Contract verification error: Hardhat found multiple contracts in the project (your MyTokenContract and the imported @openzeppelin/contracts/token/ERC20/IERC20.sol), and it doesn't know against which one you want to verify the bytecode**

  If you see this error, try verifying the contract again by specifying the name of the contract that you're looking to verify. You can do this using the --contract option. Here's an example:

  ```sh
  npx hardhat verify --contract "contracts/MyTokenContract.sol:MyToken" --network mantleTest 0x3A2b26...
  ```

{% endtab %}
{% endtabs %}

### Contracts Call Issues <a href="#contracts-call-issues" id="contracts-call-issues"></a>

{% tabs %}
{% tab title="Foundry" %}

* **Error: Failed to send transaction. Context: (code: -32000, message: failed to forward tx to sequencer, please try again. Error message: 'intrinsic gas too low', data: None)**

  The reason for this error is that Mantle's gas model is different from Ethereum, and the `forge script` command broadcasts the transaction without estimating the gas using the provided mantle rpc. Two things should be noted when using it:

  1. Set the `priority-gas-price` to 0.
  2. Upgrade your Foundry tools version to the latest or add `--skip-simulation` to the `forge script` command.
     {% endtab %}
     {% endtabs %}

## Standard Bridge[​](https://docs-v2.mantle.xyz/devs/dev-guides/troubleshooting#standard-bridge) <a href="#standard-bridge" id="standard-bridge"></a>

* **Error when withdrawing: no bridge found for token pair**

  Try switching to a different [RPC provider](https://docs.mantle.xyz/network/for-developers/resources-and-tooling/node-endpoints-and-providers).

## Explorer[​](https://docs-v2.mantle.xyz/devs/dev-guides/troubleshooting#explorer) <a href="#explorer" id="explorer"></a>

* **Error: Awaiting internal transactions for reason**

  You may encounter this error if you there are multiple internal transaction calls in the contract being invoked. This does not necessarily mean the transaction has failed, just that the explorer is yet to receive acknowledgements for all the internal transactions.

<br>


---

## Source: network / for-users / ecosystem

# Ecosystem

- [Supported Wallets](/network/for-users/ecosystem/supported-wallets.md)


---

## Source: network / for-users / faqs

# FAQs

### Is there an option for a test drive?[​](https://docs-v2.mantle.xyz/users/faqs#is-there-an-option-for-a-test-drive) <a href="#is-there-an-option-for-a-test-drive" id="is-there-an-option-for-a-test-drive"></a>

* You can experience the deposit and withdraw flow by using our simulated testnet. It provides a safe environment to try out the bridge functionality without any real token transactions.

### What is L1/L2, and what are the required gas fees for deposit and withdrawal?[​](https://docs-v2.mantle.xyz/users/faqs#what-is-l1l2-and-what-are-the-required-gas-fees-for-deposit-and-withdrawal) <a href="#what-is-l1l2-and-what-are-the-required-gas-fees-for-deposit-and-withdrawal" id="what-is-l1l2-and-what-are-the-required-gas-fees-for-deposit-and-withdrawal"></a>

* Mantle Network is a Layer-2 (L2) scalability solution built on Ethereum which is the Layer-1 (L1).
  * Deposit: You need ETH on L1 as gas fees to initiate the deposit. After depositing, you'll need MNT on L2 as gas fees to transact on Mantle Network.
  * Withdraw: You need MNT on L2 as gas fees to initiate the withdrawal and ETH on L1 as gas fees to claim the tokens on Ethereum Mainnet.

### How can I view my bridged token balances on Mantle Network in my wallet?[​](https://docs-v2.mantle.xyz/users/faqs#how-can-i-view-my-bridged-token-balances-on-mantle-network-in-my-wallet) <a href="#how-can-i-view-my-bridged-token-balances-on-mantle-network-in-my-wallet" id="how-can-i-view-my-bridged-token-balances-on-mantle-network-in-my-wallet"></a>

* If the auto-detection of your bridged balances doesn't work, you can manually import the tokens to your wallet using the following contract addresses:

  | **Token** | **Contract Address**                       |
  | --------- | ------------------------------------------ |
  | ETH       | 0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111 |

For other token contract addresses, you can access the bridge token mapping by visiting the following [link](https://docs.mantle.xyz/network/for-developers/quick-access#token-list).

### What is the typical duration for deposits and withdrawals?[​](https://docs-v2.mantle.xyz/users/faqs#what-is-the-typical-duration-for-deposits-and-withdrawals) <a href="#what-is-the-typical-duration-for-deposits-and-withdrawals" id="what-is-the-typical-duration-for-deposits-and-withdrawals"></a>

* Initiating a deposit typically completes in around \~12 minutes.

  Conversely, withdrawals, due to the intricacies of Optimistic Rollups, have a challenge period to detect and address any discrepancies in the Mantle Mainnet transaction. This ensures the highest security, but means withdrawals to Ethereum Mainnet can take up to a week.

### Why is the estimated fee on Metamask not the same as the actual transaction fee?[​](https://docs-v2.mantle.xyz/users/faqs#why-is-the-estimated-fee-on-metamask-not-the-same-as-the-actual-transaction-fee) <a href="#why-is-the-estimated-fee-on-metamask-not-the-same-as-the-actual-transaction-fee" id="why-is-the-estimated-fee-on-metamask-not-the-same-as-the-actual-transaction-fee"></a>

Metamask ensures that the transaction is successful by displaying the estimated fee higher than the actual cost consumed, and the actual fee cost is much lower. You can check the actual cost on explorer after the transaction is confirmed.

### How are withdrawals fees determined?[​](https://docs-v2.mantle.xyz/users/faqs#how-are-withdrawals-fees-determined) <a href="#how-are-withdrawals-fees-determined" id="how-are-withdrawals-fees-determined"></a>

* The cost to claim on the bridge is dependent on the gas costs, measured in Gwei, at the time of your transaction. The estimated formula to determine this cost is:

  Cost(ETH)=600,000×GweiCost(ETH)=600,000×Gwei

  For example:

  * At 15 Gwei, the cost is approximately 0.009 ETH.
  * At 30 Gwei, the cost is approximately 0.018 ETH.

  To minimize your costs, you can opt to claim during a period when the Gwei is low. For current gas prices, you can check the [Etherscan Gas Tracker](https://etherscan.io/gastracker).

### Where can I find the bridge token mapping?[​](https://docs-v2.mantle.xyz/users/faqs#where-can-i-find-the-bridge-token-mapping) <a href="#where-can-i-find-the-bridge-token-mapping" id="where-can-i-find-the-bridge-token-mapping"></a>

* You can view the bridge token mapping by visiting [this link](https://token-list.mantle.xyz/mantle.tokenlist.json). It provides comprehensive details on the token list and other related information.

<br>


---

## Source: network / for-users / how-to-guides

# How-to Guides

- [Connecting Wallet to Mantle Network](/network/for-users/how-to-guides/connecting-wallet-to-mantle-network.md)
- [Fetching Test Tokens](/network/for-users/how-to-guides/fetching-test-tokens.md)
- [Using Mantle Bridge](/network/for-users/how-to-guides/using-mantle-bridge.md)


---

## Source: network / more / audits

# Audits

## Secure3[​](https://docs-v2.mantle.xyz/intro/more/audits#secure3) <a href="#secure3" id="secure3"></a>

[Secure3](https://www.secure3.io/) is a battlefield where elite auditors compete to safeguard Web3 innovations against security threats. They have provided security audits for over 140 projects, including zkSync, Polkadot, and more! Here is the audit report for Mantle v2 Tectonic:

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td>Secure3 Audit Report</td><td>Mantle v2 Tectonic Security Audit</td><td></td><td><a href="https://github.com/mantlenetworkio/mantle-v2/blob/release/v1.0.0/technical-documents/security-reviews/Secure3/Mantle_V2_%20Secure3%20Audit%20Report.pdf">https://github.com/mantlenetworkio/mantle-v2/blob/release/v1.0.0/technical-documents/security-reviews/Secure3/Mantle_V2_%20Secure3%20Audit%20Report.pdf</a></td></tr><tr><td>Secure3 Public Audit Report</td><td>Mantle v2 Tectonic Security Public Audit</td><td></td><td><a href="https://github.com/mantlenetworkio/mantle-v2/blob/develop/technical-documents/security-reviews/Secure3/Mantle_V2_Public_Secure3_Audit_Report.pdf">https://github.com/mantlenetworkio/mantle-v2/blob/develop/technical-documents/security-reviews/Secure3/Mantle_V2_Public_Secure3_Audit_Report.pdf</a></td></tr></tbody></table>

## OpenZeppelin[​](https://docs-v2.mantle.xyz/intro/more/audits#openzeppelin) <a href="#openzeppelin" id="openzeppelin"></a>

OpenZeppelin provides a complete suite of security products to adopt security best practices from the first line of code all the way to running your decentralized application on-chain. OpenZeppelin security audits are trusted by leading organizations building decentralized systems. Here is the audit report for Mantle v2 Tectonic:

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td>OZ Security Audit</td><td>Mantle v2 Tectonic Op-Geth Security Audit</td><td></td><td><a href="https://github.com/mantlenetworkio/mantle-v2/blob/release/v1.0.0/technical-documents/security-reviews/OpenZeppelin/Mantle%20Op-Geth%20Audit%20Final%20Report%20(March%202024).pdf">https://github.com/mantlenetworkio/mantle-v2/blob/release/v1.0.0/technical-documents/security-reviews/OpenZeppelin/Mantle%20Op-Geth%20Audit%20Final%20Report%20(March%202024).pdf</a></td></tr><tr><td>OZ Security Audit</td><td>Mantle v2 Tectonic Contracts Security Audit</td><td></td><td><a href="https://github.com/mantlenetworkio/mantle-v2/blob/release/v1.0.0/technical-documents/security-reviews/OpenZeppelin/Mantle%20V2%20Solidity%20Contracts%20Audit%20Report%20(March%202024).pdf">https://github.com/mantlenetworkio/mantle-v2/blob/release/v1.0.0/technical-documents/security-reviews/OpenZeppelin/Mantle%20V2%20Solidity%20Contracts%20Audit%20Report%20(March%202024).pdf</a></td></tr><tr><td>OZ Security Audit</td><td>Mantle v2 Tectonic node and off-chain system Security Audit</td><td></td><td><a href="https://github.com/mantlenetworkio/mantle-v2/blob/release/v1.0.0/technical-documents/security-reviews/OpenZeppelin/Mantle%20Node%2C%20Batcher%2C%20Proposer%2C%20and%20Tooling%20Incremental%20Final%20Audit%20Report%20(March%202024).pdf">https://github.com/mantlenetworkio/mantle-v2/blob/release/v1.0.0/technical-documents/security-reviews/OpenZeppelin/Mantle%20Node%2C%20Batcher%2C%20Proposer%2C%20and%20Tooling%20Incremental%20Final%20Audit%20Report%20(March%202024).pdf</a></td></tr></tbody></table>

## Sigma Prime[​](https://docs-v2.mantle.xyz/intro/more/audits#sigma-prime) <a href="#sigma-prime" id="sigma-prime"></a>

[Sigma Prime](https://sigmaprime.io/) is a leading blockchain security and research firm with an extensive history in decentralized technology.

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td>Sigma Prime Audit Report</td><td>Mantle v2 Tectonic Security Audit</td><td></td><td><a href="https://github.com/mantlenetworkio/mantle-v2/blob/release/v1.0.0/technical-documents/security-reviews/SigmaPrime/Sigma_Prime_Mantle_L2_Rollup_V2_Security_Assessment_Report_v2_0.pdf">https://github.com/mantlenetworkio/mantle-v2/blob/release/v1.0.0/technical-documents/security-reviews/SigmaPrime/Sigma_Prime_Mantle_L2_Rollup_V2_Security_Assessment_Report_v2_0.pdf</a></td></tr></tbody></table>

<br>


---

## Source: network / more / faqs

# FAQs

## General[​](https://docs-v2.mantle.xyz/intro/more/faqs#general) <a href="#general" id="general"></a>

* **What signature algorithm does Mantle Network use?**

  Mantle Network uses the same signature algorithm as Ethereum. (ECDSA on the secp256k1 curve)
* **What is the block gas limit on Mantle Network?**

  The block gas limit is currently set to 250,000,000,000, or 250B units.
* **What's the average block time on Mantle Network?**

  In Mantle Network, the OP Stack framework design of 2s per L2 block production is adopted.

  info

  If the L1 node fails to synchronize a new block for more than 600s, L2 will pause block production, and once the L1 node recovers, the L2 node will return to normal, and the timestamp of the L2 block is guaranteed to be strictly incremented by 2s.
* **How does transaction finality work on Mantle Network?**
  * Transaction/block finality on L2 will depend on the finalized time of the transactions packed onto L1 (2 epochs, which is about 15mins)
  * Transaction/block finality on L1 connects to the challenge period, which is currently set at 7 days
* **Are fraud proofs online on Mantle Network?**

  **Not yet**, fraud proofs are in development in Mantle v2 Tectonic. For more details on Mantle Network's implementation, check out the page on Fraud Proofs.
* **How does modular data availability bring down transaction costs?**

  The majority of L2 gas costs (>70%) are incurred as the cost to publish data on L1 Ethereum. With Mantle DA powered by EigenDA technology, only state root data (along with very limited transaction data) is posted to L1 contracts, while the rollup data is posted to Mantle DA, which helps bring down the overall cost significantly.
* **Where can I find the brand resources for Mantle Network?**

  You can access brand resources by following [this link](https://drive.google.com/drive/folders/1GGyOmob0i86mEUqBTPvZLAhgnzt3Oxaa).

## Protocol[​](https://docs-v2.mantle.xyz/intro/more/faqs#protocol) <a href="#protocol" id="protocol"></a>

* **Do Rollup Verifier nodes verify every piece of block data processed by the Sequencer?**

  Yes. All updated state roots are verified by Rollup Verifiers before they are submitted to L1 as a part of the rollup process.
* **Do Rollup Verifiers sync rollup data from the Sequencer?**

  No. Rollup Verifiers sync rollup data from Mantle DA, which they use to generate state roots and verify the updated state roots generated by the Sequencer before they are published to L1.
* **What happens if a Rollup Verifier detects mismatch between L2 block data with L1?**

  Before fraud proofs are online on Mantle Network, if Rollup Verifiers detect a discrepancy when verifying the updated state roots, the rollup mechanism on L2 is temporarily halted. You can learn more about failure handling [here](https://docs.mantle.xyz/network/system-information/risk-management/forced-transaction-inclusion).


---

## Source: network / more / glossary

# Glossary

## Batcher[​](https://docs-v2.mantle.xyz/intro/more/glossary#batcher) <a href="#batcher" id="batcher"></a>

Batcher is a node role that packs transactions in L2 into batches and uploads them to L1. See [here](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#op-batcher) for more information.

## Bridge[​](https://docs-v2.mantle.xyz/intro/more/glossary#bridge) <a href="#bridge" id="bridge"></a>

App developers and users commonly need to move data and assets between layer 1 (L1) and layer 2 (L2). We call the process of moving data and assets between the two networks "bridging".

## Channel[​](https://docs-v2.mantle.xyz/intro/more/glossary#channel) <a href="#channel" id="channel"></a>

Channel is a data structure used in OP Stack to store compressed and encoded sequencer batches, by storing multiple batches together to achieve a better compression rate and reduce data availability cost. For more details, please check [here](https://github.com/mantlenetworkio/mantle-v2/blob/develop/specs/glossary.md#channel).

## EIP-1559 transaction[​](https://docs-v2.mantle.xyz/intro/more/glossary#eip-1559-transaction) <a href="#eip-1559-transaction" id="eip-1559-transaction"></a>

[EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) introduces a new transaction type for Ethereum transactions. Unlike traditional transactions where users set their gas prices, EIP-1559 introduces a mechanism that automatically determines the transaction fee based on network demand.

## Fraud proof / Fault proof[​](https://docs-v2.mantle.xyz/intro/more/glossary#fraud-proof--fault-proof) <a href="#fraud-proof--fault-proof" id="fraud-proof--fault-proof"></a>

An on-chain challenge mechanism initiated by a verifier, where the verifier, after fetching the state root from L1, compares it with the state root provided by the DA, and initiates single/multiple rounds of interactive/non-interactive proofs on the chain in case of inconsistency.

## Hardware security module (HSM)[​](https://docs-v2.mantle.xyz/intro/more/glossary#hardware-security-module-hsm) <a href="#hardware-security-module-hsm" id="hardware-security-module-hsm"></a>

A hardware security module is a specialized hardware device designed to safeguard sensitive information, keys, and cryptographic operations from unauthorized access and attacks. In Mantle Network, we use a hardware security module for custody of crucial accounts in modules like [`op-proposer`](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#op-proposer), [`op-batcher`](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#op-batcher), etc.

## Legacy transaction[​](https://docs-v2.mantle.xyz/intro/more/glossary#legacy-transaction) <a href="#legacy-transaction" id="legacy-transaction"></a>

Refers to the format of transactions before the introduction of type transactions using [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718). These transactions are identified as type `0x0` and contain parameters such as `nonce`, `gasPrice`, `gasLimit`, `to`, `value`, `data`, `v`, `r` and `s`.

## MIPS[​](https://docs-v2.mantle.xyz/intro/more/glossary#mips) <a href="#mips" id="mips"></a>

MIPS architecture, which stands for Microprocessor without Interlocked Pipeline Stages, is a type of computer architecture that uses a Reduced Instruction Set Computing (RISC) design philosophy. See more details [here](https://en.wikipedia.org/wiki/MIPS_architecture).

## Modular chains[​](https://docs-v2.mantle.xyz/intro/more/glossary#modular-chains) <a href="#modular-chains" id="modular-chains"></a>

In a Modular Blockchain, the core functions of blockchain operation (execution, consensus, settlement, data availability) are performed on specialized layers. By applying this principle to a rollup, we can optimize the solution since each layer is now performing a specialized task. This leads to lower costs and better overall performance.

## Monolithic chains[​](https://docs-v2.mantle.xyz/intro/more/glossary#monolithic-chains) <a href="#monolithic-chains" id="monolithic-chains"></a>

The entire blockchain system is viewed as a monolithic, tightly coupled entity. With this structure, all functions and protocols are built into the same chain.

## Optimistic Rollup[​](https://docs-v2.mantle.xyz/intro/more/glossary#optimistic-rollup) <a href="#optimistic-rollup" id="optimistic-rollup"></a>

Optimistic rollups (ORs) are L2 protocols designed to increase the throughput of Ethereum. They reduce computation load on the main Ethereum chain by taking computation and state storage off-chain and processing transactions in batches. ORs are considered “optimistic” because they assume off-chain transactions are valid and don't publish proofs of validity for transaction batches posted on-chain, and also use Fraud proof to detect and deal with invalid status.

## Proposer[​](https://docs-v2.mantle.xyz/intro/more/glossary#proposer) <a href="#proposer" id="proposer"></a>

Proposer and Batcher are similar functions, but it packs not the transactions themselves, but the state after the transactions are completed, and sends the state root to the corresponding contract in L1. For more details, please check [here](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#op-proposer).

## Reorg[​](https://docs-v2.mantle.xyz/intro/more/glossary#reorg) <a href="#reorg" id="reorg"></a>

Reorg, i.e., chain re-organization, refers to the situation where a transaction is rejected after it has been accepted due to a network attack or other factors, which often occurs in the L2 re-org situation after L1 has been attacked.

## Sequencer[​](https://docs-v2.mantle.xyz/intro/more/glossary#sequencer) <a href="#sequencer" id="sequencer"></a>

Sequencer is a node role consisting of [op-node](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#op-node) and [op-geth](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#op-geth) that performs transaction ordering in L2 and L2 block production. See [here](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#sequencer) for more information.

## Verifier[​](https://docs-v2.mantle.xyz/intro/more/glossary#verifier) <a href="#verifier" id="verifier"></a>

Verifier is a node role consisting of [op-node](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#op-node) and [op-geth](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#op-geth) that provides users with verified transactions and state root in L2, and it also initiates fraud proof in case of inconsistency in the state of on-chain and off-chain transactions to ensure the validity of transactions. See [here](https://docs.mantle.xyz/network/system-information/off-chain-system/node-introduction#verifier) for more information.

## WASM[​](https://docs-v2.mantle.xyz/intro/more/glossary#wasm) <a href="#wasm" id="wasm"></a>

WebAssembly, commonly abbreviated as WASM, is a binary instruction format that serves as a portable compilation target for high-level programming languages. It is designed to enable efficient execution of code on web browsers but is not limited to the web environment. WASM allows code to run at near-native speed, providing a performance boost compared to traditional web development technologies. See more details [here](https://en.wikipedia.org/wiki/WebAssembly).


---

## Source: meth

# Overview | mETH Protocol

Status (Liquidity Buffer): Live, capped production testing

## Description

mETH Protocol is a permissionless, vertically integrated protocol for ETH liquid staking (with liquidity buffers in Aave) and liquid restaking, available at https://www.methprotocol.xyz/.

## Key Points

### mETH Staking
mETH is a value-accumulating receipt token for ETH staking. Users can redeem mETH for the underlying principal and accumulated ETH rewards. It is a straightforward product with risk-reward profile associated with Ethereum 2.0 validation services.

### mETH Liquidity Buffer
Since 2025-10-24, the protocol has implemented the Liquidity Buffer, feature which maintains non-staked ETH to meet redemption requests and deposits this ETH deposited into blue-chip lending protocols such as AAVE main markets to maintain yield. Without this feature, withdrawal requests could take as much as 50 days.

### cmETH
cmETH is a 1:1 receipt token for mETH restaking across a portfolio of positions, including EigenLayer and associated Actively Validated Services. Rewards accrue in multiple third-party assets, which users can claim periodically.

### cmETH Unified Receipt Token
cmETH is a unified receipt token for a portfolio of restaking positions, providing users with a convenient way to participate in the risk-reward profile of restaking.

### cmETH Omnichain
cmETH utilizes the LayerZero OFT standard, providing added convenience to users by enabling fast bridging between chains within minutes and without slippage.

### Capital Efficiency
Both mETH and cmETH can be leveraged across a range of DeFi and centralized applications (with deeper partnership with Bybit), such as collateral for money markets or perpetual trading.

### COOK
COOK is the governance token for mETH Protocol.

### Opt-in
Users opt in to their desired risk-reward profile by choosing to hold either mETH or cmETH. mETH does not assume restaking risk. cmETH incorporates the risk-reward profile of mETH and adds the risk-reward profile of restaking.


---

## Source: meth / introduction / timeline

# Timeline

### 2025-10-24 mETH Liquidity Buffer feature

This reduces withdrawal request delays by maintaining a higher amount of non-staked ETH, which can earn yield on Aave.

### 2024-10-30 cmETH Public Launch

cmETH public access including subscription and redemption vaults, transfers, and OFT bridging.

### 2024-10-29 COOK Public Launch

COOK TGE on exchanges.

COOK claimability for various campaigns (Methamorphosis, MNT Rewards Station, CEX Campaigns, Quests).

### 2024-08-19

Mantle LSP rebrands as '**mETH Protocol**', as approved by [MIP-30 Clause 1](https://snapshot.org/#/bitdao.eth/proposal/0xdf25641c7eff926b73ae9b73236c8f487eb04c247e829661625d8ff855864c4e).

### 2024-08-06

cmETH vault deployed in production (Ethereum L1), with permissioned access, and first deposit testing.

### 2024-07-01

Launch of [Methamorphosis campaign](https://www.mantle.xyz/blog/announcements/season-1-methamorphosis) (Season 1 of cmETH / COOK early adopter program).

### 2024-05-28

cmETH Proposal approved via [MIP-30](https://snapshot.org/#/bitdao.eth/proposal/0xdf25641c7eff926b73ae9b73236c8f487eb04c247e829661625d8ff855864c4e).

### 2024-04-29 cmETH Proposal

Expansion of Mantle LSP (to restaking and separate governance governance token) proposed to the community via a [Mantle forum post](https://forum.mantle.xyz/t/passed-mip-30-exploring-the-next-phase-of-meth/8728).

### 2023-12-22

[Double Dose Drive](https://www.mantle.xyz/blog/announcements/meth-double-dose-drive) launch campaign.

### 2023-12-08 mETH Public Launch

Mainnet v1 (permissionless staking, 250000 mETH cap).

### 2023-11-22

Permissioned Alpha (expanded whitelist, 50000 mETH cap).

### 2023-10-06

Mainnet contracts deployed for Permissioned Closed Alpha (core contributor whitelist, 1000 mETH cap).

### **2023-08-05**

Staking of Treasury ETH authorized by a August 5, 2023  [Governance Proposal MIP-25](https://snapshot.org/#/bitdao.eth/proposal/0xa34107e34b4dc4ff4cd16b77d66e62a51f4d35457a4f4b1f68ab8ac821f58561).

### **2023-07-14 mETH Proposal**

Mantle LSP proposed to the community via a [Mantle forum post](https://forum.mantle.xyz/t/discussion-mantle-lsd/7085). Mantle LSP represents the second core product of [Mantle Ecosystem](https://www.mantle.xyz/), following [Mantle Network L2](https://docs.mantle.xyz/network/introduction/overview).


---

## Source: meth / components / architecture

# Architecture

- [Staking / mETH](/meth/components/architecture/staking-meth.md)
- [Restaking / cmETH](/meth/components/architecture/restaking-cmeth.md)


---

## Source: meth / components / merkle-roots

# Merkle Roots

## Background

This page lists the active MerkleRoots and Leafs: a cryptographically secured **whitelist of actions** available to the Strategists, such as mETH routing and rebalancing.

The system supports multiple MerkleRoots and multiple Strategists, with each Strategist limited to one MerkleRoot.

For access control and role separation purposes, we have split the MerkleRoots into three types:

* Root\_Standard — for rebalancing operations
* Root\_Setup — for one-time configurations such as `acceptOwnership()`
* Root\_Security — to handle unanticipated requirements, such as changes to third party protocols

For more details on the mechanics, interpretation, and walkthroughs, please see [merkle-verification](https://docs.mantle.xyz/meth/concepts/merkle-verification "mention")

## Active List

The current roots can be found by analyzing the logs of the following function:

&#x20;[`ManagerWithMerkleVerification.setManageRoot()`](https://etherscan.io/address/0xAEC02407cBC7Deb67ab1bbe4B0d49De764878bCE#writeContract#F6)

```json
{
  "Root_Standard": {
    "RootID": "0x1c507dd81e210ab113f5aaa7a363080c5c459dd652ca51f94e23eb21fe9862ca",
    "Strategists": {
      "Veda": "0x3AD03F992FE3282830dd36016B409Cf9B055a3dD",
      "Mantle": "0xbDFae803A88BB4f71aA1B7ba00893B21A42862D0"
    }
  },
  "Root_Setup": {
    "RootID": "0x998cebb020d797c4fdb030bb0b292199b22f5ae9be65c568b93ce5658d7ee16c",
    "Strategists": {
      "Veda": "0x56B7A6726C7B3e6F6634963dBE104b143fE06e05",
      "Mantle": "0xD3C0363B30b798256E77C70fDaF725008926e2Ec"
    }
  },
  "Root_Security": {
    "RootID": "0x67acf95841ccb9b49736eca8f36ef4a5b51e728b04523ef02eb668dcd28a046b",
    "Strategists": {
      "MLSPSecL1": "0x849738999Ba1F3D995d28bDB35efA2E47B4c8203"
    }
  }
}
```

## **Resources**

**Historical Example**

For an example of a previously used production Root\_Standard, please refer to the following file:

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2Ftx1daEKLjoZIA4mlSsMa%2FStandard_240921_4e64.json?alt=media&token=9fc95a7a-0e13-432c-9430-71ef7e3f5bc8>" %}


---

## Source: meth / components / off-chain-systems

# Off-Chain Systems

- [Staking / mETH](/meth/components/off-chain-systems/staking-meth.md)


---

## Source: meth / components / smart-contracts

# Smart Contracts

- [Staking / mETH](/meth/components/smart-contracts/staking-meth.md)
- [Restaking / cmETH](/meth/components/smart-contracts/restaking-cmeth.md)
- [COOK](/meth/components/smart-contracts/cook.md)


---

## Source: meth / concepts / accounting

# Accounting

- [Total Controlled ETH](/meth/concepts/accounting/total-controlled-eth.md)
- [Calculating Fees](/meth/concepts/accounting/calculating-fees.md)
- [Calculating APY](/meth/concepts/accounting/calculating-apy.md)


---

## Source: meth / concepts / merkle-verification

# Merkle Verification

{% hint style="danger" %}
**Status: Under Development**

*The contents of this page are currently under development and may be updated frequently without prior notice. It is not recommended to use the information on this page for production purposes.*
{% endhint %}

{% hint style="info" %}
mETH Protocol has partnered with [Veda](https://veda.tech/) for Merkle verification and vault components. For more information, please visit: <https://docs.veda.tech/>.
{% endhint %}

## Simplified Diagram

<figure><img src="https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2F9CcD1GMHJ5qGpA2qRV2o%2FMerkleVerification%20v240819.2.png?alt=media&#x26;token=4dcd8952-7418-41d5-8b2c-9262c8852f02" alt=""><figcaption><p>MerkleVerification v240819-2</p></figcaption></figure>

## Key Points

* Each permitted action of the Strategist is detailed within a Merkle Leaf 's structured data, and hashed into a MerkleLeafDigest or MerkleProof.
* When a Strategist attempts to take a rebalancing action (e.g. transfer mETH from the BoringVault to PositionManager1), this call must be accompanied with the corresponding MerkleProof which is verified against the MerkleRoot.
* The MerkleRoot is the cryptographic summary of all MerkleLeafs. Currently active Roots and Leafs can be found here: [merkle-roots](https://docs.mantle.xyz/meth/components/merkle-roots "mention")
* The BoringVault.Manager contract can contain multiple MerkleRoots and assigned Strategists. This allows for flexibility (for example we can have limited function and full function MerkleRoots) and redundancy (for example we can have multiple backup Strategist incase the primary Strategist is offline).

## Component Details

A list of all active Leafs and Roots can be found here [merkle-roots](https://docs.mantle.xyz/meth/components/merkle-roots "mention").

### MerkleLeafs

#### Example Format&#x20;

The code example below is for one Leaf associated with the rebalancing of mETH to the WithdrawerContract. This involves: interacting with the [`mETHToken`](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa#writeProxyContract) (targetAddress: 0xd5...ADfa); and [`Transfer`](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa#writeProxyContract#F11) function (0xa9059bb); and with `Destination Address` being the [DelayWithdrawal contract](https://etherscan.io/address/0x12Be34bE067Ebd201f6eAf78a861D90b2a66B113#readContract) (AddressArguement: 0x12....B113).&#x20;

```json
{
            "AddressArguments": [
                "0x12Be34bE067Ebd201f6eAf78a861D90b2a66B113"
            ],
            "CanSendValue": false,
            "DecoderAndSanitizerAddress": "0xa728337af7dD226B74B0b1546AA7dD54d340d5Eb",
            "Description": "Transfer mETH to the delayed withdrawer contract",
            "FunctionSelector": "0xa9059cbb",
            "FunctionSignature": "transfer(address,uint256)",
            "LeafDigest": "0x354d2d9c40ed196e4ecb482c8117a33dce43d100ef8b68a3f5886f4d8d2877d9",
            "PackedArgumentAddresses": "0x12be34be067ebd201f6eaf78a861d90b2a66b113",
            "TargetAddress": "0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa"
}
```

#### Descriptions

<table><thead><tr><th width="212">Item</th><th>Description</th></tr></thead><tbody><tr><td>LeafDigest</td><td>This serves as a Leaf "Id". It is a "hash result of structured data in every leaf element, and merkle tree constructed with the range of leaf digests by a fixed sequence". For more details see: <a href="https://soliditydeveloper.com/merkle-tree">https://soliditydeveloper.com/merkle-tree</a></td></tr><tr><td>TargetAddress</td><td>The smart contract address being interacted with. For example: for transfering mETH token it will be the mETH token address; for existing restaking positions it will be the restaking protocol smart contract address.</td></tr><tr><td>FunctionSelector, FunctionSignature</td><td>The smart contract function being called. For example: transfer, deposit, withdraw, claim, delegate.</td></tr><tr><td>AddressArguments</td><td>Contains the address arguments if required as part of the Function. For example: transfer destination addresses.</td></tr><tr><td>DecoderAndSanitizer</td><td>DecodersAndSanitizers are required when integrating with a new external protocol. Their job is to decode input target data, extract a bytes value comprised of addresses found in the target data, and to sanitize other non address argument values.<br><a href="https://docs.veda.tech/architecture-overview/decoderandsanitizer">https://docs.veda.tech/architecture-overview/decoderandsanitizer</a></td></tr></tbody></table>

### MerkleRoots

#### Example Format&#x20;

```json
{
        "AccountantAddress": "0x6049Bd892F14669a4466e46981ecEd75D610a2eC",
        "BoringVaultAddress": "0x33272D40b247c4cd9C646582C9bbAD44e85D4fE4",
        "DecoderAndSanitizerAddress": "0xa728337af7dD226B74B0b1546AA7dD54d340d5Eb",
        "DigestComposition": [
            "Bytes20(DECODER_AND_SANITIZER_ADDRESS)",
            "Bytes20(TARGET_ADDRESS)",
            "Bytes1(CAN_SEND_VALUE)",
            "Bytes4(TARGET_FUNCTION_SELECTOR)",
            "Bytes{N*20}(ADDRESS_ARGUMENT_0,...,ADDRESS_ARGUMENT_N)"
        ],
        "LeafCount": 60,
        "ManageRoot": "0x9746e6e59bb9c9a05af48b466df5be3dbd2bd8db622ecb1e7d1c1451de273e2c",
        "ManagerAddress": "0xAEC02407cBC7Deb67ab1bbe4B0d49De764878bCE",
        "TreeCapacity": 64
}
```

### Updating MerkleRoots

#### Key Points

* Full name: [`BoringVaultManager.setManageRoot()`](https://etherscan.io/address/0xAEC02407cBC7Deb67ab1bbe4B0d49De764878bCE#writeContract#F6)
* This function is called when modifying constraints (MerkleRoots) or Strategists.
* There can be multiple MerkleRoots and assigned Strategists.
* Each Strategist can only be assigned one MerkleRoot.

#### Etherscan Interface

<figure><img src="https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2F8IxmWiqX3KswCOOiQtMW%2Fimage.png?alt=media&#x26;token=8281ee87-fff5-48f7-a5ad-3e11fb401cc8" alt=""><figcaption><p><a href="https://etherscan.io/address/0xAEC02407cBC7Deb67ab1bbe4B0d49De764878bCE#writeContract#F6">https://etherscan.io/address/0xAEC02407cBC7Deb67ab1bbe4B0d49De764878bCE#writeContract#F6</a></p></figcaption></figure>

### Rebalancing mETH

#### Key Points

* Full name: [`BoringVaultManager.manageVaultWithMerkleVerification()`](https://etherscan.io/address/0xAEC02407cBC7Deb67ab1bbe4B0d49De764878bCE#writeContract#F2)
* This function is called by Strategists when rebalancing mETH (e.g., between the BoringVault and PositionManagers or DelayedWithdrawal contracts.

#### Etherscan Interface

<figure><img src="https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2FqG1bfqTtxjlcWBX7bfk0%2Fimage.png?alt=media&#x26;token=8f3b514c-477e-4736-9c8c-a7e9c920dbb7" alt=""><figcaption><p><a href="https://etherscan.io/address/0xAEC02407cBC7Deb67ab1bbe4B0d49De764878bCE#writeContract#F2">https://etherscan.io/address/0xAEC02407cBC7Deb67ab1bbe4B0d49De764878bCE#writeContract#F2</a></p></figcaption></figure>

## Strategist Walkthrough

*For manual rebalancing*

{% embed url="<https://7seascapital.notion.site/BoringVault-Manual-Rebalance-3e4065b44c9749f4ae3870058aa175b6>" %}

## Additional Resources

<https://soliditydeveloper.com/merkle-tree>

<https://docs.veda.tech/architecture-overview/manager/managerwithmerkleverification>

<https://docs.alchemy.com/docs/merkle-trees-in-blockchains>

<https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/>


---

## Source: meth / concepts / risk-management

# Risk Management

- [Exchange Rate](/meth/concepts/risk-management/exchange-rate.md)
- [Pausing](/meth/concepts/risk-management/pausing.md)
- [Oracle Validity Checks](/meth/concepts/risk-management/oracle-validity-checks.md)
- [Oracle Sanity Checks](/meth/concepts/risk-management/oracle-sanity-checks.md)
- [Oracle Quorum](/meth/concepts/risk-management/oracle-quorum.md)
- [Slashing Event Handling](/meth/concepts/risk-management/slashing-event-handling.md)
- [Custody](/meth/concepts/risk-management/custody.md)
- [Quotation and Slippage](/meth/concepts/risk-management/quotation-and-slippage.md)
- [New Stake Frontrunning](/meth/concepts/risk-management/new-stake-frontrunning.md)
- [Unstake Griefing](/meth/concepts/risk-management/unstake-griefing.md)
- [Upgradability and Timelock](/meth/concepts/risk-management/upgradability-and-timelock.md)


---

## Source: meth / concepts / trading

# Trading

- [Primary Market Rates](/meth/concepts/trading/primary-market-rates.md)


---

## Source: meth / governance / tokenomics

# Tokenomics

{% hint style="info" %}
**Transfer Restrictions**\
The content contained in this website does not constitute an offer or sale of securities in or into the United States, or to or for the account or benefit of U.S. persons, or in any other jurisdictions where it is unlawful to do so. Transfer of COOK tokens may be subject to legal restrictions under applicable laws. Under no circumstances shall COOK tokens be reoffered, resold or transferred within the United States or to, or for the account or benefit of, U.S. persons, except pursuant to an exemption from, or in a transaction not subject to, the registration requirements of the U.S. Securities Act of 1933, as amended.
{% endhint %}

## Use Case

COOK is the governance token for the mETH protocol, used to vote on the direction of the ecosystem and other strategic matters.

## Specification

### **Token Addresses**

[eth:0x9F0C013016E8656bC256f948CD4B79ab25c7b94D](https://etherscan.io/token/0x9F0C013016E8656bC256f948CD4B79ab25c7b94D)\
[mantle:0x9F0C013016E8656bC256f948CD4B79ab25c7b94D](https://explorer.mantle.xyz/token/0x9F0C013016E8656bC256f948CD4B79ab25c7b94D)

### **Compatibility**

ERC-20 compatible, DeFi compatible.

### **Bridging Format**

COOK is natively deployed on Ethereum L1 and utilizes the [LayerZero V2 OFT](https://docs.layerzero.network/v2/developers/evm/oft/quickstart) standard. It follows a  `Lock / Unlock` mechanism on the Ethereum L1 Gateway, and a `Mint / Burn` mechanism on other chains. The amount locked on Ethereum L1 will always match the sum of net-minted tokens across all other chains.

When a user requests a bridge transaction from L1 to another chain, COOK will be locked in the relevant LayerZeroL1 Adapter (Gateway) smart contract, and minted on the destination chain (e.g., Mantle L2). User requests are cryptographically signed and verified by LayerZero endpoints on both source and destination chains. Users can bridge from any chain to any other supported chain without necessarily routing through Ethereum L1.

Bridge finality takes **5-20 minutes** in any direction.

### Total Supply

5,000,000,000 COOK

Note: As a LayerZero V2 OFT, the native token will be minted and its supply controlled on EthereumL1, with total supply viewable here: [Etherscan Link](https://etherscan.io/token/0x9F0C013016E8656bC256f948CD4B79ab25c7b94D#readProxyContract#F20).

When COOK is bridged to other chains, a portion of this supply will be locked and unlocked through the [L1COOK\_LayerZeroAdapter contract](https://etherscan.io/address/0xc14459931cf666dccad582d63288aefb9f0bdca9#writeProxyContract). The token supply locked in this contract will match the aggregate supply on other chains.

### Circulating Supply

The circulating supply can be defined as the quantity of COOK not held within the mETH Protocol and Mantle Treasuries, see: [treasury](https://docs.mantle.xyz/meth/governance/treasury "mention").

## Distribution and Vesting

### Overall

<table><thead><tr><th width="263">Category</th><th width="193">Amount</th><th>Vesting</th></tr></thead><tbody><tr><td>Core Contributor Team</td><td>500,000,000<br><em>10%</em></td><td>12 month cliff, 3 year linear</td></tr><tr><td>mETH Protocol Community</td><td>3,000,000,000<br><em>60%</em></td><td></td></tr><tr><td>Mantle Treasury</td><td>1,500,000,000<br><em>30%</em></td><td></td></tr></tbody></table>

Notes:

\[1] The above numbers are **estimates only** and will be finalized prior to TGE. The scope will be restricted by the [MIP-30 Authorization](https://snapshot.org/#/bitdao.eth/proposal/0xdf25641c7eff926b73ae9b73236c8f487eb04c247e829661625d8ff855864c4e).

\[2] Vesting schedules will commence with TGE and / or primary exchange listing date.

### Initial Circulating Supply

The public launch of the token was on 2024 October 29.

At that time the circulating supply is approximately  COOK 873,000,000 (\~17.4% of total supply) with the following breakdown:\
\
**TVL Campaign (Methamorphosis S1) and Quests**\
Quantity: 235,000,000 COOK (4.7%)

**TVL Campaign, Puff**\
Quantity: 300,000,000 COOK (6.0%)\
Source: mETH Protocol Community\
Note: Serves as a retroactive TVL campaign for mETH

**CEX Listing Campaigns**\
Quantity: 78,000,000 COOK (1.6%)\
Source: mETH Protocol Community\
Note: Includes launchpool, launchpad type activities

**Growth Campaigns**\
Quantity: 60,000,000 COOK (1.2%)\
Source: mETH Protocol Community, general marketing and growth activities

**MNT RewardsStation, COOK**\
Quantity: 200,000,000 COOK (4%)\
Source: MantleTreasury<br>

Note: there may be COOK loans to service providers to facilitate exchange liquidity. Such are not included in the above as they are loans and will look to mETH Protocol Treasury in the future.

\ <br>


---

## Source: meth / governance / treasury

# Treasury

## Treasury Holdings

<table><thead><tr><th width="252">Name</th><th>Address</th></tr></thead><tbody><tr><td>MPTreasuryL1-Core</td><td><a href="https://etherscan.io/address/0x00354d59E829fB79e2Ff7D8a022553728520cB6A">eth:0x00354d59E829fB79e2Ff7D8a022553728520cB6A</a></td></tr><tr><td>MPTreasuryL1-Eco</td><td><a href="https://etherscan.io/address/0x18d336d33a5be54cC62C9034e3a66e3220AA268a">eth:0x18d336d33a5be54cC62C9034e3a66e3220AA268a</a></td></tr><tr><td>MPTreasuryL1-Rewards</td><td><a href="https://etherscan.io/address/0xfB7e8892fBDa0205f6BbdbCd90dD9b0bDD321D16">eth:0xfB7e8892fBDa0205f6BbdbCd90dD9b0bDD321D16</a></td></tr><tr><td>MPTreasuryL2-Core</td><td><a href="https://mantlescan.xyz/address/0x0CA28e2D07268325ce7f5eCe5ACde658a4769CD7">mantle:0x0CA28e2D07268325ce7f5eCe5ACde658a4769CD7</a></td></tr><tr><td>MPTreasuryL2-Eco</td><td><a href="https://explorer.mantle.xyz/address/0x931FCb5bC6CaFaFbA0Ce921f31AFD27C144F2fD5">mantle:0x931FCb5bC6CaFaFbA0Ce921f31AFD27C144F2fD5</a></td></tr><tr><td>MPTreasuryL2-Contributor</td><td><a href="https://explorer.mantle.xyz/address/0x381e7741a183C8E0c6Ec1AFa183842E597144Ed0">mantle:0x381e7741a183C8E0c6Ec1AFa183842E597144Ed0</a></td></tr></tbody></table>

Note: $COOK will be held in "Core" treasuries and internally transferred to "Eco" and "Contributor" treasuries based on approved vesting schedules prior to distribution to third parties. "MP" denotes mETH Protocol. "Eco" encompasses ecosystem programs including TVL campaigns (seasons) and grants. "Contributor" is for handling core contributor payments, governed by specific authorized limits and vesting schedules. "Rewards" handles of rewards and payments from the cmETH restaking product.

## Fee Related

<table><thead><tr><th width="256">Name</th><th>Address</th></tr></thead><tbody><tr><td>For staking</td><td><a href="https://etherscan.io/address/0x432ABcCb04DdD86Db9aA91FA3E03Fb566270c9ff">eth:0x432ABcCb04DdD86Db9aA91FA3E03Fb566270c9ff</a></td></tr><tr><td>For restaking</td><td><a href="https://etherscan.io/address/0x7C67679b147DDDa9BB219EbaA58AA3ab1d846BfC">eth:0x7C67679b147DDDa9BB219EbaA58AA3ab1d846BfC</a></td></tr></tbody></table>

Protocol fees, if applicable, are often streamed and initially captured at the above "Fee" addresses before being periodically transferred to the Treasury addresses (after any distributions to channel partners or validators).

## Budget Related

As per Term 4 of [MIP-30](https://snapshot.org/#/bitdao.eth/proposal/0xdf25641c7eff926b73ae9b73236c8f487eb04c247e829661625d8ff855864c4e), mETH Protocol's development will be financed via the Mantle Core budget before transitioning to an independent budget.


---

## Source: meth / security / audits

# Audits

## mETH Protocol updates 3.01

{% hint style="info" %}
This set of audits covers the **mETH architecture update**, including liquidity buffer and position manager for AAVE.
{% endhint %}

### 251113 Mixbytes

`LiquilityBuffer` `PositionManagerAAVE`

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2F7DhxKicJ8bDVIc97CU5f%2FMixBytes-BufferPool.pdf?alt=media&token=0204a917-9542-4959-80a6-204890ce04f0>" %}

### 251022 Hexens

`LiquilityBuffer` `PositionManagerAAVE`

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2FNQRVoWBNlZQgGHJqlE2P%2FHexens-BufferPool.pdf?alt=media&token=baa00251-295b-473e-b691-f0ad7bb7471e>" %}

### 251021 Blocksec

`LiquilityBuffer` `PositionManagerAAVE`

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2FNdXlRHtKYExIqqa9s7fP%2FBlocksec-BufferPool.pdf?alt=media&token=cffb4eb2-734a-47de-84ad-b4d564ae5b48>" %}

### 251020 Exvul

`LiquilityBuffer` `PositionManagerAAVE`

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2FIVOEAhgisB2EtOU2rwNP%2FExvul-BufferPool.pdf?alt=media&token=19234114-8c0e-4e19-94e4-155ad6ff4cda>" %}

## mETH Protocol updates 2.01

{% hint style="info" %}
This set of audits covers the **cmETH architecture**, including restaking vaults, position managers, and the cmETH receipt token; and **COOK token**.
{% endhint %}

### 241029 Mixbytes

&#x20; `cmETH` `BoringVault`&#x20;

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2FDQqPYLP8pvuxVwj4n6av%2FMantle%20cMETH%20Security%20Audit%20Report.pdf?alt=media&token=c5632071-99d6-4c2a-bfaa-94d1a050ccb4>" %}

### 241020 Fuzzland (Verilog)

`COOK` `PositionManagers`

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2F5uL6TUlJvsnMnZ3bTBfG%2Fverilog-mantle-fuzzland-cook-pm-audit-report.pdf?alt=media&token=65069fd0-9024-4f3c-aeae-c4859cc22228>" %}

### 241018 Quantstamp

`COOK` `PositionManagers` `cmETH`

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2FvRlXVC4cVdibzenmeS6I%2FMantle%20Fix%20Review%203%20Report.pdf?alt=media&token=f277b43c-88dd-4239-be00-134cc1b1b6ed>" %}

### 241015 Blocksec

`COOK`

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2FVvF5gHAjjBeZ25zObSz2%2FBlockSec%20Final%5BCook%5D.pdf?alt=media&token=244f97a5-9b79-489b-b811-17a2a1ce3724>" %}

### 240911 Secure3

`cmETH` `BoringVault`

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2Ff5ozoh0YRvxE3YO8FqMK%2FMantle-cmETH_Secure3_Audit_Report.pdf?alt=media&token=6d651cfe-1aff-427f-b154-97ab0cbfa16f>" %}

### 240831 Hexens

`cmETH` `BoringVault`

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2FT0QClInfYwk3ARBy1vrk%2Fmantle-cmeth-hexens-audit-aug-2024.pdf?alt=media&token=5dab2533-b293-46a3-b643-d6da0147153e>" %}

## mETH Protocol updates 1.01

{% hint style="info" %}
This set of audits covers the **mETH architecture**, including the ETH2.0 (Proof-of-Stake) components and the mETH receipt token. Please note that 'Mantle LSP' was the previous name of 'mETH Protocol'.
{% endhint %}

### 230825 Hexens&#x20;

`Token and Vault Smart Contracts`

<https://github.com/Hexens/Smart-Contract-Review-Public-Reports/blob/main/Mantle_SCs_Aug23(Public)(Liquid%20Staking%20Protocol).pdf>

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2FG407rVeB9SxJVhM28PEC%2FMantle_SCs_Aug23(Public)(Liquid%20Staking%20Protocol).pdf?alt=media&token=345caf8d-b15d-47c2-8075-6ae0557f3380>" %}

### 231002 Hexens

`Oracle`

<https://github.com/Hexens/Smart-Contract-Review-Public-Reports/blob/main/Mantle_Sep23(Public)%20(Oracle).pdf>

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2FMlIxHGCEPsOGBFdgxvrJ%2FMantle_Sep23(Public)%20(Oracle).pdf?alt=media&token=f469dd7d-aa4a-4c41-8f5f-1b1749033c5d>" %}

### 231030 MixBytes

`Token and Vault Smart Contracts`

<https://github.com/mixbytes/audits_public/blob/master/Mantle%20Network/Mantle%20Network%20METH%20Secuity%20Audit%20Report.pdf>

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2FZBSPwrDcGKf3Y7WyeJXr%2FMantle%20Network%20METH%20Secuity%20Audit%20Report%20Upd.pdf?alt=media&token=b7d5f27f-4eab-462d-bd49-b06e71c8b3da>" %}

### 231013 Secure3

`Oracle`

<https://secure3.io/contest/bbb030a7>

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2Fb5AJNmg1LvkJjL88oJCt%2FMantle-LSD-Oracle-Service-Core_final_Secure3_Audit_Report.pdf?alt=media&token=345131e5-7a93-445f-8b7b-c6a9edf242a4>" %}

### 231012 Secure3

`Token and Vault Smart Contracts`

<https://secure3.io/contest/64954f6b>

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2FEtxWvXpZa5vpZuHK1hGi%2FMantle-LSD-mntETH_final_Secure3_Audit_Report.pdf?alt=media&token=bdccee0e-d2e8-48ca-b8ea-c6a697b8d388>" %}

Note: in response to issue MNT-1: <https://github.com/mantle-lsp/contracts/blob/main/docs/claim-burn.md>

### 231121 Verilog - mETH L2

`L2_mETH`

<https://github.com/Verilog-Solutions/.github/blob/main/Audit/Mantle_Ecosystem_Audit/Mantle_LSP_L2_Report.pdf>

{% file src="<https://1633802790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCmiq1MQrm4dWpxTw2pun%2Fuploads%2FJgFbWoSYWVOJkwVeRceq%2FMantle_LSP_L2_Report.pdf?alt=media&token=ebd73a4a-149a-4db3-b552-1e670160aaff>" %}


---

## Source: meth / security / bug-bounty

# Bug Bounty

<https://immunefi.com/bounty/mantlelsp/>


---

## Source: meth / security / overview

# Overview

## Background

System Components (e.g., smartcontracts) are designed with **Functions** that can be called by permissioned **Roles**. Roles are mapped to **Signers** within the smartcontract code or via permissioning systems such as OZ AccessControl or Solmates.

Process

1. Assess each function's criticality
2. Assess performance requirements e.g. how often each function will be called, and required reaction time for signers.
3. Map function to roles; and map roles to signer addresses.

{% hint style="danger" %}
Note: For mETH Protocol, all **Critical** functions are only mapped to **Security Multisigs**.
{% endhint %}

## Function Criticality

<table><thead><tr><th width="199">Rating</th><th width="549">Definition</th></tr></thead><tbody><tr><td>Critical</td><td><ul><li>Can modify other critical role permissions (super admin).</li><li>Can move principal assets to custom destination addresses either directly via function call, or indirectly via first modifying routes.</li><li>Can cause the protocol to be drained via setting of risk parameters (e.g. exchange rates, fees, sanity bounds).</li><li>Can modify the core protocol logic (i.e. via upgrades)</li></ul></td></tr><tr><td>High</td><td><ul><li>Can move protocol fees or reward assets (but not principal assets).</li><li>Can collude with multiple other permissioned roles to indirectly drain assets via adjustment of risk parameters or other economic exploits. Note that this will likely require the collusion of all Pausers.</li></ul></td></tr><tr><td>Medium</td><td><ul><li>Cannot directly or indirectly access a material amount of assets.</li><li>Can cause service disruptions via malicious actions - e.g. pausing components of the protocol.</li></ul></td></tr><tr><td>Low</td><td><ul><li>Can cause service disruptions only via non-activity.</li></ul></td></tr></tbody></table>

## Signer Types

<table><thead><tr><th width="202">Type</th><th width="544">Comments</th></tr></thead><tbody><tr><td>Security Multisig</td><td>Reaction Time: 2 days+<br><br>Policy: typically requires at least 6 signers across multiple organizations (e.g. core team, and tech partners) and functions (e.g. engineering, business, finance)<br><br>Key Management: SAFE Multisig</td></tr><tr><td>Engineering Multisig</td><td>Reaction Time: within 6 hours<br><br>Policy: typically requires at least 3 signers within the same engineering team.</td></tr><tr><td>EOA</td><td>Reaction Time: within 6 hours<br><br>Key Management: hardware wallet</td></tr><tr><td>Service (Node)</td><td>Reaction Time: real time<br><br>Policy: can be flexibly setup as a single signer, with quorum or threshold rules, 1-of-M, or proposer-approver.<br><br>Key Management: typically real time nodes which need to have their private key online for the required system performance (i.e. hot wallet). The private key is protected by industry standard setups such as cloudHSM and secure enclaves.</td></tr></tbody></table>


---

## Source: meth / security / roles

# Roles

- [mETH Related](/meth/security/roles/meth-related.md): Scope of this page includes: the ETH-Staking-Vault and subsystems, and the mETH token.
- [LiquidityBuffer Related](/meth/security/roles/liquiditybuffer-related.md)
- [cmETH Related](/meth/security/roles/cmeth-related.md): Scope of this page includes: mETH-BoringVault and subsystems, and the cmETH token.
- [COOK Related](/meth/security/roles/cook-related.md)
- [Upgrade Related](/meth/security/roles/upgrade-related.md)


---

## Source: meth / additional-documents / brand-assets

# Brand Assets

[mETH Protocol Brand Assets (COOK, mETH, cmETH)](https://drive.google.com/drive/folders/1nTC-mxeeTqeg3g7KZrK-d6-tW15Vtxy4?usp=sharing)


---

## Source: meth / additional-documents / official-links

# Official Links

**Website:**

Product - <https://meth.mantle.xyz/>

Landing -  <https://www.mantle.xyz/meth>

**GitHub:** <https://github.com/mantle-lsp>

**Twitter:**

Primary - <https://x.com/mETHProtocol>

Secondary - <https://twitter.com/0xMantle>

**Blog:** <https://www.mantle.xyz/blog>

**Telegram:** <https://t.me/mantlenetwork>

**Discord:** <https://discord.com/invite/0xMantle>

**Reddit:** <https://reddit.com/r/0xMantle/>

**YouTube:** <https://www.youtube.com/@0xMantle>


---

## Source: governance / index

# Overview | Governance

## Summary

Token Holder Authority: Token holders determine the strategic direction of Mantle via the Mantle Governance process, including launching new product lines and initiatives, modifications to tokenomics, significant spending items or budget allocations, course-corrective actions, organizational structuring, Committee membership and ruleset, select technical architecture choices, and modification of Mantle Governance parameters. Mantle Governance holds authority over all Mantle products and the Treasury, enabling token holders to actively participate in shaping the future of the ecosystem.

DAO Flexibility: It's worth noting that DAOs are highly customizable and adaptable. The content below will be modified based on the current status of approved proposals and inflight initiatives.

Mantle Improvement Proposals (MIPs): All changes to Mantle are authorized through Mantle Improvement Proposals, which function similarly to statutes and policies in political or corporate contexts. MIPs serve as the formalized mechanism for proposing and discussing changes within the community.

Community Feedback and Voting: MIPs are introduced as forum discussions to gather community feedback and gauge overall sentiment. After incorporating any necessary modifications based on community input, the proposals proceed to official voting on the Governance Module. During the voting phase, $MNT token holders have the opportunity to ratify the proposal and contribute to the decision-making process.

Implementation Process: Following the voting process, the approved policies are implemented either through automated code executed on-chain, or by the core contributor team through off-chain methods. Currently, the majority of implementation processes take place off-chain.

## Document Categories

### Parameters
These documents contain the authorized parameters, which have been established through MIPs or inherited from the launch state.
- Governance - for voting systems and voting parameters.
- Tokenomics - for token details, distribution, vesting, and supply.
- Delegation - for determination of vote weight and vote weight modification schemes.

### Guidance
These documents are considered "living documents" as they are continuously maintained by the Mantle core contributor team and advisors. They provide supplementary information to the Mantle community and stakeholders, aid in better comprehension of the organization's ways of working, serve as a platform to gather feedback, and offer hints about future roadmaps.


---

## Source: governance / parameters / delegation

# Delegation

## Current Parameters

<table data-full-width="true"><thead><tr><th width="221.33333333333331">Component or Feature</th><th width="640">Comment</th><th>Status<select><option value="03344b5b2e624371baa3afb28692fb62" label="Production" color="blue"></option><option value="aff667002786425f8b537cc67e620e7e" label="Development" color="blue"></option><option value="92c9d72ba04f44d09aefb60c2fe559d5" label="Guidance" color="blue"></option></select></th></tr></thead><tbody><tr><td>Official products</td><td><a href="https://delegatevote.mantle.xyz/">https://delegatevote.mantle.xyz/</a></td><td><span data-option="03344b5b2e624371baa3afb28692fb62">Production</span></td></tr><tr><td>Basic Delegation<br>(one-to-one)</td><td><strong>L1 $MNT</strong>: Uses "erc20-votes" method of the <a href="https://etherscan.io/token/0x3c3a81e81dc49a522a592e7622a7e711c06bf354#writeProxyContract">$MNT token</a>, with vote weight calculation managed by Snapshot.<br><br><strong>L2 $MNT:</strong> Uses a "comp-like" method handled by a <a href="https://explorer.mantle.xyz/address/0xEd459209796D741F5B609131aBd927586fcCACC5/contracts?contract-tab=write-contract#address-tabs">smartcontract</a> on Mantle Network, with <a href="https://api.delegatevote.mantle.xyz/snapshot/v2">graphs</a> and vote weight calculated managed by an <a href="https://api.delegatevote.mantle.xyz/snapshot">offchain system</a>.<br></td><td><span data-option="03344b5b2e624371baa3afb28692fb62">Production</span></td></tr><tr><td>Enhanced Delegation Program</td><td>Informal guidelines, <a href="https://docs.mantle.xyz/governance/delegation#enhanced-delegation-program">see link</a>.<br></td><td><span data-option="92c9d72ba04f44d09aefb60c2fe559d5">Guidance</span></td></tr></tbody></table>

## Overview

Token holders cannot vote or create proposals until they delegate their voting rights to an address. Delegation can be given to one address at a time, including the holder’s own address.

Note that delegation does not lock or transfer tokens. If an isolated delegatee wallet is stolen, compromised, or interacts with the incorrect smart contract, this will not directly result in the loss of tokens, and the token holder can delegate to another address.

Delegation enables modification of vote weight independent from token holdings. This allows for decentralization of voting on Mantle proposals, and adjustment of vote weight distribution between voters with different areas of expertise and interests.

## Delegation Methods

### L1 $MNT

{% hint style="danger" %}
Delegate L1 $MNT:\
As with any smart contract action please ensure you are interacting with the correct contract, method / function:

* Contract: [0x3c3a81e81dc49a522a592e7622a7e711c06bf354](https://etherscan.io/token/0x3c3a81e81dc49a522a592e7622a7e711c06bf354#writeProxyContract)
* Method: `delegate`
* Method ID: `0x5c19a95c`
  {% endhint %}

#### Using the Mantle Page

1. Go to <https://delegatevote.mantle.xyz/>
2. Connect wallet to Ethereum Mainnet
3. Enter target delegate address or delegate to yourself
4. Check parameters (see warning above), and confirm using your wallet.

#### Using Etherscan

1. Go to <https://etherscan.io/token/0x3c3a81e81dc49a522a592e7622a7e711c06bf354#writeProxyContract>
2. Click "Connect to Web3"
3. If using Multisig: use WalletConnect on Etherscan and your Multisig app
4. Under Item "5. Delegate" enter the address you wish to delegate to
5. Click "Write"
6. Check parameters (see warning above), and confirm using your wallet.

### L2 $MNT

{% hint style="danger" %}
Delegate L2 $MNT:\
As with any smart contract action please ensure you are interacting with the correct contract, method / function:

* Contract: [0xEd459209796D741F5B609131aBd927586fcCACC5](https://explorer.mantle.xyz/address/0xEd459209796D741F5B609131aBd927586fcCACC5/contracts?contract-tab=write-contract#address-tabs)
* Method: delegate
* Method ID: 0x5c19a95c
  {% endhint %}

#### Using the Mantle Page

1. Go to <https://delegatevote.mantle.xyz/>
2. Connect wallet to Mantle Network Mainnet
3. Enter target delegate address or delegate to yourself
4. Check parameters (see warning above), and confirm using your wallet.

#### Using Block Explorer

1. Go to: <https://explorer.mantle.xyz/address/0xEd459209796D741F5B609131aBd927586fcCACC5/contracts?contract-tab=write-contract#address-tabs>
2. Click on the "Connect to Web3" button, select your Mantle Network $MNT holding wallet
3. Click on "1. delegate"
4. Input your target delegatee address (this can be your own address)
5. Click on "Write"
6. Check parameters (see warning above), and confirm using your wallet.

## Enhanced Delegation Program

{% hint style="info" %}
A formal Enhanced Delegation Program has not yet been discussed or approved by Mantle Governance, however we advise large token holders to follow the guidance below when delegating their votes.

We aim to commence discussions after: 1) completion of the BitDAO and Mantle merger; and 2) when the required voting systems are established.
{% endhint %}

### Purpose

1. Enhance the quality of decision-making.
2. Establish checks and balances among various stakeholder groups.
3. Enhance the signaling value of the Mantle Governance vote as a form of social consensus.

### Mechanism

{% hint style="info" %}
Note: the below are preliminary ideas only. The final mechanism will be discussed and authorized by Mantle Governance.
{% endhint %}

* The Enhanced Delegation Program will utilize Mantle Treasury $MNT to provide delegated voting power to various stakeholders.
* Each stakeholder category will be be provided with a total vote weight (e.g. 100M to core contributor team, 100M to applications, 100M to technology partners, etc.).
* The underlying $MNT will be held in a Mantle Governance custodied multi-sig. An Administrator will distribute the vote weight (non-custodial) based on a yet-to-be-determined process.

### Criteria for Enhanced Delegates

#### Core

* Votes in the best interest of the overall Mantle Ecosystem
* Completes delegate profile available at <https://delegatevote.mantle.xyz/>
* Votes on all proposals in areas of expertise or interest

#### Desirable

* Provides reasons for the vote through a forum comment linked to the Snapshot vote
* An existing token holder
* Shows active engagement within the Mantle community or ecosystem
* Participates regularly in the forum
* Possesses a significant following and distribution network

#### Demographic Mix

With the Enhanced Delegation Program we hope to achieve a mix of the following stakeholders:

* Core contributor team and advisors (funded by Mantle budgetary proposals)
* Technology partners of various Mantle products
* Applications deployed on Mantle products
* Users of Mantle products
* Crypto community members


---

## Source: governance / parameters / governance

# Governance

## Summary

Mantle Governance follows a primarily off-chain governance process. Discussions are initiated by the Mantle core contributor team or community members and are then introduced to the broader Mantle community through a forum discussion. Discussions that generate sufficient interest and positive sentiment may progress into formal proposals 'MIPs', which are subsequently voted upon by $MNT token holders. Once a proposal is ratified, various core contributor team members will support its implementation according to the terms outlined in the proposal. This approach is considered an "off-chain" governance process because the result of the governance vote does not automatically trigger code updates to products or automatic treasury actions.

## Current Parameters

<table data-full-width="true"><thead><tr><th width="192">Category<select><option value="905d10c619344f379a9c9c768e5072fb" label="Custody" color="blue"></option><option value="9fe2f9ea74d1452ebbe07289a27a86ca" label="Discussion" color="blue"></option><option value="a3116904817344ccb47b47b7011d1690" label="Voting" color="blue"></option><option value="571c412c5ec148329baf53d1795502bb" label="Official" color="blue"></option><option value="581f8aa74699464582009454d691fd24" label="Guidance" color="blue"></option></select></th><th width="256">Component</th><th width="476">Comment</th><th>Status<select><option value="f60e6e666893472088416d05cd7fbd25" label="Official" color="blue"></option><option value="87098dd947b34ed3a183604e95884152" label="Guidance" color="blue"></option></select></th></tr></thead><tbody><tr><td><span data-option="9fe2f9ea74d1452ebbe07289a27a86ca">Discussion</span></td><td>Soft proposals and discussions**</td><td>Discourse<br><a href="https://forum.mantle.xyz/">https://forum.mantle.xyz/</a><br></td><td><span data-option="87098dd947b34ed3a183604e95884152">Guidance</span></td></tr><tr><td><span data-option="9fe2f9ea74d1452ebbe07289a27a86ca">Discussion</span></td><td>Forum discussion period</td><td>Minimum 7 days</td><td><span data-option="87098dd947b34ed3a183604e95884152">Guidance</span></td></tr><tr><td><span data-option="a3116904817344ccb47b47b7011d1690">Voting</span></td><td>Voting Module (Governance Module)**</td><td>Gnosis Snapshot<br><a href="https://snapshot.org/#/bitdao.eth">https://snapshot.org/#/bitdao.eth</a></td><td><span data-option="f60e6e666893472088416d05cd7fbd25">Official</span></td></tr><tr><td><span data-option="a3116904817344ccb47b47b7011d1690">Voting</span></td><td>Governance Token**</td><td>$MNT (<a href="https://etherscan.io/address/0x3c3a81e81dc49a522a592e7622a7e711c06bf354">L1 Token</a>, <a href="https://explorer.mantle.xyz/address/0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000">L2 Token</a>)</td><td><span data-option="f60e6e666893472088416d05cd7fbd25">Official</span></td></tr><tr><td><span data-option="a3116904817344ccb47b47b7011d1690">Voting</span></td><td>Delegated Voting**</td><td><p>Enabled for Delegate All only.</p><p>Token holders must delegate before voting (can delegate to themselves).<br><a href="https://delegatevote.mantle.xyz/">https://delegatevote.mantle.xyz/</a></p></td><td><span data-option="f60e6e666893472088416d05cd7fbd25">Official</span></td></tr><tr><td><span data-option="a3116904817344ccb47b47b7011d1690">Voting</span></td><td>Snapshot Strategy**</td><td>1 delegated $MNT = 1 vote weight</td><td><span data-option="f60e6e666893472088416d05cd7fbd25">Official</span></td></tr><tr><td><span data-option="a3116904817344ccb47b47b7011d1690">Voting</span></td><td>Proposal Threshold**</td><td>200,000 $MNT</td><td><span data-option="f60e6e666893472088416d05cd7fbd25">Official</span></td></tr><tr><td><span data-option="a3116904817344ccb47b47b7011d1690">Voting</span></td><td>Vote Duration</td><td>Minimum 7 days</td><td><span data-option="f60e6e666893472088416d05cd7fbd25">Official</span></td></tr><tr><td><span data-option="a3116904817344ccb47b47b7011d1690">Voting</span></td><td>Vote Threshold (Quorum)**</td><td>100,000,000 $MNT</td><td><span data-option="f60e6e666893472088416d05cd7fbd25">Official</span></td></tr><tr><td><span data-option="905d10c619344f379a9c9c768e5072fb">Custody</span></td><td>Mantle Treasury</td><td>Safe (previously known as Gnosis Safe), Multi-sig</td><td><span data-option="f60e6e666893472088416d05cd7fbd25">Official</span></td></tr></tbody></table>

## Definitions and Details

### **Discussions (Discourse Forum)**

The recommended forum for discussing the Mantle ecosystem is: <https://forum.mantle.xyz/>. A community member may draft a soft proposal or initiate a discussion that may leads to an official Mantle Governance vote. Such proposals act as a “temperature test” or a poll but do not guarantee implementation.

### **Governance Module (Snapshot)**

The official governance voting solution is [Gnosis Snapshot](https://snapshot.org/#/) and the official Snapshot Space can be found at <https://snapshot.org/#/bitdao.eth>. Snapshot is an off-chain vote aggregation platform and was chosen to make governance simple and transparent for our users. It is a proven solution with a user-friendly interface and is used by many industry-leading projects such as Balancer, Yearn Finance, SushiSwap, Uniswap, Bancor, The Graph, and Aave.

Snapshot-based governance, commonly referred to as off-chain governance, doesn't automatically implement the voting results. It often requires a core contributor and administration team to perform subsequent actions.

### Governance Token ($MNT)

TBD - pending the outcomes of key proposals and discussions such as the [BIP-21 Merger Proposal](https://snapshot.org/#/bitdao.eth/proposal/0xe81f852d90ba80929b1f19683da14b334d63b31cb94e53249b8caed715475693) and [MIP-22 Token Design Proposal](https://snapshot.org/#/bitdao.eth/proposal/0x950dac4d5715b8aa8eab29c484b1c9dd0eed161141262b0425874f65be4d9f8e).&#x20;

### **Delegated Voting**

Token holders cannot vote or create Snapshot proposals until they delegate their voting rights to an address. Delegation can be given to one address at a time, including the holder’s own address. More details can be found here: <https://docs.mantle.xyz/governance/parameters/delegation>.

### **Snapshot Vote Strategy**

The Snapshot Vote Strategy defines how vote weight is calculated. The current setting is that 1 MNT token equals 1 vote weight when delegated.

Multiple vote strategies can be implemented to recognize different vote weights derived from various tokens and other vote weight modification schemes. Any modifications to the vote strategy must be approved by Mantle Governance.

### **Snapshot Proposal Threshold**

This threshold specifies the minimum amount of vote weight required to create a proposal. It is typically implemented to mitigate spamming of proposals.

### **Snapshot Vote Duration**

Snapshot Vote Duration refers to the length of time between the start and end of the voting period. It is the period during which token holders can cast their votes on a proposal.

### **Snapshot Vote Threshold / Quorum**

The Snapshot Vote Threshold specifies the minimum amount of vote weight required for a vote on a proposal to be considered effective. If this minimum threshold is not met, the vote is unsuccessful, even if the majority of voters voted in favor. This threshold is sometimes referred to as the "quorum".

### **Mantle Treasury (Safe)**

The official asset custody solution is provided by <https://safe.global/> (previously known as Gnosis Safe). Mantle Treasury uses a direct implementation of [Safe](https://github.com/gnosis/safe-contracts). Safe is a widely used standard for enabling multi-sig control over an Ethereum address. Safe utilizes an extensive [testing suite](https://github.com/safe-global/safe-contracts/tree/main/test), [bug bounty program](https://docs.gnosis-safe.io/introduction/security/bug-bounty-program), and [security audits](https://docs.gnosis-safe.io/introduction/security/security-audits). For additional information regarding the contract, please refer to the [Safe documentation](https://docs.gnosis-safe.io/).

### **Implementation**

Mantle Governance follows a primarily off-chain governance process. Discussions are initiated by the Mantle core contributor team or community members, and are then introduced to the broader Mantle community through forum discussions. Discussions that generate sufficient interest and positive sentiment may progress into formal proposals (MIPs), which are subsequently voted upon by $MNT token holders. Once a proposal is ratified, various core contributor team members will support its implementation according to the terms outlined in the proposal. This approach is considered an "off-chain" governance process because the result of the governance vote does not automatically trigger code updates to products or automatic treasury actions.


---

## Source: governance / parameters / tokenomics

# Tokenomics

> **Transfer Restrictions** - The content contained in this website does not constitute an offer or sale of securities in or into the United States, or to or for the account or benefit of U.S. persons, or in any other jurisdictions where it is unlawful to do so. Transfer of MNT tokens may be subject to legal restrictions under applicable laws. Under no circumstances shall MNT tokens be reoffered, resold or transferred within the United States or to, or for the account or benefit of, U.S. persons, except pursuant to an exemption from, or in a transaction not subject to, the registration requirements of the U.S. Securities Act of 1933, as amended.
>
> **Governance & Change Notice** - DAOs are highly customizable. The information provided about $MNT governance and utility reflects the current state. As the Mantle Ecosystem evolves, the content and functionality described may be modified through the Mantle Governance process.

## Summary

1. The $MNT token has two roles: governance and utility within the Mantle ecosystem.
2. As a governance token, each $MNT provides voting weight within the [Mantle Governance](https://docs.mantle.xyz/governance/parameters/governance) process.
3. As a utility token, $MNT is utilized for gas fees on Mantle Network, and a principal asset within Mantle Rewards Station.
4. The initial distribution of $MNT was determined by Mantle genesis proposals [BIP-21](https://snapshot.org/#/bitdao.eth/proposal/0xe81f852d90ba80929b1f19683da14b334d63b31cb94e53249b8caed715475693) and [MNT-22](https://snapshot.org/#/bitdao.eth/proposal/0x950dac4d5715b8aa8eab29c484b1c9dd0eed161141262b0425874f65be4d9f8e); additionally, $MNT supports other use cases on partnered platforms like Bybit.
5. $MNT held in the Mantle "[Treasury Holdings](https://docs.mantle.xyz/governance/treasury#treasury-holdings)" can be considered "not in circulation", whereas $MNT in "[Other Holdings](https://docs.mantle.xyz/governance/treasury#other-holdings)" (e.g., liquidity support (ECSP) or budget addresses) is "in circulation".
6. The distribution of $MNT tokens from the Mantle Treasury requires authorization, primarily via [Budget Proposals](#budget-proposals).

## Token Addresses <a href="#mnt-token-address" id="mnt-token-address"></a>

<table data-full-width="false"><thead><tr><th width="257">Blockchain $Token</th><th>Token Address</th></tr></thead><tbody><tr><td>Ethereum L1 $MNT</td><td><a href="https://etherscan.io/address/0x3c3a81e81dc49a522a592e7622a7e711c06bf354">0x3c3a81e81dc49A522A592e7622A7E711c06bf354</a></td></tr><tr><td>Mantle Network L2 $MNT</td><td><a href="https://explorer.mantle.xyz/address/0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000">0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000</a></td></tr><tr><td>Mantle Network L2 $wMNT</td><td><a href="https://explorer.mantle.xyz/address/0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8">0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8</a></td></tr></tbody></table>

## Distribution and Supply

### Current Distribution

#### Calculate via API

<https://api.mantle.xyz/api/v1/token-data>

[https://api.mantle.xyz/api/v1/token-data?q=totalSupply](https://api.mantle.xyz/api/v1/token-data?q=totalSupplyhttps://api.mantle.xyz/api/v1/token-data?q=circulatingSupply)

[https://api.mantle.xyz/api/v1/token-data?q=circulatingSupply](https://api.mantle.xyz/api/v1/token-data?q=totalSupplyhttps://api.mantle.xyz/api/v1/token-data?q=circulatingSupply)

Note: The API term `treasuryBalance` is also referred to on this page as “Treasury Holdings".

#### Calculate Manually

**Formula**

$$
\text{Circulating Supply}=\text{Total Supply}-\text{Treasury Holdings}
$$

**Total Supply**

Query the `totalSupply` method of MNT token contract <https://etherscan.io/address/0x3c3a81e81dc49a522a592e7622a7e711c06bf354#readProxyContract#F20>

**Treasury Holdings**

Query the $MNT balance of Mantle Treasury addresses: [#treasury-holdings-core](https://docs.mantle.xyz/governance/treasury#treasury-holdings-core "mention")

### Initial Distribution

The 2023-07-07 initial distribution of $MNT is as follows:

<div data-full-width="true"><figure><img src="https://549518790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F034qlEySrVog4UerYYFm%2Fuploads%2FdCPZK2WKwTwU8a8AK2TN%2Fchart.svg?alt=media&#x26;token=73e704f7-227c-4d78-9286-f2c601899604" alt=""><figcaption></figcaption></figure></div>

<table><thead><tr><th width="204.33333333333331">Holder Category</th><th width="171" align="right">$MNT tokens [1]</th><th width="94" align="right">Share</th><th>Vesting, Distribution</th></tr></thead><tbody><tr><td>Mantle Treasury [2]</td><td align="right">3,046,328,614</td><td align="right">49.0%</td><td>Based on Mantle Governance Proposals</td></tr><tr><td>Circulating</td><td align="right">3,172,988,154</td><td align="right">51.0%</td><td>None</td></tr><tr><td></td><td align="right">6,219,316,768</td><td align="right">100.0%</td><td></td></tr></tbody></table>

\[1] Based on 2023-07-07 snapshot and post-approval of [MIP-23: $MNT Supply Optimization](https://snapshot.org/#/bitdao.eth/proposal/0x8446404bd2dbd6a0b6b3a70dd2db64bd5b4a5408684aa93b263623fa0fdc0e85).

\[2] Includes the core holdings treasuries for DAO governed and undistributed $MNT tokens, and DAO-owned liquidity positions such as MNT:ETH LP pairs. Excludes Mantle product budget treasuries and Mantle protocol fee related wallets.

### **Subsequent Distributions**

The Mantle Core budget represents the primary expenditure of $MNT for payments and incentives within the following categories: workforce, G\&A, marketing, ecosystem and builder programs, and infrastructure & security.

$MNT transfers from Treasury Holdings to [Budget Treasuries](https://docs.mantle.xyz/governance/parameters/treasury#budget-related) are authorized via Budget Proposals prior to final distributions.

Examples include:

2025-09-11, [MIP-33: Mantle Core Budget for Third Budget Cycle](https://snapshot.box/#/s:bitdao.eth/proposal/0xe26ab40b14c0f6a71b8a0fbf36c9ff436e5ae571f500b924fac7152fa304a883)

2024-09-12, [MIP-31: Mantle Budget Second Period](https://snapshot.org/#/bitdao.eth/proposal/0x3bd69ebec93f61fff8be513610cf895cda9cfb0d1e0b3e56762300fac80fa734)

2023-02-20, [BIP-19: Mantle Budget First Period](https://snapshot.org/#/bitdao.eth/proposal/0x5e82c6ef374db3e472717d3e79b05f246f9a29de3435adb457ae34afa192b5be)


---

## Source: governance / parameters / treasury

# Treasury

## Administration

All Treasury actions are authorized by [governance](https://docs.mantle.xyz/governance/parameters/governance "mention") proposals available at  <https://snapshot.org/#/bitdao.eth>. For example, budget proposals such as [MIP-31](https://snapshot.box/#/s:bitdao.eth/proposal/0x3bd69ebec93f61fff8be513610cf895cda9cfb0d1e0b3e56762300fac80fa734) authorize funding for Mantle Core operations; and [MIP-28](https://snapshot.box/#/s:bitdao.eth/proposal/0x1f23e992b5123d0948e48681da08cb511e3dc6405baf0d301198ecce4c1e1d5a) provides broad authority to supply liquidity and rebalance assets.

## Estimates

The best estimate of Treasury assets is **Treasury Monitor**: <https://treasurymonitor.mantle.xyz/>.

It is manually updated for large transfers and for recognition of significant gains and losses from liquidity support. This approach may be more reliable than querying current balances for the following reasons:

* The Treasury asset positions are dynamic due to active liquidity support; for example, in USD-ETH AMM liquidity pools the component amounts may change per block, there may be impermanent losses, and gains from fees.
* Treasury positions may be in derivative formats (e.g., staked ETH) or specialized USD instruments. Treasury Monitor treats them as vanilla ETH or USD and adjusts units when a triggering event occurs.
* Some in-flight positions may not be indexed by explorers, e.g., during a redemption cooldown for staked assets.
* Not all Treasury positions are on-chain and available via explorer addresses. We utilize centralized services for custody and trading. While read-only APIs are available, public exposure is not recommended for risk reasons.

## Custody

Policies and Application

1. **Ownership** - All categories of holdings below belong to the Treasury and can be recalled. However, in practice some flows are one-way; for example assets transferred to Budget custody are will be consumed by Mantle Core operations (product development, growth, etc.). Other items, such as transfers to ECSP, are considered delegated custody as those funds and all gains or losses are owned by the Treasury.
2. **Non-Comprehensive List** - We operate multiple treasuries to segment risk and track flows. The list below shows on-chain addresses only. We also hold assets at centralized venues for bridging, rebalancing, and flexible-yield purposes; those are not listed here.
3. **Simplified MNT Circulating Supply** - For the purpose of MNT Circulating Supply  we apply the simple formula "Circulating Supply = Total Supply - Treasury Holdings", see more here: [#calculate-manually](https://docs.mantle.xyz/governance/tokenomics#calculate-manually "mention"). So even though MNT provided to ECSP (Service Providers) are forecasted to be returned, the amounts are dynamic and difficult to calculate, but not significant enough for the purposes of circulating supply definitions.
4. **Categorization** - We have broadly segmented into "Treasury Holdings" (which provide financing) and "Other Holdings", which serve specific functions such as liquidity support, core budgets, and the EcoFund.

### Treasury Holdings

#### **Primary**

MTreasuryL1, Eth, [0x78605Df79524164911C144801f41e9811B7DB73D](https://etherscan.io/address/0x78605Df79524164911C144801f41e9811B7DB73D)\
MTreasuryL2, Mantle, [0x94FEC56BBEcEaCC71c9e61623ACE9F8e1B1cf473](https://explorer.mantle.xyz/address/0x94FEC56BBEcEaCC71c9e61623ACE9F8e1B1cf473)

MTreasuryFB-C, BTC, [bc1qjxxpf8r7n2trwg83rchwpwjpzvgfv3mrry692j](https://www.blockchain.com/explorer/addresses/btc/bc1qjxxpf8r7n2trwg83rchwpwjpzvgfv3mrry692j)\
MTreasuryFB-C, EVM, [0x0a89A70Ed887D949A7781826441C2c6A4764d908 ](https://debank.com/profile/0x0a89a70ed887d949a7781826441c2c6a4764d908)\
MTreasuryFB-C, SOL, [8M51ZCHRZy1NvmHvaqaWSRArUX6C9cVvZGG8HSq4yBTV](https://solscan.io/account/8M51ZCHRZy1NvmHvaqaWSRArUX6C9cVvZGG8HSq4yBTV)

MTreasuryL1-FF, Eth, [0x34cAfA03D9750124102059eE35619A9C5D5aF7df](https://etherscan.io/address/0x34cAfA03D9750124102059eE35619A9C5D5aF7df)\
MTreasuryL2-FF, Mantle, [0xcD9Dab9Fa5B55EE4569EdC402d3206123B1285F4](https://explorer.mantle.xyz/address/0xcD9Dab9Fa5B55EE4569EdC402d3206123B1285F4)

MTreasuryFB-FF, BTC, [bc1q58ey5adtgz5tpm3hf4sausjq0zvzq26q7hfyxm](https://www.blockchain.com/explorer/search?search=bc1q58ey5adtgz5tpm3hf4sausjq0zvzq26q7hfyxm)\
MTreasuryFB-FF, EVM, [0x61cA90679eBF73F592115b5d3ca21532059CB3fC](https://debank.com/profile/0x61ca90679ebf73f592115b5d3ca21532059cb3fc)\
MTreasuryFB-FF, SOL, [3ec4cKJkUjCjKmDN9gqrke3nFvzx1dgBGyPFrrmeXZA5](https://solscan.io/account/3ec4cKJkUjCjKmDN9gqrke3nFvzx1dgBGyPFrrmeXZA5)

#### **Special Purpose**

*Note: Used for contract interactions, or subscription and redemptions.*

MTreasuryL1-E , Eth, [0x1a743BD810dde05fa897Ec41FE4D42068F7fD6b2](https://etherscan.io/address/0x1a743BD810dde05fa897Ec41FE4D42068F7fD6b2)\
MTreasuryL1-SC, Eth, [0xCa264A4Adf80d3c390233de135468A914f99B6a5](https://etherscan.io/address/0xCa264A4Adf80d3c390233de135468A914f99B6a5)\
MTreasuryL1-O, Eth, [0xf0e91a74cb053d79b39837E1cfba947D0c98dd93](https://etherscan.io/address/0xf0e91a74cb053d79b39837E1cfba947D0c98dd93)\
MTreasuryARB-VE, ArbOne, [0x381d55Af79255A930699740EC93EcFD2F168A3F9](https://arbiscan.io/address/0x381d55Af79255A930699740EC93EcFD2F168A3F9)

#### **Admin EOA**

*Note: Used for contract interactions, subscriptions, and redemptions.*

MantleEOA-8eB8, EVM, [0x3Dc5FcB0Ad5835C6059112e51A75b57DBA668eB8](https://etherscan.io/address/0x3dc5fcb0ad5835c6059112e51a75b57dba668eb8)\
MantleEOA-5fe3, EVM, [0x61Af7a48B0EeA8481E5A055A35f829d0e8505fE3](https://etherscan.io/address/0x61Af7a48B0EeA8481E5A055A35f829d0e8505fE3)

#### **Other**

*Note: The following addresses will be retired shortly; all assets will be swept.*

MTreasuryL1-RB, Eth, [0x164Cf077D3004bC1f26E7A46Ad8fA54df4449E3F](https://etherscan.io/address/0x164Cf077D3004bC1f26E7A46Ad8fA54df4449E3F)\
MTreasuryL2-RB, Mantle, [0x87C862C3F9BDFc09200bCF1cbb36F233A65CeF3e6](https://explorer.mantle.xyz/address/0x87C62C3F9BDFc09200bCF1cbb36F233A65CeF3e6)\
MTreasuryL1-LP, Eth, [0xA5b79541548ef2D48921F63ca72e4954e50a4a74](https://etherscan.io/address/0xA5b79541548ef2D48921F63ca72e4954e50a4a74)\
MTreasuryL2-LP, Mantle, [0x992b65556d330219e7e75C43273535847fEee262](https://explorer.mantle.xyz/address/0x992b65556d330219e7e75C43273535847fEee262)

### Other Holdings

#### ECSP Related

*Authorized by: MIP-25, MIP-26, MIP-28*

*Note: The Economics Committee Service Providers help deploy treasury assets as liquidity support for Mantle ecosystem applications.*

{% tabs %}
{% tab title="Current" %}
0x87c185bEFFfb36a42b741d10601A007e997a63bA 0x8AA6a67e96850e070B0c8E94E3a35C5f9f01809C 0x50f6e426fdefb3f994d3fe9fa4e1ee715f85de7f\
0x6cBA077D58fA613B793168c705D1A656bA4f50e3\
\
0x7427b4Fd78974Ba1C3B5d69e2F1B8ACF654fEB44 0x7fe2bAffD481a8776A9eaD15a8eD17Fe37107903 0x15Bb5D31048381c84a157526cEF9513531b8BE1e 0xdD1c2483056fF46153249bd903401ae7bF6360D1 0x565F603D583F9199487923775114ae8c0D17D044 0x650aD9e7EfCD34B7d050c22a6A8dFFAFe3B4A22E 0x607105cE5bf13e70B49E949a3DdFaD694d19374F 0x131C7f3461A6696317ddfEdfed3BCdc10A2062B2 0xa1F7D91Bf121f4940d96c5C52Bc577011B95B51b 0x911169AA285f5D18fC3567d150616d4B0869d3a5 0x3f946F00A00eB2A66A4BD1AeAF137E05dB6CAEc6 0x9fe09b3ed1A407162876fEB1995048A620552fD0 0xd4338fC8Dc9d2FDcb99604d3cFc80019EBE01058 0x71Fb53Afc7E36C3f11BC1bdBBAB7B6FC3E552eb6 0x92A9e359d72F934a5d7c1251201f9855A381B23c 0xb118d4B94B0D4ce38F0D15d88f1dC09580a60b7A 0xaA42736947d1fdcc5d93F459A6D1dC0d7b9a92a4 0xF366eC9FA2DCE0ee7A6bdae4Aaa5c076E8391AFC 0x5DA939F5e2bC3C7159ac16f98BbFb23759000cd5 0x60F6ce1965D99EEffDF63B5303664f25fCb0347F 0xC784F3aEA5ce3daBA6907ee5d6Ce321a204Eb3A8 0xDCA65E2DFEe70991374eD47EfB4aD6B4FCD0c612 0x4ea7b4D10a01c93509BaA0CBb128c89344A1F578 0x4dF3d780Af7cbD51d9c76f236477edF417c7B554 0xA38e519b12D9CE133396a3E4EB92aac0934AB351 0x6d9755211D627fe0EA02D94C23C6110af16a8882 0x43c0f24E84e6d45b021d18C982beAbFA969577c8 0xB82C91bB7e8696a4A057192ED61aFcD1F9121722 0x15FFBf5730FA9eF271B2E9b4a1a6c90F2288155B 0xCef70f66e50CF016BB932De6425AA6f7286A3886 0x50165383783124232B9e4367D59815947012Ac27 0x97D50c7d14E68bEBC0f81B4FdCed89a1122330A6\
0x74Cf70305879dC6c3ab3985E6d001136D8e5991E\
0x0368733c0C0dFA64eD2391F50a3A263e0c2Ce412

\
\
L2 SAFEs:

0xfe1b20E738B16950d4941F9Db008161549bcc201\
0xe028DFde5f9f340FFfe0B8688400980D536899FA\
0x309c71B862593E59eb4F09704014ABbf619eb75e\
0xF1FcffE93808fcbe613c970854507F2A35Fd0d1C\
0xc4dD67422A4926a4fB5aAe68c70773851DC89180\
0x1567a2dE69051244abBb69BFbaF66b1F21994191\
0xb8cD0621c65226C74861595be6bFC5a3411f191e\
0xCa3c9CC7f3DC514018F8a2748231244c5bBDa353\
0xDBCe0920342e072B488884FA9eE7E8A8ac768816\
0x5A0616af112AAD702A311D2189EA7d59398CfAD6\
0x798d1c6e9C5fC6220478D8236b60Aa2CCb88973c\
0x06514C83CC75500529692Cd387328518da20C436\
0x6043Ac7612cC8Ee1546D6E70F27EAa2ED229A71D\
0x867FcB9F3a01491bb7105b565eaFa2e6890cd6e7\
0xBb5E001EC2513ff261f07d7b46cdD023dc061765\
0xB6606A62eCE7e42924F74ED2076186E292e4e1f5\
0xe63c1d26Db11452E7f053Cf42bBA5661c66Fd947\
0xe19A1941d67cDAF4ba97d678f86BFBb0E1B327cD\
0x37cD5Bb41E3A8164b65f5F747Fe60CE1B0c49970\
0x73989Ab8a0021C616392b4c8107E38590b5BC327\
0x1f5a50F77Af28b3bc1227b5Bf4441123F92f67d1\
0x5439306bc763de4af502b0D8C64A3E6a2a579FFd\
0xc7Eb9F185d5213CB08C7eF58D2Df89e06D28E62D\
0x2ba0f5303E47f9e6890f562D2748D91798317c6a\
0x43C31715b954C592500C117d44fBFb938B180dEa\
0x1c627B88F1492658F07f39e14905D00006d017D2\
0x4444C50b5Cd3fbaB87a8C43B8C88C6DF08435761\
0xe61FDF45f97e8AdDE86299176d5075EE5b48A738\
0xdaB723D5a17da12E712e0Ea140034eEb12F8738F\
0xC13cBC9cB2c26A8e3D2eB60407654C6De6D8EB19\
\
FB:\
0xAA928DF60c92CEd50fFb48C6a344008131d47835\
0xef78160E1baBb4739C85056C43C9C158F3740fAE 0x510A6169985927C03a2EcB364046EeD311A86f76 0xa00583a5AE3Dd08B0351F3cAcA2051B29e639035 0x936074c4270ceF59EbDA861A813c2bd505B6c0b0 0x51e6809741E403C013D8A527bd94C10e0D99e1b8 0x25B296Bd0C56A536070e5021a6F8A3A15122Ba27 0xc08106aA1c427477D2B58482946b72ffA50e33E0 0xCC7D84ed51B53ED20EC11eE42Df23C0BDF7d352a 0xE54a3766C65dCa1F654B941bE35f2e62A313e852
{% endtab %}

{% tab title="Historic" %}
0xa6b12425F236EE85c6E0E60df9c422C9e603cf80 0x730D4C348Ba3622E56F1214A825b27C2f6c66169 0x73904f907A265B1d55b240a85f28a123C33D7255 0xeFcb810E5C53110436e899f5eaf4D48Fd61278a7 0xf7cec670917F0AfBD1D08bfbC14FC382CCf28BB7 0x31645089f6a26E00e36654C74958d1D6C388aC5d 0xc6Ca545640f24a5b8aACce310Eb2Bca5Bb46aFFB 0x818a60f490A29E270B6255A36E819f24f7462318 0x48424b47A48B0Fc9ab998f2337da1Bb8FaFA0Bc0 0x596b79a977f59D8F282B44102964E49Bd171d9E1 0xEbAD077F1E61FBbB7EfEb2a991b4eC31Fe72Dd87 0x9df9E4aE30C8c4E0d840259cfd1C5c058D0A9e39 0xC76E84e487dE1dC00b4fC00dcBCAcAE4e0d27BB3 0xCFf0ac214EeA01F2AaEB02a745464E5Ab205Bf52 0x31cCa7bbaCFCE8c70f4D2eAc23758CD60Dfc8bBD 0x47AF3a800AD9834Be4fBC20a91178543F43D2AfE 0xf78BB1fe258c2B3455Df181a40304F5205821E19 0x36D1B05517D8213e590A2531757Fa52705876340 0x37C1231e713CdED0D88a7Eb1bC79A819F3F43494 0x7FF3e7eb4496D09Fbd99D5612AE5B8ef368780fE
{% endtab %}
{% endtabs %}

#### Budget Related

*Authorized by: BIP-19*

MBudgetL1, Eth, [0x1B9Cef6Bdd029f378c511E5e6C20eE556b6781b9](https://etherscan.io/address/0x1B9Cef6Bdd029f378c511E5e6C20eE556b6781b9)\
MBudgetL2, Mantle, [0xb9d507990c009Ed1Ee853a07B6A20c0925DD8A08](https://explorer.mantle.xyz/address/0xb9d507990c009Ed1Ee853a07B6A20c0925DD8A08)

#### Protocol Related

*Note: For collecting fees, and funding gas*

SequencerVault, Mantle, [0x4200000000000000000000000000000000000011](https://explorer.mantle.xyz/address/0x4200000000000000000000000000000000000011)\
NetworkL2, Mantle, [0x09734bB3980906Bb217305EA6Bd34256feEAB105](https://explorer.mantle.xyz/address/0x09734bB3980906Bb217305EA6Bd34256feEAB105)\
NetworkL1, Eth, [0x2F44BD2a54aC3fB20cd7783cF94334069641daC9](https://etherscan.io/address/0x2F44BD2a54aC3fB20cd7783cF94334069641daC9)<br>

#### EcoFund Related

*Authorized by: MIP-24, MIP-25, MIP-26*\
\
MEcoFundL1, Eth, [0x0729FF91C188eBC6F290Ba4e228cfF72EF940044](https://etherscan.io/address/0x0729FF91C188eBC6F290Ba4e228cfF72EF940044)


---

## Source: governance / guidance / g0001

# Governance and Core Contributor Teams

Author: [Cateatpeanut](https://twitter.com/CatEatPeanut), with input from the Mantle Core Contributor Team

Tags: Governance, Core Contributor Teams, Committees

## Purpose

This document outlines the current practices involving the interaction between Mantle Governance and Core Contributor Teams. Its purpose is to provide transparency to the community, and motivate feedback and improvements. It is not intended to be a prescriptive ruleset, but rather describes the norms and allows for case-by-case flexibility. The document will be updated frequently to reflect the current situation, and incorporate feedback and industry best practices.

This document is classified as "Guidance", as many items have not been ratified by the Mantle Governance Vote. Therefore, its contents are subject to the terms of current and future Proposals (MIPs) and Mantle Governance parameters.

## Definitions

**"Token Holders"** refers to both the current and future holders of $MNT tokens, acquired through purchasing, compensation, or other incentive and distribution programs. This group is analogous to "voters, citizens" in a political context, or "shareholders" in a corporate context.

\
\&#xNAN;**"Core Contributor Teams"** refers to product development and growth teams across multiple Mantle products. These teams are allocated resources through budget proposals. This group is analogous to the "executive branch" within a political context, or the "management team, directors, and workforce" within a corporate context.

\
\&#xNAN;**"Mantle Governance Vote"** refers to the official voting process of Mantle (currently Snapshot) with parameters such as quorum and majority rules defined and modifiable by Proposals. This is analogous to a "general election" or "referendum" within a political context, or the "general shareholder vote" within a corporate context.

\
\&#xNAN;**"Committees"** refers to subject matter specialized bodies, formed and authorized through Mantle Governance Vote, providing technical advisory and oversight for Core Contributor Teams in the interest of Token Holders. This is analogous to "subject matter committees" within a political and corporate context.

\
\&#xNAN;**"Voting Delegates"** receive voting weight from $MNT token holders. This group is analogous to jurisdictional or geographic "representatives" in a political context, or the "board of directors" within a corporate context.

## Current Practices

### **Objective: Token Holders determine the strategic direction of Mantle.**

Control of Resources

1. All development resources and Core Contributor Team incentives, including USDx, ETH and MNT, should be held in Mantle Treasury with disbursements via the Mantle Governance process. This distinguishes Mantle from many other DAOs where major asset resources are controlled by founding Labs or Foundations, with the DAO only overseeing the community allocation of their native token.
2. Core Contributor Teams request financing from Mantle Governance through the budget proposal process. Core Contributor Teams custody limited amounts of resources, which are replenished through a capital call process, subject to periodic performance reviews, and tracking via the Treasury Monitor. Excessively large capital calls will be rejected (see [Budgeting and Finance Guidelines](https://docs.mantle.xyz/governance/guidance/g0002) for more information).
3. All fees generated by the Mantle products are to be directed to the Mantle Treasury. The Mantle Treasury funds all expenses related to Mantle product-suite protocols and operations, in accordance with the terms specified in the budget proposal. As such, there is no "recycling" of resources without first passing through Mantle Governance authorizations.

Classification of Items for the Mantle Governance Vote

4. "Strategic" items subjected to the Mantle Governance Vote include: launching new product lines and initiatives, modifications to tokenomics, significant spending items or budget allocations, course-corrective actions, organizational structuring, Committee membership and ruleset, select technical architecture choices, and modification of Mantle Governance parameters.
5. "Non-strategic" items are best delegated to authorized Core Contributor Teams, including: monthly operating expenses, small grants, and technical architecture choices during early phases of development, cosmetic modifications, and critical fixes.
6. Items that fall between strategic and non-strategic should be delegated to Committees. Committees handle technical decisions concerning architecture, economics, security, and risk. Committee members are expected to make decisions in the best interest of Token Holders, regardless of their roles within Core Contributor Teams.

Roadmap for Committees

7. The concept of Committees, like the Mantle EcoFund Investment Committee and the Mantle Network Leadership Committee, has been alluded to by current proposals.
8. Potential future committees include the "Administrative Committee" to support proposal drafting, proposal interpretation and compliance, and establishment of real-world entities. It will also be responsible for assessing sentiment to prompt course correction discussions. The "Economics Committee" will provide advice on multi-product synergies, tokenomics, treasury yield strategies, and long-term Mantle prosperity.
9. Committee membership and rules may range from "self-determined" to "mandated by Mantle Governance", depending on the Committee's subject matter. High-risk areas such as investments and treasury allocations may necessitate memberships mandated by Mantle Governance with an "any member can veto" rule.

Approval versus Ideation Function

10. Mantle Governance primarily serves as the organization's approval and oversight function, not necessarily as the "ideation" function. While the forum is permissionless, most strategic ideas and formal proposals are expected to originate from current and future Core Contributor Teams.
11. Voter participation legitimizes the Mantle Governance Vote, particularly in relation to the protection of minority Token Holder interests.
12. Voter participation and diversification are not objectives in themselves. Most Token Holders seek potential from Mantle products, and have a high trust in Voting Delegates, Committees, and Core Contributor Teams. By analogy to a corporate context, most shareholders are passive or assign their vote to board members.

Roadmap for Voter Demographic

13. The Mantle voter and Voting Delegate demographic will likely differ from other DAOs due to the potential of the Mantle product suite and other treasury initiatives. Mantle will likely have multiple product line Core Contributor Teams, flagship dAPP partners, and technology partners such as node operators and modular blockchain technology integrations. The resulting vote-weight demographic will likely resemble a federation of committed members.

Governance Hierarchy

14. All authority of Committees and Core Contributor Teams originates from the approval and authorization of Mantle Governance through Proposals. These authorizations should be temporary and subject to modification, clarification, and supplementation by Mantle Governance. Any proposals conflicting with this principle are subject to rejection.

Course Correction

15. Course corrections depend on community and stakeholder sentiment as observed through forum posts, community managers, and other channels. The threshold is not "will this pass a vote", but "whether there is sufficient sentiment to warrant a discussion". The preference is to handle changes through private discussion, as public course-corrective actions are controversial and can potentially harm the brand. The forthcoming Administrative Council will facilitate course correction proposals.
16. The Mantle Governance Vote can, with immediate effect, modify Committee memberships and rulesets, and Core Contributor Team operating budgets. As such, Committees and Core Contributor Teams should be sensitive to community sentiment, regard Proposal terms as the minimum standard for behavior and transparency, interpret Proposal terms conservatively, and always act in the best interest of Token Holders.

### **Objective: Preserve the rights and interests of Token Holders.**

Economic Rights and Interests

17. By default, proposals should be drafted to have equal impact on all existing Token Holders' economic stakes. In special cases, a Token Holder may voluntarily choose to dilute their stake and confirm this decision through the Mantle Governance Vote.
18. Proposals resulting in resource disbursements from the Mantle Treasury are potentially economically dilutive to existing Token Holders. Such proposals must outline how these disbursements contribute to long-term Mantle prosperity. This approach parallels "ROI analysis" in a corporate context.

Voting Rights and Interests

19. The current voting mechanism is "one token, one vote weight", with no current plans for modification. Any modification proposals must empirically justify how they improve outcomes, and the effectiveness of prerequisite mechanisms like identity systems and Sybil resistance.
20. Delegation and Redelegation mechanisms are currently allowed as their purpose is convenience, and not for skewing voting rights.
21. Large Token Holders are encouraged to self-limit their voting weight, or delegate their voting weight to the preferred Voting Delegate or Core Contributor Team.

### **Objective: Empower Core Contributor Teams to be motivated and competitive.**

Executive Flexibility

22. Constraints on Core Contributor Teams will vary depending on the maturity of product development, adoption, and an empathetic evaluation of working conditions. The aim is to minimize micromanagement by Token Holders and minimize administrative and governance processes that impede progress.
23. The Mantle Governance process ordinarily spans 2-4 weeks, requiring at minimum a 7-day forum discussion and a 7-day Mantle Governance Vote. Proposals are purposely drafted with broad terms to allow flexible interpretation, ensuring that minor deviations do not necessitate additional proposals.

Privacy and Reporting

24. In alignment with our crypto-native orientation, we respect the autonomy of Core Contributor Team members and commercial partners to maintain anonymity or pseudonymity, upholding a strong degree of personal privacy.
25. Financial information will be made accessible via the Treasury Monitor for the purposes of Token Holder review and strategic decision making. Typically, these consist of budget line items. By default, individual compensations or partnership commercial terms will not be publically disclosed. To enhance transparency in the future, we may engage independent auditors to review financial details under NDA.

### **Objective: Ensure Products and Governance are censorship resistant.**

Censorship Resistance

26. Mantle Products will aim to enhance censorship resistance, progressively through technical architecture decisions and the decentralization of node operators. Progress will depend on product maturity and adoption, as these choices are likely to impose restrictions on product performance and future product development.
27. Mantle Governance and Treasury will aim to enhance censorship resistance through the adoption of on-chain governance and automated treasuries. These decisions will be based on a thorough evaluation of community sentiment, benefits, risks, costs, and constraints on future flexibility. Given the current stage of Mantle's development, this is not an immediate priority.

Virtual vs Real Life Entities

28. As a guiding principle, virtual entities are enduring and inherently censorship resistant. In contrast, real-life entities are to be established as modular, swiftly replaceable via proposals, and avoid custody of a critical mass of resources or process ownership.
29. Mantle Governance should remain a virtual membership and set of rules. Mantle Treasury should largely remain onchain.
30. Real Life entities, such as various Mantle Foundations or Holdings entities, are to derive authority from proposals. Their constitutions should be drafted with reference to the relevant proposal. Their directorships and internal governance rules should be modifiable by Mantle Governance, compliant with the relevant proposal terms, and compliant with real-world regulations.
31. Service Providers, like development labs or professional services, are not governed by Mantle Governance. Their relationship is strictly commercial, and they should follow the best practices of the Budgeting and Finance Guidelines.

## Additional Information

### Diagram: Control of Resources

<figure><img src="https://549518790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F034qlEySrVog4UerYYFm%2Fuploads%2FAY3hP0dkqxV2tBXBc9hN%2FFlowchart.jpg?alt=media&#x26;token=eb439fb0-92d7-43fb-adda-1eea580b40f4" alt=""><figcaption></figcaption></figure>


---

## Source: governance / guidance / g0002

# Budgeting and Finance Administration

Author: [Cateatpeanut](https://twitter.com/CatEatPeanut), with input from the Mantle Core Contributor Team and service providers

Tags: Budgeting, Finance, Administration

## Purpose

This document outlines the best practices for finance administration processes between the [Mantle Core Budget](https://treasurymonitor.mantle.xyz/mantle-core-budget) and authorized Service Providers. The first iteration was the [BIP-19 proposal](https://discourse.bitdao.io/t/passed-securing-the-future-with-mantle-a-comprehensive-plan/4533).

## Accounting Method

* **Multicurrency:** For the purposes of monthly claims, each major asset including MNT, USDT, USDC, ETH shall be accounted for in units. This provides simplification for end of period FX treatments.
* **Invoicing and payment cycle:** Each authorized Services Provider shall invoice the Core Operations Budget after the end of each month, by the 20th of the month. Qualified payments will be made within 1 week to the onchain address. For 1-2 months working capital, service providers can request working capital financing.
* **Record Keeping:** Service Providers shall maintain standard accounting systems, general ledger, and records of payments and costs for the purposes of review by the Mantle Administrator, or future nominated reviewers.
* **Accrual accounting:** Revenue is recognized in the period in which it's earned and realizable, but not necessarily when the cash is actually received. Revenues and expenses are recognized in the same period.

## Category Definitions

Budget proposals and monthly invoices should align with the following **Category** and <mark style="color:purple;">Subcategory</mark> definitions:

### Operating Activities

#### **A1 Workforce**

* <mark style="color:purple;">Research, Development</mark>
* <mark style="color:purple;">Creative, Growth, Marketing</mark>

Note\
\[1] Includes core teams and advisors.

#### **A2 General and Administrative**

* <mark style="color:purple;">PeopleFinanceOps</mark> - charged at $X per FTE supported
* <mark style="color:purple;">Recruitment Fees</mark>
* <mark style="color:purple;">Legal</mark>
* <mark style="color:purple;">Travel</mark> - does not include marketing and dev rel events
* <mark style="color:purple;">Other</mark>

Note\
\[1] For event related Travel and Other expenses, categorize under A3 Marketing for networking events, and C1 Ecosystem Programs for ETH events, dev events, and hackathons.

#### **A3 Marketing**

* <mark style="color:purple;">General</mark> - Includes marketing agencies, community management, analytics subscription, networking events, video production, etc.

#### B1 Infrastructure

* <mark style="color:purple;">Protocol Services</mark> - includes costs of off-chain services for Network and LSP such as AWS, monitoring services, Ethereum nodes, etc.
* <mark style="color:purple;">Support Services</mark> - includes other third party services such as: explorer, graph and indexers, RPC, oracles, analytics, security tools, bridges, relayers, wallets, etc.
* <mark style="color:purple;">Security, Audit</mark>
* <mark style="color:purple;">Other</mark>

#### B2 Protocol Expenses

* <mark style="color:purple;">Network Core</mark> - includes various core protocol system gas fee paymasters such as L1 Gas Fees and L2 Sequencer, Batch Submitter, and DA fees.
* <mark style="color:purple;">Network Other</mark> - includes gas fees for other setup requirements and faucets.

**C1 Ecosystem and Builder Programs**

* <mark style="color:purple;">DevRel, Events</mark> -&#x20;
* <mark style="color:purple;">Grants</mark> - to applications and user programs
* <mark style="color:purple;">Bug bounty</mark>

### Financing Activities

#### Funding

* <mark style="color:purple;">Working Cap Advance</mark> - Due to payment and claim cycles, service providers may request 1 to 2 months working capital advance. These are to be treated as a loan from Mantle Core Budget and repaid or settled at the end of the engagement period.

#### Special

* <mark style="color:purple;">Node Delegation</mark>
* <mark style="color:purple;">Canonical Bridge Assets</mark>

### Investing Activities

This is out of scope for the Mantle Core Budget. All investment or fund deployment activities shall be executed through [MIP-24 Mantle EcoFund](https://snapshot.org/#/bitdao.eth/proposal/0x395e58727038c5a855977248a1dd6e07356674c11f0293eb4b0f68de4e73792f), or [MIP-25 Mantle Economics Committee](https://snapshot.org/#/bitdao.eth/proposal/0xa34107e34b4dc4ff4cd16b77d66e62a51f4d35457a4f4b1f68ab8ac821f58561) vehicles.


---

## Source: governance / additional-documents / audits

# Audits

## Active Products

<table data-full-width="true"><thead><tr><th width="226">YYMMDD Auditor</th><th width="221.33333333333331">Scope<select multiple><option value="e4901451479a4e2e9199f491805c70e3" label="Migrator" color="blue"></option><option value="55ba44bc8c394d3cacfbd2375935a315" label="$MNT" color="blue"></option><option value="79291166a1a1472faf0b7c468299dd6d" label="L2Multisig" color="blue"></option></select></th><th width="95">Link</th><th data-type="files">Files</th></tr></thead><tbody><tr><td>210531 G0 Group</td><td><span data-option="79291166a1a1472faf0b7c468299dd6d">L2Multisig</span></td><td><a href="https://github.com/safe-global/safe-contracts/blob/main/docs/audit_1_3_0.md">Link</a></td><td></td></tr><tr><td>230612 Quantstamp</td><td><span data-option="e4901451479a4e2e9199f491805c70e3">Migrator</span></td><td><a href="https://certificate.quantstamp.com/full/mantle-network-token-migration/1ef59b13-313b-4382-84cc-9de402ffabcd/index.html">Link</a></td><td><a href="https://549518790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F034qlEySrVog4UerYYFm%2Fuploads%2FjT2Fa5EiWelpEaIt2onf%2F2023-06-12%20Quantstamp%20Migrator.pdf?alt=media&#x26;token=fd53c16b-84ce-457d-817e-02fb4111a32b">2023-06-12 Quantstamp Migrator.pdf</a></td></tr><tr><td>230711 Zellic</td><td><span data-option="e4901451479a4e2e9199f491805c70e3">Migrator, </span><span data-option="55ba44bc8c394d3cacfbd2375935a315">$MNT</span></td><td><a href="https://github.com/Zellic/publications/blob/master/Mantle%20-%20Zellic%20Audit%20Report.pdf">Link</a></td><td><a href="https://549518790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F034qlEySrVog4UerYYFm%2Fuploads%2FhdOymEHtgwibaFyIOfmC%2F2023-07-11%20Zellic%20MNT%20Migrator.pdf?alt=media&#x26;token=45a6f283-282a-4325-9b30-e052b6ebeeac">2023-07-11 Zellic MNT Migrator.pdf</a></td></tr><tr><td>230717 OpenZeppelin</td><td><span data-option="e4901451479a4e2e9199f491805c70e3">Migrator, </span><span data-option="55ba44bc8c394d3cacfbd2375935a315">$MNT</span></td><td><a href="https://blog.openzeppelin.com/mantle-token-and-bridge-audit">Link</a></td><td><a href="https://549518790-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F034qlEySrVog4UerYYFm%2Fuploads%2Fr4oWrX2cM9nS9o1PG8gB%2F2023-07-17%20OpenZeppelin%20MNT%20Migrator.pdf?alt=media&#x26;token=41e39ebc-5c77-423c-9184-aeb790e72fff">2023-07-17 OpenZeppelin MNT Migrator.pdf</a></td></tr></tbody></table>

## Product Descriptions

### $MNT Token

The native token for Mantle Ecosystem.

<https://etherscan.io/address/0x3c3a81e81dc49a522a592e7622a7e711c06bf354#code>

### Migrator

Migrates $BIT to $MNT 1:1, as authorized by BIP-21 and MIP-22.

<https://etherscan.io/address/0xffb94c81d9a283ab4373ab4ba3534dc4fb8d1295#code>

<https://migratebit.mantle.xyz/>

### L2Multisig SAFE

Proxy Factory v1.3.0 +L2\
<https://explorer.mantle.xyz/address/0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC/contracts#address-tabs>

Master Copy Singleton v1.3.0+L2\
<https://explorer.mantle.xyz/address/0xfb1bffC9d739B8D520DaF37dF666da4C687191EA/contracts#address-tabs>

<https://multisig.mantle.xyz/>

Note: we have deployed the official 1.3.0 version of safe-contracts, without any changes. Since the contracts haven't had any changes (which can be also proved by the contracts addresses as they were deployed deterministically using create2 opcode), this audit is applicable to to the contracts deployed on Mantle.

## Archive


---

