import { expect } from "chai";
import { ethers } from "hardhat";
import { PriceConsumer, PriceOracle } from "../typechain-types";

describe("PriceConsumer", function () {
  // We define a fixture to reuse the same setup in every test.

  let priceConsumer: PriceConsumer;
  let priceOracle: PriceOracle;
  let owner: any;
  let reporter1: any;
  let key: string;
  let price: number;

  before(async () => {
    [owner, reporter1] = await ethers.getSigners();

    // Deploy Price Oracle
    const priceOracleFactory = await ethers.getContractFactory("PriceOracle");
    priceOracle = (await priceOracleFactory.deploy()) as PriceOracle;
    await priceOracle.deployed();

    // Upload initial price for BTC/UST

    key = ethers.utils.formatBytes32String("BTC/UST");
    price = 1000;
    await priceOracle.connect(owner).updateReporter(reporter1.address, true);
    await priceOracle.connect(reporter1).updateData(key, price);

    // Deploy Price Oracle Consumer
    const priceConsumerFactory = await ethers.getContractFactory("PriceConsumer");
    priceConsumer = (await priceConsumerFactory.deploy(priceOracle.address)) as PriceConsumer;
    await priceConsumer.deployed();
  });

  it("should get the current correct price", async function () {
    // Get Current Price
    expect(await priceConsumer.getPrice(key)).to.equal(price);
  });

  it("should be able to update price and get the correct current price", async function () {
    // Update data in oracle contract
    price = 2000;
    await priceOracle.connect(reporter1).updateData(key, price);
    // Test getPrice function if its correct to the new updated price
    expect(await priceConsumer.getPrice(key)).to.equal(price);
  });

  it("should fail when price is not found", async function () {
    // Test getPrice function with non-existent price
    await expect(
      priceConsumer.getPrice(ethers.utils.formatBytes32String("NonExistentTicker")),
    ).to.be.revertedWithCustomError(priceConsumer, "CouldNotGetPrice");
  });

  it("should fail when price is stale", async function () {
    // Set the block.timestamp to future time to make the price stale
    // increase by 180 seconds
    await ethers.provider.send("evm_increaseTime", [180]);
    await ethers.provider.send("evm_mine", []);
    // Test getPrice function with stale price
    await expect(priceConsumer.getPrice(key)).to.be.revertedWithCustomError(priceConsumer, "StalePrice");
  });
});
