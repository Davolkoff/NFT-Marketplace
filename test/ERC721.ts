import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("ERC721 functions", function() {
    let token721: Contract;

    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;

    it("Should deploy ERC721 contract", async function () {
        [owner, addr1] = await ethers.getSigners();
        const MarketplaceERC721 = await ethers.getContractFactory("MyERC721");
        token721 = await MarketplaceERC721.deploy();

        await token721.deployed();
    });

    it("Should revert connecting markeplace if you are not an owner", async function () {
        await expect(token721.connect(addr1).connectMarketplace(addr1.address)).to.be.revertedWith("Not an owner");
    });

    it("Should connect marketplace to ERC721 token", async function () {
        await token721.connectMarketplace(addr1.address);
    });

    it("Should revert connecting marketplace if it alrady connected", async function () {
        await expect(token721.connectMarketplace(owner.address)).to.be.revertedWith("Marketplace already connected");
    });

    it("Should revert minting if you are not marketplace", async function () {
        await expect(token721.mint(owner.address, 0, "111")).to.be.revertedWith("Not a marketplace");
    });

    it("Should mint token to specific user", async function () {
        await token721.connect(addr1).mint(owner.address, 0, "111");
        expect(await token721.balanceOf(owner.address)).to.equal(1);
    });

    it("Should return URI of a specific token", async function () {
        expect(await token721.tokenURI(0)).to.equal("111");
    });

    it("Should revert burning tokens if you are not a marketplace", async function () {
        await expect(token721.burn(0)).to.be.revertedWith("Not a marketplace");
    });

    it("Should burn specific token", async function () {
        await token721.connect(addr1).burn(0);
        expect(await token721.balanceOf(owner.address)).to.equal(0);
    });
});