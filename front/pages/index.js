import React, { useContext, useState } from 'react'
import Link from 'next/link'
import Moment from 'react-moment';

import Button from '../components/button';
import RoomComponent from '../components/room-component';
import { AuthContext } from '../components/auth-wrapper';
import { isSameAddresses } from '../utils/is-same-addresses';

export default function Home() {
  const value = useContext(AuthContext);
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
    <div>
      <section className="max-w-6xl mx-auto">
        <h1 className="text-center my-12 font-black gradient-pink-green font-sans text-6xl">
          Rooms in Toronto 🗼
        </h1>
        <div className="grid grid-cols-3 gap-4 font-mono">
          {value?.appliedRents?.length > 0 && value.appliedRents.map((rent) => (
            <RoomComponent rent={rent} showTenent={false}>
              <div className="self-center mt-8 w-auto">
                <Button buttonText="Applied" disabled={true} />
              </div>
            </RoomComponent>
          ))}
          {value?.myRents?.length > 0 && value.myRents.map((rent) => (
            <RoomComponent rent={rent}>
            {isSameAddresses(rent.owner, value.account) && (
              <div className="self-center mt-8 w-41">
                <Button buttonText="You are the owner" disabled={true} />
              </div>
            )}
            {isSameAddresses(rent.tenant, value.account) && (
              <div className="self-center mt-8 w-41">
                <Button buttonText="You are the tenant" disabled={true} />
              </div>
            )}
            </RoomComponent>
          ))}
          {value?.activeRents?.length > 0 && value.activeRents.map((rent) => (
            <RoomComponent rent={rent}>
              <div className="self-center my-8 w-full">
                  <Button onClick={() => applyRent(rent.contractId)} buttonText="Apply" isLoading={applyingRent} />
              </div>
            </RoomComponent>
          ))}
        </div>
      </section>
    </div>
  )
}
