import Head from 'next/head'
import React, { useState, useEffect, createContext } from 'react'
import Nav from '../components/nav'
import { ethers } from 'ethers';
import rent from '../abi/Rent.json'
import score from '../abi/Score.json'
import payment from '../abi/Payment.json'
import { RENT_CONTRACT_ADDRESS,  SCORE_CONTRACT_ADDRESS, PAYMENT_CONTRACT_ADDRESS } from '../utils/constants'
import { RentState } from '../utils/enum';
import { isSameAddresses } from '../utils/is-same-addresses';

const defaultContext = {
    account: null,
    rentContract: null,
    scoreContract: null,
    paymentContract: null,
    allRents: [],
    myRents: [],
    appliedRents: [],
    activeRents: []
}

export const AuthContext = createContext(defaultContext)

const AuthWrapper = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [connectingWallet, setConnectingWallet] = useState(false);
    const [rentContract, setRentContract] = useState(null);
    const [scoreContract, setScoreContract] = useState(null);
    const [paymentContract, setPaymentContract] = useState(null);
    const [allRents, setAllRents] = useState([]);
    const [activeRents, setActiveRents] = useState([]);
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
            const act = accounts[0];
            console.log('Found an authorized account:', act);
            setAccount(act);
            defaultContext.account = act;
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
  }, [account])

  // get all rents & get events
  useEffect(() => {
    const getAllRents = async() => {
      try {
        const allRentsTxn = await rentContract.getAllContracts()
        let allRentsArray = []
        for(let rent of allRentsTxn) {
          allRentsArray.push({
            contractId: rent.contractId.toNumber(),
            location: rent.location,
            startDate: new Date(rent.startDate * 1000),
            endDate: new Date(rent.endDate * 1000),
            owner: rent.owner,
            tenant: rent.tenant,
            price: ethers.utils.formatEther(rent.price),
            state: rent.state
          })
        }
        setAllRents(allRentsArray)
        defaultContext.allRents = allRentsArray
      } catch (error) {
        console.log('getAllRents Error: ', error)
      }
    }

    if (account && rentContract) {
      getAllRents();

      const onContractCreated = async(id) => {
        console.log('contract created-----', id)
        getAllRents();
      }

      const onAppliedContract = async(id, applicant) => {
        console.log('applied contract----', id, applicant)
        getAllRents();
      }

      const onContractLocked = async(id, tenant) => {
        console.log('contract locked----', id, tenant)
        getAllRents();
      }

      const onDepositReceived = async(id, owner, tenant) => {
        console.log('deposit received-----', id, owner, tenant)
        getAllRents();
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

  // get myRents & applied rents
  useEffect(() => {
    const filteredMyRents = allRents.filter((rent) => (isSameAddresses(account, rent.tenant) && rent.state === RentState.Succeeded) || isSameAddresses(account, rent.owner))
    setMyRents(filteredMyRents)
    defaultContext.myRents = filteredMyRents;

    const getAppliedRents = async() => {
      try {
          const appliedRentIdsTxn = await rentContract.getAppliedContractIds(account, { gasLimit: 1000000 })
          const appliedRentIdsArray = appliedRentIdsTxn.map((id) => id.toNumber())
          const myRentIds = filteredMyRents.map((rent) => rent.contractId)
          const filteredAppliedRents = allRents.filter((rent) => appliedRentIdsArray.includes(rent.contractId) && !myRentIds.includes(rent.contractId))
          setAppliedRents(filteredAppliedRents)
          defaultContext.appliedRents = filteredAppliedRents
      } catch (error) {
          console.log('Get applied rents Error: ', error)
      }
    }

    if (account && rentContract) {
      getAppliedRents();
    }
  }, [rentContract, allRents]);

  // get active rents
  useEffect(() => {
    const appliedRentIds = appliedRents.map((rent) => rent.contractId)
    const filteredActiveRents = allRents.filter((rent) => rent.state === RentState.Active &&
                                                          !appliedRentIds.includes(rent.contractId) &&
                                                          !isSameAddresses(rent.owner, account) &&
                                                          !isSameAddresses(rent.tenant, account))
    setActiveRents(filteredActiveRents)
    defaultContext.activeRents = filteredActiveRents
  }, [rentContract, allRents, appliedRents])

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
      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{account, rentContract, scoreContract, paymentContract, allRents, myRents, appliedRents, activeRents}} >
        <Head>
            <title>Jibse</title>
            <meta name="description" content="Jibse" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Nav account={account} connectWalletAction={connectWalletAction} connectingWallet={connectingWallet} />

        {children}
    </AuthContext.Provider>
  )
}

export default AuthWrapper