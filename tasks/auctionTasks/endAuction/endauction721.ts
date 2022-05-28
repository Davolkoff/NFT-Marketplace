import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("endauction721", "Ends the ERC721 auction")
.addParam("id", "Id of auction")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    
    await marketplace.finishAuction(false, args.id);
    console.log("Auction successfully ended");
});