import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, network } from "hardhat";

describe("Marketplace", function () {
  let token721: Contract;
  let token1155: Contract;
  let token20: Contract;
  let marketplace: Contract;
  
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3: SignerWithAddress;

  describe("Deploy", function() {
    it("Should deploy ERC721 contract", async function () {
      [owner, addr1, addr2, addr3] = await ethers.getSigners();
      const MarketplaceERC721 = await ethers.getContractFactory("MyERC721");
      token721 = await MarketplaceERC721.deploy();

      await token721.deployed();
    });

    it("Should deploy ERC1155 contract", async function () {
      const MarketplaceERC721 = await ethers.getContractFactory("MyERC1155");
      token1155 = await MarketplaceERC721.deploy("Marketplace ERC1155 token", "MPT1155");

      await token1155.deployed();
    })

    it("Should deploy ERC20 contract", async function () {
      const MyERC20 = await ethers.getContractFactory("MyERC20");
      token20 = await MyERC20.deploy("DVToken", "DVT", 18);
    });
    
    it("Should deploy marketplace contract", async function () {
      const Marketplace = await ethers.getContractFactory("Marketplace");
      marketplace = await Marketplace.deploy(token721.address, token1155.address, token20.address);

      await marketplace.deployed();
    });

    it("Should connect marketplace to ERC contracts", async function () {
      token721.connectMarketplace(marketplace.address);
      token1155.connectMarketplace(marketplace.address);
    });
  });

  describe("Minting functions", function() {
    it("Should mint ERC721 token", async function () {
      const metadata = "ipfs://QmcNmyNJNpwVW43T61uR7VgjKwNdbY1WgHqyirXq2sbjey";
      marketplace.createItem(false, owner.address, "0", metadata);
      
      expect(await token721.balanceOf(owner.address)).to.equal("1");
      expect(await token721.tokenURI(0)).to.equal(metadata);
    });

    it("Should mint ERC1155 token", async function () {
      const metadata = "ipfs://QmcNmyNJNpwVW43T61uR7VgjKwNdbY1WgHqyirXq2sbjey";
      marketplace.createItem(true, owner.address, "100", metadata);
      
      expect(await token1155.balanceOf(owner.address, 1)).to.equal("100");
      expect(await token1155.uri(1)).to.equal(metadata);
    });
  });

  describe("Market functions", function () {
    
    it("Should revert listing if it's not your token", async function () {
      await expect(marketplace.connect(addr3).listItem(false, 0, 100)).to.be.revertedWith("Not your token");
      await expect(marketplace.connect(addr3).listItem(true, 1, 100)).to.be.revertedWith("Not your token");
    });

    it("Should list ERC721 item", async function () {
      await token721.approve(marketplace.address, 0);
      
      await marketplace.listItem(false, 0, 50);

      expect(await token721.ownerOf(0)).to.equal(marketplace.address);
      expect(await marketplace.listed(0)).to.equal(true);
      expect(await marketplace.price(0)).to.equal(50);
    });

    it("Should list ERC1155 item", async function () {
      await token1155.setApprovalForAll(marketplace.address, true);
      await marketplace.listItem(true, 1, 100);
      await token1155.setApprovalForAll(marketplace.address, false);
      
      expect(await token1155.balanceOf(marketplace.address, 1)).to.equal(100);
      expect(await marketplace.listed(1)).to.equal(true);
      expect(await marketplace.price(1)).to.equal(100);
    });

    it("Should revert cancelling if it's not your token", async function () {
      await expect(marketplace.connect(addr3).cancel(false, 0)).to.be.revertedWith("Not your token");
      await expect(marketplace.connect(addr3).cancel(true, 1)).to.be.revertedWith("Not your token");
    });

    it("Should cancel listing ERC721 token", async function () {
      await marketplace.cancel(false, 0);
      
      expect(await token721.balanceOf(owner.address)).to.equal(1);
      expect(await marketplace.listed(0)).to.equal(false);
      await expect(marketplace.price(0)).to.be.revertedWith("Token not listed");
    });
    

    it("Should cancel listing ERC1155 token", async function () {
      await marketplace.cancel(true, 1);
      
      expect(await token1155.balanceOf(owner.address, 1)).to.equal(100);
      expect(await marketplace.listed(1)).to.equal(false);
      await expect(marketplace.price(1)).to.be.revertedWith("Token not listed");
    });

    it("Should revert cancelling if your token not listed", async function () {
      await expect(marketplace.cancel(false, 0)).to.be.revertedWith("Token not listed");
      await expect(marketplace.cancel(true, 1)).to.be.revertedWith("Token not listed");
    });

    it("Should list ERC721 item with another price", async function () { // added to test buying function
      await token721.approve(marketplace.address, 0);
      
      await marketplace.listItem(false, 0, 100);

      expect(await token721.ownerOf(0)).to.equal(marketplace.address);
      expect(await marketplace.listed(0)).to.equal(true);
      expect(await marketplace.price(0)).to.equal(100);
    });

    it("Should allow to buy ERC721 token", async function() {
      await token20.mint(addr1.address, 100);
      await token20.connect(addr1).approve(marketplace.address, 100);
      await marketplace.connect(addr1).buyItem(false, 0);
      
      expect(await token721.ownerOf(0)).to.equal(addr1.address);
      expect(await token20.balanceOf(owner.address)).to.equal(100);
      expect(await marketplace.listed(0)).to.equal(false);
    });

    it("Should list ERC1155 item with another price", async function () { // added to test buying function
      await token1155.setApprovalForAll(marketplace.address, true);
      await marketplace.listItem(true, 1, 200);
      await token1155.setApprovalForAll(marketplace.address, false);
      
      expect(await token1155.balanceOf(marketplace.address, 1)).to.equal(100);
      expect(await marketplace.listed(1)).to.equal(true);
      expect(await marketplace.price(1)).to.equal(200);
    });

    it("Should allow to buy ERC1155 token", async function() {
      await token20.mint(addr1.address, 200);
      await token20.connect(addr1).approve(marketplace.address, 200);
      await marketplace.connect(addr1).buyItem(true, 1);
      
      expect(await token1155.balanceOf(addr1.address, 1)).to.equal(100);
      expect(await token20.balanceOf(owner.address)).to.equal(300);
      expect(await marketplace.listed(1)).to.equal(false);
    });

    it("Should revert buying, if token not listed", async function() {
      await expect(marketplace.buyItem(false, 0)).to.be.revertedWith("Token not listed");
      await expect(marketplace.buyItem(true, 1)).to.be.revertedWith("Token not listed");
    });
  });

  describe("Auction functions", function () {
    it("Should revert listing to auction, if it's not your token", async function() {
      await expect(marketplace.listItemOnAuction(false, 0, 100, 172800)).to.be.revertedWith("Not your token");
      await expect(marketplace.listItemOnAuction(true, 1, 100, 172800)).to.be.revertedWith("Not your token");
    });

    it("Should allow to list ERC721 token on auction", async function() {
      await token721.connect(addr1).approve(marketplace.address, 0);
      await marketplace.connect(addr1).listItemOnAuction(false, 0, 100, 172800); // the auction lasts 2 days
      
      expect(await token721.ownerOf(0)).to.equal(marketplace.address);
      expect(await marketplace.onAuction(0)).to.equal(true);
      expect(await marketplace.lastBid(0)).to.equal(100);
    });

    it("Should allow to list ERC1155 token on auction", async function () {
      await token1155.connect(addr1).setApprovalForAll(marketplace.address, true);
      await marketplace.connect(addr1).listItemOnAuction(true, 1, 300, 172800); // the auction lasts 2 days
      await token1155.setApprovalForAll(marketplace.address, false);
      
      expect(await token1155.balanceOf(marketplace.address, 1)).to.equal(100);
      expect(await marketplace.onAuction(1)).to.equal(true);
      expect(await marketplace.lastBid(1)).to.equal(300);
    });

    it("Should allow you to bid on auction (ERC721)", async function() {
      await token20.mint(owner.address, 200);
      await token20.approve(marketplace.address, 200);
      await marketplace.makeBid(0, 200);
      
      expect(await token20.balanceOf(marketplace.address)).to.equal(200);
    });

    it("Should allow you to bid on auction (ERC1155)", async function() {
      await token20.mint(owner.address, 400);
      await token20.approve(marketplace.address, 400);
      await marketplace.makeBid(1, 400);
      expect(await token20.balanceOf(owner.address)).to.equal(300);
      expect(await token20.balanceOf(marketplace.address)).to.equal(600); //200 tokens from ERC721 bid + 400 from ERC1155 bid
    });

    it("Should revert your bid if it less than last bid", async function() {
      await expect(marketplace.makeBid(1, 100)).to.be.revertedWith("You should bid more than last bidder");
    });

    it("Should allow you to return your last bid if someone bid more", async function() {
      await token20.mint(addr2.address, 300);
      await token20.connect(addr2).approve(marketplace.address, 300);
      
      await marketplace.connect(addr2).makeBid(0, 300);
      await marketplace.withdrawCancelledBids();
      expect(await token20.balanceOf(owner.address)).to.equal(500); //300 tokens from selling tokens + 200 tokens from reverted bid
      expect(await token20.balanceOf(marketplace.address)).to.equal(700); //300 tokens from ERC721 bid + 400 from ERC1155 bid
    });

    it("Should revert finishig auction if time not expired", async function () {
      await expect(marketplace.finishAuction(false, 0)).to.be.revertedWith("Not time yet");
      await expect(marketplace.finishAuction(true, 1)).to.be.revertedWith("Not time yet");
    });

    it("Should revert all bids after time expiration", async function() {
      await network.provider.send("evm_increaseTime", [200000]);
      await network.provider.send("evm_mine");

      await expect(marketplace.makeBid(0,1000)).to.be.revertedWith("Time out");
      await expect(marketplace.makeBid(1,1000)).to.be.revertedWith("Time out");
    });

    it("Should finish auction for ERC721 tokens", async function() {
      await marketplace.finishAuction(false, 0);
      expect(await token20.balanceOf(addr1.address)).to.equal(300);
      expect(await token721.ownerOf(0)).to.equal(addr2.address);
    });

    it("Should finish auction for ERC1155 tokens", async function() {
      await marketplace.finishAuction(true, 1);
      expect(await token20.balanceOf(addr1.address)).to.equal(700);
      expect(await token1155.balanceOf(owner.address, 1)).to.equal(100);
    });

    it("Should revert all bids if token not on auction", async function () {
      await expect(marketplace.makeBid(0, 1000)).to.be.revertedWith("Token is not on auction");
    });

    it("Should revert finishing auction if token not on auction", async function() {
      await expect(marketplace.finishAuction(false, 0)).to.be.revertedWith("Token is not on auction");
      await expect(marketplace.finishAuction(true, 1)).to.be.revertedWith("Token is not on auction");
    });

    it("Should send ERC721 back to owner if no one made bid", async function () {
      await token721.connect(addr2).approve(marketplace.address, 0);
      await marketplace.connect(addr2).listItemOnAuction(false, 0, 100, 0);
      expect(await token721.ownerOf(0)).to.equal(marketplace.address);
      await marketplace.finishAuction(false, 0);
      expect(await token721.ownerOf(0)).to.equal(addr2.address);
    });

    it("Should send ERC1155 back to owner if no one made bid", async function () {
      await token1155.setApprovalForAll(marketplace.address, 1);
      await marketplace.listItemOnAuction(true, 1, 100, 0);
      await token1155.setApprovalForAll(marketplace.address, 0);
      expect(await token1155.balanceOf(marketplace.address, 1)).to.equal(100);
      await marketplace.finishAuction(true, 1);
      expect(await token1155.balanceOf(owner.address, 1)).to.equal(100);
    });
  });
});