const { use, expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { solidity } = waffle;
use(solidity);

const { advanceBlockTo } = require("./utilities");

describe("Farming", function () {
  before(async function () {
    this.signers = await ethers.getSigners();
    this.alice = this.signers[0];
    this.bob = this.signers[1];
    this.carol = this.signers[2];
    this.dev = this.signers[3];
    this.minter = this.signers[4];
    this.owner = this.signers[5];
    this.router = this.signers[6];

    this.Farming = await ethers.getContractFactory("Farming");
    this.MoneyToken = await ethers.getContractFactory("MoneyToken");
    this.ERC20Mock = await ethers.getContractFactory("ERC20Mock", this.minter);
    this.Buyback = await ethers.getContractFactory("Buyback");
    this.Reserve = await ethers.getContractFactory("Reserve");
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
    this.farm = await this.Farming.deploy(
      this.money.address,
      this.buyback.address,
      this.reserve.address
    );

    await this.money.deployed();
    await this.farm.deployed();
    await this.buyback.deployed();
    await this.reserve.deployed();

    await this.buyback.setReserve(this.reserve.address);
    await this.reserve.addWithdrawers(
      [this.farm.address, this.owner.address],
      [50, 50]
    );

    this.money.connect(this.owner).transfer(this.alice.address, "100");
    this.money.connect(this.owner).transfer(this.bob.address, "100");
    this.money.connect(this.owner).transfer(this.carol.address, "100");
  });

  it("should set correct state variables", async function () {
    const money = await this.farm.money();
    const owner = await this.farm.owner();
    const moneyOwner = await this.money.owner();

    expect(money).to.equal(this.money.address);
    expect(owner).to.equal(this.alice.address);
    expect(moneyOwner).to.equal(this.owner.address);
  });

  it("should allow dev and only dev to update dev", async function () {
    await expect(
      this.farm.connect(this.bob).transferOwnership(this.bob.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await this.farm.connect(this.alice).transferOwnership(this.bob.address);
    expect(await this.farm.owner()).to.equal(this.bob.address);
  });

  context("With ERC/LP token added to the field", function () {
    beforeEach(async function () {
      this.lp = await this.ERC20Mock.deploy("LPToken", "LP", "10000000000");

      await this.lp.transfer(this.alice.address, "100");
      await this.lp.transfer(this.bob.address, "100");
      await this.lp.transfer(this.carol.address, "100");

      this.lp2 = await this.ERC20Mock.deploy("LPToken2", "LP2", "10000000000");

      await this.lp2.transfer(this.alice.address, "100");
      await this.lp2.transfer(this.bob.address, "100");
      await this.lp2.transfer(this.carol.address, "100");
    });

    it("should allow emergency withdraw", async function () {
      // 100 per block farming rate starting at block 100 with bonus until block 1000
      await this.farm.add("100", this.lp.address, 0);

      await this.lp.connect(this.bob).approve(this.farm.address, "100");
      await this.farm.connect(this.bob).deposit(0, "100");

      expect(await this.lp.balanceOf(this.bob.address)).to.equal("0");

      await this.farm.connect(this.bob).withdraw(0, 100);
      expect(await this.lp.balanceOf(this.bob.address)).to.equal("100");
    });

    it("should give out MONEYs (rewards) only after farming time", async function () {
      // 100 per block farming rate starting at block 100 with bonus until block 1000
      await this.farm.add("100", this.lp.address, 0);

      await this.lp.connect(this.bob).approve(this.farm.address, "100");

      await this.farm.connect(this.bob).deposit(0, "100");
      await advanceBlockTo("89");

      await this.farm.connect(this.bob).deposit(0, "0"); // block 90
      expect(await this.money.balanceOf(this.bob.address)).to.equal("100");
      await advanceBlockTo("94");

      await this.farm.connect(this.bob).deposit(0, "0"); // block 95
      expect(await this.money.balanceOf(this.bob.address)).to.equal("100");
      await advanceBlockTo("99");

      await this.farm.connect(this.bob).deposit(0, "0"); // block 100
      expect(await this.money.balanceOf(this.bob.address)).to.equal("100");
      await advanceBlockTo("100");

      await this.farm.connect(this.bob).withdraw(0, "0"); // block 101
      expect(await this.money.balanceOf(this.bob.address)).to.equal("100");

      await advanceBlockTo("104");
      await this.farm.connect(this.bob).deposit(0, "0"); // block 105

      expect(await this.money.balanceOf(this.bob.address)).to.equal("100");
    });

    it("should not distribute MONEYs if no one deposit", async function () {
      // 100 per block farming rate starting at block 200 with bonus until block 1000
      await this.farm.add("100", this.lp.address, 0);
      await this.lp.connect(this.bob).approve(this.farm.address, "1000");
      await advanceBlockTo("199");
      expect(await this.money.balanceOf(this.farm.address)).to.equal("0");
      await advanceBlockTo("204");
      expect(await this.money.balanceOf(this.farm.address)).to.equal("0");
      await advanceBlockTo("209");
      await this.farm.connect(this.bob).deposit(0, "10"); // block 210
      expect(await this.money.balanceOf(this.farm.address)).to.equal("0");
      expect(await this.money.balanceOf(this.bob.address)).to.equal("100");
      expect(await this.lp.balanceOf(this.bob.address)).to.equal("90");
      await advanceBlockTo("219");
      await this.farm.connect(this.bob).withdraw(0, "10"); // block 220

      expect(await this.money.balanceOf(this.bob.address)).to.equal("100");
      expect(await this.money.balanceOf(this.dev.address)).to.equal("0");
      expect(await this.lp.balanceOf(this.bob.address)).to.equal("100");
    });

    it("should distribute MONEYs properly for each staker", async function () {
      // 100 per block farming rate starting at block 300 with bonus until block 1000
      await this.farm.add("100", this.lp.address, 0);
      await this.lp.connect(this.alice).approve(this.farm.address, "1000", {
        from: this.alice.address,
      });
      await this.lp.connect(this.bob).approve(this.farm.address, "1000", {
        from: this.bob.address,
      });
      await this.lp.connect(this.carol).approve(this.farm.address, "1000", {
        from: this.carol.address,
      });
      // Alice deposits 10 LPs at block 310
      await advanceBlockTo("309");
      await this.farm
        .connect(this.alice)
        .deposit(0, "10", { from: this.alice.address });
      // Bob deposits 20 LPs at block 314
      await advanceBlockTo("313");
      await this.farm
        .connect(this.bob)
        .deposit(0, "20", { from: this.bob.address });
      // Carol deposits 30 LPs at block 318
      await advanceBlockTo("317");
      await this.farm
        .connect(this.carol)
        .deposit(0, "30", { from: this.carol.address });
      // Alice deposits 10 more LPs at block 320. At this point:
      //   Alice should have: 4*1000 + 4*1/3*1000 + 2*1/6*1000 = 5666
      //   Farming should have the remaining: 10000 - 5666 = 4334
      await advanceBlockTo("319");
      await this.farm
        .connect(this.alice)
        .deposit(0, "10", { from: this.alice.address });

      expect(await this.money.balanceOf(this.alice.address)).to.equal("100");
      expect(await this.money.balanceOf(this.bob.address)).to.equal("100");
      expect(await this.money.balanceOf(this.carol.address)).to.equal("100");
      expect(await this.money.balanceOf(this.farm.address)).to.equal("0");
      expect(await this.money.balanceOf(this.dev.address)).to.equal("0");
      // Bob withdraws 5 LPs at block 330. At this point:
      //   Bob should have: 4*2/3*1000 + 2*2/6*1000 + 10*2/7*1000 = 6190
      await advanceBlockTo("329");
      await this.farm
        .connect(this.bob)
        .withdraw(0, "5", { from: this.bob.address });

      expect(await this.money.balanceOf(this.alice.address)).to.equal("5666");
      expect(await this.money.balanceOf(this.bob.address)).to.equal("6190");
      expect(await this.money.balanceOf(this.carol.address)).to.equal("0");
      expect(await this.money.balanceOf(this.farm.address)).to.equal("8144");
      expect(await this.money.balanceOf(this.dev.address)).to.equal("2000");

      // Alice withdraws 20 LPs at block 340.
      // Bob withdraws 15 LPs at block 350.
      // Carol withdraws 30 LPs at block 360.
      await advanceBlockTo("339");
      await this.farm
        .connect(this.alice)
        .withdraw(0, "20", { from: this.alice.address });
      await advanceBlockTo("349");
      await this.farm
        .connect(this.bob)
        .withdraw(0, "15", { from: this.bob.address });
      await advanceBlockTo("359");
      await this.farm
        .connect(this.carol)
        .withdraw(0, "30", { from: this.carol.address });

      expect(await this.money.balanceOf(this.dev.address)).to.equal("5000");
      // Alice should have: 5666 + 10*2/7*1000 + 10*2/6.5*1000 = 11600
      expect(await this.money.balanceOf(this.alice.address)).to.equal("11600");
      // Bob should have: 6190 + 10*1.5/6.5 * 1000 + 10*1.5/4.5*1000 = 11831
      expect(await this.money.balanceOf(this.bob.address)).to.equal("11831");
      // Carol should have: 2*3/6*1000 + 10*3/7*1000 + 10*3/6.5*1000 + 10*3/4.5*1000 + 10*1000 = 26568
      expect(await this.money.balanceOf(this.carol.address)).to.equal("26568");
      // All of them should have 1000 LPs back.
      expect(await this.lp.balanceOf(this.alice.address)).to.equal("1000");
      expect(await this.lp.balanceOf(this.bob.address)).to.equal("1000");
      expect(await this.lp.balanceOf(this.carol.address)).to.equal("1000");
    });

    it("should give proper MONEYs allocation to each pool", async function () {
      // 100 per block farming rate starting at block 400 with bonus until block 1000

      await this.lp
        .connect(this.alice)
        .approve(this.farm.address, "1000", { from: this.alice.address });
      await this.lp2
        .connect(this.bob)
        .approve(this.farm.address, "1000", { from: this.bob.address });
      // Add first LP to the pool with allocation 1
      await this.farm.add("10", this.lp.address, 0);
      // Alice deposits 10 LPs at block 410
      await advanceBlockTo("409");
      await this.farm
        .connect(this.alice)
        .deposit(0, "10", { from: this.alice.address });
      // Add LP2 to the pool with allocation 2 at block 420
      await advanceBlockTo("419");
      await this.farm.add("20", this.lp2.address, 0);
      // Alice should have 10*1000 pending reward
      expect(await this.farm.pendingMoney(0, this.alice.address)).to.equal(
        "10000"
      );
      // Bob deposits 10 LP2s at block 425
      await advanceBlockTo("424");
      await this.farm
        .connect(this.bob)
        .deposit(1, "5", { from: this.bob.address });
      // Alice should have 10000 + 5*1/3*1000 = 11666 pending reward
      expect(await this.farm.pendingMoney(0, this.alice.address)).to.equal(
        "11666"
      );
      await advanceBlockTo("430");
      // At block 430. Bob should get 5*2/3*1000 = 3333. Alice should get ~1666 more.
      expect(await this.farm.pendingMoney(0, this.alice.address)).to.equal(
        "13333"
      );
      expect(await this.farm.pendingMoney(1, this.bob.address)).to.equal(
        "3333"
      );
    });
  });
});
