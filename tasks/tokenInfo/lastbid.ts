import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("lastbid", "Info: returns last bid of specific auction")
.addParam("id", "Id of auction")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    
    console.log("Last bid:", (await marketplace.lastBid(args.id)).toString(), "DVT");
});