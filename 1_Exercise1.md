# Exercise 1: Hello

## Create, Test, and Deploy the Hello Contract
+ Open a Git Bash (in Windows) or a terminal (in Mac).
+ Create a folder `Solidity` and enter it.
  ```
  mkdir Solidity
  ```
  ```
  cd Solidity
  ```
+ Initialize a Foundry project.
  ```
  forge init hello
  ```
+ Enter the new folder and open Visual Studio Code.
  ```
  cd hello
  ```
  ```
  code .
  ```
+ Move src/Counter.sol elsewhere (e.g., the `orig` folder). Edit `src/Hello.sol`.
  (You can copy this file from `/code/solidity/hello/src/Hello.sol`.)
+ Move test/Counter.t.sol elsewhere (e.g., the `orig` folder). Edit `test/Hello.t.sol`.
  (You can copy this file from `/code/solidity/hello/test/Hello.t.sol`.)
+ Move test/Counter.s.sol elsewhere (e.g., the `orig` folder). Edit `script/Hello.s.sol`.
  (You can copy this file from `/code/solidity/hello/script/Hello.s.sol`.)
+ Test the contract.
  ```
  forge test -vv
  ```
+ Build the contract.
  ```
  forge build
  ```
+ Deploy the contract using command (and using your private key).
  ```
  forge create src/Hello.sol:Hello --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
  ```
+ Alternatively, deploy the contract using deployment script (and using your private key). (**Use this method!**)
  ```
  forge script script/Hello.s.sol --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
  ```

## Interact with the Hello Contract via Node.js
+ Open a Git Bash (in Windows) or a terminal (in Mac).
+ Enter the folder `Web`.
  ```
  cd Web
  ```
+ Create a folder `hello` and enter it.
  ```
  mkdir hello
  ```
  ```
  cd hello
  ```
+ Initialize an npm project.
  ```
  npm init
  ```
+ Install Ethers.js.
  ```
  npm install ethers
  ```
+ Edit `hello.js`.
  (You can copy this file from `/code/web/hello/hello.js`.)
  ```
  code .
  ```
+ Edit `config.js`. (Change the two paths, according to your environment.)
  (You can copy this file from `/code/web/hello/config.js`.)
+ View the result.
  ```
  node hello
  ```
+ Edit `listen.js`. (Subscribe to the NameChanged event.) (You can copy this file from `/code/web/hello/listen.js`.)
+ View the result.
  ```
  node listen
  ```
  ```
  node hello
  ```
+ Interact with the contract uisng the `cast` command.
  ```
  export CONTRACT_ADDR=<YOUR_CONTRACT_ADDRESS>
  ```
  ```
  cast call $CONTRACT_ADDR "greet()(string)" --rpc-url http://127.0.0.1:8545
  ```
  ```
  cast call $CONTRACT_ADDR "getMaxUint256()(uint256)" --rpc-url http://127.0.0.1:8545
  ```
  ```
  cast call $CONTRACT_ADDR "sumUpTo(uint256)(uint256)" 100 --rpc-url http://127.0.0.1:8545
  ```
  ```
  cast call $CONTRACT_ADDR "getName()(string)" --rpc-url http://127.0.0.1:8545
  ```
  ```
  cast send $CONTRACT_ADDR "setName(string)" "Pepe2" --rpc-url http://127.0.0.1:8545 --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked
  ```
  ```
  cast call $CONTRACT_ADDR "getName()(string)" --rpc-url http://127.0.0.1:8545
  ```
  ```
  cast send $CONTRACT_ADDR "setName(string)" "Pepe3" --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
  ```
  ```
  cast call $CONTRACT_ADDR "getName()(string)" --rpc-url http://127.0.0.1:8545
  ```

![image](/image/hello.png)

## Interact with the Hello Contract via React
+ Open a Git Bash (in Windows) or a terminal (in Mac).
+ Enter the folder `Web`.
  ```
  cd Web
  ```
+ Create a React + Vite app. (Install with npm and start now? Choose "No".)
  ```
  npm create vite@latest hello-app -- --template react
  ```
+ Enter the new folder and install Vite.
  ```
  cd hello-app
  npm install
  ```
+ Install Ethers.js.
  ```
  npm install ethers
  ```
+ Backup "src/App.jsx" to "src/App.jsx.ORIG".
  ```
  mv src/App.jsx src/App.jsx.ORIG
  ```
+ Edit `src/App.jsx`.
  (You can copy this file from `/code/web/hello-app/src/App.jsx`.)
  ```
  code .
  ```
  (Run the editor at the root folder of hello-app.)
+ Put `go.cjs` into your app root (i.e., hello-app).
  (You can copy this file from `/code/web/hello-app/go.cjs`.)
+ Run `go.cjs` to get the contract's ABI and address.
  ```
  mkdir src/abi
  ```
  ```
  node go.cjs
  ```
+ View the web page.
  ```
  npm run dev
  ```

Notes:
+ Install the `React Developer Tools` plugin in your browser for advanced debugging.
+ `forge clean` can remove the build artifacts and cache directories.

![image](/image/hello-app.png)
