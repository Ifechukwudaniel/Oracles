import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import CoinGecko from "coingecko-api";
import * as fs from "fs";
import { PriceOracle } from "./typechain-types";

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

async function getPricesAndTickers() {
  const CoinGeckoClient = new CoinGecko();

  const coinList = [
    "bitcoin",
    "ethereum",
    "solana",
    "bitcoin-cash",
    "cardano",
    "monero",
    "polkadot",
    "dogecoin",
    "dash",
    "tron",
  ];
  const responses = coinList.map(coin => CoinGeckoClient.coins.fetch(coin, {}));
  const priceAndSymbol = await Promise.all(responses).then(response => {
    return response.map(({ success, data }) => {
      if (success) {
        const ticker = data.symbol.toUpperCase().concat("/USD");
        const currentPrice = parseFloat(`${data.market_data.current_price.usd}`);
        const price = parseInt(`${currentPrice * 10000}`);
        return { ticker, price };
      }
    });
  });

  return priceAndSymbol;
}

const DEBUG = true;

function debug(text: string) {
  if (DEBUG) {
    console.log(text);
  }
}

task("watchPrice", "Watches and update the prices on the price oracle").setAction(
  async (taskArgs, { network, ethers }) => {
    const TARGET_FILE = `./deployments/${network.name}/PriceOracle.json`;
    if (!fs.existsSync(TARGET_FILE)) {
      debug(`Please deploy Price Oracle Contract on ${network.name} network `);
      return;
    }

    const priceOracleAbiString = fs.readFileSync(TARGET_FILE, { encoding: "utf8", flag: "r" });
    const priceOracleAbi = JSON.parse(priceOracleAbiString);

    const priceOracleFactory = await ethers.getContractFactory("PriceOracle");
    const priceOracle = (await priceOracleFactory.attach(priceOracleAbi.address)) as PriceOracle;

    const [, reporter1] = await ethers.getSigners();
    // const key = "BTC/UST");
    // const amount = 10000;

    const POOL_INTERVAL = 120000;

    while (true) {
      const pricesAndTickers = await getPricesAndTickers();
      for (let i = 0; i < pricesAndTickers.length; i++) {
        if (pricesAndTickers[i]?.ticker === undefined || pricesAndTickers[i]?.price === undefined) continue;
        const key = ethers.utils.formatBytes32String(pricesAndTickers[i]?.ticker || "");
        const amount = pricesAndTickers[i]?.price || 0;
        console.log(`Updating ${pricesAndTickers[i]?.ticker} price to ${pricesAndTickers[i]?.price}`);
        await priceOracle.connect(reporter1).updateData(key, amount);
        await new Promise(resolve => setTimeout(resolve, 4000));
      }
      await new Promise(resolve => setTimeout(resolve, POOL_INTERVAL));
    }
  },
);
