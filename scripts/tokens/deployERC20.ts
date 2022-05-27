import { ethers } from "hardhat";
import * as fs from 'fs'

async function main() {
  const ERC20 = await ethers.getContractFactory("MyERC20");
  const merc20 = await ERC20.deploy("DVCoin", "DVC", 18);

  await merc20.deployed();

  console.log("ERC20 contract address:", merc20.address);

  fs.appendFileSync('.env', `\n\nERC20_ADDRESS=${merc20.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });