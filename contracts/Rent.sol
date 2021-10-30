// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Rent
 * @dev manage rent lifecycle
 */
contract Rent {
    
    enum State { 
        Active, // A contract has been created by the owner, waiting for a tenant.
        Locked, // The owner has chosen a tenant and is waiting to receive a deposit.
        Accepted, // The tenent paid a deposit and the contract has successfully concluded.
        Inactive // A contract has been removed by the owner's request.
    }
    // enum Frequency { BiWeekly, Monthly, Yearly }
    // enum Currency { ETH, DAI }
    
    // struct Price {
    //    uint price;
    //    Currency currency;
    // }
    
    struct Contract {
        uint startDate;
        uint endDate;
        address owner;
        address tenant;
        string location;
        State state;
        uint price;
    }
    
    Contract[] contracts;
    mapping(address => uint[]) public contractMap; // user => contract_index
    
    // event for EVM logging
    event ContractCreated(uint indexed id);
    event ContractStateChanged(uint indexed id, State indexed oldState, State indexed newState);
    
    modifier isOwner(uint contractId) {
        require(msg.sender == contracts[contractId].owner, "Only owner can call this function.");
        _;
    }
    
    modifier isTenant(uint contractId) {
        require(msg.sender == contracts[contractId].tenant, "Only tenant can call this function.");
        _;
    }
    
    modifier inState(uint contractId, State state) {
        require(state != contracts[contractId].state, "Contract is not in valid state.");
        _;
    }
    
    modifier isValidPrice(uint contractId) {
        require(msg.value != contracts[contractId].price, "Price is incorrect.");
        _;
    }
    
    constructor() {
    }
    
    function addContract(
        uint startDate,
        uint endDate,
        string calldata location,
        uint price) 
        external 
    {
        require(startDate < endDate  ||
            endDate == 0, "End date should be null or later than start date.");
        
        uint id = contracts.length;
        contracts.push(Contract({
            owner: msg.sender,
            tenant: address(0),
            startDate: startDate,
            endDate: endDate,
            location: location,
            price: price,
            state: State.Active
        }));
        contractMap[msg.sender].push(id);
        
        emit ContractCreated(id);
    }

    function getContracts(State state) 
        external 
        view 
        returns (Contract[] memory) 
    {
        uint count = 0;
        for(uint i=0; i<contracts.length; i++) {
            if(contracts[i].state == state) {
                count++;
            }
        }
        
        Contract[] memory result = new Contract[](count);
        uint j = 0;
        for(uint i=0; i<contracts.length; i++) {
            if(contracts[i].state == state) {
                result[j] = contracts[i];
                j++;
            }
        }
        
        return result;
    }
    
    function getContracts(address _address) 
        external
        view 
        returns (Contract[] memory) 
    {
        uint[] memory addresses = contractMap[_address];
        Contract[] memory result = new Contract[](addresses.length);
        
        for(uint i=0; i<addresses.length; i++) {
            result[i] = contracts[addresses[i]];
        }
        return result;
    }
    
    function setUpAutoTransfer(uint contractId) 
        external
        isTenant(contractId)
        inState(contractId, State.Accepted)
        returns (bool)
    {
        return true;
    }
    
    function pay(uint contractId)
        external
        isTenant(contractId)
        inState(contractId, State.Accepted)
        returns (bool)
    {
        return true;
    }
    
}
