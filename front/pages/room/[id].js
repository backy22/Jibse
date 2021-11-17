import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Moment from 'react-moment';
import Button from '../../components/button'
import Modal from '../../components/modal'
import { useForm } from "react-hook-form";
import StarRatings from 'react-star-ratings';
import Graph from '../../components/graph';
import { AuthContext } from '../../components/auth-wrapper'
import { isSameAddresses } from '../../utils/is-same-addresses';
import { isEmptyAddress } from "../../utils/address"; 
import { ethers } from 'ethers';
import { RentState, BillState } from '../../utils/enum';
import { Notify } from '../../components/notify';
import { UserpageLink } from '../../components/userpage-link';

const Room = () => {
    const router = useRouter()
    const { id: contractId } = router?.query
  
    const value = useContext(AuthContext);
    const [rentDetail, setRentDetail] = useState('');
    const [applicants, setApplicants] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isOpen, setIsOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [isOwner, setIsOwner] = useState(false)
    const [isTenant, setIsTenant] = useState(false)
    const [reviewing, setReviwing] = useState(false)
    const [bills, setBills] = useState([])
    const [toast, setToast] = useState(null)

    const { register, handleSubmit, formState: { errors } } = useForm();

    const changeRating = (newRating) => {
        setRating(newRating)
    }

    const onSubmit = async(values) => {
        try {
            setReviwing(true)
            const addReview = await value.scoreContract.addReview(
                contractId,
                rating,
                values.review,
                { gasLimit: 1000000 }
            )
            addReview.wait();
        } catch (error) {
            console.log('Add Review Error: ', error);
            setToast({message: 'Failed to Create Review', type: 'error', id: contractId})
        } finally {
            setIsOpen(false);
            setReviwing(false)
        }
    }

    function openModal() {
        setIsOpen(true)
    }

    useEffect(() => {
        const getRentDetail = async() => {
            try {
                const rentTxn = await value.rentContract.getContractById(contractId)
                setRentDetail({
                    contractId: rentTxn.contractId.toNumber(),
                    location: rentTxn.location,
                    startDate: new Date(rentTxn.startDate * 1000),
                    endDate: new Date(rentTxn.endDate * 1000),
                    owner: rentTxn.owner,
                    tenant: rentTxn.tenant,
                    price: ethers.utils.formatEther(rentTxn.price),
                    state: rentTxn.state,
                });
                if (isSameAddresses(rentTxn.owner, value.account)) {
                    setIsOwner(true)
                }
                if (isSameAddresses(rentTxn.tenant, value.account)) {
                    setIsTenant(true)
                }
            } catch (error) {
                console.log('Get rent detail Error: ', error)
            }
        }

        const getApplicants = async() => {
            try {
                const applicantTxn = await value.rentContract.getApplicants(contractId)
                const applicantsArray = []
                for(let applicant of applicantTxn) {
                    applicantsArray.push(applicant)
                }
                setApplicants(applicantsArray);
            } catch (error) {
                console.log('Get applicants Error: ', error)
            }
        }

        const getBills = async() => {
            try {
                const billsTxn = await value.paymentContract.getBillsByContractId(contractId, { gasLimit: 1000000 })
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
                console.log('Get reviews Error: ', error)
            }
        }

        const getReviews = async() => {
            try {
                const reviewsTxn = await value.scoreContract.getReviews(contractId, { gasLimit: 1000000 })
                const reviewsArray = []
                for(let review of reviewsTxn) {
                    reviewsArray.push({
                        reviewId: review.reviewId.toNumber(),
                        star: review.star.toNumber(),
                        review: review.review
                    })
                }
                setReviews(reviewsArray)
            } catch (error) {
                console.log('Get reviews Error: ', error)
            }
        }

        if (value.account && contractId && value.rentContract) {
            getRentDetail();
        }
        if (contractId && value.rentContract && isOwner) {
            getApplicants();
        }
        if (contractId && value.scoreContract) {
            getReviews();
        }
        if (contractId && value.paymentContract) {
            getBills();
        }

        if (contractId && value.scoreContract && value.paymentContract) {
            const onReviewAdded = async(id) => {
                setToast({message: 'Review Added', type: 'success', id: id.toNumber()})
                getReviews();
            }

            const onBillCreated = async(id) => {
                setToast({message: 'Bill Created', type: 'success', id: id.toNumber()})
                getBills();
            }

            value.scoreContract.on('ReviewAdded', onReviewAdded);
            value.paymentContract.on('BillCreated', onBillCreated);

            return () => {
                value.scoreContract.off('ReviewAdded', onReviewAdded);
                value.paymentContract.off('BillCreated', onBillCreated);
            }
        }

    }, [contractId, value.rentContract, value.scoreContract, value.paymentContract, isOwner, isTenant])

    const acceptApplicant = async(applicant) => {
        try {
            const acceptTxn = await value.rentContract.acceptApplicant(contractId, applicant)
            await acceptTxn.wait();
            console.log('accpetTxn: ', acceptTxn);
        } catch (error) {
            console.log('Accept applicant Error: ', error)
            setToast({message: 'Failed to Accept Applicant', type: 'error', id: contractId})
        }
    }

    async function createBill() {
        try {
            const createBillTxn = await value.paymentContract.createBill(contractId, { gasLimit: 1000000 })
            await createBillTxn.wait();
            console.log('createBillTxt: ', createBillTxn);
        } catch (error) {
            console.log('Create bill Error: ', error)
            setToast({message: 'Failed to Create Bill', type: 'error', id: contractId})
        }
    }

    return (
        <div>
            {toast && <Notify message={toast.message} type={toast.type} id={toast.id} />}
            <section className="max-w-6xl mx-auto pb-12">
                <h1 className="text-center my-20 font-black gradient-pink-green font-sans text-6xl">Room Dashboard</h1>
                {rentDetail && (
                    <>
                        <div className="flex">
                            <div className="bg-gray-purple p-4 mb-4 rounded mr-6 w-1/2">
                                <Graph />
                            </div>
                            <div className="self-end mb-6">
                                <div className="text-left mb-3">
                                  <span className="font-extrabold text-8xl">{rentDetail.price}</span> ETH / month
                                </div>
                                <div>
                                  <span className="font-bold">Address: </span>{rentDetail.location}
                                </div>
                                <div>
                                  <span className="font-bold">Start date: </span>
                                  <Moment format="YYYY-MM-DD">{rentDetail.startDate.toString()}</Moment>
                                </div>
                                <div>
                                  <span className="font-bold">End date: </span>
                                  <Moment format="YYYY-MM-DD">{rentDetail.endDate.toString()}</Moment>
                                </div>
                                <div>
                                  <span className="font-bold">Owner: </span>
                                  <UserpageLink address={rentDetail.owner} underline={true} shorten={true} />
                                </div>
                                {isEmptyAddress(rentDetail.tenant) && (
                                  <div>
                                    <span>Tenant: </span>
                                    <UserpageLink address={rentDetail.tenant} underline={true} shorten={true} />
                                  </div>
                                )}
                                {isTenant && rentDetail.state === RentState.Succeeded && (
                                    <div className="mt-6">
                                        <Button buttonText="Review this room" onClick={openModal} />
                                    </div>
                                )}
                                {isOwner && rentDetail.state === RentState.Succeeded && (
                                    <div className="mt-6 w-40">
                                        <Button buttonText="Create a bill" onClick={createBill} />
                                    </div>
                                )}
                            </div>
                        </div>
                        {isOwner && applicants.length > 0 && (
                            <>
                                <h4>Applicants</h4>
                                {applicants.map((applicant) => (
                                    <div className="flex  bg-gray-purple p-2 my-2 rounded justify-between items-center" key={applicant}>
                                        <div>{applicant}</div>
                                        <div className="w-40">
                                            <Button buttonText="Accept" onClick={() => acceptApplicant(applicant)}/>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        {bills.length > 0 && (
                            <>
                                <h4>Payment History</h4>
                                {bills.map((bill) => (
                                    <div className="flex  bg-gray-purple p-2 my-2 rounded justify-between items-center" key={bill.billId}>
                                        <UserpageLink address={bill.payer} /> 
                                        <div>{bill.state === BillState.Paid ? 'Paid' : 'Pending'}</div>
                                    </div>
                                ))}
                            </>
                        )}
                        {reviews.length > 0 && (
                            <>
                                <h4>Reviews</h4>
                                {reviews.map((review) => (
                                    <div className="flex flex-col bg-gray-purple p-2 my-2 rounded" key={review.reviewId}>
                                        <div>
                                            <StarRatings
                                                rating={review.star}
                                                starRatedColor="rgba(239,220,5,1)"
                                                numberOfStars={5}
                                                name='rating'
                                                starDimension="25px"
                                            />
                                        </div>
                                        <div>{review.review}</div>
                                    </div>
                                ))}
                            </>
                        )}
                    </>
                )}

                <Modal 
                    isOpen={isOpen}
                    label="Review Room"
                    setIsOpen={setIsOpen}>
                    <form onSubmit={handleSubmit(onSubmit)} className="text-gray-100 flex flex-col h-full">
                        <StarRatings
                            rating={rating}
                            starHoverColor="rgba(239,220,5,1)"
                            starRatedColor="rgba(239,220,5,1)"
                            changeRating={changeRating}
                            numberOfStars={5}
                            name='rating'
                            starDimension="25px"
                        />
                        <div className="my-4 h-3/4">
                            <textarea className="border-2 w-full h-full p-2 bg-light-purple" placeholder="Write your review" {...register("review", { required: true })} />
                            {errors.exampleRequired && <span>This field is required</span>}
                        </div>
                        <div className="mx-auto w-40">
                            <Button type="submit" buttonText="Save" isLoading={reviewing} />
                        </div>
                    </form>
                </Modal>
            </section>
        </div>
    )
}

export default Room