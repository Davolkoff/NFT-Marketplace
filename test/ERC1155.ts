import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("ERC1155 functions", async function () {
    let token1155: Contract;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;

    it("Should deploy ERC1155 contract", async function () {
        [owner, addr1] = await ethers.getSigners();
        const MarketplaceERC721 = await ethers.getContractFactory("MyERC1155");
        token1155 = await MarketplaceERC721.deploy("Marketplace ERC1155 token", "MPT1155");

        await token1155.deployed();
    });

    it("Should return name of this token", async function () {
        expect(await token1155.name()).to.equal("Marketplace ERC1155 token");
    });

    it("Should return symbol of this token", async function () {
        expect(await token1155.symbol()).to.equal("MPT1155");
    });

    it("Should revert connecting markeplace if you are not an owner", async function () {
        await expect(token1155.connect(addr1).connectMarketplace(addr1.address)).to.be.revertedWith("Not an owner");
    });

    it("Should connect marketplace to ERC1155 token", async function () {
        await token1155.connectMarketplace(addr1.address);
    });

    it("Should revert connecting marketplace if it alrady connected", async function () {
        await expect(token1155.connectMarketplace(owner.address)).to.be.revertedWith("Marketplace already connected");
    });

    it("Should mint tokens to specific address", async function () {
        await token1155.connect(addr1).mint(owner.address, 0, 100, "111");
        expect(await token1155.balanceOf(owner.address, 0)).to.equal(100);
    });

    it("Should minting tokens if you are not a marketplace", async function () {
        await expect(token1155.mint(owner.address, 0, 100, "111")).to.be.revertedWith("Not a marketplace");
    });

    it("Should return URI of specific token", async function () {
        expect(await token1155.uri(0)).to.equal("111");
    });
});