// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "./IOracle.sol";

error CouldNotGetPrice();
error StalePrice();

contract Consumer {
    IOracle public oracle;

    constructor(address _oracle) {
        oracle = IOracle(_oracle);
    }

    function getBitcoinPrice() external view returns (uint) {
        bytes32 key = keccak256(abi.encodePacked("BTC/USD"));
        (bool found, uint timestamp, uint bitcoinPrice) = oracle.getData(key);
        if (!found) {
            revert CouldNotGetPrice();
        }
        if (timestamp - block.timestamp > 2 minutes) {
            revert StalePrice();
        }
        return bitcoinPrice;
    }
}
