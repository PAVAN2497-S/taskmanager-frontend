import { toast } from 'react-toastify';

export const showToast = (message, type = "error") => {
    toast[type](message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};
