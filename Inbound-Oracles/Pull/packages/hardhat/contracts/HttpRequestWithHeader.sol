// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "./HttpRequestOracle.sol";
import "./RequestConsumer.sol";

contract HttpRequestConsumerWithHeader is RequestConsumer {
  using RequestLib for RequestLib.Request;

  HttpRequestOracle httpOracle;
  uint256 exchange_rate;

  event RequestExchangeRate(bytes32 indexed requestId, uint256 exchange_rate);

  constructor(address _oracle) {
    httpOracle = HttpRequestOracle(_oracle);
  }

  function requestPriceData() private returns (bytes32) {
    RequestLib.Request memory req = buildRequest(this._requestedDataCompleted.selector);
    req.setId(keccak256(abi.encodePacked(block.timestamp, msg.sender)));

    // The code above is the same as
    // const request = require('request');

    // request.get({
    //   url: 'https://api.api-ninjas.com/v1/exchangerate?pair=USD_EUR',
    //   headers: {
    //     'X-Api-Key': 'YOUR_API_KEY'
    //   },
    // }, function(error, response, body) {
    //   if(error) return console.error('Request failed:', error);
    //   else if(response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
    //   else console.log(body)
    // });

    req.add("get", "https://api.api-ninjas.com/v1/exchangerate?pair=USD_EUR");
    req.addHeader("X-Api-Key", "YOUR_API_KEY");

    // Set the path to find the desired data in the API response, where the response format is:
    //  {
    //   "currency_pair": "USD_EUR",
    //   "exchange_rate": 0.826641
    // }
    req.add("path", "exchange_rate");
    httpOracle.sendRequest(req);
    return req.id;
  }

  function _requestedDataCompleted(bytes32 _requestId, uint256 _exchange_rate) public {
    emit RequestExchangeRate(_requestId, _exchange_rate);
    exchange_rate = _exchange_rate;
  }
}
