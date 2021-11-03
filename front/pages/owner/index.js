import { useContext, useState } from "react";
import { AuthContext } from ".."
import Modal from 'react-modal'
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import Nav from '../../components/nav'
import "react-datepicker/dist/react-datepicker.css";
import Button from '../../components/button'

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

const OwnerDashboard = () => {
    const value = useContext(AuthContext);
    console.log('AuthContext----', value.account, value.rentContract)

    const [isOpen, setIsOpen] = useState(false)

    const { control, register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async(values) => {
        try {
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

    return (
        <>
            <Nav currentAccount={value.account} />
            <section>
                
                <h1>Owner Dashboard</h1>
                <Button onClick={openModal} buttonText="Create Room" />

                <Modal 
                    isOpen={isOpen}
                    onRequestClose={closeModal}
                    onAfterOpen={afterOpenModal}
                    style={customStyles}
                    contentLabel="Create Room">
                    <form onSubmit={handleSubmit(onSubmit)} className="text-gray-500 flex flex-col">
                        <div className="m-2">
                            <input className="border-2" placeholder="Location" {...register("location", { required: true })} />
                            {errors.exampleRequired && <span>This field is required</span>}
                        </div>
                        <div className="flex m-2">
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
                            <div>~</div>
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
                        <div className="m-2">
                            <input className="border-2" placeholder="Price" {...register("price", { required: true })} />
                            {errors.exampleRequired && <span>This field is required</span>}
                        </div>
                        <Button type="submit" buttonText="Save" />
                    </form>
                </Modal>
            </section>
        </>
    )
}

export default OwnerDashboard