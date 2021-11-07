import { useContext, useState } from "react";
import { AuthContext } from ".."
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import Nav from '../../components/nav'
import "react-datepicker/dist/react-datepicker.css";
import Button from '../../components/button'
import Modal from '../../components/modal'

const OwnerDashboard = () => {
    const value = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false)
    const [creatingRoom, setCreatingRoom] = useState(false)

    const { control, register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async(values) => {
        try {
            setCreatingRoom(true)
            const addContract = await value.rentContract.addContract(
                new Date(values.startDate).getTime()/1000,
                new Date(values.endDate).getTime()/1000,
                values.location,
                values.price
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

    return (
        <>
            <Nav currentAccount={value.account} />
            <section className="max-w-6xl mx-auto">
                
                <h1 className="text-center mb-12">Owner Dashboard</h1>
                <Button onClick={openModal} buttonText="Create Room" isLoading={creatingRoom}/>

                <Modal 
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    label="Create Room">
                    <form onSubmit={handleSubmit(onSubmit)} className="text-gray-500 flex flex-col">
                        <div className="m-2">
                            <input className="border-2 p-2 w-full" placeholder="Location" {...register("location", { required: true })} />
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
                            <input className="border-2 p-2 w-full" placeholder="Price" {...register("price", { required: true })} />
                            {errors.exampleRequired && <span>This field is required</span>}
                        </div>
                        <div className="mt-12 self-center">
                            <Button type="submit" buttonText="Save" />
                        </div>
                    </form>
                </Modal>
            </section>
        </>
    )
}

export default OwnerDashboard