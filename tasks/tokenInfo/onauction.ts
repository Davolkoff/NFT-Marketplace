import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("onauction", "Info: listed token on auction or not")
.addParam("id", "Id of token")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    
    if(await marketplace.onAuction(args.id)) {
        console.log("Listed on auction");
    }
    else{
        console.log("Not listed on auction");
    }
});