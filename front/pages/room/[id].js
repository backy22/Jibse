import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { AuthContext } from ".."
import { useRouter } from 'next/router'
import Nav from '../../components/nav'
import Moment from 'react-moment';
import Button from '../../components/button'
import Modal from '../../components/modal'
import { useForm } from "react-hook-form";
import StarRatings from 'react-star-ratings';
import { shortenAddress } from '../../utils/shorten-address';
import Graph from '../../components/graph';

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

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

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
            console.log('addReview', addReview);
        } catch (error) {
            console.log('Add Contract Error: ', error);
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
                console.log('rentTxn', rentTxn)
                setRentDetail({
                    contractId: rentTxn.contractId.toNumber(),
                    location: rentTxn.location,
                    startDate: new Date(rentTxn.startDate * 1000),
                    endDate: new Date(rentTxn.endDate * 1000),
                    owner: rentTxn.owner,
                    tenant: rentTxn.tenant,
                    price: rentTxn.price.toNumber(),
                    state: rentTxn.state,
                });
                if (rentTxn.owner.toLowerCase() === value.account) {
                    setIsOwner(true)
                }
                if (rentTxn.tenant.toLowerCase() === value.account) {
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
                console.log('applicantTxn', applicantTxn)
                for(let applicant of applicantTxn) {
                    applicantsArray.push(applicant)
                }
                console.log('applicantsArray', applicantsArray)
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
                        billId: bill.id.toNumber(),
                        contractId: bill.contractId.toNumber(),
                        billingDate: new Date(bill.billingDate * 1000),
                        payee: bill.payee,
                        payer: bill.payer,
                        state: bill,state
                    })
                }
                console.log('billsArray', billsArray)
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
                console.log('reviewsArray', reviewsArray)
                setReviews(reviewsArray)
            } catch (error) {
                console.log('Get reviews Error: ', error)
            }
        }

        if (value.rentContract) {
            getRentDetail();
        }
        if (value.rentContract && isOwner) {
            getApplicants();
        }
        if (value.scoreContract) {
            getReviews();
        }
        if (value.paymentContract) {
            getBills();
        }
    }, [contractId, value.rentContract, value.scoreContract, value.paymentContract, isOwner, isTenant])

    const acceptApplicant = async(applicant) => {
        try {
            const acceptTxn = await value.rentContract.acceptApplicant(contractId, applicant)
            await acceptTxn.wait();
            console.log('accpetTxn: ', acceptTxn);
        } catch (error) {
            console.log('Accept applicant Error: ', error)
        }
    }

    async function createBill() {
        try {
            const createBillTxn = await value.paymentContract.createBill(contractId, { gasLimit: 1000000 })
            await createBillTxn.wait();
            console.log('createBillTxt: ', createBillTxn);
        } catch (error) {
            console.log('Create bill Error: ', error)
        }
    }

    return (
        <>
            <Nav currentAccount={value.account} className="max-w-6xl mx-auto" />
            <section className="max-w-6xl mx-auto">
                <h1 className="text-center mb-12">Room Dashboard</h1>
                {rentDetail && (
                    <>
                        <div className="flex">
                            <div className="bg-gray-purple p-4 mb-4 rounded mr-6">
                                <Graph />
                            </div>
                            <div>
                                <div>{rentDetail.location}</div>
                                <div>Rent Date:
                                <Moment format="YYYY-MM-DD">{rentDetail.startDate.toString()}</Moment>
                                &nbsp;~&nbsp;
                                <Moment format="YYYY-MM-DD">{rentDetail.endDate.toString()}</Moment>
                                </div>
                                <div>
                                    <Link href={`/user/${rentDetail.owner}`}>
                                        <a>Owner Address: {shortenAddress(rentDetail.owner)}</a>
                                    </Link>
                                </div>
                                <div>
                                    <Link href={`/user/${rentDetail.tenant}`}>
                                        <a>Tenant Address: {shortenAddress(rentDetail.tenant)}</a>
                                    </Link>
                                </div>
                                <div>{rentDetail.price} eth/month</div>
                                {isTenant && (
                                    <div className="mt-6">
                                        <Button buttonText="Review this room" onClick={openModal} />
                                    </div>
                                )}
                                {isOwner && (
                                    <div className="mt-6">
                                        <Button buttonText="Create bill" onClick={createBill} />
                                    </div>
                                )}
                            </div>
                        </div>
                        {isOwner && applicants.length > 0 && (
                            <>
                                <h4>Applicants</h4>
                                <div className="flex flex-col bg-gray-purple p-2 rounded">
                                    {applicants.map((applicant) => (
                                        <div className="flex justify-between" key={applicant}>
                                            <div>{applicant}</div>
                                            <Button buttonText="Accept" onClick={() => acceptApplicant(applicant)}/>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {bills.length > 0 && (
                            <>
                                <h4>Payment History</h4>
                            </>
                        )}
                        {reviews.length > 0 && (
                            <>
                                <h4>Reviews</h4>
                                <div className="flex flex-col bg-gray-purple p-2 rounded">
                                    {reviews.map((review) => (
                                        <div key={review.reviewId}>
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
                                </div>
                            </>
                        )}
                    </>
                )}

                <Modal 
                    isOpen={isOpen}
                    label="Review Room"
                    setIsOpen={setIsOpen}>
                    <form onSubmit={handleSubmit(onSubmit)} className="text-gray-100 flex flex-col">
                        <StarRatings
                            rating={rating}
                            starHoverColor="rgba(239,220,5,1)"
                            starRatedColor="rgba(239,220,5,1)"
                            changeRating={changeRating}
                            numberOfStars={5}
                            name='rating'
                            starDimension="25px"
                        />
                        <div className="my-4">
                            <textarea className="border-2 w-full h-28 p-2 bg-light-purple" placeholder="Write your review" {...register("review", { required: true })} />
                            {errors.exampleRequired && <span>This field is required</span>}
                        </div>
                        <div className="mx-auto">
                            <Button type="submit" buttonText="Save" isLoading={reviewing} />
                        </div>
                    </form>
                </Modal>
            </section>
        </>
    )
}

export default Room