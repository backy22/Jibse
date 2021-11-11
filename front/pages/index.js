import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import Moment from 'react-moment';
import Button from '../components/button'
import { shortenAddress } from '../utils/shorten-address';
import Graph from '../components/graph'
import AuthWrapper, { AuthContext } from '../components/auth-wrapper';
import { isSameAddresses } from '../utils/is-same-addresses';

export default function Home() {
  const value = useContext(AuthContext);
  console.log('vlaue--', value)
  const [applyingRent, setApplyingRent] = useState(false);

  const applyRent = async(contractId) => {
    try {
      setApplyingRent(true)
      const applyTxn = await value.rentContract.applyForContract(contractId);
      await applyTxn.wait();
      console.log('applyTxn: ', applyTxn);
    } catch (error) {
      console.log('Apply Rent Error: ', error)
    } finally {
      setApplyingRent(false)
    }
  }

  return (
    <AuthWrapper>
      <section className="max-w-6xl mx-auto">
        <h1 className="text-center mb-12">
          Rooms in Toronto
        </h1>

        <div className="grid grid-cols-3 gap-4">
          {value.appliedRents?.length > 0 && value.appliedRents.map((rent) => (
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
              <div className="self-center mt-8 w-41">
                <Button buttonText="Applied" disabled={true} />
              </div>
            </div>
          ))}
          {value.myRents?.length > 0 && value.myRents.map((rent) => (
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
              {isSameAddresses(rent.owner, value.account) && (
                <div className="self-center mt-8 w-41">
                  <Button buttonText="You are Owner" disabled={true} />
                </div>
              )}
              {isSameAddresses(rent.tenant, value.account) && (
                <div className="self-center mt-8 w-41">
                  <Button buttonText="You are Tenant" disabled={true} />
                </div>
              )}
            </div>
          ))}
          {value.activeRents?.length > 0 && value.activeRents.map((rent) => (
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
              <div className="self-center mt-8 w-41">
                <Button onClick={() => applyRent(rent.contractId)} buttonText="Apply" isLoading={applyingRent} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </AuthWrapper>
  )
}
