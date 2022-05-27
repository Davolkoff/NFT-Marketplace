import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("connect", "Connects your marketplace to your tokens")
.setAction(async (args, hre) => {

    const token721 = await hre.ethers.getContractAt("MyERC721", process.env.ERC721_ADDRESS as string);
    const token1155 = await hre.ethers.getContractAt("MyERC1155", process.env.ERC1155_ADDRESS as string);
    
    await token721.connectMarketplace(process.env.MARKETPLACE_ADDRESS as string);
    await token1155.connectMarketplace(process.env.MARKETPLACE_ADDRESS as string);

    console.log("Marketplace successfully connected");
});