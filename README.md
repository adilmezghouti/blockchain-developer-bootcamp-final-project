# Family Trust
##Introduction
This contract product allows parents and guardians to set up a family trust to help secure the future of their children.

So far users can do the following things:
- Anyone can put funds in the following buckets:
  - University: Funds in this bucket are meant to be locked until children start University.
  - Allowances: Funds in this bucket are should be available for the children to use.
  - Inheritance: Funds in this bucket are meant to be locked until children reaches the age of 18.
- Anyone can view the different balances
- Anyone can view the people taking part in the contract
- The contract owner can:
  - Add, enable, disable admins
  - Add, enable, disable benefitors/users

##Future Requirements
Here are some features that can be added in the future:
- Use Hashed Time Lock Contracts to unlock funds in a given back
- Only allow the people in the contract to access/view the dapp.
- Allow admins to invest the deposited money into defi products
- Allow the contract to hold ERC20 tokens and NFTs
- Use NFTs and tokens to reward children
- Transfer ownership of the contract when the owner passes away

##Project Setup Instructions:
There are two different component to this project: the smart contract and the dapp (front-end).

###Requirements
This project uses the following technologies:
- Node js
- npm or yarn
- Truffle
- Ganache
- React js
- Solidity

###Smart Contract:
To set up the smart contract part follow the following steps:
- Install dependencies: npm install
- Rename .env.local to .env and populate it with the right values
- Run ganache: ganache-cli -m PUT_MNEMONIC_VALUE_FROM_DOT_ENV_HERE
- Run tests: truffle test --network development //This requires Ganache to be already running
- Compile the smart contract:  truffle compile --all
- Deploy the smart contract: truffle migrate --reset

In order to deploy the smart contract to Ropsten:
- truffle migrate --network ropsten

###Dapp / Font-end:
- Change directories to client
- Install dependencies: npm install
- Run the dapp: npm run start
- Access the dapp at: http://localhost:3000/

##Unit Tests
The battery of unit tests in place target the following pieces of functionality:
- Make sure the contract is deployed
- Contract Ownership
- Read, add admins
- Read, add users/benefitors
- Read and add fund buckets
- Read, add, and release funds

## See the dapp in action
- The dapp is deployed to IPFS using Fleek. You can access it here: https://white-recipe-7476.on.fleek.co/
- A screencast of you walking through your project

##Public Ethereum account:
- My address for the NFT certificate: 0xF35Efa0f39270358687f896487bdE4F90b5fC933
