import Alert from '@mui/material/Alert';
import { useState } from 'react';

export const Toast = ({severity, message, show=false}) => {
    const [showToast, setShowToast] = useState(show);
    const toggleShowToast = () => { setShowToast(!showToast); };
    return (showToast && 
    <div className="grid h-20 w-full place-content-center">
        <Alert className="z-50 w-max" onClose={toggleShowToast} severity={severity}>{message}</Alert>
    </div>);
}