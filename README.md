# NFT Marketplace

>In this project I created my own NFT Marketplace, that allows you to create, sell, buy, and list on auction ERC721 and ERC1155 tokens. The ERC721 and ERC1155 tokens were inherited from openzeppelin. Tasks allow you to get the full functionality of the marketplace, tests have full coverage
-------------------------
# Table of contents
1. <b>Deploying</b>
  + [Deploy ERC20 token](#Deploy-erc20)
  + [Deploy ERC721 token](#Deploy-erc721)
  + [Deploy ERC1155 token](#Deploy-erc1155)
  + [Deploy marketplace contract](#Deploy-marketplace)
  + [Connect marketplace to tokens](#Connect)
  + [Mint ERC20 on your address](#Mint-erc20)
2. <b>Creating NFTs</b>
  + [Create ERC721 token](#Create-erc721)
  + [Create ERC1155 token](#Create-erc1155)
3. <b>Purchase and sale of NFT</b>
  + [Put NFT up for sale](#Sell-nft)
  + [Cancel the sale of NFT](#Cancel-selling)
  + [Buy NFT](#Buy-nft)
4. <b>NFT auction</b>
  + [Put NFT up for auction](#Start-auction)
  + [Make bid](#Make-bid)
  + [End the auction](#End-auction)
5. <b>Readable functions</b>
  + [Is NFT listed](#Listed)
  + [Price of the NFT](#Price)
  + [Is NFT listed on auction](#On-auction)
  + [Last bid on the auction](#Last-bid)
-------------------------
## 1. Deploying

#### <a name="Deploy-erc20"></a> <b>- Deploy ERC20 token(after executing this command you'll see ERC20 token's address in terminal, address will be added to .env file):</b> 
```shell
npx hardhat run scripts/tokens/deployERC20.ts
```
>This token is used as a currency for buying NFT, taking part in the NFT auction

#### <a name="Deploy-erc721"></a> <b>- Deploy ERC721 token (after executing this command you'll see ERC721 token's address in terminal, address will be added to .env file):</b> 
```shell
npx hardhat run scripts/tokens/deployERC721.ts
```
>The marketplace refers to this contract for the creation and transfer of tokens ERC721

#### <a name="Deploy-erc1155"></a> <b>- Deploy ERC1155 token (after executing this command you'll see ERC1155 token's address in terminal, address will be added to .env file):</b>
```shell
npx hardhat run scripts/tokens/deployERC1155.ts
```
>The marketplace refers to this contract for the creation and transfer of tokens ERC1155

#### <a name="Deploy-marketplace"></a> <b>- Deploy marketplace contract (after executing this command you'll see marketplace contract 's address in terminal, address will be added to .env file):</b>
```shell
npx hardhat run scripts/tokens/deployERC1155.ts
```
>This is the main contract that the user interacts with through tasks. The addresses of tokens and marketplace are taken from .env file

#### <a name="Connect"></a> <b>- Connect marketplace to tokens:</b>
```shell
npx hardhat connect
```
>Connects token contracts with a marketplace contract. Without this command, the marketplace functions will not work. The addresses of tokens and marketplace are taken from the .env file

#### <a name="Mint-erc20"></a> <b>- Mint ERC20 on your address </b>
```shell
Usage: hardhat [GLOBAL OPTIONS] mint20 --amount <STRING> --recipient <STRING>

OPTIONS:

  --amount      Amount of tokens 
  --recipient   Recipient address 


Example:

hardhat createitem721 --recipient 0x5A31ABa56b11cc0Feae06C7f907bED9Dc1C02f95 --amount 100000
```
-------------------------
## 2. Creating NFTs
>If you want to create your NFT, you should store your files to IPFS and write metadata file, which will be readable by opensea or other NFT marketplaces
#### <a name="Create-erc721"></a> <b>- Create ERC721 token(after executing this command you'll see ERC721 token's id in terminal):</b> 
```shell
Usage: hardhat [GLOBAL OPTIONS] createitem721 --cid <STRING> --recipient <STRING>

OPTIONS:

  --cid         Your CID from IPFS 
  --recipient   Recipient address 


Example:

hardhat createitem721 --recipient 0x5A31ABa56b11cc0Feae06C7f907bED9Dc1C02f95 --cid QmVM6fTYtxadBExQWMZQVb6xWXZAvAKF3vNv3ZRM4FTbg4
```

#### <a name="Create-erc1155"></a> <b>- Create ERC1155 token(after executing this command you'll see ERC721 token's id in terminal):</b> 
```shell
Usage: hardhat [GLOBAL OPTIONS] createitem1155 --amount <STRING> --cid <STRING> --recipient <STRING>

OPTIONS:

  --amount      Amount of tokens 
  --cid         Your CID from IPFS 
  --recipient   Recipient address 


Example:

hardhat createitem1155 --recipient 0x5A31ABa56b11cc0Feae06C7f907bED9Dc1C02f95 --cid QmVM6fTYtxadBExQWMZQVb6xWXZAvAKF3vNv3ZRM4FTbg4 --amount 1000
```
-------------------------
## 3. Purchase and sale of NFT
>You can sell and buy NFTs only using ERC20 tokens, that you deployed earlier. Every standard has it's own functions. If you call, for example, the ERC721 function for the ERC1155 token, you will receive an error message. Every function here will be two kinds of usages: for ERC721 and for ERC1155 and two kinds of examples
#### <a name="Sell-nft"></a> <b>- Put NFT up for sale:</b>

```shell
Usage: hardhat [GLOBAL OPTIONS] listitem721 --id <STRING> --price <STRING>

Usage: hardhat [GLOBAL OPTIONS] listitem1155 --id <STRING> --price <STRING>

OPTIONS:

  --id          Id of your NFT 
  --price       Price of your NFT 


Example:

hardhat listitem721 --id 0 --price 100

hardhat listitem1155 --id 1 --price 150
```

#### <a name="Cancel-selling"></a> <b>- Cancel the sale of NFT:</b>

```shell
Usage: hardhat [GLOBAL OPTIONS] cancel721 --id <STRING>

Usage: hardhat [GLOBAL OPTIONS] cancel1155 --id <STRING>

OPTIONS:

  --id  Id of your NFT 


Example:

hardhat cancel721 --id 0

hardhat cancel1155 --id 1
```

#### <a name="Buy-nft"></a> <b>- Buy NFT:</b>

```shell
Usage: hardhat [GLOBAL OPTIONS] buyitem721 --id <STRING>

Usage: hardhat [GLOBAL OPTIONS] buyitem1155 --id <STRING>

OPTIONS:

  --id  Id of your NFT 


Example:

hardhat buyitem721 --id 0

hardhat buyitem1155 --id 0
```
-------------------------
## 4. NFT auction
>You can put your NFT up for auction and place bids only using ERC20 tokens, that you deployed earlier. Every standard has it's own functions. If you call, for example, the ERC721 function for the ERC1155 token, you will receive an error message. Every function here will be two kinds of usages: for ERC721 and for ERC1155 and two kinds of examples

#### <a name="Start-auction"></a> <b>- Put NFT up for auction:</b>

```shell
Usage: hardhat [GLOBAL OPTIONS] listauction721 --exp <STRING> --id <STRING> --minbid <STRING>

Usage: hardhat [GLOBAL OPTIONS] listauction1155 --exp <STRING> --id <STRING> --minbid <STRING>

OPTIONS:

  --exp         Expiration time in seconds 
  --id          Id of your NFT 
  --minbid      Minimum bid 


Example:

hardhat listauction721 --exp 600 --id 0 --minbid 100

hardhat listauction1155 --exp 1200 --id 0 --minbid 150
```

#### <a name="Make-bid"></a> <b>- Make bid:</b>
>This function works equally with ERC721 and ERC1155 tokens
```shell
Usage: hardhat [GLOBAL OPTIONS] makebid --amount <STRING> --id <STRING>

OPTIONS:

  --amount      Amount of your bid 
  --id          Id of auction 


Example:

hardhat makebid --amount 700 --id 0
```

#### <a name="End-auction"></a> <b>- End the auction:</b>
>Сan be called by any user after the expiration of the auction
```shell
Usage: hardhat [GLOBAL OPTIONS] endauction721 --id <STRING>

Usage: hardhat [GLOBAL OPTIONS] endauction1155 --id <STRING>

OPTIONS:

  --id  Id of auction 


Example:

hardhat endauction721 --id 0

hardhat endauction1155 --id 1
```
-------------------------
## 5. Readable functions
>These functions work with both types of tokens. They do not change anything, they just display important information for the user. After executing this commands you'll see the necessary information in terminal

#### <a name="Listed"></a> <b>- Is NFT listed:</b> 
```shell
Usage: hardhat [GLOBAL OPTIONS] listed --id <STRING>

OPTIONS:

  --id  Id of token 


Example:

hardhat listed --id 0 
```

#### <a name="Price"></a> <b>- Price of the NFT:</b> 
```shell
Usage: hardhat [GLOBAL OPTIONS] price --id <STRING>

OPTIONS:

  --id  Id of token 


Example:

hardhat price --id 0
```

#### <a name="On-auction"></a> <b>- Is NFT listed on auction:</b> 
```shell
Usage: hardhat [GLOBAL OPTIONS] onauction --id <STRING>

OPTIONS:

  --id  Id of token 


Example:

hardhat onauction --id 1
```

#### <a name="Last-bid"></a> <b>- Last bid on the auction:</b> 
```shell
Usage: hardhat [GLOBAL OPTIONS] lastbid --id <STRING>

OPTIONS:

  --id  Id of auction 


Example:

hardhat lastbid --id 1
```
