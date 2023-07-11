## Inbound Oracles

A Guide to Understanding and Implementing Inbound Oracles on the Ethereum Network

This folder provides a comprehensive guide to inbound oracles, which are third-party services that provide external data and information to the Ethereum network. Inbound oracles allow smart contracts to receive information from external sources, which can trigger smart contract execution or influence the outcome of smart contract condition

This folder covers two different methods of implementing inbound oracles: push and pull. It explains the advantages and disadvantages of each method, and provides examples of how they can be implemented in practice.

- Pull Oracles: These oracles pull data from external sources by making API requests or other direct calls to external systems. They can be used to retrieve data from a single source or multiple sources, and can be implemented in a decentralized or centralized manner. In the folder Pull above we implement a simple oracle that can get a random number and return it back to the user

- Push Oracles: These oracles rely on external systems to push data to the blockchain network when a specific event occurs. They are typically used in cases where external systems have already validated the data and the blockchain network needs to be updated in real-time. In the folder Push above we implement a simple oracle that can get the current price of bitcoin and return it back to the contact Note : We can use this to forward predict the price of wbtc and then arbitrage it( in Theory)
