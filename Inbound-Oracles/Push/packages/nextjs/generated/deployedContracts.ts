const contracts = {
  31337: [
    {
      name: "localhost",
      chainId: "31337",
      contracts: {
        PriceOracle: {
          address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          abi: [
            {
              inputs: [],
              name: "OnlyReporter",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "ticker",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "reporter",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "payload",
                  type: "uint256",
                },
              ],
              name: "PriceUpdate",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "key",
                  type: "bytes32",
                },
              ],
              name: "getData",
              outputs: [
                {
                  internalType: "bool",
                  name: "results",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "date",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "payload",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "reporterAddress",
                  type: "address",
                },
              ],
              name: "getReporter",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "key",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "payload",
                  type: "uint256",
                },
              ],
              name: "updateData",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "reporterAddress",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "isReporter",
                  type: "bool",
                },
              ],
              name: "updateReporter",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        PriceConsumer: {
          address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_oracle",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [],
              name: "CouldNotGetPrice",
              type: "error",
            },
            {
              inputs: [],
              name: "StalePrice",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "ticker",
                  type: "bytes32",
                },
              ],
              name: "getPrice",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "priceOracle",
              outputs: [
                {
                  internalType: "contract IOracle",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
