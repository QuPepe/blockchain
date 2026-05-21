# Exercise 2: Send Ether

## Send Ether via MetaMask and React
+ Create or log in to your MetaMask wallet. Create a test network and connect to it:
  ![image](/image/testnet.png)
+ Open a Git Bash (in Windows) or a terminal (in Mac).
+ Enter the folder `Web`.
  ```
  cd Web
  ```
+ Create a React + Vite app. (Install with npm and start now? Choose "No".)
  ```
  npm create vite@latest transfer-app -- --template react
  ```
+ Enter the new folder and install Vite.
  ```
  cd transfer-app
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
+ Edit "src/App.jsx".
  (You can copy this file from `/code/web/transfer-app/src/App.jsx`.)
  ```
  code .
  ```
+ Copy images assets to "src". (You can copy the assets from `/code/web/transfer-app/src/assets`.)
+ View the web page.
  ```
  npm run dev
  ```
+ Change the receiver address.
+ "Transfer" Ether to the receiver address.
+ Use the utility program `vieweth` to examine account balances.

![image](/image/transfer.png)

## Note (Maybe No Longer Needed)
1. In addition to transferring ETH through MetaMask and a React frontend, we can also send ETH directly from the command line using Foundry's `cast` tool. See [this tutorial](cast_send_ether.md) for details.

2. When you restart anvil, you may need to restart your browser and clear activity and nonce data in MetaMask.

+ Firefox: `Settings -> Advanced -> Clear activity tab data`.
+ Chrome: `Settings -> Developer tools -> Delete activity and nonce data`.

This can make sure the nonce data in anvil and in your MetaMask are consistent.
