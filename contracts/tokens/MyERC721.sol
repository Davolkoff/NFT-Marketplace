// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyERC721 is ERC721, ERC721URIStorage {
    address private _marketplace;
    address private _owner;
    bool private _connected; // uses to connect marketplace only once

    modifier onlyMarketplace {
        require(_marketplace == msg.sender, "Not a marketplace");
        _;
    }

    modifier onlyOwner {
        require(msg.sender == _owner, "Not an owner");
        _;
    }

    constructor() ERC721("Marketplace ERC721 token", "MPT721") {
        _owner = msg.sender;
    }

    // mints token to specific address
    function mint(address to, uint256 tokenId, string memory uri) external onlyMarketplace {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // function created to test _burn
    function burn(uint256 tokenId) external onlyMarketplace {
        _burn(tokenId);
    }

    // returns tokenURI
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // allows smart contract of marketplace use this contract
    function connectMarketplace(address marketplace) external onlyOwner {
        require(_connected == false, "Marketplace already connected");
        _marketplace = marketplace;
        _connected = true;
    }

    // Without this function smart contract does not works
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}