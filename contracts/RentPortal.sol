// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract RentPortal {
    uint256 totalRooms;
    uint256 totalRents;

    struct Rooms {
        uint256 roomId;
        address owner;
        string location;
    }

    Rooms[] defaultRooms;

    struct Rents {
        uint256 rentId;
        uint256 roomId;
        uint256 timestamp;
        uint256 startdate;
        uint256 enddate;
        uint256 price;
        address tenant;
    }

    Rents[] defaultRents;

    mapping(uint256 => Rooms) public ownerRooms;
    mapping(uint256 => Rents) public roomRents;

    constructor(
        string[] memory roomLocations,
        uint256[] memory roomIds,
        uint256[] memory startDates,
        uint256[] memory endDates,
        uint256[] memory prices
    )
    {
        console.log('roomLoations', roomLocations.length);
        for(uint i = 0; i < roomLocations.length; i += 1) {
            defaultRooms.push(Rooms({
                roomId: i,
                owner: msg.sender,
                location: roomLocations[i]
            }));

            Rooms memory c = defaultRooms[i];

            console.log("Done initializing rooms", c.roomId, c.owner, c.location);
        }


        for(uint i = 0; i < roomIds.length; i += 1) {
            defaultRents.push(Rents({
                rentId: i,
                roomId: roomIds[i],
                timestamp: block.timestamp,
                startdate: startDates[i],
                enddate: endDates[i],
                price: prices[i],
                tenant: msg.sender
            }));

            Rents memory t = defaultRents[i];

            console.log("Done initializing rents", t.rentId, t.roomId, t.startdate);
        }
    }
 
    function getAllRooms() public view returns (Rooms[] memory) {
        return defaultRooms;
    }

    function getAllRents() public view returns (Rents[] memory) {
        return defaultRents;
    }

    function getRentByRentId(uint256 _rentId) private {
    }

    function getRentByOwner(uint256 _owner) public {
    }

    function applyRent(uint256 _rentId) public {
    }

    function acceptRent(uint256 _rentId) public {
    }
}