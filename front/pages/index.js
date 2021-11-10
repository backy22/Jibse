import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import Nav from '../components/nav'
import Link from 'next/link'
import { ethers } from 'ethers';
import rent from '../abi/Rent.json'
import score from '../abi/Score.json'
import payment from '../abi/Payment.json'
import Moment from 'react-moment';
import Button from '../components/button'
import { RENT_CONTRACT_ADDRESS,  SCORE_CONTRACT_ADDRESS, PAYMENT_CONTRACT_ADDRESS } from '../utils/constants'
import { shortenAddress } from '../utils/shorten-address';
import Graph from '../components/graph'
import { RentState } from '../utils/enum';

const defaultContext = { account: null, rentContract: null, scoreContract: null, paymentContract: null, myRents: [], appliedRents: [] }
export const AuthContext = React.createContext(defaultContext)

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [rentContract, setRentContract] = useState(null);
  const [scoreContract, setScoreContract] = useState(null);
  const [paymentContract, setPaymentContract] = useState(null);
  const [activeRents, setActiveRents] = useState([]);
  const [myRents, setMyRents] = useState([]);
  const [appliedRents, setAppliedRents] = useState([])
  const [applyingRent, setApplyingRent] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        /*
        * Check if we're authorized to access the user's wallet
        */
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        /*
        * User can have multiple authorized accounts, we grab the first one if its there!
        */
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
        console.log('myRentArray', myRentArray)
        setMyRents(myRentArray)
        defaultContext.myRents = myRentArray;
      }
    } catch (error) {
      console.log('getMyRent Error: ', error)
    }
  }

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
        console.log('appliedRentArray', appliedRentArray)
        setAppliedRents(appliedRentArray)
        defaultContext.appliedRents = appliedRentArray;
    } catch (error) {
        console.log('Get applied rents Error: ', error)
    }
  }

  const getActiveRents = async() => {
    try {
      const activeRentsTxn = await rentContract.getContractsByState(RentState.Active)
      let activeRentArray = []
      let appliedRentContractIds = appliedRents.map((rent) => rent.contractId);
      console.log('appliedRentContractIds', appliedRentContractIds)
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
    } catch (error) {
      console.log('getActiveRent Error: ', error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    getContracts();
  }, [currentAccount])

  useEffect(() => {
    if (currentAccount && rentContract) {
      getMyRents();
    }
  }, [rentContract]);

  useEffect(() => {
    if (currentAccount && rentContract) {
      getAppliedRents();
    }
  }, [myRents, rentContract]);

  useEffect(() => {
    if (currentAccount && rentContract) {
      getActiveRents();
    }
  }, [rentContract, appliedRents])

  const applyRent = async(contractId) => {
    console.log('contractId', contractId)
    try {
      setApplyingRent(true)
      const applyTxn = await rentContract.applyForContract(contractId);
      await applyTxn.wait();
      console.log('applyTxn: ', applyTxn);
    } catch (error) {
      console.log('Apply Rent Error: ', error)
    } finally {
      setApplyingRent(false)
    }
  }

  return (
    <div>
      <Head>
        <title>Jibse</title>
        <meta name="description" content="Jibse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav currentAccount={currentAccount} connectWalletAction={connectWalletAction} connectingWallet={connectingWallet} />

      <main className="max-w-6xl mx-auto">
        <h1 className="text-center mb-12">
          Rooms in Toronto
        </h1>

        <div className="grid grid-cols-3 gap-4">
          {appliedRents.length > 0 && appliedRents.map((rent) => (
            <div className="bg-gray-purple p-4 rounded flex flex-col" key={rent.contractId}>
              <Graph />
              <div>{rent.location}</div>
              <div>Rent Date:{' '}
                <Moment format="YYYY-MM-DD">{rent.startDate.toString()}</Moment>
                &nbsp;~&nbsp;
                <Moment format="YYYY-MM-DD">{rent.endDate.toString()}</Moment>
              </div>
              <Link href={`/user/${rent.owner}`}>
                <a>Owner Address: {shortenAddress(rent.owner)}</a>
              </Link>
              <div>{rent.price} eth/month</div>
              <Link href={`/room/${rent.contractId}`}>
                <a>Room Detail</a>
              </Link>
              <div className="self-center mt-8">
                <Button buttonText="Applied" disabled={true} />
              </div>
            </div>
          ))}
          {myRents.length > 0 && myRents.map((rent) => (
            <div className="bg-gray-purple p-4 rounded flex flex-col" key={rent.contractId}>
              <Graph />
              <div>{rent.location}</div>
              <div>Rent Date:{' '}
                <Moment format="YYYY-MM-DD">{rent.startDate.toString()}</Moment>
                &nbsp;~&nbsp;
                <Moment format="YYYY-MM-DD">{rent.endDate.toString()}</Moment>
              </div>
              <Link href={`/user/${rent.owner}`}>
                <a>Owner Address: {shortenAddress(rent.owner)}</a>
              </Link>
              <div>{rent.price} eth/month</div>
              <Link href={`/room/${rent.contractId}`}>
                <a>Room Detail</a>
              </Link>
              {rent.owner.toLowerCase() === currentAccount && (
                <div className="self-center mt-8">
                  <Button buttonText="You are Owner" disabled={true} />
                </div>
              )}
              {rent.tenant.toLowerCase() === currentAccount && (
                <div className="self-center mt-8">
                  <Button buttonText="You are Tenant" disabled={true} />
                </div>
              )}
            </div>
          ))}
          {activeRents.length > 0 && activeRents.map((rent) => (
            <div className="bg-gray-purple p-4 rounded flex flex-col" key={rent.contractId}>
              <Graph />
              <div>{rent.location}</div>
              <div>Rent Date:
                <Moment format="YYYY-MM-DD">{rent.startDate.toString()}</Moment>
                &nbsp;~&nbsp;
                <Moment format="YYYY-MM-DD">{rent.endDate.toString()}</Moment>
              </div>
              <Link href={`/user/${rent.owner}`}>
                <a>Owner Address: {shortenAddress(rent.owner)}</a>
              </Link>
              <div>{rent.price} eth/month</div>
              <Link href={`/room/${rent.contractId}`}>
                <a>Room Detail</a>
              </Link>
              <div className="self-center mt-8">
                <Button onClick={() => applyRent(rent.contractId)} buttonText="Apply" isLoading={applyingRent} />
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>
      </footer>
    </div>
  )
}
