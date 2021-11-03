// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "hardhat/console.sol";
import "./Rent.sol";

/**
 * @title Score
 * @dev manage score and review
 */

contract Score is Rent {

    address rent_address = 0xf6395B9f0B5f6Ba3e58e69e316B9251e3AC601a8;

    mapping(address => uint) scoreMap; // user address => score

    struct Review {
        uint reviewId;
        uint contractId;
        address tenant;
        uint star;
        string review;
    }

    Review[] reviews;
    mapping(uint => uint[]) reviewMap; // contractId -> reviewIDs

    constructor() {
    }

    function getScore(address _address) 
        public
        view
        returns (uint) 
    {
        return scoreMap[_address];
    }

    function calculateTenantScore(address _address)
        public
        returns (uint)
    {
        // get current score if exists
        uint score = getScore(_address) | 500;
        
        // get most current payment and check it's paid or over due or not paid // get from payment contract
        
        // get amount owed = price of the active contracts + get length of history = sum of the duration of all contract
        Rent rent = Rent(rent_address);
        Contract[] memory contracts = rent.getContractsByAddress(_address);
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
        return result;
    }

    function addReview(uint _contractId, uint _star, string memory _review) public {
        uint id = reviews.length;
        reviews.push(Review({
            reviewId: id,
            contractId: _contractId,
            tenant: msg.sender,
            star: _star,
            review: _review
        }));
        reviewMap[_contractId].push(id);
    }

    function getReviews(uint _contractId) external view returns (Review[] memory){
        uint[] memory reviewIds = reviewMap[_contractId];
        Review[] memory result = new Review[](reviewIds.length);

        for(uint i=0; i< reviewIds.length; i++) {
            result[i] = reviews[reviewIds[i]];
        }
        return result;
    }
}