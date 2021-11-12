import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { AuthContext } from "../../components/auth-wrapper";
import { BillState } from "../../utils/enum";
import { UserpageLink } from "../../components/userpage-link";

const User = () => {
    const value = useContext(AuthContext);
    const router = useRouter()
    const { address } = router?.query

    const [score, setScore] = useState(0);
    const [bills, setBills] = useState([]);

    useEffect(() => {
        const getUserScore = async() => {
            try {
                const scoreTxn = await value.scoreContract.getScore(address, { gasLimit: 1000000 })
                setScore(scoreTxn.toNumber())
            } catch (error) {
                console.log('Get user score Error: ', error)
            }
        }

        const getUserBills = async() => {
            try {
                const billsTxn = await value.paymentContract.getBillsByAddress(address, { gasLimit: 1000000 })
                const billsArray = []
                for(let bill of billsTxn) {
                    billsArray.push({
                        billId: bill.billId.toNumber(),
                        contractId: bill.contractId.toNumber(),
                        billingDate: new Date(bill.billingDate * 1000),
                        payee: bill.payee,
                        payer: bill.payer,
                        state: bill.state
                    })
                }
                setBills(billsArray)
            } catch (error) {
                console.log('Get bills Error: ', error)
            }
        }

        if (value.scoreContract) {
            getUserScore();
        }
        if (value.paymentContract) {
            getUserBills();
        }
    }, [address, value.scoreContract, value.paymentContract])

    return (
        <div>
            <section className="max-w-6xl mx-auto">
                <h1 className="text-center my-12">{address}</h1>
                <div>
                    <div>Score: {score}</div>
                </div>

                {bills.length > 0 && (
                    <>
                        <h4>Payment History</h4>
                        {bills.map((bill) => (
                            <div className="flex  bg-gray-purple p-2 my-2 rounded justify-between items-center" key={bill.billId}>
                                <div>
                                    <UserpageLink address={bill.payee} />
                                </div>
                                <div>{bill.state === BillState.Paid ? 'Paid' : 'Pending'}</div>
                            </div>
                        ))}
                    </>
                )}
            </section>
        </div>
    )
}

export default User