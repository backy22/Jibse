// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface IRent {
    
    enum State { 
        Active, // A contract has been created by the owner, waiting for a tenant.
        Locked, // The owner has chosen a tenant and is waiting to receive a deposit.
        Succeeded, // The tenent paid a deposit and the contract has successfully concluded.
        Inactive // A contract has been removed by the owner's request.
    }
    
    struct Contract {
        uint contractId;
        uint startDate;
        uint endDate;
        address owner;
        address tenant;
        string location;
        State state;
        uint price; // unit : wei (1 ether == 1e18 wei)
    }
   
   function getAllContracts() external view returns (Contract[] memory);
   function getContractById(uint id) external view returns (Contract memory);
   function getContractsByState(State state) external view returns (Contract[] memory);
   function getContractsByAddress(address _address) external view returns (Contract[] memory);
   function acceptApplicant(uint contractId, address _address) external;
   function applyForContract(uint contractId) external;
   function getApplicants(uint contractId) external view returns (address[] memory);
   function payDeposit(uint contractId) external payable;
}
