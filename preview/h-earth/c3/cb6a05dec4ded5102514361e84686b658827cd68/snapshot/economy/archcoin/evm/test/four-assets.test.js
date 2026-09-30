const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ARCHCOIN four fixed-supply assets", function () {
  const assets = [["ARCHCOIN Contract","ARCC"],["ARCHCOIN Receivable","ARCR"],["ARCHCOIN Payable","ARCP"],["ARCHCOIN Allocation","ARCA"]];
  for (const [name, symbol] of assets) {
    it(symbol + " deploys fixed supply and transfers", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const supply = ethers.parseUnits("1000000", 18);
      const Factory = await ethers.getContractFactory("ArchcoinFixedSupply");
      const token = await Factory.deploy(name, symbol, owner.address, supply);
      await token.waitForDeployment();
      expect(await token.symbol()).to.equal(symbol);
      expect(await token.totalSupply()).to.equal(supply);
      await expect(token.transfer(receiver.address, 1n)).to.changeTokenBalances(token, [owner, receiver], [-1n, 1n]);
      expect(await token.totalSupply()).to.equal(supply);
    });
  }
});
