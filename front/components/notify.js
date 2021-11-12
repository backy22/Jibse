import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Notify = ({message, type, id}) => {
    useEffect(() => {
        if (type === 'error') {
          toast.error(message, { id });
        } else {
          toast.success(message, { id });
        }
    }, [message, type, id])

    return <ToastContainer autoClose={1500} />
}