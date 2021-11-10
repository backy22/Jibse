import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import Nav from '../components/nav'
import { ethers } from 'ethers';
import rent from '../abi/Rent.json'
import score from '../abi/Score.json'
import payment from '../abi/Payment.json'
import { RENT_CONTRACT_ADDRESS,  SCORE_CONTRACT_ADDRESS, PAYMENT_CONTRACT_ADDRESS } from '../utils/constants'
import { RentState } from '../utils/enum';

const defaultContext = {
    account: null,
    rentContract: null,
    scoreContract: null,
    paymentContract: null,
    myRents: [],
    appliedRents: [],
    activeRents: []
}

export const AuthContext = React.createContext(defaultContext)

const AuthWrapper = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [connectingWallet, setConnectingWallet] = useState(false);
    const [rentContract, setRentContract] = useState(null);
    const [, setScoreContract] = useState(null);
    const [, setPaymentContract] = useState(null);
    const [, setActiveRents] = useState([]);
    const [myRents, setMyRents] = useState([]);
    const [appliedRents, setAppliedRents] = useState([])

  // get account
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window;
  
        if (!ethereum) {
          console.log('Make sure you have MetaMask!');
          return;
        } else {
          console.log('We have the ethereum object', ethereum);
  
          const accounts = await ethereum.request({ method: 'eth_accounts' });
  
          if (accounts.length !== 0) {
            const account = accounts[0];
            console.log('Found an authorized account:', account);
            setCurrentAccount(account);
            defaultContext.account = account;
          } else {
            console.log('No authorized account found');
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  // get all contracts
  useEffect(() => {
    const getContracts = () => {
      const { ethereum } = window;
        
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
  
        const rentContract = new ethers.Contract(
          RENT_CONTRACT_ADDRESS,
          rent.abi,
          signer
        );
  
        setRentContract(rentContract);
        defaultContext.rentContract = rentContract;
  
        const scoreContract = new ethers.Contract(
          SCORE_CONTRACT_ADDRESS,
          score.abi,
          signer
        );
  
        setScoreContract(scoreContract);
        defaultContext.scoreContract = scoreContract;
  
        const paymentContract = new ethers.Contract(
          PAYMENT_CONTRACT_ADDRESS,
          payment.abi,
          signer
        );
  
        setPaymentContract(paymentContract);
        defaultContext.paymentContract = paymentContract;
      } else {
        console.log('Ethereum object not found');
      }
    }

    getContracts();
  }, [currentAccount])

  // get myRents & get events
  useEffect(() => {
    const getMyRents = async() => {
      try {
        if (rentContract) {
          const myRentsTxn = await rentContract.getContractsByAddress(currentAccount)
          let myRentArray = []
          for(let rent of myRentsTxn) {
            myRentArray.push({
              contractId: rent.contractId.toNumber(),
              location: rent.location,
              startDate: new Date(rent.startDate * 1000),
              endDate: new Date(rent.endDate * 1000),
              owner: rent.owner,
              tenant: rent.tenant,
              price: rent.price.toNumber(),
              state: rent.state
            })
          }
          setMyRents(myRentArray)
          defaultContext.myRents = myRentArray;
        }
      } catch (error) {
        console.log('getMyRent Error: ', error)
      }
    }

    if (currentAccount && rentContract) {
      getMyRents();

      const onContractCreated = async(id) => {
        console.log('contract created-----', id)
        getMyRents();
      }

      const onAppliedContract = async(id, applicant) => {
        console.log('applied contract----', id, applicant)
        getMyRents();
      }

      const onContractLocked = async(id, tenant) => {
        console.log('contract locked----', id, tenant)
        getMyRents();
      }

      const onDepositReceived = async(id, owner, tenant) => {
        console.log('deposit received-----', id, owner, tenant)
        getMyRents();
      }

      rentContract.on('ContractCreated', onContractCreated);
      rentContract.on('AppliedContract', onAppliedContract);
      rentContract.on('ContractLocked', onContractLocked);
      rentContract.on('DepositReceived', onDepositReceived);

      return () => {
        rentContract.off('ContractCreated', onContractCreated);
        rentContract.off('AppliedContract', onAppliedContract);
        rentContract.off('ContractLocked', onContractLocked);
        rentContract.off('DepositReceived', onDepositReceived);
      }
    }
  }, [rentContract]);

  // get applied rents
  useEffect(() => {
    const getAppliedRents = async() => {
      try {
          const appliedRentTxn = await rentContract.getAppliedContracts(currentAccount, { gasLimit: 1000000 })
          const appliedRentArray = []
          const myRentIds = myRents.map((rent) => rent.contractId)
          for(let appliedRent of appliedRentTxn) {
            if(!myRentIds.includes(appliedRent.contractId.toNumber())) {
              appliedRentArray.push({
                  contractId: appliedRent.contractId.toNumber(),
                  location: appliedRent.location,
                  startDate: new Date(appliedRent.startDate * 1000),
                  endDate: new Date(appliedRent.endDate * 1000),
                  owner: appliedRent.owner,
                  tenant: appliedRent.tenant,
                  price: appliedRent.price.toNumber(),
                  state: appliedRent.state
              })
            }
          }
          setAppliedRents(appliedRentArray)
          defaultContext.appliedRents = appliedRentArray;
      } catch (error) {
          console.log('Get applied rents Error: ', error)
      }
    }

    if (currentAccount && rentContract) {
      getAppliedRents();
    }
  }, [rentContract, myRents]);

  // get active rents
  useEffect(() => {
    const getActiveRents = async() => {
      try {
        const activeRentsTxn = await rentContract.getContractsByState(RentState.Active)
        let activeRentArray = []
        let appliedRentContractIds = appliedRents.map((rent) => rent.contractId);
        for(let rent of activeRentsTxn) {
          if (!appliedRentContractIds.includes(rent.contractId.toNumber()) && rent.owner.toLowerCase() !== currentAccount && rent.tenant.toLowerCase() !== currentAccount) {
            activeRentArray.push({
              contractId: rent.contractId.toNumber(),
              location: rent.location,
              startDate: new Date(rent.startDate * 1000),
              endDate: new Date(rent.endDate * 1000),
              owner: rent.owner,
              price: rent.price.toNumber(),
              state: rent.state
            })
          }
        }
        setActiveRents(activeRentArray)
        defaultContext.activeRents = activeRentArray
      } catch (error) {
        console.log('getActiveRent Error: ', error)
      }
    }  

    if (currentAccount && rentContract) {
      getActiveRents();
    }
  }, [rentContract, appliedRents])

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
      setConnectingWallet(true)

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
        <Head>
            <title>Jibse</title>
            <meta name="description" content="Jibse" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Nav currentAccount={currentAccount} connectWalletAction={connectWalletAction} connectingWallet={connectingWallet} />

        {children}
    </div>
  )
}

export default AuthWrapper