// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import './interfaces/IMyERC721.sol';
import './interfaces/IMyERC1155.sol';
import './interfaces/IMyERC20.sol';

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract Marketplace is ERC1155Holder {

    IMyERC721 token721; // created for interacting with contracts
    IMyERC1155 token1155;
    IMyERC20 token20;

    uint256 tokenIdCounter; // created for generating tokenIds
    
    struct Token {
        address owner; // owner of token

        bool listed; // is token on sale
        bool onAuction; // is token on auction
    }

    struct Auction {
        uint256 expirationTime; // expiration time of auction
        uint256 lastBid; // last bid of auction
        address lastBidder; // last bidder on auction
    }

    mapping(uint256 => Token) private _tokens; // combined ERC721 and ERC1155 of marketplace in mapping 
    mapping(uint256 => Auction) private _auctions; // mapping of auctions
    mapping(uint256 => uint256) private _price; // prices of tokens

    event ItemCreated (
        bool standard, // 0 - ERC721, 1 - ERC1155
        uint256 tokenId
    );

    event ItemListed (
        uint256 tokenId,
        uint256 price
    );

    event AuctionCreated (
        uint256 tokenId
    );

    constructor (address mp721_, address mp1155_, address erc20_) {
        token721 = IMyERC721(mp721_);
        token1155 = IMyERC1155(mp1155_);
        token20 = IMyERC20(erc20_);
    }

    // creates ERC721 NFT
    function createItem721(string memory metadata_, address recipient_) external {
        token721.mint(recipient_, tokenIdCounter, metadata_);
        _tokens[tokenIdCounter].owner = recipient_;
        emit ItemCreated(false, tokenIdCounter);
        tokenIdCounter += 1;
    }

    // creates ERC1155 NFT
    function createItem1155(address recipient_, uint256 amount_, string memory uri_) external {
        token1155.mint(recipient_, tokenIdCounter, amount_, uri_);
        _tokens[tokenIdCounter].owner = recipient_;
        emit ItemCreated(true, tokenIdCounter);
        tokenIdCounter += 1;
    }

    // puts ERC721 up for sale
    function listItem721(uint256 tokenId_, uint256 price_) external {
        require(_tokens[tokenId_].owner == msg.sender, "Not your token");

        token721.transferFrom(_tokens[tokenId_].owner, address(this), tokenId_);
        _tokens[tokenId_].listed = true;
        _price[tokenId_] = price_;
        emit ItemListed(tokenId_, price_);
    }

    // removes ERC721 from sale
    function cancel721(uint256 tokenId_) external {
        require(_tokens[tokenId_].owner == msg.sender, "Not your token");
        require(_tokens[tokenId_].listed == true, "Token not listed");

        token721.transferFrom(address(this), _tokens[tokenId_].owner, tokenId_);
        _tokens[tokenId_].listed = false;
    }

    // puts ERC1155 up for sale
    function listItem1155(uint256 tokenId_, uint256 price_) external {
        require(_tokens[tokenId_].owner == msg.sender, "Not your token");

        uint256 amount = token1155.balanceOf(_tokens[tokenId_].owner, tokenId_);

        token1155.safeTransferFrom(_tokens[tokenId_].owner, address(this), tokenId_, amount, "0x00");
        _tokens[tokenId_].listed = true;
        _price[tokenId_] = price_;
        emit ItemListed(tokenId_, price_);
    }

    // removes ERC1155 from sale
    function cancel1155(uint256 tokenId_) external {
        require(_tokens[tokenId_].owner == msg.sender, "Not your token");
        require(_tokens[tokenId_].listed, "Token not listed");

        uint256 amount = token1155.balanceOf(address(this), tokenId_);

        token1155.safeTransferFrom(address(this), _tokens[tokenId_].owner, tokenId_, amount, "0x00");
        _tokens[tokenId_].listed = false;
    }

    // function for buying items for ERC20 tokens
    function buyItem721(uint256 tokenId_) external {
        require(_tokens[tokenId_].listed, "Token not listed");

        token20.transferFrom(msg.sender, _tokens[tokenId_].owner, _price[tokenId_]);
        token721.transferFrom(address(this), msg.sender, tokenId_);

        _tokens[tokenId_].owner = msg.sender;
        _tokens[tokenId_].listed = false;
    }

    // function for buying items for ERC20 tokens
    function buyItem1155(uint256 tokenId_) external {
        require(_tokens[tokenId_].listed, "Token not listed");

        uint256 amount = token1155.balanceOf(address(this), tokenId_);

        token20.transferFrom(msg.sender, _tokens[tokenId_].owner, _price[tokenId_]);
        token1155.safeTransferFrom(address(this), msg.sender, tokenId_, amount, "0x00");

        _tokens[tokenId_].owner = msg.sender;
        _tokens[tokenId_].listed = false;
    }

    // puts the ERC721 token up for auction
    function listItemOnAuction721(uint256 tokenId_, uint256 minPrice_, uint256 expiration_) external {
        require(_tokens[tokenId_].owner == msg.sender, "Not your token");

        token721.transferFrom(_tokens[tokenId_].owner, address(this), tokenId_);
        
        _tokens[tokenId_].onAuction = true;
        _auctions[tokenId_].lastBid = minPrice_;
        _auctions[tokenId_].expirationTime = block.timestamp + expiration_;
        emit AuctionCreated(tokenId_);
    }

    // puts the ERC1155 token up for auction
    function listItemOnAuction1155(uint256 tokenId_, uint256 minPrice_, uint256 expiration_) external {
        require(_tokens[tokenId_].owner == msg.sender, "Not your token");

        uint256 amount = token1155.balanceOf(_tokens[tokenId_].owner, tokenId_);

        token1155.safeTransferFrom(_tokens[tokenId_].owner, address(this), tokenId_, amount, "0x00");
        _tokens[tokenId_].onAuction = true;
        
        _auctions[tokenId_].lastBid = minPrice_;
        _auctions[tokenId_].expirationTime = block.timestamp + expiration_;
        emit AuctionCreated(tokenId_);
    }

    // make bid on auction (works with ERC721 and ERC1155)
    function makeBid(uint256 tokenId_, uint256 amount_) external {
        require(_tokens[tokenId_].onAuction, "Token is not on auction");
        require(_auctions[tokenId_].expirationTime > block.timestamp, "Time out");
        require(_auctions[tokenId_].lastBid < amount_, "You should bid more than last bidder");
        
        token20.transferFrom(msg.sender, address(this), amount_);

        if(_auctions[tokenId_].lastBidder != address(0)) {
            token20.transfer(_auctions[tokenId_].lastBidder, _auctions[tokenId_].lastBid);
        }

        _auctions[tokenId_].lastBidder = msg.sender;
        _auctions[tokenId_].lastBid = amount_;
    }

    // finish ERC721 auction
    function finishAuction721(uint tokenId_) external {
        require(_tokens[tokenId_].onAuction, "Token is not on auction");
        require(block.timestamp > _auctions[tokenId_].expirationTime, "Not time yet");

        if(_auctions[tokenId_].lastBidder == address(0)) {
            token721.transferFrom(address(this), _tokens[tokenId_].owner, tokenId_);
        }
        else {
            token20.transfer(_tokens[tokenId_].owner, _auctions[tokenId_].lastBid);
            token721.transferFrom(address(this), _auctions[tokenId_].lastBidder, tokenId_);
            
            _tokens[tokenId_].owner = _auctions[tokenId_].lastBidder;
            _tokens[tokenId_].onAuction = false;
            _auctions[tokenId_].lastBidder = address(0);
        }
    }

    // finish ERC1155 auction
    function finishAuction1155(uint tokenId_) external {
        require(_tokens[tokenId_].onAuction, "Token is not on auction");
        require(block.timestamp > _auctions[tokenId_].expirationTime, "Not time yet");

        uint256 amount = token1155.balanceOf(address(this), tokenId_);

        if(_auctions[tokenId_].lastBidder == address(0)) {
            token1155.safeTransferFrom(address(this), _tokens[tokenId_].owner, tokenId_, amount, "0x00");
        }
        else {
            token20.transfer(_tokens[tokenId_].owner, _auctions[tokenId_].lastBid);
            token1155.safeTransferFrom(address(this), _auctions[tokenId_].lastBidder, tokenId_, amount, "0x00");
            _tokens[tokenId_].owner = _auctions[tokenId_].lastBidder;
            _tokens[tokenId_].onAuction = false;
            _auctions[tokenId_].lastBidder = address(0);
        }
    }

    // returns info about state of NFT
    function listed(uint256 tokenId_) external view returns (bool) {
        return _tokens[tokenId_].listed;
    }

    // returns info about price of NFT
    function price(uint256 tokenId_) external view returns (uint256) {
        require(_tokens[tokenId_].listed, "Token not listed");
        return _price[tokenId_];
    }

    // returns info about state of NFT
    function onAuction(uint256 tokenId_) external view returns (bool) {
        return _tokens[tokenId_].onAuction;
    }

    // returns info about last bid on auction
    function lastBid(uint256 tokenId_) external view returns (uint256) {
        return _auctions[tokenId_].lastBid;
    }
}