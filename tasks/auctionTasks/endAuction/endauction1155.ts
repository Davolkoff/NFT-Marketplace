import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("endauction1155", "Ends the ERC1155 auction")
.addParam("id", "Id of auction")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    
    await marketplace.finishAuction1155(args.id);
    console.log("Auction successfully ended");
});