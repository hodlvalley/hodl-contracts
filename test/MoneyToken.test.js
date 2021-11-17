const { use, expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { solidity } = waffle;
use(solidity);

describe("MoneyToken", function () {
  before(async function () {
    this.MoneyToken = await ethers.getContractFactory("MoneyToken");
    this.signers = await ethers.getSigners();
    this.alice = this.signers[0];
    this.bob = this.signers[1];
    this.carol = this.signers[2];
  });

  beforeEach(async function () {
    this.money = await this.MoneyToken.deploy(this.alice.address);
    await this.money.deployed();
  });

  it("should have correct name and symbol and decimal", async function () {
    const name = await this.money.name();
    const symbol = await this.money.symbol();
    const decimals = await this.money.decimals();
    expect(name, "MoneyToken");
    expect(symbol, "MONEY");
    expect(decimals, "18");
  });

  it("should supply token transfers properly", async function () {
    await this.money.transfer(this.bob.address, "1000");
    await this.money.transfer(this.carol.address, "10");
    await this.money.connect(this.bob).transfer(this.carol.address, "100", {
      from: this.bob.address,
    });
    const totalSupply = await this.money.totalSupply();
    const bobBal = await this.money.balanceOf(this.bob.address);
    const carolBal = await this.money.balanceOf(this.carol.address);
    expect(totalSupply, "5000000000000000000000000000");
    expect(bobBal, "900");
    expect(carolBal, "110");
  });

  it("should fail if you try to do bad transfers", async function () {
    await expect(
      this.money.connect(this.bob).transfer(this.carol.address, "110")
    ).to.be.revertedWith(
      "Money::_transferTokens: transfer amount exceeds balance"
    );
    await expect(
      this.money
        .connect(this.bob)
        .transfer(this.carol.address, "1", { from: this.bob.address })
    ).to.be.revertedWith(
      "Money::_transferTokens: transfer amount exceeds balance"
    );
  });
});
