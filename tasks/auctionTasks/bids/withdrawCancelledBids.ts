import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("wbids", "Withdraws your cancelled bids")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    
    await marketplace.withdrawCancelledBids();
    console.log("Your bids has been successfully withdrawn");
});