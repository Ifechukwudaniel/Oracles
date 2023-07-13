#  Push Oracle Demo

This is a straightforward guide that provides an explanation of a push oracle, utilizing Scaffold-Eth 2 for demonstration purposes. It's advisable that you have some familiarity with Scaffold-Eth 2 and Solidity to fully benefit from this tutorial.

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/Ifechukwudaniel/Oracles
cd Inbound-Oracles/Push/
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
cd Inbound-Oracles/Push/packages/nextjs
yarn start
```
This command starts the next js app on Visit your app on: `http://localhost:3000 `.There are two pages you need to know about, the first page explains the demo while the second page is a table that shows price updates, the price table is empty because the Oracle node is not running 
 
<img width="1440" alt="Screenshot 2023-07-13 at 3 36 53 PM" src="https://github.com/Ifechukwudaniel/Oracles/assets/47566579/116644f2-77f0-40d0-9182-f05cefcb7310">

<img width="1440" alt="Screenshot 2023-07-13 at 3 36 10 PM" src="https://github.com/Ifechukwudaniel/Oracles/assets/47566579/0d2fe56d-36e8-47d0-87bf-7ae7f9df3b49">


5. On the fifth terminal run the Simulation of nodes updating the prices of different Token  on the price oracle contract:

```
cd Inbound-Oracles/Push/packages/hardhat
yarn run watch-prices 
```
By executing the subsequent command, you initiate the script that refreshes the Oracle contract's state and the user interface. The value of each asset will be refreshed every 2 seconds to maintain the most recent token price.

<img width="673" alt="Screenshot 2023-07-13 at 4 05 23 PM 1" src="https://github.com/Ifechukwudaniel/Oracles/assets/47566579/63c872a6-6737-4e1c-8fba-4d6fb6504e67">

<img width="1440" alt="Screenshot 2023-07-13 at 4 06 43 PM" src="https://github.com/Ifechukwudaniel/Oracles/assets/47566579/394379db-36ff-4ea3-87e9-359f36930c92">


## Note 
This demonstration is purely for illustrative purposes and is not intended for deployment on the mainnet.


## How it Works 

![Diagram](https://github.com/Ifechukwudaniel/Oracles/assets/47566579/01617caf-887e-433d-a9a5-8c79dd317197)

In essence, there are nodes that report the latest price of each of the following assets in USD:
```
[
    "bitcoin",
    "ethereum",
    "solana",
    "bitcoin-cash",
    "cardano",
    "monero",
    "polkadot",
    "dogecoin",
    "dash",
    "tron",
  ];
```
And then it calls updateData  in the PriceOracle.sol Contract 

 ```
  function updateData(bytes32 key, uint payload) external {
    if (!_hasReporter(msg.sender)) {
      revert OnlyReporter();
    }
    data[key] = Data(block.timestamp, payload);
    emit PriceUpdate(key, msg.sender, payload);
  }
 ```
The token's id is the Byte32 hash of the token symbol, which is the key, and the payload is the price.


 ```

contract PriceConsumer {
  IOracle public priceOracle;

  constructor(address _oracle) {
    priceOracle = IOracle(_oracle);
  }

  function getPrice(bytes32 ticker) external view returns (uint) {
    (bool found, uint timestamp, uint price) = priceOracle.getData(ticker);
    if (!found) {
      revert CouldNotGetPrice();
    }
    if (block.timestamp - timestamp >= 3 minutes) {
      revert StalePrice();
    }
    return price;
  }
}

```

`priceOracle.getData(ticker)` gets the data  where the ticker is the bytes32 hash of 'BTC/USD'

