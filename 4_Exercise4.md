# Exercise 4: Create Your Own Tokens

## Create, Test, and Deploy Your ERC‑20 Contract on Anvil
+ Enter the folder `Solidity`.
  ```
  cd Solidity
  ```
+ Initialize a Foundry project.
   ```
   forge init erc20
   cd erc20
   ```
+ Install OpenZeppelin
  ```
  forge install OpenZeppelin/openzeppelin-contracts
  ```
+ Move src/Counter.sol elsewhere (e.g., the `orig` folder).
+ Move test/Counter.t.sol elsewhere (e.g., the `orig` folder).
+ Move script/Counter.s.sol elsewhere (e.g., the `orig` folder).
+ `code .`
+ Copy the contract file from `/code/solidity/erc20/src/MyToken.sol` to your `src` folder.
+ Copy the test script file from `/code/solidity/erc20/test/MyToken.t.sol` to your `test` folder.
+ Copy the deployment script file from `/code/solidity/erc20/script/MyToken.s.sol` to your `script` folder.
+ `anvil`
+ Build the contract.
  ```
  forge build
  ```
+ Test the contract.
  ```
  forge test -vv
  ```
+ Deploy the contract using deployment script (and using your private key).
  ```
  forge script script/MyToken.s.sol --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
  ```
+ Import your tokens into your wallet.
+ Now, you should be able to tranfer your tokens to another account on anvil.

## Deploy Your ERC‑20 Contract on Sepolia (an Ethereum Testnet)
+ Prerequisites
  1. MetaMask wallet -> Networks -> Show test networks -> Select network - > Sepolia
  2. Visit [Google Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) or [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia) to obtain Sepolia ETH (Ethereum test tokens).
     - You can obtain only 0.05 Sepolia ETH per day or 0.1 Sepolia ETH / 72 hrs.
     - If there is any error, try to use another Google account.
+ Select "Sepolia" as your network.
+ For security reasons, do not reveal your private key in commnad line interface. So, set your private key as an environmental varaible.
  ```
  export PRIVATE_KEY=<your_private_key>
  ```
+ Deploy your ERC-20 contract onto Sepolia. (Your could change the RPC URL to other Sepolia RPC URLs, such as Infura and Alchemy.)
  ```
  forge script script/MyToken.s.sol --rpc-url https://ethereum-sepolia-rpc.publicnode.com --private-key $PRIVATE_KEY --broadcast
  ```
+ Check the deployed contract on [Etherscan Sepolia](https://sepolia.etherscan.io/) by typing your contract address.
+ Import your tokens into your wallet.
+ Transfer your tokens to your friends.
+ Set your contract address as an environmental varaible.
  ```
  export CONTRACT_ADDRESS=<your_contract_address>
  ```
+ Query the supply of your tokens.
  ```
  cast call $CONTRACT_ADDRESS "totalSupply()(uint256)" --rpc-url https://ethereum-sepolia-rpc.publicnode.com
  ```
+ Query your token name.
  ```
  cast call $CONTRACT_ADDRESS "name()(string)" --rpc-url https://ethereum-sepolia-rpc.publicnode.com
  ```
+ Query your token symbol.
  ```
  cast call $CONTRACT_ADDRESS "symbol()(string)" --rpc-url https://ethereum-sepolia-rpc.publicnode.com
  ```
+ Query the number of your token decimals.
  ```
  cast call $CONTRACT_ADDRESS "decimals()(uint8)" --rpc-url https://ethereum-sepolia-rpc.publicnode.com
  ```
+ Mint new tokens. (Change the amount as you wish. But remember to multiply it by the number of decimals.)
  ```
  cast send $CONTRACT_ADDRESS "mint(address,uint256)" <recipient_address> 1000000000000000000000 --rpc-url https://ethereum-sepolia-rpc.publicnode.com --private-key $PRIVATE_KEY
  ```
+ Transfer tokens. (Change the amount as you wish. But remember to multiply it by the number of decimals.)
  ```
  cast send $CONTRACT_ADDRESS "transfer(address,uint256)" <recipient_address> 1000000000000000000000 --rpc-url https://ethereum-sepolia-rpc.publicnode.com --private-key $PRIVATE_KEY
  ```
+ Fill in the form.

+ Think: How to move Exercise 3 onto Sepolia?

