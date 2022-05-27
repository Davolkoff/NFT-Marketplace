// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

interface IMyERC721 {
    function mint(address to, uint256 tokenId, string memory uri) external;

    function transferFrom(address from, address to, uint256 tokenId) external;
}