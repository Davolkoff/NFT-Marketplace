import { ethers } from "hardhat";
import * as fs from 'fs'

async function main() {
  const MarketplaceERC1155 = await ethers.getContractFactory("MyERC1155");
  const merc1155 = await MarketplaceERC1155.deploy("Marketplace ERC1155 token", "MPT1155");

  await merc1155.deployed();

  console.log("Address of ERC1155 contract for marketplace:", merc1155.address);
  fs.appendFileSync('.env', `\nERC1155_ADDRESS=${merc1155.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
