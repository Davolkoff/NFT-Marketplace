import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("listitem1155", "Puts the ERC1155 token up for sale")
.addParam("id", "Id of your NFT")
.addParam("price", "Price of your NFT")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    const token1155 = await hre.ethers.getContractAt("MyERC1155", process.env.ERC1155_ADDRESS as string);
    
    await token1155.setApprovalForAll(process.env.MARKETPLACE_ADDRESS as string, true);
    await marketplace.listItem1155(args.id, args.price);
    await token1155.setApprovalForAll(process.env.MARKETPLACE_ADDRESS as string, false);
    console.log("Your ERC1155 NFT successfully listed");
});