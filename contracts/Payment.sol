// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

import "hardhat/console.sol";
import "./IRent.sol";
import "./Rent.sol";

contract Payment is KeeperCompatibleInterface {
    
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
    address[] autoPaymentSetups;
    
    mapping(address => uint[]) userAddressBillMap; // user address => bill IDs
    mapping(uint => uint[]) contractBillMap; // contract IDs => bill IDs
    
    modifier isContractValid(uint contractId) {
        IRent.Contract memory _contract = rent.getContractById(contractId);
        require(_contract.state == IRent.State.Succeeded, "The contract is in an invalid state.");
        _;
    }
    
    // events
    event BillCreated(uint indexed id);
    event BillPaid(uint indexed id);

    constructor() {
        rent = Rent(rentContract);
    }
    
    function setAutoPayment(address _address, bool autoPayment) 
        external
    {
        for(uint i=0; i<autoPaymentSetups.length; i++)
        {
            if(autoPaymentSetups[i] == _address) {
                if(!autoPayment) {
                    delete autoPaymentSetups[i];
                }
                return;
            }
        }
        if(autoPayment) {
            autoPaymentSetups.push(_address);
        }
    }
    
    function isAutoPaymentSetup(address _address) 
        external
        view
        returns(bool)
    {
        for(uint i=0; i<autoPaymentSetups.length; i++)
        {
            if(autoPaymentSetups[i] == _address) {
                return true;
            }
        }
        return false;
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
            payer: _contract.tenant
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
        public
        payable
    {
        require(bills[billId].state == State.Pending, "This bill was already paid or cancelled.");
        require(bills[billId].payer.balance >= bills[billId].price, "Payer has not enough balance.");
        
        bills[billId].state = State.Paid;
        payable(bills[billId].payee).transfer(bills[billId].price);
        emit BillPaid(billId);
    }
    
    function checkUpkeep(bytes calldata /* checkData */) 
        external
        override
        returns (bool upkeepNeeded, bytes memory performData) 
    {
        upkeepNeeded = autoPaymentSetups.length > 0;
        // return (upkeepNeeded, abi.encode(autoPaymentSetups));
    }

    function performUpkeep(bytes calldata performData) 
        external
        override
    {
        // address[] _addresses = abi.decode(performData, (address[]));
        for(uint i=0; i<autoPaymentSetups.length; i++) {
            address user = autoPaymentSetups[i];
            uint lastBillId = userAddressBillMap[user][userAddressBillMap[user].length-1];
            if(bills[lastBillId].state == State.Pending) {
                payBill(lastBillId);
            }
        }
    }   
    
}
