import { toast } from 'react-hot-toast';

const className = 'bg-white border-2 border-gray-600 font-bold text-sm';

// Success
export const toastUploadPhotoSuccess = () => {
  toast.success('Upload Success', {
    className,
    id: 'UploadPhotoSuccess'
  });
};

// Error
export const toastUploadPhotoError = () => {
  toast.error('Upload Failed', {
    className,
    id: 'UploadPhotoError'
  });
};

export const toastLoadingPhotoError = () => {
  toast.error('Loading Photo Failed', {
    className,
    id: 'LoadingPhotoError'
  });
};

export const toastPhotoFileSizeError = () => {
  toast.error('File size is too large', {
    className,
    id: 'PhotoFileSizeError'
  });
};

export const toastGetAddressError = () => {
  toast.error('Failed to get address', {
    className,
    id: 'GetAddressError'
  });
};
