import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("price", "Info: returns price of listed token")
.addParam("id", "Id of token")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    
    console.log("Price:", (await marketplace.price(args.id)).toString(), "DVT");
});