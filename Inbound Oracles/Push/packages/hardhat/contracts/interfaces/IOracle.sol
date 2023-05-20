// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

interface IOracle {
    function updateReporter(address reporterAddress, bool isReporter) external;

    function updateData(bytes32 key, uint payload) external;

    function getData(
        bytes32 key
    ) external view returns (bool results, uint date, uint payload);
}
