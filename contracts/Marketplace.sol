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
    mapping(uint256 => uint256) private _prices; // prices of NFT on sale
    mapping(address => uint256) private _lastBidBalances; // returned bids

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

    // creates NFT (0 - ERC721, 1 - ERC1155)
    function createItem(bool standard_, address recipient_, uint256 amount_, string memory metadata_) external {
        if (standard_){
            token1155.mint(recipient_, tokenIdCounter, amount_, metadata_);
            //_tokens[tokenIdCounter].standard = true;
        }
        else {
            token721.mint(recipient_, tokenIdCounter, metadata_);
        }
        _tokens[tokenIdCounter].owner = recipient_;
        emit ItemCreated(false, tokenIdCounter);
        tokenIdCounter += 1;
    }

    // puts NFT up for sale
    function listItem(bool standard_, uint256 tokenId_, uint256 price_) external {
        require(_tokens[tokenId_].owner == msg.sender, "Not your token");

        if (standard_) {
            uint256 amount = token1155.balanceOf(_tokens[tokenId_].owner, tokenId_);
            token1155.safeTransferFrom(_tokens[tokenId_].owner, address(this), tokenId_, amount, "0x00");
        }
        else {
            token721.transferFrom(_tokens[tokenId_].owner, address(this), tokenId_);
        }
        _tokens[tokenId_].listed = true;
        _prices[tokenId_] = price_;
        emit ItemListed(tokenId_, price_);
    }

    // removes NFT from sale (0 - ERC721, 1 - ERC1155)
    function cancel(bool standard_, uint256 tokenId_) external {
        require(_tokens[tokenId_].owner == msg.sender, "Not your token");
        require(_tokens[tokenId_].listed == true, "Token not listed");

        if (standard_) {
            uint256 amount = token1155.balanceOf(address(this), tokenId_);
            token1155.safeTransferFrom(address(this), _tokens[tokenId_].owner, tokenId_, amount, "0x00");
        }
        else {
            token721.transferFrom(address(this), _tokens[tokenId_].owner, tokenId_);
        }
        _tokens[tokenId_].listed = false;
    }

    // function for buying NFT for ERC20 tokens (0 - ERC721, 1 - ERC1155)
    function buyItem(bool standard_, uint256 tokenId_) external {
        require(_tokens[tokenId_].listed, "Token not listed");

        token20.transferFrom(msg.sender, _tokens[tokenId_].owner, _prices[tokenId_]);
        
        if (standard_) {
            uint256 amount = token1155.balanceOf(address(this), tokenId_);
            token1155.safeTransferFrom(address(this), msg.sender, tokenId_, amount, "0x00");
        }
        else {
            token721.transferFrom(address(this), msg.sender, tokenId_);
        }

        _tokens[tokenId_].owner = msg.sender;
        _tokens[tokenId_].listed = false;
    }

    // puts the NFT up for auction (0 - ERC721, 1 - ERC1155)
    function listItemOnAuction(bool standard_, uint256 tokenId_, uint256 minPrice_, uint256 expiration_) external {
        require(_tokens[tokenId_].owner == msg.sender, "Not your token");

        if (standard_) {
            uint256 amount = token1155.balanceOf(_tokens[tokenId_].owner, tokenId_);
            token1155.safeTransferFrom(_tokens[tokenId_].owner, address(this), tokenId_, amount, "0x00");
        }
        else {
            token721.transferFrom(_tokens[tokenId_].owner, address(this), tokenId_);
        }
        
        _tokens[tokenId_].onAuction = true;
        _auctions[tokenId_].lastBid = minPrice_;
        _auctions[tokenId_].expirationTime = block.timestamp + expiration_;
        emit AuctionCreated(tokenId_);
    }

    // make bid on auction (works with ERC721 and ERC1155 without bool)
    function makeBid(uint256 tokenId_, uint256 amount_) external {
        uint256 totalBid = amount_ + _lastBidBalances[msg.sender];

        require(_tokens[tokenId_].onAuction, "Token is not on auction");
        require(_auctions[tokenId_].expirationTime > block.timestamp, "Time out");
        require(totalBid > _auctions[tokenId_].lastBid, "You should bid more than last bidder");
        
        token20.transferFrom(msg.sender, address(this), totalBid);

        if(_auctions[tokenId_].lastBidder != address(0)) {
            _lastBidBalances[_auctions[tokenId_].lastBidder] += _auctions[tokenId_].lastBid;
        }

        _auctions[tokenId_].lastBidder = msg.sender;
        _auctions[tokenId_].lastBid = totalBid;
    }

    // withdraw canceled bids
    function withdrawCancelledBids() external {
        token20.transfer(msg.sender, _lastBidBalances[msg.sender]);
    }

    // finish ERC721 auction
    function finishAuction(bool standard_, uint tokenId_) external {
        require(_tokens[tokenId_].onAuction, "Token is not on auction");
        require(block.timestamp > _auctions[tokenId_].expirationTime, "Not time yet");

        uint256 amount; // amount of tokens if standard is ERC1155
        if (standard_) {
            amount = token1155.balanceOf(address(this), tokenId_);
        }
        if (_auctions[tokenId_].lastBidder == address(0)) {
            if (standard_) {
                token1155.safeTransferFrom(address(this), _tokens[tokenId_].owner, tokenId_, amount, "0x00");
            }
            else {
                token721.transferFrom(address(this), _tokens[tokenId_].owner, tokenId_);
            }
        }
        else {
            token20.transfer(_tokens[tokenId_].owner, _auctions[tokenId_].lastBid);
            
            if (standard_) {
                token1155.safeTransferFrom(address(this), _auctions[tokenId_].lastBidder, tokenId_, amount, "0x00");
            }
            else {
                token721.transferFrom(address(this), _auctions[tokenId_].lastBidder, tokenId_);
            }
            
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
        return _prices[tokenId_];
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