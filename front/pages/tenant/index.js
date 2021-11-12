import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import RoomComponent from "../../components/room-component";
import Button from "../../components/button";
import { ethers } from "ethers";
import { RentState, BillState } from "../../utils/enum";
import Moment from "react-moment";
import { AuthContext } from "../../components/auth-wrapper";
import { isSameAddresses } from "../../utils/is-same-addresses";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TenantDashboard = () => {
  const value = useContext(AuthContext);
  const [score, setScore] = useState(0);
  const [myRentsAsTenant, setMyRentsAsTenant] = useState([]);
  const [payingDeposit, setPayingDeposit] = useState(false);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const getMyScore = async () => {
      try {
        const scoreTxn = await value.scoreContract.getScore(value.account, {
          gasLimit: 1000000,
        });
        setScore(scoreTxn.toNumber());
      } catch (error) {
        console.log("Get score Error: ", error);
      }
    };

    const filteredRents = value.myRents.filter((rent) =>
      isSameAddresses(rent.tenant, value.account)
    );
    setMyRentsAsTenant(filteredRents);

    const isAutoPaymentSetup = async (address) => {
      try {
        const isAutoPaymentSetupTxn = await value.paymentContract.isAutoPaymentSetup(address)
        return isAutoPaymentSetupTxn
      } catch (error) {
        console.log("Get isAutoPaymentSetup: ", error);
      }
    }

    const getBills = async () => {
      try {
        const getBillsTxn = await value.paymentContract.getBillsByAddress(
          value.account
        );
        const billsArray = [];
        for (let bill of getBillsTxn) {
          billsArray.push({
            id: bill.billId.toNumber(),
            contractId: bill.contractId.toNumber(),
            price: ethers.utils.formatEther(bill.price),
            billingDate: new Date(bill.billingDate * 1000),
            payee: bill.payee,
            payer: bill.payer,
            state: bill.state,
            isAuto: await isAutoPaymentSetup(bill.payee)
          });
        }
        setBills(billsArray);
        console.log("billsArray", billsArray);
      } catch (error) {
        console.log("Get bill Error: ", error);
      }
    };

    getMyScore();
    getBills();

    if (value.paymentContract) {
      const onAutoPaymentSet = async(address) => {
          console.log('Auto payment set-----')
          notify('Auto Payment Set', 'success', address)
          getBills()
      }

      value.paymentContract.on('AutoPaymentSet', onAutoPaymentSet);

      return () => {
          value.paymentContract.off('AutoPaymentSet', onAutoPaymentSet);
      }
    }
  }, [value.account, value.scoreContract, value.myRents, value.rentContract]);

  const notify = (message, type, toastId) => {
    console.log('notify', message, type, toastId)
    if (type === 'error') {
      toast.error(message, { toastId });
    } else {
      toast.success(message, { toastId });
    }
  }

  async function payDeposit(rent) {
    try {
      setPayingDeposit(true);
      let wei = ethers.utils.parseEther(rent.price.toString()) // convert to wei
      const payDepositTxn = await value.rentContract.payDeposit(
        rent.contractId,
        {
          value: wei.toString(),
          gasLimit: 1000000,
        }
      );
      console.log("payDepositTxn", payDepositTxn);
    } catch (error) {
      console.log("Pay deposit Error: ", error);
    } finally {
      setPayingDeposit(false);
    }
  }

  async function payBill(bill) {
    try {
      let wei = ethers.utils.parseEther(bill.price.toString())
      const payBillTxn = await value.paymentContract.payBill(bill.id, {
        value: wei.toString(),
        gasLimit: 1000000,
      });
      console.log("payBillTxn", payBillTxn);
    } catch (error) {
      console.log("Pay bill Error: ", error);
    }
  }

  async function setAutoPayment() {
    try {
      const setAutoPaymentTxn = await value.paymentContract.setAutoPayment(true, {
        gasLimit: 1000000,
      });
      console.log("setAutoPaymentTxn", setAutoPaymentTxn);
    } catch (error) {
      console.log("Set Auto Payment Error: ", error);
    }
  }

  return (
    <div>
      <ToastContainer autoClose={1500} />
      <section className="max-w-6xl mx-auto">
        <h1 className="text-center my-12 font-black gradient-pink-green font-sans text-6xl">
          Tenant Dashboard
        </h1>
        <div className="p-12">
          <div className="my-4">
            <div>Score: {score}</div>
            <div>Contact: 647-123-5678</div>
          </div>
          {myRentsAsTenant.length > 0 && (
            <div className="my-4">
              <h4>Current Rent</h4>
              <div className="grid grid-cols-3 gap-4 font-mono">
                {myRentsAsTenant.map((rent) => (
                  <RoomComponent rent={rent} key={rent.contractId}/>
                ))}
              </div>
            </div>
          )}
          {bills.length > 0 && (
            <div className="my-4">
              <h4>My bills</h4>
              {bills.map((bill) => (
                <div className="flex bg-gray-purple p-2 my-2 rounded items-center" key={bill.id}>
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
                  <div className="flex-auto">
                    <Moment format="YYYY-MM-DD">
                      {bill.billingDate.toString()}
                    </Moment>
                  </div>
                  <div className="flex-auto">{bill.price}</div>
                  {bill.state === BillState.Paid ? (
                    <div className="flex-auto">Paid</div>
                  ) : (
                    <>
                      {bill.isAuto ? (
                        <div className="flex-auto w-41">
                          Auto Payment set
                        </div>
                      ) : (
                        <>
                          <div className="flex-auto w-41">
                            <Button
                              buttonText="Pay Now"
                              onClick={() => payBill(bill)}
                            />
                          </div>
                          <div className="flex-auto w-41 ml-2">
                            <Button
                              buttonText="Set Auto Payment"
                              onClick={setAutoPayment}
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          {value.appliedRents.length > 0 && (
            <div className="my-4">
              <h4>Applied Rent</h4>
              {value.appliedRents.map((rent) => (
                <div key={rent.contractId}>
                  <RoomComponent rent={rent} />
                  {rent.state === RentState.Locked && (
                    <div className="w-41">
                      <Button
                        buttonText="Pay Deposit"
                        onClick={() => payDeposit(rent)}
                        isLoading={payingDeposit}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TenantDashboard;
