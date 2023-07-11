// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "./interfaces/IOracle.sol";

error CouldNotGetPrice();
error StalePrice();

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
