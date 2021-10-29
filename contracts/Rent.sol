// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Rent
 * @dev manage rent lifecycle
 */
contract Rent {

    struct Place {
        uint id;
        address owner;
        string location;
    }
    
    struct Price {
        uint price;
        Currency currency;
    }
    
    struct Contract {
        uint placeId;
        uint startDate;
        uint endDate;
        address tenant;
        State state;
        Frequency frequency;
        Price price;
    }
    
    Place[] places;
    mapping(placeId, Contract[]) contractsByPlace;
    mapping(address => Contract[]) contractsByAddress;
    
    enum State { Active, Locked, Accepted, Inactive }
    enum Frequency { Weekly, BiWeekly, Monthly, Yearly }
    enum Currency { ETH, DAI }
    
    // event for EVM logging
    event ChangeOwner(uint indexed placeId, address indexed oldOwner, address indexed newOwner);
    event ChangedContractState(uint indexed id, State indexed oldState, State indexed newState);
    
    // modifier to check if caller is owner
    modifier isOwner(uint placeId) {
        require(msg.sender == places[placeId].owner, "Only owner can call this function.");
        _;
    }
    
    // modifier to check if caller is not owner
    modifier isNotOwner(uint placeId)) {
        require(msg.sender != places[placeId].owner, "Owner can't call this function.");
        _;
    }
    
    modifier isOwnerOrTenant(uint contractId) {
        require(msg.sender == contracts[contractId].owner ||
        msg.sender == contracts[contractId].tenent
        , "Owner can't call this function.");
        _;
    }
    
    
    /**
     * @dev 
     */
    constructor() {
    }

    /**
     * @dev Change owner
     * @param newOwner address of new owner
     */
    function changeOwner(uint placeId, address newOwner) 
        public 
        isOwner(placeId) 
    {
        emit ChangeOwner(place_id, places[place_id].owner, newOwner);
        places[place_id].owner = newOwner;
    }

    /**
     * @dev Return owner address 
     * @return address of owner
     */
    function getContract(address sender) 
        external 
        isOwnerOrTenant(contractId)
        view 
        returns (address) {
        return contracts[contractId];
    }
}
