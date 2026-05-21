# Sending ETH Using Foundry `cast`

In addition to transferring ETH through MetaMask and a React frontend, we can also send ETH directly from the command line using Foundry's `cast` tool.

`cast` is a command-line utility provided by Foundry. It can be used to:

- send transactions
- call smart contract functions
- query blockchain data
- interact with Ethereum RPC nodes

The `cast send` command signs and broadcasts a transaction.

---

# 1. Check Account Balance

Check the ETH balance of an address:

```bash
cast balance 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 \
  --rpc-url http://127.0.0.1:8545
```

The result is returned in wei.

Convert wei to ether:

```bash
cast from-wei <BALANCE_IN_WEI> ether
```

---

# 2. Send ETH

Use one of Anvil's default test accounts to send ETH.

```bash
cast send 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 \
  --value 1ether \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://127.0.0.1:8545
```

Explanation:

- `0x7099...79c8` is the receiver address.
- `--value 1ether` sends 1 ETH.
- `--private-key` specifies the sender's private key.
- `--rpc-url` connects to the local Anvil blockchain.

After execution, `cast` will display the transaction hash and transaction information.

---

# 3. Verify the Transfer

Check the balances again:

```bash
cast balance 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 \
  --rpc-url http://127.0.0.1:8545

cast balance 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 \
  --rpc-url http://127.0.0.1:8545
```

The sender's balance should decrease, while the receiver's balance should increase.

---

# 4. Anvil Test Accounts

When Anvil starts, it automatically generates several test accounts with ETH balances and known private keys.

Start Anvil:

```bash
anvil
```

Example output:

```text
Available Accounts
==================

(0) 0xf39Fd6e51aad88F6F4ce6AB8827279cffFb92266
(1) 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

Private Keys
==================

(0) 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

These accounts are only for local testing and development.

Never expose real private keys on public blockchains.

---

# 5. Additional Notes

`cast send` can also be used to:

- deploy smart contracts
- call smart contract functions
- send ETH together with contract calls
- interact with deployed contracts

Example of calling a smart contract function:

```bash
cast send <CONTRACT_ADDRESS> \
  "setName(string)" "Alice" \
  --private-key <PRIVATE_KEY> \
  --rpc-url http://127.0.0.1:8545
```

This sends a transaction that calls the `setName()` function on the smart contract.
