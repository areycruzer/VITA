const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
  const provider = new ethers.JsonRpcProvider('https://endpoints.omniatech.io/v1/mantle/sepolia/public');
  const wallet = new ethers.Wallet(process.env.MANTLE_PRIVATE_KEY, provider);
  
  // Contract addresses from deployment
  const addresses = {
    valuationEngine: '0xa7BC6695258f5fC5E07c5561bE2c65342AC7b745',
    vitaToken: '0x4d0F0e709b1c81853f3a99925B00cFe085044c79',
    groth16Verifier: '0x47371C3244D60C89D6e5Ab49E972cA07D427Dc37',
    workProofRegistry: '0x008aceeD352DC93DB3B15E4466f8Ad71316D0dCd',
    mockMETH: '0x9A02E56cE3D8858ff72bfbDb83085AE5CfAE7031',
    methStaking: '0xcC06e475e8863129fEaC7eFecE9851B4a489738e',
    vitaTokenV2: '0x36987d58D3ba97462c241B52598aacd7B8C77228',
  };
  
  console.log('Configuring contracts...');
  console.log('Wallet:', wallet.address);
  
  // VitaTokenV2 ABI for initialize
  const vitaTokenV2Abi = [
    'function initialize(address _methStaking, address _zkVerifier, address _workProofRegistry) external',
    'function initialized() view returns (bool)',
  ];
  
  const vitaTokenV2 = new ethers.Contract(addresses.vitaTokenV2, vitaTokenV2Abi, wallet);
  
  // Check if already initialized
  try {
    const isInit = await vitaTokenV2.initialized();
    console.log('VitaTokenV2 initialized:', isInit);
    
    if (!isInit) {
      console.log('Initializing VitaTokenV2...');
      const tx = await vitaTokenV2.initialize(
        addresses.methStaking,
        addresses.groth16Verifier,
        addresses.workProofRegistry
      );
      console.log('Tx:', tx.hash);
      await tx.wait();
      console.log('VitaTokenV2 initialized!');
    }
  } catch (e) {
    console.log('VitaTokenV2 init error:', e.message.slice(0, 100));
  }
  
  // METHStaking role grant
  const methStakingAbi = [
    'function VITA_TOKEN_ROLE() view returns (bytes32)',
    'function grantRole(bytes32 role, address account) external',
    'function hasRole(bytes32 role, address account) view returns (bool)',
  ];
  
  const methStaking = new ethers.Contract(addresses.methStaking, methStakingAbi, wallet);
  
  try {
    const role = await methStaking.VITA_TOKEN_ROLE();
    const hasRole = await methStaking.hasRole(role, addresses.vitaTokenV2);
    console.log('VitaTokenV2 has VITA_TOKEN_ROLE:', hasRole);
    
    if (!hasRole) {
      console.log('Granting VITA_TOKEN_ROLE...');
      const tx = await methStaking.grantRole(role, addresses.vitaTokenV2);
      console.log('Tx:', tx.hash);
      await tx.wait();
      console.log('Role granted!');
    }
  } catch (e) {
    console.log('Role grant error:', e.message.slice(0, 100));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ DEPLOYMENT COMPLETE!');
  console.log('='.repeat(60));
  console.log('\n📋 Contract Addresses (Mantle Sepolia - Chain ID 5003):');
  console.log('-'.repeat(60));
  for (const [name, addr] of Object.entries(addresses)) {
    console.log(`  ${name.padEnd(20)} ${addr}`);
  }
  console.log('\n🔗 View on Explorer:');
  console.log(`  https://sepolia.mantlescan.xyz/address/${addresses.vitaTokenV2}`);
}

main().catch(console.error);
