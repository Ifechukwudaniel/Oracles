const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, ethers }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  let oracle = await ethers.getContract("Oracle", deployer);
  log(
    "------------------ Deploying Consumer ----------------------------------  "
  );
  const consumer = await deploy("Consumer", {
    from: deployer,
    args: [oracle.address],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
};
module.exports.tags = ["all", "consumer"];
