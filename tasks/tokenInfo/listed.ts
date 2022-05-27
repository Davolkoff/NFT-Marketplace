import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("listed", "Info: listed token or not")
.addParam("id", "Id of token")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    
    if(await marketplace.listed(args.id)) {
        console.log("Listed");
    }
    else{
        console.log("Not listed");
    }
});