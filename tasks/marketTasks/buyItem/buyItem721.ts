import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("buyitem721", "Buy selected ERC721 NFT")
.addParam("id", "Id of your NFT")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    const token20 = await hre.ethers.getContractAt("MyERC20", process.env.ERC20_ADDRESS as string);

    const price = await marketplace.price(args.id);
    await token20.approve(process.env.MARKETPLACE_ADDRESS, Number(price))
    await marketplace.buyItem(false, args.id);
    console.log("You successfully bought ERC721 NFT");
});