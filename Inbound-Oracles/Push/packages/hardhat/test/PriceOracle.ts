import { expect } from "chai";
import { ethers } from "hardhat";
import { PriceOracle } from "../typechain-types";

describe("PriceOracle", function () {
  // We define a fixture to reuse the same setup in every test.

  let priceOracle: PriceOracle;
  let owner: any;
  let reporter1: any;
  let reporter2: any;
  const key = ethers.utils.formatBytes32String("BTC/UST");
  const amount = 1000;

  before(async () => {
    [owner, reporter1, reporter2] = await ethers.getSigners();
    const priceOracleFactory = await ethers.getContractFactory("PriceOracle");
    priceOracle = (await priceOracleFactory.deploy()) as PriceOracle;
    await priceOracle.deployed();
  });

  describe("Oracle Reporters ", () => {
    it("Non-Owner Should not update reporter", async function () {
      await expect(priceOracle.connect(reporter1).updateReporter(reporter2.address, true)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });

    it("Owner can add reporter", async function () {
      await priceOracle.connect(owner).updateReporter(reporter1.address, true);
      expect(await priceOracle.getReporter(reporter1.address)).to.equal(true);
    });

    it("Owner can remove reporter  ", async function () {
      await priceOracle.updateReporter(reporter2.address, false);
      expect(await priceOracle.getReporter(reporter2.address)).to.equal(false);
    });
  });

  describe("Oracle Data", () => {
    it("Data should be empty if data has not been updated ", async () => {
      const [found, date, payload] = await priceOracle.getData(key);
      expect(found).to.equal(false);
      expect(date.toNumber()).to.equal(0);
      expect(payload.toNumber()).to.equal(0);
    });

    it("Reporter should be able to update data", async () => {
      await priceOracle.connect(owner).updateReporter(reporter1.address, true);
      await priceOracle.connect(reporter1).updateData(key, amount);
      const [found, date, payload] = await priceOracle.getData(key);
      await ethers.provider.send("evm_increaseTime", [120]);
      await ethers.provider.send("evm_mine", []);
      const timeStamp = (await ethers.provider.getBlock("latest")).timestamp;
      expect(date.toNumber()).to.lessThan(timeStamp);
      expect(found).to.equal(true);
      expect(payload).to.equal(amount);
    });

    it("should fire priceUpdate event when price is updated", async () => {
      await priceOracle.connect(owner).updateReporter(reporter1.address, true);
      await expect(priceOracle.connect(reporter1).updateData(key, amount))
        .to.emit(priceOracle, "PriceUpdate")
        .withArgs(key, reporter1.address, amount);
    });

    it("Non Reporters should not be able to update data ", async () => {
      await expect(priceOracle.connect(reporter2).updateData(key, amount)).to.be.revertedWithCustomError(
        priceOracle,
        "OnlyReporter",
      );
    });
  });
});
