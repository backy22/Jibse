// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";
import "./IRent.sol";
import "./Rent.sol";

contract Payment {
    
    enum State { 
        Pending,
        Paid,
        Cancelled
    }
    
    struct Bill {
        uint billId;
        uint contractId;
        uint price;
        uint billingDate;
        address payee;
        address payer;
        State state;
    }
    
    IRent internal rent;
    address internal rentContract = 0x337fECBC7BE3312a9d65c947072C4A1355D99C75;
    
    Bill[] bills;
    mapping(address => uint[]) userAddressBillMap; // user address => bill IDs
    mapping(uint => uint[]) contractBillMap; // contract ID => bill IDs

    // events
    event BillCreated(uint indexed id);
    event BillPaid(uint indexed id);

    constructor() {
        rent = Rent(rentContract);
    }
    
    function createBill(uint contractId) external {
        IRent.Contract memory _contract = rent.getContractById(contractId);

        require(block.timestamp < _contract.endDate, "The contract has already ended.");
        require(_contract.state == IRent.State.Succeeded, "The contract is in an invalid state.");

        uint billingDate = _contract.startDate + (1 + contractBillMap[contractId].length) * 30 days;
        
        uint id = bills.length;
        bills.push(Bill({
            billId: id,
            contractId: contractId,
            price: _contract.price,
            billingDate: billingDate,
            state: State.Pending,
            payee: _contract.owner,
            payer: address(0)
        }));

        contractBillMap[contractId].push(id);
        userAddressBillMap[_contract.tenant].push(id);

        emit BillCreated(id);
    }
    
    function getBillsByAddress(address _address)
        external
        view
        returns (Bill[] memory)
    {
        uint[] memory addresses = userAddressBillMap[_address];
        Bill[] memory result = new Bill[](addresses.length);
        
        for(uint i=0; i<addresses.length; i++) {
            result[i] = bills[addresses[i]];
        }
        
        return result;
    }

    function getBillsByContractId(uint contractId)
        external
        view
        returns (Bill[] memory)
    {
        uint[] memory _bills = contractBillMap[contractId];
        Bill[] memory result = new Bill[](_bills.length);
        
        for(uint i=0; i<_bills.length; i++) {
            result[i] = bills[_bills[i]];
        }
        
        return result;
    }
    
    function payBill(uint billId)
        external
        payable
    {
        require(bills[billId].state != State.Paid, "This bill was already paid.");
        //require(bills[billId].price == msg.value, "The price is incorrect.");
        bills[billId].state = State.Paid;
        bills[billId].payer = msg.sender;
        payable(bills[billId].payee).transfer(msg.value);

        emit BillPaid(billId);
    }
    
}
