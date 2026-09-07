import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Contract ABI (simplified for ticketing)
const CONTRACT_ABI = [
  "function mintTicket(string memory ticketId, bytes32 dataHash) public returns (uint256)",
  "function getTicket(uint256 tokenId) public view returns (string memory ticketId, bytes32 dataHash, address owner, uint256 timestamp)",
  "function verifyTicket(uint256 tokenId) public view returns (bool)",
  "event TicketMinted(uint256 indexed tokenId, string ticketId, address indexed owner, uint256 timestamp)"
];

// Initialize provider and contract
let provider;
let contract;
let signer;

export const initBlockchain = () => {
  try {
    // Connect to blockchain
    provider = new ethers.JsonRpcProvider(
      process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545'
    );

    // Use first account as signer (in production, use proper key management)
    signer = new ethers.Wallet(
      process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      provider
    );

    // Initialize contract
    contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    console.log('✅ Blockchain initialized');
    console.log(`📍 Contract address: ${process.env.CONTRACT_ADDRESS}`);
    
    return { provider, contract, signer };
  } catch (error) {
    console.error('❌ Blockchain initialization failed:', error.message);
    return null;
  }
};

// Mint ticket on blockchain
export const mintTicketOnChain = async (ticketId, ticketData) => {
  try {
    if (!contract) {
      throw new Error('Blockchain not initialized');
    }

    // Create hash of ticket data
    const dataHash = ethers.keccak256(
      ethers.toUtf8Bytes(JSON.stringify(ticketData))
    );

    // Mint ticket
    const tx = await contract.mintTicket(ticketId, dataHash);
    const receipt = await tx.wait();

    // Get token ID from event
    const event = receipt.logs.find(log => {
      try {
        return contract.interface.parseLog(log).name === 'TicketMinted';
      } catch {
        return false;
      }
    });

    const tokenId = event ? contract.interface.parseLog(event).args.tokenId : null;

    return {
      success: true,
      transactionHash: receipt.hash,
      tokenId: tokenId ? tokenId.toString() : null,
      blockNumber: receipt.blockNumber,
      dataHash
    };
  } catch (error) {
    console.error('Blockchain mint error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Verify ticket on blockchain
export const verifyTicketOnChain = async (tokenId) => {
  try {
    if (!contract) {
      throw new Error('Blockchain not initialized');
    }

    const isValid = await contract.verifyTicket(tokenId);
    const ticketData = await contract.getTicket(tokenId);

    return {
      success: true,
      isValid,
      ticketId: ticketData[0],
      dataHash: ticketData[1],
      owner: ticketData[2],
      timestamp: ticketData[3].toString()
    };
  } catch (error) {
    console.error('Blockchain verify error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get blockchain info
export const getBlockchainInfo = async () => {
  try {
    if (!provider) {
      throw new Error('Provider not initialized');
    }

    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const balance = await provider.getBalance(signer.address);

    return {
      network: network.name,
      chainId: network.chainId.toString(),
      blockNumber,
      signerAddress: signer.address,
      balance: ethers.formatEther(balance)
    };
  } catch (error) {
    console.error('Blockchain info error:', error);
    return null;
  }
};

export { provider, contract, signer };
