// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MyERC1155 is ERC1155 {
    string private _name;
    string private _symbol;
    address private _marketplace;
    address private _owner;
    bool private _connected; // uses to connect marketplace only once

    mapping(uint256 => string) private _uris;

    modifier onlyMarketplace {
        require(_marketplace == msg.sender, "Not a marketplace");
        _;
    }

    modifier onlyOwner {
        require(_owner == msg.sender, "Not an owner");
        _;
    }

    constructor(string memory name_, string memory symbol_) ERC1155("") {
        _name = name_;
        _symbol = symbol_;
        _owner = msg.sender;
    }

    // returns name of ERC1155 token
    function name() external view returns (string memory) {
        return _name;
    }

    // returns symbol of ERC1155 token
    function symbol() external view returns (string memory) {
        return _symbol;
    }

    // returns uri of specific token
    function uri(uint tokenId) override public view returns (string memory) {
        return (_uris[tokenId]);
    }

    // mints ERC1155 tokens to recipient
    function mint(address _recipient, uint256 _tokenId, uint256 _amount, string memory _uri) public onlyMarketplace {
        _mint(_recipient, _tokenId, _amount, "");
        _uris[_tokenId] = _uri;
    }

    // allows smart contract of marketplace use this contract
    function connectMarketplace(address marketplace) external onlyOwner {
        require(_connected == false, "Marketplace already connected");
        _marketplace = marketplace;
        _connected = true;
    }
}