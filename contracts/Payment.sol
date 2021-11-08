// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./IRent.sol";
import "./Rent.sol";

import "https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary/blob/master/contracts/BokkyPooBahsDateTimeLibrary.sol";

contract Payment {
    
    enum State { 
        Pending,
        Paid,
        Cancelled
    }
    
    struct Bill {
        uint id;
        uint contractId;
        uint price;
        uint billingDate;
        address payee;
        address payer;
        State state;
    }
    
    IRent internal rent;
    address internal rentContract = 0x6FddFDbEf1bb65a137E3D17B987EBB35dA9AAb98;
    
    Bill[] bills;
    mapping(address => uint[]) billMap; // user address => bill IDs
    
    constructor() {
        rent = Rent(rentContract);
    }
    
    function createBill(uint contractId) external {
        IRent.Contract memory _contract = rent.getContractById(contractId);
        uint currentTimestamp = block.timestamp * 1000;
        require(currentTimestamp < _contract.endDate, "The contract has already ended.");
        require(_contract.state == IRent.State.Succeeded, "The contract is in an invalid state.");
        
        (uint currentYear, uint currentMonth, uint currentDay) = BokkyPooBahsDateTimeLibrary.timestampToDate(currentTimestamp);
        (uint contractYear, uint contractMonth, uint contractDay) = BokkyPooBahsDateTimeLibrary.timestampToDate(_contract.startDate);
        uint billingDate = BokkyPooBahsDateTimeLibrary.timestampFromDate(currentYear, currentMonth, contractDay);
        
        uint id = bills.length;
        bills.push(Bill({
            id: id,
            contractId: contractId,
            price: _contract.price,
            billingDate: billingDate,
            state: State.Pending,
            payee: _contract.owner,
            payer: address(0)
        }));
        billMap[_contract.tenant].push(id);
    }
    
    function getBillsByAddress(address _address)
        external
        view
        returns (Bill[] memory)
    {
        uint[] memory addresses = billMap[_address];
        Bill[] memory result = new Bill[](addresses.length);
        
        for(uint i=0; i<addresses.length; i++) {
            result[i] = bills[addresses[i]];
        }
        
        return result;
    }
    
    function payBill(uint billId)
        external
        payable
    {
        require(bills[billId].state != State.Paid, "This bill was already paid.");
        require(bills[billId].price == msg.value, "The price is incorrect.");
        bills[billId].state = State.Paid;
        bills[billId].payer = msg.sender;
        payable(bills[billId].payee).transfer(msg.value);
    }
    
}
