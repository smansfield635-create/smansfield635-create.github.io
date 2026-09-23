const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const assets = [
  ["ARCHCOIN Contract", "ARCC", "ARCC_INITIAL_SUPPLY"],
  ["ARCHCOIN Receivable", "ARCR", "ARCR_INITIAL_SUPPLY"],
  ["ARCHCOIN Payable", "ARCP", "ARCP_INITIAL_SUPPLY"],
  ["ARCHCOIN Allocation", "ARCA", "ARCA_INITIAL_SUPPLY"]
];

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error("MISSING_REQUIRED_ENV:" + name);
  return value;
}

async function main() {
  if (hre.network.config.chainId !== 11155111) throw new Error("WRONG_CHAIN:" + hre.network.config.chainId);
  const recipient = required("ARCHCOIN_INITIAL_RECIPIENT");
  if (!hre.ethers.isAddress(recipient)) throw new Error("INVALID_RECIPIENT");
  const Factory = await hre.ethers.getContractFactory("ArchcoinFixedSupply");
  const receipt = { schema: "ARCHCOIN_SEPOLIA_DEPLOYMENT_v1", chainId: 11155111, recipient, assets: [] };

  for (const [name, symbol, supplyEnv] of assets) {
    const humanSupply = required(supplyEnv);
    const supply = hre.ethers.parseUnits(humanSupply, 18);
    if (supply <= 0n) throw new Error("INVALID_SUPPLY:" + symbol);
    const token = await Factory.deploy(name, symbol, recipient, supply);
    const tx = token.deploymentTransaction();
    await token.waitForDeployment();
    const address = await token.getAddress();
    const code = await hre.ethers.provider.getCode(address);
    if (code === "0x") throw new Error("NO_ONCHAIN_BYTECODE:" + symbol);
    receipt.assets.push({ symbol, address, deploymentTransaction: tx.hash, initialSupply: humanSupply, bytecodePresent: true });
  }

  const out = path.join(__dirname, "..", "qualification", "sepolia-deployment.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(receipt, null, 2) + "\n");
  console.log(JSON.stringify(receipt, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
