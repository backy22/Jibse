import { useContext, useState } from "react";
import { AuthContext } from ".."
import Modal from 'react-modal'
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
        <section>
            <h1>Owner Dashboard</h1>
            <button onClick={openModal}>Create Room</button>

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
                                dateFormat="d MMM yyyy"
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
                                dateFormat="d MMM yyyy"
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
                    <button className="text-green-300 border-green-300 rounded-md border-2 p-2" type="submit">Save</button>
                </form>
            </Modal>
        </section>
    )
}

export default OwnerDashboard