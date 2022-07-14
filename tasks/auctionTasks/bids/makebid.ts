import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("makebid", "Make bid on auction")
.addParam("id", "Id of auction")
.addParam("amount", "Amount of your bid")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    const token20 = await hre.ethers.getContractAt("MyERC20", process.env.ERC20_ADDRESS as string);

    await token20.approve(process.env.MARKETPLACE_ADDRESS as string, args.amount);
    await marketplace.makeBid(args.id, args.amount);
    console.log("You have successfully made a bid");
});