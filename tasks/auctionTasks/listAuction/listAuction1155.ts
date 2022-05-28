import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("listauction1155", "Puts ERC1155 token up for auction")
.addParam("id", "Id of your NFT")
.addParam("minbid", "Minimum bid")
.addParam("exp", "Expiration time in seconds")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    const token1155 = await hre.ethers.getContractAt("MyERC1155", process.env.ERC1155_ADDRESS as string);
    
    await token1155.setApprovalForAll(process.env.MARKETPLACE_ADDRESS as string, true);
    await marketplace.listItemOnAuction(true, args.id, args.minbid, args.exp);
    await token1155.setApprovalForAll(process.env.MARKETPLACE_ADDRESS as string, false);
    console.log("Your ERC1155 NFT successfully listed on auction");
});