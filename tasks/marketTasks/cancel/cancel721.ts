
import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("cancel721", "Removes ERC1155 token from sale")
.addParam("id", "Id of your NFT")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    
    await marketplace.cancel(false, args.id);
    console.log("Your ERC721 NFT successfully unlisted");
});