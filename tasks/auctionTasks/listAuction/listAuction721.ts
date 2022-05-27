import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("listauction721", "Puts ERC721 token up for auction")
.addParam("id", "Id of your NFT")
.addParam("minbid", "Minimum bid")
.addParam("exp", "Expiration time in seconds")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    const token721 = await hre.ethers.getContractAt("MyERC721", process.env.ERC721_ADDRESS as string);

    await token721.approve(process.env.MARKETPLACE_ADDRESS as string, args.id);
    await marketplace.listItemOnAuction721(args.id, args.minbid, args.exp);
    console.log("Your ERC721 NFT successfully listed on auction");
});