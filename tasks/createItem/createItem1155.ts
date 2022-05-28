import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("createitem1155", "Mints ERC1155 to selected account")
.addParam("recipient", "Recipient address")
.addParam("amount", "Amount of tokens")
.addParam("cid", "Your CID from IPFS")
.setAction(async (args, hre) => {
    const marketplace = await hre.ethers.getContractAt("Marketplace", process.env.MARKETPLACE_ADDRESS as string);
    
    const createResponse = await marketplace.createItem(true, args.recipient, args.amount,`ipfs://${args.cid}`);
    const createReceipt = await createResponse.wait();

    console.log("Your NFT successfully minted");
    console.log(`Token id: ${createReceipt.events[1].args["tokenId"].toString()}`);
});