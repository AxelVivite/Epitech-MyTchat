import { toast } from 'react-toastify';

export const toastifyError = (msg: string) => {
  toast.error(msg, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    progress: undefined,
    theme: 'colored',
  });
};

export const toastifySuccess = (msg: string) => {
  toast.success(msg, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    progress: undefined,
    theme: 'colored',
  });
};
