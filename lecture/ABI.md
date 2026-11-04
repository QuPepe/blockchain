## Application Binary Interface (ABI)

In computer software, an **Application Binary Interface (ABI)** defines how different program modules interact at the binary level, often between an operating system and user programs. Unlike an **Application Programming Interface (API)**, which defines how software components interact at the source-code level, an ABI specifies how functions are called and how data is represented at the binary level.

In Ethereum, the ABI defines how external applications interact with smart contracts. It specifies the functions that can be called, their input parameters, and their return values. The ABI is also used to encode function calls into binary data that the Ethereum Virtual Machine (EVM) can process and to decode returned data.

A smart contract's ABI is typically represented as a **JSON array** describing its functions, events, errors, and other interfaces.

- **Functions:** Each function description includes fields such as `type`, `name`, `inputs`, `outputs`, and `stateMutability`.
- **Events:** Each event description includes fields such as `type`, `name`, `inputs`, and `anonymous`.

The `stateMutability` field specifies whether a function is `pure`, `view`, `nonpayable`, or `payable`.

Frontend libraries such as **ethers.js** use the ABI to interact with smart contracts by encoding function calls and decoding returned data.

**Note:** The ABI is different from smart contract bytecode. Bytecode contains the executable instructions deployed on Ethereum, while the ABI describes how external applications can interact with the contract.
