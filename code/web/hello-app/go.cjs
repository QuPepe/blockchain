// Import Node.js core modules
const fs = require('fs'); // File system module (read/write files)
const path = require('path'); // Utility for handling file paths

// Paths to the compiled contract artifact and Foundry broadcast file
const abiPath = 'D:/Solidity/hello/out/Hello.sol/Hello.json';
const broadcastPath = 'D:/Solidity/hello/broadcast/Hello.s.sol/31337/run-latest.json';

/**
 * Export ABI and contract address for frontend use
 *
 * This function:
 * 1. Reads the compiled contract artifact (to get ABI)
 * 2. Reads the Foundry broadcast file (to get deployed address)
 * 3. Writes both ABI and address into JSON files for the frontend
 */
function exportContractArtifact() {
    // Read and parse the compiled contract artifact (JSON)
    // This file contains ABI, bytecode, and metadata
    const artifact = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));

    // Extract ABI
    const abi = artifact.abi;

    // Read and parse the Foundry broadcast output
    // Contains deployment details such as transactions and receipts
    const deployment = JSON.parse(fs.readFileSync(broadcastPath, 'utf-8'));

    // Extract deployed contract address
    // Prefer receipts[0].contractAddress (standard case)
    // Fallback to transactions[0].contractAddress if needed
    const address =
        deployment?.receipts?.[0]?.contractAddress ??
        deployment?.transactions?.[0]?.contractAddress;

    // Throw error if contract address cannot be found
    if (!address) {
        throw new Error('Cannot find contractAddress in broadcast JSON');
    }

    // Write ABI to a JSON file for frontend usage
    // This allows the frontend to understand contract methods and events
    // __dirname: the directory path of the current file
    // __dirname: ensures file paths are resolved relative to this file (not the current working directory)
    fs.writeFileSync(
        path.join(__dirname, './src/abi/Hello-abi.json'),
        JSON.stringify(abi, null, 2) // Convert object to JSON string with readable formatting (2-space indent)
    );

    // Write contract address to a separate JSON file
    // This allows the frontend to know where the contract is deployed
    fs.writeFileSync(
        path.join(__dirname, './src/abi/Hello-addr.json'),
        JSON.stringify({ address }, null, 2)
    );

    console.log('ABI and contract address have been exported successfully');
}

// Execute the function
exportContractArtifact();
