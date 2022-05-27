import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import * as fs from 'fs';
dotenv.config();

async function main() {
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    process.env.ERC721_ADDRESS, 
    process.env.ERC1155_ADDRESS,
    process.env.ERC20_ADDRESS);

  await marketplace.deployed();

  console.log("Marketplace contract address:", marketplace.address);
  fs.appendFileSync('.env', `\nMARKETPLACE_ADDRESS=${marketplace.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
