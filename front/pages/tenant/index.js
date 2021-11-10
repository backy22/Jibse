import { useContext, useEffect, useState } from "react";
import Link from 'next/link'
import RoomComponent from '../../components/room-component';
import Button from '../../components/button';
import { ethers } from 'ethers';
import { RentState, BillState } from "../../utils/enum";
import Moment from 'react-moment';
import AuthWrapper, { AuthContext } from "../../components/auth-wrapper";

const TenantDashboard = () => {
    const value = useContext(AuthContext);
    const [score, setScore] = useState(0);
    const [myRentsAsTenant, setMyRentsAsTenant] = useState([])
    const [payingDeposit, setPayingDeposit] = useState(false)
    const [bills, setBills] = useState([])

    useEffect(() => {
        const getMyScore = async() => {
            try {
                const scoreTxn = await value.scoreContract.getScore(value.account, { gasLimit: 1000000 })
                setScore(scoreTxn.toNumber())
            } catch (error) {
                console.log('Get score Error: ', error)
            }
        }

        const filteredMyRent = value.myRents.filter((rent) => rent.tenant.toLowerCase() === value.account)
        setMyRentsAsTenant(filteredMyRent)

        const getBills = async() => {
            try {
                const getBillsTxn = await value.paymentContract.getBillsByAddress(value.account)
                const billsArray = []
                for(let bill of getBillsTxn) {
                    billsArray.push({
                        id: bill.billId.toNumber(),
                        contractId: bill.contractId.toNumber(),
                        price: bill.price.toNumber(),
                        billingDate: new Date(bill.billingDate * 1000),
                        payee: bill.payee,
                        payer: bill.payer,
                        state: bill.state
                    })
                }
                setBills(billsArray)
                console.log('billsArray', billsArray)
            } catch (error) {
                console.log('Get bill Error: ', error)
            }
        }

        getMyScore();
        getBills();
    }, [value.account, value.scoreContract, value.myRents, value.rentContract])

    async function payDeposit(rent) {
        try {
            setPayingDeposit(true)
            const payDepositTxn = await value.rentContract.payDeposit(rent.contractId, { value: ethers.utils.parseEther((rent.price/1000).toString()), gasLimit: 1000000 })
            console.log('payDepositTxn', payDepositTxn)
        } catch (error) {
            console.log('Pay deposit Error: ', error)
        } finally {
            setPayingDeposit(false)
        }
    }

    async function payBill(bill) {
        try {
            const payBillTxn = await value.paymentContract.payBill(bill.id, { value: ethers.utils.parseEther((bill.price/1000).toString()), gasLimit: 1000000 })
            console.log('payBillTxn', payBillTxn)
        } catch (error) {
            console.log('Pay bill Error: ', error)
        }
    }

    return (
        <AuthWrapper>
            <section className="max-w-6xl mx-auto">
                <h1 className="text-center mb-12">Tenant Dashboard</h1>
                <div className="mb-8">
                    <div>Score: {score}</div>
                    <div>Contact: 647-123-5678</div>
                </div>
                {myRentsAsTenant.length > 0 && (
                    <>
                        <h4>Current Rent</h4>
                        {myRentsAsTenant.map((rent) => (
                            <div className="flex items-center" key={rent.contractId}>
                                <RoomComponent rent={rent} />
                                {rent.state === RentState.Locked && (
                                    <div>
                                        <Button buttonText="Pay Deposit" onClick={() => payDeposit(rent)} isLoading={payingDeposit} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
                {bills.length > 0 && (
                    <>
                        <h4>My bills</h4>
                        <div className="flex bg-gray-purple p-2 rounded">
                            <div className="flex-auto">Payee Address</div>
                            <div className="flex-auto">Contract Id</div>
                            <div className="flex-auto">Billing date</div>
                            <div className="flex-auto">Price</div>
                            <div className="flex-auto">Action</div>
                        </div>
                        {bills.map((bill) => (
                            <div className="flex bg-gray-purple p-2 rounded" key={bill.id}>
                                <div className="flex-auto">
                                    <Link href={`/user/${bill.payee}`}>
                                        <a>{bill.payee}</a>
                                    </Link>
                                </div>
                                <div className="flex-auto">
                                    <Link href={`/room/${bill.contractId}`}>
                                        <a>{bill.contractId}</a>
                                    </Link>
                                </div>
                                <div className="flex-auto"><Moment format="YYYY-MM-DD">{bill.billingDate.toString()}</Moment></div>
                                <div className="flex-auto">{bill.price}</div>
                                {bill.state === BillState.Paid ? (
                                    <div className="flex-auto">Paid</div>
                                ) : (
                                    <div className="flex-auto">
                                        <Button buttonText="Pay Now" onClick={() => payBill(bill)} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
                {value.appliedRents.length > 0 && (
                    <>
                        <h4>Applied Rent</h4>
                        {value.appliedRents.map((rent) => (
                            <RoomComponent rent={rent} />
                        ))}
                    </>
                )}
            </section>
        </AuthWrapper>
    )
}

export default TenantDashboard