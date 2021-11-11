// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "hardhat/console.sol";
import "./Rent.sol";
import "./IRent.sol";

/**
 * @title Score
 * @dev manage score and review
 */

contract Score {

    IRent internal rent;
    address internal rent_address = 0xfCD67F13049Df22Be4bA9315551269e531189B66; // everytime Rent contract is deployed, this should be updated.

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

    // events
    event TenantScoreCalculated(address indexed tenant, uint indexed score);
    event ReviewAdded(uint indexed id);
    event OwnerScoreCalculated(address indexed owner, uint indexed score);

    modifier isAdmin() {
        require(msg.sender == 0x684367aa423f4c1446d99ae234E172AE1BA2842c, "Only admin user can call this function.");
        _;
    }

    constructor() {
        rent = Rent(rent_address);
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
        isAdmin()
    {
        // get current score. Otherwise, default score is 500
        uint score = getScore(_address) | 500;
        console.log('score', score);
        
        // get most current payment and check it's paid or over due or not paid // get from payment contract
        
        // get amount owed = price of the active contracts + get length of history = sum of the duration of all contract
        IRent.Contract[] memory contracts = rent.getContractsByAddress(_address);
        uint amount = 0;
        uint duration = 0;
        for(uint i=0; i < contracts.length; i++) {
            duration += contracts[i].endDate - contracts[i].startDate;
            if (contracts[i].state == IRent.State.Active) {
                amount += contracts[i].price;
            }
        }

        console.log('amount', amount);
        console.log('duration', duration);

        // calculate and save in the scoreMap
        uint result = score + amount * 10 + duration * 1/1000000;
        console.log('result', result);
        scoreMap[_address] = result;

        emit TenantScoreCalculated(_address, result);
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

        emit ReviewAdded(_contractId);
    }

    function getReviews(uint _contractId) public view returns (Review[] memory){
        uint[] memory reviewIds = reviewMap[_contractId];
        Review[] memory result = new Review[](reviewIds.length);

        for(uint i=0; i< reviewIds.length; i++) {
            result[i] = reviews[reviewIds[i]];
        }
        return result;
    }

    function calculateOwnerScore(address _address) public isAdmin() {
        // get current score Otherwise, default score is 500
        uint score = getScore(_address) | 500;

        // get all contracts
        IRent.Contract[] memory contracts = rent.getContractsByAddress(_address);

        // get reviews and calculate stars & duration & price
        uint count = 0;
        uint starSum = 0;
        uint duration = 0;
        uint priceSum = 0;
        for (uint i=0; i < contracts.length; i++) {
            Review[] memory reviews = getReviews(contracts[i].contractId);
            duration += contracts[i].endDate - contracts[i].startDate;
            if (contracts[i].endDate > block.timestamp) {
                priceSum += contracts[i].price;
            }
            for (uint k=0; k < reviews.length; k++) {
                starSum += reviews[i].star;
                count++;
            }
        }

        uint averageStar = starSum / count;
        uint starScore = 0;
        if (averageStar > 4) {
            starScore = 10;
        } else if (averageStar > 3) {
            starScore = 5;
        }

        console.log('starScore', starScore);
        console.log('duration', duration);
        console.log('priceSum', priceSum);

        // calculate and save in the scoreMap
        uint result = score + starScore + duration * 1/1000000 + priceSum * 10;
        scoreMap[_address] = result;

        emit OwnerScoreCalculated(_address, result);
    }
}