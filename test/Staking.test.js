const { use, expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { solidity } = waffle;
use(solidity);

describe("Staking", function () {
  before(async function () {
    this.MoneyToken = await ethers.getContractFactory("MoneyToken");
    this.Staking = await ethers.getContractFactory("Staking");
    this.Buyback = await ethers.getContractFactory("Buyback");
    this.Reserve = await ethers.getContractFactory("Reserve");

    this.signers = await ethers.getSigners();
    this.alice = this.signers[0];
    this.bob = this.signers[1];
    this.carol = this.signers[2];
    this.owner = this.signers[3];
    this.router = this.signers[4];
  });

  beforeEach(async function () {
    this.money = await this.MoneyToken.deploy(this.owner.address);
    this.buyback = await this.Buyback.deploy(
      this.router.address,
      this.money.address
    );
    this.reserve = await this.Reserve.deploy(
      this.money.address,
      this.buyback.address
    );
    this.stake = await this.Staking.deploy(
      this.money.address,
      this.reserve.address
    );

    await this.money.deployed();
    await this.stake.deployed();
    await this.buyback.deployed();
    await this.reserve.deployed();

    await this.buyback.setReserve(this.reserve.address);
    await this.reserve.addWithdrawers(
      [this.stake.address, this.owner.address],
      [50, 50]
    );

    this.money.connect(this.owner).transfer(this.alice.address, "100");
    this.money.connect(this.owner).transfer(this.bob.address, "100");
    this.money.connect(this.owner).transfer(this.carol.address, "100");
  });

  it("should not allow enter if not enough approve", async function () {
    await expect(this.stake.enter("100")).to.be.revertedWith(
      "Money::transferFrom: transfer amount exceeds spender allowance"
    );
    await this.money.approve(this.stake.address, "50");
    await expect(this.stake.enter("100")).to.be.revertedWith(
      "Money::transferFrom: transfer amount exceeds spender allowance"
    );
    await this.money.approve(this.stake.address, "100");
    await this.stake.enter("100");
    expect(await this.stake.balanceOf(this.alice.address)).to.equal("100");
  });

  it("should not allow withraw more than what you have", async function () {
    await this.money.approve(this.stake.address, "100");
    await this.stake.enter("100");
    await expect(this.stake.leave("200")).to.be.revertedWith(
      "ERC20: burn amount exceeds balance"
    );
  });

  it("should work with more than one participant", async function () {
    await this.money.approve(this.stake.address, "100");
    await this.money
      .connect(this.bob)
      .approve(this.stake.address, "100", { from: this.bob.address });
    // Alice enters and gets 20 shares. Bob enters and gets 10 shares.
    await this.stake.enter("20");
    await this.stake.connect(this.bob).enter("10", { from: this.bob.address });
    expect(await this.stake.balanceOf(this.alice.address)).to.equal("20");
    expect(await this.stake.balanceOf(this.bob.address)).to.equal("10");
    expect(await this.money.balanceOf(this.stake.address)).to.equal("30");
    // Staking get 20 more MONEYs from an external source.
    await this.money
      .connect(this.carol)
      .transfer(this.stake.address, "20", { from: this.carol.address });
    // Alice deposits 10 more MONEYs. She should receive 10*30/50 = 6 shares.
    await this.stake.enter("10");
    expect(await this.stake.balanceOf(this.alice.address)).to.equal("26");
    expect(await this.stake.balanceOf(this.bob.address)).to.equal("10");
    // Bob withdraws 5 shares. He should receive 5*60/36 = 8 shares
    await this.stake.connect(this.bob).leave("5", { from: this.bob.address });
    expect(await this.stake.balanceOf(this.alice.address)).to.equal("26");
    expect(await this.stake.balanceOf(this.bob.address)).to.equal("5");
    expect(await this.money.balanceOf(this.stake.address)).to.equal("52");
    expect(await this.money.balanceOf(this.alice.address)).to.equal("70");
    expect(await this.money.balanceOf(this.bob.address)).to.equal("98");
  });
});
