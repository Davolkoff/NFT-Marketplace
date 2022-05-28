import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("listitem721", "Puts the ERC721 token up for sale")
.addParam("id", "Id of your NFT")
.addParam("price", "Price of your NFT")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    const token721 = await hre.ethers.getContractAt("MyERC721", process.env.ERC721_ADDRESS as string);

    await token721.approve(process.env.MARKETPLACE_ADDRESS as string, args.id);
    await marketplace.listItem(false, args.id, args.price);
    console.log("Your ERC721 NFT successfully listed");
});