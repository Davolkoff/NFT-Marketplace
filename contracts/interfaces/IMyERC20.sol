//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IMyERC20 {

    function transfer(address _to, uint256 _value) external returns (bool);

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool);

}