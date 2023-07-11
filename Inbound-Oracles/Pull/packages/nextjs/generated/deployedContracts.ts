const contracts = {
  31337: [
    {
      name: "localhost",
      chainId: "31337",
      contracts: {
        HttpRequestConsumer: {
          address: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
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
              name: "FakeReporter",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "requestId",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "volume",
                  type: "uint256",
                },
              ],
              name: "RequestVolume",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "_requestId",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "_volume",
                  type: "uint256",
                },
              ],
              name: "_requestedDataCompleted",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "requestPriceData",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        HttpRequestOracle: {
          address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
          abi: [
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
                  name: "id",
                  type: "bytes32",
                },
              ],
              name: "RequestCancelled",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "id",
                  type: "bytes32",
                },
              ],
              name: "RequestFulfilled",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "id",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "bytes",
                  name: "data",
                  type: "bytes",
                },
              ],
              name: "RequestSent",
              type: "event",
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
                  components: [
                    {
                      internalType: "bytes32",
                      name: "id",
                      type: "bytes32",
                    },
                    {
                      internalType: "address",
                      name: "callbackAddress",
                      type: "address",
                    },
                    {
                      internalType: "bytes4",
                      name: "callbackFunctionId",
                      type: "bytes4",
                    },
                    {
                      components: [
                        {
                          internalType: "bytes",
                          name: "buf",
                          type: "bytes",
                        },
                        {
                          internalType: "uint256",
                          name: "capacity",
                          type: "uint256",
                        },
                      ],
                      internalType: "struct BufferBase.buffer",
                      name: "requestData",
                      type: "tuple",
                    },
                  ],
                  internalType: "struct RequestLib.Request",
                  name: "req",
                  type: "tuple",
                },
              ],
              name: "sendRequest",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
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
        HttpRequestConsumerWithHeader: {
          address: "0x9A676e781A523b5d0C0e43731313A708CB607508",
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
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "requestId",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "exchange_rate",
                  type: "uint256",
                },
              ],
              name: "RequestExchangeRate",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "_requestId",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "_exchange_rate",
                  type: "uint256",
                },
              ],
              name: "_requestedDataCompleted",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
