import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("mint20", "Mints ERC20 tokens on selected account")
.addParam("amount", "Amount of tokens")
.addParam("recipient", "Recipient address")
.setAction(async (args, hre) => {

    const token20 = await hre.ethers.getContractAt("MyERC20", process.env.ERC20_ADDRESS as string);
    
    await token20.mint(args.recipient, args.amount);

    console.log("Tokens successfully minted");
});