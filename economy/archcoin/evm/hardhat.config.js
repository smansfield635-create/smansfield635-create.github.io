require("@nomicfoundation/hardhat-toolbox");

const sepoliaUrl = process.env.SEPOLIA_RPC_URL;
const deployerKey = process.env.SEPOLIA_DEPLOYER_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.28",
  networks: {
    ...(sepoliaUrl && deployerKey ? {
      sepolia: {
        url: sepoliaUrl,
        chainId: 11155111,
        accounts: [deployerKey]
      }
    } : {})
  }
};
