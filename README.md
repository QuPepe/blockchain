# Learning Resources
+ [Learn Solidity](https://www.alchemy.com/university/courses/solidity) & [GitHub](https://github.com/alchemyplatform/learn-solidity-presentations)
+ [Smart Contracts and Solidity](https://masteringethereum.xyz/chapter_7.html)
+ [Solidity (Official)](https://soliditylang.org/)
+ [Foundry](https://book.getfoundry.sh/)
+ [Foundry Full Course](https://github.com/Cyfrin/foundry-full-course-cu)
+ [Solidity cheetsheet](https://docs.soliditylang.org/en/v0.8.28/cheatsheet.html)
+ [Ethers.js documents](https://docs.ethers.org/v6/)

# Supplements
+ [Application Binary Interfaces](https://docs.ethers.org/v6/basics/abi/)
+ [Introduction to Smart Contracts](https://docs.soliditylang.org/en/develop/introduction-to-smart-contracts.html)
+ [Solidity by Example](https://docs.soliditylang.org/en/develop/solidity-by-example.html)
+ [Console logging in Foundry](https://book.getfoundry.sh/reference/forge-std/console-log)
+ [WTF Solidity](https://github.com/AmazingAng/WTF-Solidity)
+ [Develop an NFT Collection](https://updraft.cyfrin.io/courses/advanced-foundry/how-to-create-an-NFT-collection/introduction-to-nfts)
+ [Develop an NFT Collection, By TA](https://github.com/jing-yuan-nccu/foundry-nft)
+ [JavaScript: Promise 介紹](https://www.casper.tw/development/2020/10/16/async-await/)
+ [JavaScript: async / await 介紹](https://www.casper.tw/development/2020/10/16/async-await/)
+ [React: useState](https://react.dev/reference/react/useState)
+ [React: userEffect](https://react.dev/reference/react/useEffect)

# Software Used in This Class
+ Solidity: [Foundry](https://book.getfoundry.sh/)
+ Git: [Git for Windows](https://gitforwindows.org/) (Mac already has Git and thus does not need to install this.)
+ JavaScript: [Node.js](https://nodejs.org/en/download/prebuilt-installer)
+ JavaScript development framework: [React](https://react.dev/)
+ Code editor: [Visual Studio Code](https://code.visualstudio.com/)

# Installation
+ [Git for Windows](https://gitforwindows.org/)
  - (Suggested) Check "Additional icons (On the Desktop)".
  - (Optional) Set your name for Git.
    ```
    git config --global user.name "John Doe"
    ```
  - Set your email for Git.
    ```
    git config --global user.email johndoe@example.com
    ```
+ [Foundry](https://book.getfoundry.sh/)
  - Open a Git Bash (in Windows) or a terminal (in Mac).
    ```
    curl -L https://foundry.paradigm.xyz | bash && foundryup
    ```
  - Note: If you use Mac (especially Intel CPU models), you may encounter the error message when installing Foundry: `Library not loaded: /usr/local/opt/libusb/lib/libusb-1.0.0.dylib`. You can type `brew install libusb` to solve this issue.
+ JavaScript
  - Install prebuilt [Node.js](https://nodejs.org/en/download/prebuilt-installer). (Or use [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows) to install multiple Node.js.)
  - If you use nvm:
    ```
    nvm install lts
    ```
    ```
    nvm list
    ```
    ```
    nvm use <version>
    ```
  - Check the installed version.
    ```
    node -v
    ```
    ```
    npm -v
    ```
+ Code editor
  - Install [Visual Studio Code](https://code.visualstudio.com/).
  - Install the "solidity" extension by Juan Blanco, which provides syntax highlighting, IntelliSense, and debugging support for Solidity.

# View Blockchain Information
+ Open a Git Bash (in Windows) or a terminal (in Mac).
+ Start the test blockchain.
  ```
  anvil
  ```
+ Open another Git Bash (in Windows) or another terminal (in Mac).
+ Create a root folder "Web" and enter it.
  ```
  mkdir Web
  ```
  ```
  cd Web
  ```
+ Create a folder "vieweth" and enter it.
  ```
  mkdir vieweth
  ```
  ```
  cd vieweth
  ```
+ Initialize a Node.js project.
  ```
  npm init
  ```
  ```
+ Install Ethers.js.
  ```
  ```
  npm install ethers
  ```
+ Edit "vieweth.js".
  (You can copy this file from `/code/web/vieweth/vieweth.js`.)
+ View the result.
  ```
  node vieweth
  ```

![image](/image/anvil.png)

![image](/image/vieweth.png)
