// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "hardhat/console.sol";

/**
 * @title Score
 * @dev manage score and review
 */

contract Score {
    mapping(address => uint) scoreMap; // user address => score

    struct Review {
        uint roomId;
        address tenant;
        uint star;
        string review;
    }

    Review[] reviews;
    mapping(address => uint[]) reviewMap; // user address -> reviewIDs

    function getScore(address _address) 
        public
        view
        returns (uint) 
    {
        return scoreMap[_address];
    }

    function calculateTenantScore(address _address)
        public
        view
    {
        // get current score if exists
        uint score = getScore(_address) | 500;
        console.log('score--', score);
        
        // get most current payment and check it's paid or over due or not paid // get from payment contract
        
        // get amount owed = price of the active contracts + get length of history = sum of the duration of all contract
        Contract[] memory contracts = getContracts(_address);
        uint amount = 0;
        uint duration = 0;
        for(uint i=0; i < contracts.length; i++) {
            duration += contracts[i].endDate - contracts[i].startDate;
            if (contracts[i].state == State.Active) {
                amount += contracts[i].price;
            }
        }

        console.log('amount', amount);
        console.log('duration', duration);

        // calculate and save in the scoreMap
        uint result = score + amount * 10 + duration * 1/1000;
        scoreMap[_address] = result;
    }

    function addReview(uint _roomId, uint _star, string _review) public view{
        uint id = contracts.length;
        reviews.push(Review({
            roomId: _roomId,
            tenant: msg.sender,
            star: _star,
            review: _review
        }));
    }
}