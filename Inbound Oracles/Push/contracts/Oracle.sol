// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

error OnlyAdmin();
error OnlyReporter();

contract Oracle {
    address public admin;
    mapping(address => bool) reporters;
    mapping(bytes32 => Data) data;

    struct Data {
        uint date;
        uint payload;
    }

    constructor() {
        admin = msg.sender;
    }

    function updateReporter(address reporterAddress, bool isReporter) external {
        if (msg.sender != admin) {
            revert OnlyAdmin();
        }
        reporters[reporterAddress] = isReporter;
    }

    function updateData(bytes32 key, uint payload) external {
        if (!_hasReporter(msg.sender)) {
            revert OnlyReporter();
        }
        data[key] = Data(block.timestamp, payload);
    }

    function getData(
        bytes32 key
    ) external view returns (bool results, uint date, uint payload) {
        if (data[key].date == 0) {
            return (false, 0, 0);
        }
        return (true, data[key].date, data[key].payload);
    }

    function _hasReporter(address reporterAddress) private view returns (bool) {
        return reporters[reporterAddress];
    }
}
