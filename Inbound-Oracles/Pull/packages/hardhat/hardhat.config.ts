import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import * as fs from "fs";
import { HttpRequestOracle } from "./typechain-types";

// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io
const providerApiKey = process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "localhost",
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    },
  },
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    arbitrumGoerli: {
      url: `https://arb-goerli.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    optimismGoerli: {
      url: `https://opt-goerli.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
  },
  verify: {
    etherscan: {
      apiKey: `${etherscanApiKey}`,
    },
  },
};

export default config;

const DEBUG = true;

function debug(text: string) {
  if (DEBUG) {
    console.log(text);
  }
}

task("watchEvents", "Watches and update the callback function base on the event call").setAction(
  async (taskArgs, { network, ethers }) => {
    const TARGET_FILE = `./deployments/${network.name}/HttpRequestOracle.sol.json`;
    if (!fs.existsSync(TARGET_FILE)) {
      debug(`Please deploy Price Oracle Contract on ${network.name} network `);
      return;
    }

    const httpRequestOracleAbiString = fs.readFileSync(TARGET_FILE, { encoding: "utf8", flag: "r" });
    const httpRequestOracleAbi = JSON.parse(httpRequestOracleAbiString);

    // Create a contract instance
    const httpRequestOracleFactory = await ethers.getContractFactory("HttpRequestOracle");
    const httpRequestOracle = (await httpRequestOracleFactory.attach(
      httpRequestOracleAbi.address,
    )) as HttpRequestOracle;

    // Monitor Event
    httpRequestOracle.on("RequestSent", (id, data) => {
      console.log(id, data);
    });

    // const [, reporter1] = await ethers.getSigners();

    // const key = "BTC/UST");
    // const amount = 10000;

    // const POOL_INTERVAL = 120000;

    // while (true) {
    //   const pricesAndTickers = await getPricesAndTickers();
    //   for (let i = 0; i < pricesAndTickers.length; i++) {
    //     if (pricesAndTickers[i]?.ticker === undefined || pricesAndTickers[i]?.price === undefined) continue;
    //     const key = ethers.utils.formatBytes32String(pricesAndTickers[i]?.ticker || "");
    //     const amount = pricesAndTickers[i]?.price || 0;
    //     console.log(`Updating ${pricesAndTickers[i]?.ticker} price to ${pricesAndTickers[i]?.price}`);
    //     await priceOracle.connect(reporter1).updateData(key, amount);
    //     await new Promise(resolve => setTimeout(resolve, 4000));
    //   }
    //   await new Promise(resolve => setTimeout(resolve, POOL_INTERVAL));
    // }
  },
);
