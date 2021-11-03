import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import Nav from '../components/nav'
import Link from 'next/link'
import { ethers } from 'ethers';
import rent from '../utils/Rent.json'
import Moment from 'react-moment';
import Button from '../components/button'
import { RENT_CONTRACT_ADDRESS,  SCORE_CONTRACT_ADDRESS } from '../constants'

const defaultContext = { account: null, rentContract: null }
export const AuthContext = React.createContext(defaultContext)

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rentContract, setRentContract] = useState(null);
  const [activeRents, setActiveRents] = useState([]);
  const [myRents, setMyRents] = useState([]);

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
      setIsLoading(true)

      /*
        * Fancy method to request access to account.
        */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
        * Boom! This should print out public address once we authorize Metamask.
        */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getRentContract = () => {
    const { ethereum } = window;
      
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const rentContract = new ethers.Contract(
        RENT_CONTRACT_ADDRESS,
        rent.abi,
        signer
      );

      console.log('rentContract', rentContract)
      setRentContract(rentContract);
      defaultContext.rentContract = rentContract;
    } else {
      console.log('Ethereum object not found');
    }
  }

  const getActiveRents = async() => {
    try {
      if (rentContract) {
        const activeRentsTxn = await rentContract.getContractsByState(0)
        let activeRentArray = []
        for(let rent of activeRentsTxn) {
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
        setActiveRents(activeRentArray)
      }
    } catch (error) {
      console.log('getActiveRent Error: ', error)
    }
  }

  const getMyRents = async() => {
    try {
      if (rentContract) {
        const myRentsTxn = await rentContract.getContractsByAddress(currentAccount)
        let myRentArray = []
        console.log('myRentsTxn', myRentsTxn);
        for(let rent of myRentsTxn) {
          myRentArray.push({
            contractId: rent.contractId.toNumber(),
            location: rent.location,
            startDate: new Date(rent.startDate * 1000),
            endDate: new Date(rent.endDate * 1000),
            owner: rent.owner,
            price: rent.price.toNumber(),
            state: rent.state
          })
        }
        console.log(myRentArray)
        setMyRents(myRentArray)
      }
    } catch (error) {
      console.log('getMyRent Error: ', error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    getRentContract();
  }, [currentAccount])

  useEffect(() => {
    getActiveRents();
    getMyRents();
  }, [rentContract]);

  const applyRent = async(contractId) => {
    console.log('contractId', contractId)
    try {
      const applyTxn = await rentContract.applyForContract(contractId);
      await applyTxn.wait();
      console.log('applyTxn: ', applyTxn);
    } catch (error) {
      console.log('Apply Rent Error: ', error)
    }
  }

  return (
    <div>
      <Head>
        <title>Jibse</title>
        <meta name="description" content="Jibse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav currentAccount={currentAccount} connectWalletAction={connectWalletAction}/>

      <main className="max-w-6xl mx-auto">
        <h1 className="text-center mb-12">
          Rooms in Toronto
        </h1>

        <div className="grid grid-cols-3 gap-4">
          {myRents.length > 0 && myRents.map((rent) => (
            <div className="bg-white text-black p-4" key={rent.contractId}>
              <div>Graph</div>
              <div>{rent.location}</div>
              <div>Rent Date:
                <Moment format="YYYY-MM-DD">{rent.startDate.toString()}</Moment>
                &nbsp;~&nbsp;
                <Moment format="YYYY-MM-DD">{rent.endDate.toString()}</Moment>
              </div>
              <div>Owner Address: {rent.owner}</div>
              <div>{rent.price} eth/month</div>
              <Link href={`/room/${rent.contractId}`}>
                <a>Detail</a>
              </Link>
              <div>
                <Button onClick={() => applyRent(rent.contractId)} buttonText="Apply" />
              </div>
            </div>
          ))}
          {activeRents.length > 0 && activeRents.map((rent) => (
            <div className="bg-white text-black p-4" key={rent.contractId}>
              <div>Graph</div>
              <div>{rent.location}</div>
              <div>Rent Date:
                <Moment format="YYYY-MM-DD">{rent.startDate.toString()}</Moment>
                &nbsp;~&nbsp;
                <Moment format="YYYY-MM-DD">{rent.endDate.toString()}</Moment>
              </div>
              <div>Owner Address: {rent.owner}</div>
              <div>{rent.price} eth/month</div>
              <Link href={`/room/${rent.contractId}`}>
                <a>Detail</a>
              </Link>
              <div>
                <Button onClick={() => applyRent(rent.contractId)} buttonText="Apply" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>
        footer
      </footer>
    </div>
  )
}
