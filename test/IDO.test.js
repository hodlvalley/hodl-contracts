const { use, expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { solidity } = waffle;
const { BigNumber, utils } = require('ethers');
use(solidity);

const { advanceBlockTo, latest, lastBlock } = require("./utilities");

describe("Money IDO", function () {
	before(async function () {
		this.signers = await ethers.getSigners();
    this.alice = this.signers[0];
    this.bob = this.signers[1];
    this.carol = this.signers[2];
    this.dev = this.signers[3];
    this.minter = this.signers[4];
    this.owner = this.signers[5];
    this.router = this.signers[6];

		this.MoneyToken = await ethers.getContractFactory("MoneyToken");
		this.ERC20Mock = await ethers.getContractFactory("ERC20Mock", this.minter);
		this.IDO = await ethers.getContractFactory("IDO");
	});

	beforeEach(async function () {
		this.money = await this.MoneyToken.deploy(this.owner.address);
		this.usdt = await this.ERC20Mock.connect(this.alice).deploy("USDT", "USDT", utils.parseEther('100000'));

		const latestTimestamp = await latest();
		this.latestTimestamp = latestTimestamp;
		this.ido = await this.IDO.deploy(
			latestTimestamp,					// sale start time
			latestTimestamp.add(500),		// sale end time = 1 hour + start time
			latestTimestamp.add(1000),		// sale unlock time = 1 hour + end time
			BigNumber.from(10).pow(18).mul(3000),		// sale cap = 10000 usdt
			BigNumber.from(10).pow(18).mul(1000),			// deposit min = 1000 usdt
			BigNumber.from(10).pow(18).mul(2000),			// deposit max = 2000 usdt
			100,											// exchange rate
			this.owner.address,								// withdrawer address
			this.usdt.address,
      this.money.address
    );

		await this.money.deployed();
		await this.usdt.deployed();
		await this.ido.deployed();
	})

	it("should set correct state variables", async function () {
		const owner = await this.ido.owner();
		expect(owner).to.equal(this.alice.address);

		const saleStartTime = await this.ido.saleStartTime();
		expect(saleStartTime.eq(this.latestTimestamp)).to.equal(true);
	});

	it("should allow deposit between min and max amounts", async function () {
		await expect(
			this.ido.deposit(utils.parseEther('999'))
		).to.be.revertedWith('MoneyIDO: Does not meet minimum deposit requirements.');
		await expect(
			this.ido.deposit(utils.parseEther('2001'))
		).to.be.revertedWith('MoneyIDO: Does not meet maximum deposit requirements.');

		await this.usdt.connect(this.alice).approve(this.ido.address, utils.parseEther('5000'));
		await this.ido.deposit(utils.parseEther('1500'));
		expect(await this.ido.balanceOf(this.alice.address)).to.equal(utils.parseEther('1500'));
		expect(await this.ido.totalBalance()).to.equal(utils.parseEther('1500'));

		await expect(
			this.ido.deposit(utils.parseEther('1500'))
		).to.be.revertedWith('MoneyIDO: Does not meet maximum deposit requirements.');
	})

	it("should reject deposit after achieve sale cap", async function () {
		await this.usdt.connect(this.alice).transfer(this.bob.address, utils.parseEther('2000'));
		await this.usdt.connect(this.alice).approve(this.ido.address, utils.parseEther('3000'));
		await this.ido.deposit(utils.parseEther('2000'));

		await this.usdt.connect(this.bob).approve(this.ido.address, utils.parseEther('2000'));

		await expect(
			this.ido.connect(this.bob).deposit(utils.parseEther('2000'))
		).to.be.revertedWith('MoneyIDO: Sale Cap overflow.');
	})

	it("should reject deposit after end of sale", async function () {
		await advanceBlockTo("1000");
		await this.usdt.connect(this.alice).approve(this.ido.address, utils.parseEther('5000'));
		await expect(
			this.ido.deposit(utils.parseEther('1500'))
		).to.be.revertedWith('MoneyIDO: IDO is already finished.');
	})

	it("should be able to claim only after unlock period", async function () {
		await this.money.connect(this.owner).transfer(this.ido.address, utils.parseEther('1000000'))
		await this.usdt.connect(this.alice).approve(this.ido.address, utils.parseEther('5000'));
		await this.ido.deposit(utils.parseEther('2000'));

		await expect(
			this.ido.claim()
		).to.be.revertedWith('MoneyIDO: IDO is not unlocked yet.');
		await advanceBlockTo("3000");
		await this.ido.claim();
		expect(await this.money.balanceOf(this.alice.address)).to.equal(utils.parseEther('200000'))
		await expect(
			this.ido.claim()
		).to.be.revertedWith('MoneyIDO: Insufficient balance.');
	})

	it("should allow only withdrawer to withdraw usdt", async function () {
		await this.money.connect(this.owner).transfer(this.ido.address, utils.parseEther('1000000'))
		await this.usdt.connect(this.alice).approve(this.ido.address, utils.parseEther('5000'));
		await this.ido.deposit(utils.parseEther('2000'));
		await advanceBlockTo("5000");

		await expect(
			this.ido.connect(this.alice).withdraw()
		).to.be.revertedWith("MoneyIDO: You can't withdraw funds.");
		await this.ido.connect(this.owner).withdraw();
		expect(await this.usdt.balanceOf(this.owner.address)).to.equal(utils.parseEther('2000'));
	})
})