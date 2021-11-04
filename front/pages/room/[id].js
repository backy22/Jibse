import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from ".."
import { useRouter } from 'next/router'
import Nav from '../../components/nav'
import Moment from 'react-moment';
import Button from '../../components/button'
import Modal from 'react-modal'
import { useForm } from "react-hook-form";
import StarRatings from 'react-star-ratings';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
    overlay: {
        background: 'rgba(24,24,24,0.7)'
    }
};

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

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const changeRating = (newRating) => {
        setRating(newRating)
    }

    const onSubmit = async(values) => {
        console.log(contractId, rating, values.review)
        try {
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
            closeModal();
        }
    }

    function afterOpenModal() {
    }
    
    function closeModal() {
        setIsOpen(false);
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
                    price: rentTxn.price.toNumber()
                });
                if (rentTxn.owner.toLowerCase() == value.account) {
                    setIsOwner(true)
                }
                if (rentTxn.tenant.toLowerCase() == value.account) {
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
                console.log('applicantsArray', applicantsArray)
                setApplicants(applicantsArray);
            } catch (error) {
                console.log('Get applicants Error: ', error)
            }
        }

        const getReviews = async() => {
            try {
                const reviewsTxn = await value.scoreContract.getReviews(contractId, { gasLimit: 1000000 })
                const reviewsArray = []
                console.log('reviewsTxn', reviewsTxn)
                for(let review of reviewsTxn) {
                    reviewsArray.push({
                        reviewId: review.reviewId,
                        star: review.star,
                        review: review.review
                    })
                }
                console.log('reviewsArray', reviewsArray)
                setReviews(reviewsArray)
            } catch (error) {
                console.log('Get reviews Error: ', error)
            }
        }

        getRentDetail();
        getApplicants();
        getReviews();
    }, [contractId, value.rentContract, value.scoreContract])

    const acceptApplicant = async(applicant) => {
        try {
            const acceptTxn = await value.rentContract.acceptApplicant(contractId, applicant)
            await acceptTxn.wait();
            console.log('accpetTxn: ', acceptTxn);
        } catch (error) {
            console.log('Accept applicant Error: ', error)
        }
    }

    return (
        <>
            <Nav currentAccount={value.account} />
            <section className="max-w-6xl mx-auto">
                <h1 className="text-center">Room Dashboard</h1>
                {rentDetail && (
                    <>
                        <div className="bg-gray-purple p-4 mb-4 rounded">
                            <div>Graph</div>
                            <div>{rentDetail.location}</div>
                            <div>Rent Date:
                            <Moment format="YYYY-MM-DD">{rentDetail.startDate.toString()}</Moment>
                            &nbsp;~&nbsp;
                            <Moment format="YYYY-MM-DD">{rentDetail.endDate.toString()}</Moment>
                            </div>
                            <div>Owner Address: {rentDetail.owner}</div>
                            <div>{rentDetail.price} eth/month</div>
                            {isTenant && <Button buttonText="Review this room" onClick={openModal} />}
                        </div>
                        {isOwner && applicants.length > 0 && (
                            <>
                                <h4>Applicants</h4>
                                <div className="flex flex-col bg-gray-purple p-2 rounded">
                                    {applicants.map((applicant) => (
                                        <div className="flex justify-between">
                                            <div>{applicant}</div>
                                            <Button buttonText="Accept" onClick={() => acceptApplicant(applicant)}/>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}

                <Modal 
                    isOpen={isOpen}
                    onRequestClose={closeModal}
                    onAfterOpen={afterOpenModal}
                    ariaHideApp={false}
                    style={customStyles}
                    contentLabel="Review Room">
                    <form onSubmit={handleSubmit(onSubmit)} className="text-gray-500 flex flex-col">
                        <StarRatings
                            rating={rating}
                            starRatedColor="blue"
                            changeRating={changeRating}
                            numberOfStars={5}
                            name='rating'
                        />
                        <div className="my-2">
                            <textarea className="border-2 w-full h-28 p-2" placeholder="Write your review" {...register("review", { required: true })} />
                            {errors.exampleRequired && <span>This field is required</span>}
                        </div>
                        <Button type="submit" buttonText="Save" />
                    </form>
                </Modal>
            </section>
        </>
    )
}

export default Room