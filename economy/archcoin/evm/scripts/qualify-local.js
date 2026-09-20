const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const assets = [
  ["ARCHCOIN Contract", "ARCC"],
  ["ARCHCOIN Receivable", "ARCR"],
  ["ARCHCOIN Payable", "ARCP"],
  ["ARCHCOIN Allocation", "ARCA"],
];

function record(stage, state, detail = {}) {
  const dir = path.join(__dirname, "..", "qualification");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, stage + ".status"), state + "\n");
  fs.writeFileSync(path.join(dir, stage + ".json"), JSON.stringify({ stage, state, ...detail }, null, 2) + "\n");
}

async function main() {
  const [owner, receiver] = await hre.ethers.getSigners();
  const supply = hre.ethers.parseUnits("1000000", 18);
  const amount = hre.ethers.parseUnits("1", 18);
  const Factory = await hre.ethers.getContractFactory("ArchcoinFixedSupply");
  const deployed = [];

  record("LOCAL_DEPLOY", "RUNNING");
  for (const [name, symbol] of assets) {
    const token = await Factory.deploy(name, symbol, owner.address, supply);
    await token.waitForDeployment();
    deployed.push({ token, symbol, address: await token.getAddress() });
  }
  record("LOCAL_DEPLOY", "PASS", { contracts: deployed.map(({symbol,address}) => ({symbol,address})) });

  for (const { token, symbol, address } of deployed) {
    const stage = symbol + "_TRANSACTIONS";
    record(stage, "RUNNING", { address });
    const before = await token.balanceOf(receiver.address);
    const tx = await token.transfer(receiver.address, amount);
    const receipt = await tx.wait();
    const after = await token.balanceOf(receiver.address);
    if (after - before !== amount) throw new Error(symbol + " transfer invariant failed");
    record(stage, "PASS", { address, transactionHash: receipt.hash, transferred: amount.toString() });
  }

  record("FINAL_STATE_INVARIANTS", "RUNNING");
  for (const { token, symbol } of deployed) {
    if (await token.symbol() !== symbol) throw new Error(symbol + " symbol mismatch");
    if ((await token.decimals()) !== 18n) throw new Error(symbol + " decimals mismatch");
    if ((await token.totalSupply()) !== supply) throw new Error(symbol + " supply changed");
    if ((await token.balanceOf(receiver.address)) !== amount) throw new Error(symbol + " receiver balance mismatch");
  }
  record("FINAL_STATE_INVARIANTS", "PASS", { fixedSupply: supply.toString(), transferPerAsset: amount.toString() });
}

main().catch((error) => {
  record("LOCAL_EVM_EXECUTION_FAILURE", "FAIL", { error: String(error && error.stack || error) });
  process.exitCode = 1;
});
