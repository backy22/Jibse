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
    const [isOpen, setIsOpen] = useState(false)
    const [rating, setRating] = useState(0)

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const changeRating = (newRating) => {
        setRating(newRating)
    }

    const onSubmit = async(values) => {
        try {
            const addReview = await value.scoreContract.addReview(
                contractId,
                rating,
                values.review
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
                    price: rentTxn.price.toNumber()
                });
                const applicantTxn = await value.rentContract.getApplicants(contractId)
                const applicantsArray = []
                for(let applicant of applicantTxn) {
                    applicantsArray.push(applicant)
                }
                console.log('applicantsArray', applicantsArray)
                setApplicants(applicantsArray);
            } catch (error) {
                console.log('Get rent detail Error: ', error)
            }
        }

        getRentDetail();
    }, [contractId, value.rentContract])

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
                        <div className="bg-white text-black p-4 mb-4">
                            <div>Graph</div>
                            <div>{rentDetail.location}</div>
                            <div>Rent Date:
                            <Moment format="YYYY-MM-DD">{rentDetail.startDate.toString()}</Moment>
                            &nbsp;~&nbsp;
                            <Moment format="YYYY-MM-DD">{rentDetail.endDate.toString()}</Moment>
                            </div>
                            <div>Owner Address: {rentDetail.owner}</div>
                            <div>{rentDetail.price} eth/month</div>
                            <Button buttonText="Review this room" onClick={openModal} />
                        </div>
                        <h4>Applicants</h4>
                        <div className="flex flex-col bg-white text-black p-2">
                            {applicants.length > 0 && applicants.map((applicant) => (
                                <div className="flex justify-between">
                                    <div>{applicant}</div>
                                    <Button buttonText="Accept" onClick={() => acceptApplicant(applicant)}/>
                                </div>
                            ))}
                        </div>
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
                        <div className="m-2">
                            <input className="border-2" placeholder="Write your review" {...register("review", { required: true })} />
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