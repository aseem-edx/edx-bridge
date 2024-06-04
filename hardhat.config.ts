import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const TEST_PRIVATE_KEY = vars.get("TEST_PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    edexaTestnet: {
      accounts: [TEST_PRIVATE_KEY],
      url: "https://testnet.edexa.network/rpc",
    },
    amoy: {
      accounts: [TEST_PRIVATE_KEY],
      url: "https://rpc-amoy.polygon.technology",
    },
  },
};

export default config;
