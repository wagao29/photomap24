import { toast } from 'react-hot-toast';

const className = 'border-2 border-gray-600 text-gray-600 font-bold';

export const toastCreatePhotoAtCurrentPos = () => {
  toast('Post a photo at your current location', {
    className,
    id: 'CreatePhotoAtCurrentPos'
  });
};
export const toastCurrentPosError = () => {
  toast.error('Unable to obtain current location', {
    className,
    id: 'CurrentPosError'
  });
};
