const { createPublicClient, http } = require('viem');
const { sepolia } = require('viem/chains');

const client = createPublicClient({
  chain: sepolia,
  transport: http()
});

const pyusdAddress = '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9';

async function checkPYUSD() {
  try {
    const name = await client.readContract({
      address: pyusdAddress,
      abi: [{
        name: 'name',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'string' }]
      }],
      functionName: 'name'
    });
    
    const symbol = await client.readContract({
      address: pyusdAddress,
      abi: [{
        name: 'symbol',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'string' }]
      }],
      functionName: 'symbol'
    });

    console.log('PYUSD Name:', name);
    console.log('PYUSD Symbol:', symbol);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkPYUSD();
