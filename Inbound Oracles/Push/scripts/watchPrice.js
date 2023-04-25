import { ethers } from "ethers";
import { parse, stringify } from "envfile";
import * as fs from "fs";

const envFilePath = "./.env";

/**
 * Generate a new random private key and write it to the .env file
 * @param existingEnvConfig
 */

async function main() {
  if (!fs.existsSync(envFilePath)) {
    // No .env file yet.
    setNewEnvConfig();
    return;
  }

  // .env file exists
  const existingEnvConfig = parse(fs.readFileSync(envFilePath).toString());
  if (existingEnvConfig.DEPLOYER_PRIVATE_KEY) {
    console.log(
      "⚠️ You already have a deployer account. Check the packages/hardhat/.env file"
    );
    return;
  }

  setNewEnvConfig(existingEnvConfig);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
