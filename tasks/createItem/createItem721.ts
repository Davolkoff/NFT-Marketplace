import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("createitem721", "Mints ERC721 to selected account")
.addParam("recipient", "Recipient address")
.addParam("cid", "Your CID from IPFS")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    
    const createResponse = await marketplace.createItem(false, args.recipient, 0, `ipfs://${args.cid}`);
    const createReceipt = await createResponse.wait(); 
    console.log("Your ERC721 NFT successfully minted");
    console.log(`Token id: ${createReceipt.events[1].args["tokenId"].toString()}`);
});