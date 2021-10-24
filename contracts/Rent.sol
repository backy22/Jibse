// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Rent {
    struct rent {
        uint256 startdate;
        uint256 enddate;
        address owner;
        uint256 price;
        bool deposit;
        string location;
    }

    Rent[] rents;

    function getAllRent() public view returns (Rent[] memory) {
        return rents;
    }
}