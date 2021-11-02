import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Nav from '../components/nav'
import Link from 'next/link'
import { ethers } from 'ethers';

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rentContract, setRentContract] = useState(null);
  const [rents, setRents] = useState([]);

  const RENT_CONTRACT_ADDRESS = '';

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
        rentContract.abi,
        signer
      );

      setRentContract(rentContract);
    } else {
      console.log('Ethereum object not found');
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

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

        <div class="grid grid-cols-3 gap-4">
          <div className="bg-white text-black p-4">
            <div>Graph</div>
            <div>Location</div>
            <div>Rent Date: 2021 Nov 1st - 2022 Oct 31th</div>
            <div>Owner Address</div>
            <div>1000DAI/month</div>
            <Link href={`/room/1`}>
              <a>Detail</a>
            </Link>
          </div>
          <div className="bg-white text-black p-4">
            <div>Graph</div>
            <div>Location</div>
            <div>Rent Date: 2021 Nov 1st - 2022 Oct 31th</div>
            <div>Owner Address</div>
            <div>1000DAI/month</div>
          </div>
          <div className="bg-white text-black p-4">
            <div>Graph</div>
            <div>Location</div>
            <div>Rent Date: 2021 Nov 1st - 2022 Oct 31th</div>
            <div>Owner Address</div>
            <div>1000DAI/month</div>
          </div>
        </div>
      </main>

      <footer>
        footer
      </footer>
    </div>
  )
}
