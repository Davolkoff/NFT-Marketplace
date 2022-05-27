// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

interface IMyERC1155 {
    function mint(
        address _recipient, 
        uint256 _tokenId, 
        uint256 _amount, 
        string memory _uri
    ) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;

    function balanceOf(
        address account, 
        uint256 id
    ) external view returns (uint256);
}