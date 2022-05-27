import { ethers } from "hardhat";
import * as fs from 'fs'

async function main() {
  const MarketplaceERC721 = await ethers.getContractFactory("MyERC721");
  const merc721 = await MarketplaceERC721.deploy();

  await merc721.deployed();

  console.log("Address of ERC721 contract for marketplace:", merc721.address);
  fs.appendFileSync('.env', `\nERC721_ADDRESS=${merc721.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
