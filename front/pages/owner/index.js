import { useContext, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from '../../components/button'
import Modal from '../../components/modal'
import RoomComponent from '../../components/room-component';
import { AuthContext } from "../../components/auth-wrapper";
import { isSameAddresses } from "../../utils/is-same-addresses";
import { ethers } from 'ethers';

const OwnerDashboard = () => {
    const value = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false)
    const [creatingRoom, setCreatingRoom] = useState(false)
    const [myRooms, setMyRooms] = useState([])

    const { control, register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async(values) => {
        try {
            setCreatingRoom(true)
            let wei = ethers.utils.parseEther(values.price.toString()) // convert to wei
            const addContract = await value.rentContract.addContract(
                new Date(values.startDate).getTime()/1000,
                new Date(values.endDate).getTime()/1000,
                values.location,
                wei.toString() // convert to wei
            )
            addContract.wait();
            console.log('addContract', addContract);
        } catch (error) {
            console.log('Add Contract Error: ', error);
        } finally {
            setIsOpen(false)
            setCreatingRoom(false)
        }
    }

    function openModal() {
        setIsOpen(true)
    }

    useEffect(() => {
        const filteredMyRent = value.myRents.filter((rent) => isSameAddresses(rent.owner, value.account))
        setMyRooms(filteredMyRent);
    }, [value.account, value.myRents])

    return (
        <div>
            <section className="max-w-6xl mx-auto">
                <h1 className="text-center mb-12">Owner Dashboard</h1>
                <div className="mb-6 w-40">
                    <Button onClick={openModal} buttonText="Create Room" isLoading={creatingRoom}/>
                </div>

                {myRooms.length > 0 && myRooms.map((rent) => (
                    <div key={rent.contractId}>
                        <RoomComponent rent={rent} />
                    </div>
                ))}

                <Modal 
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    label="Create Room">
                    <form onSubmit={handleSubmit(onSubmit)} className="text-gray-100 flex flex-col">
                        <div className="m-2">
                            <input className="border-2 p-2 w-full bg-light-purple" placeholder="Location" {...register("location", { required: true })} />
                            {errors.exampleRequired && <span>This field is required</span>}
                        </div>
                        <div className="flex m-2">
                            <div className="border-2 p-2 mr-4">
                                <Controller
                                    control={control}
                                    name='startDate'
                                    required
                                    render={({ field }) => (
                                    <DatePicker
                                        dateFormat="yyyy-MM-dd"
                                        minDate={new Date()}
                                        showTimeSelect={false}
                                        placeholderText='Select start date'
                                        onChange={(date) => field.onChange(date)}
                                        selected={field.value}
                                    />
                                    )}
                                />
                            </div>
                            <div className="p-2 mr-4">~</div>
                            <div className="border-2 p-2">
                                <Controller
                                    control={control}
                                    name='endDate'
                                    render={({ field }) => (
                                    <DatePicker
                                        dateFormat="yyyy-MM-dd"
                                        minDate={new Date()}
                                        showTimeSelect={false}
                                        placeholderText='Select end date'
                                        onChange={(date) => field.onChange(date)}
                                        selected={field.value}
                                    />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="m-2">
                            <input className="border-2 p-2 w-full bg-light-purple" placeholder="Price" {...register("price", { required: true })} /> eth/month
                            {errors.exampleRequired && <span>This field is required</span>}
                        </div>
                        <div className="mt-12 self-center w-41">
                            <Button type="submit" buttonText="Save" />
                        </div>
                    </form>
                </Modal>
            </section>
        </div>
    )
}

export default OwnerDashboard