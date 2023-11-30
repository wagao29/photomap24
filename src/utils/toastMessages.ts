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
export const toastUploadPhotoFailed = () => {
  toast.error('Upload Failed', {
    className,
    id: 'UploadPhotoFailed'
  });
};

export const toastLoadingPhotoFailed = () => {
  toast.error('Loading Photo Failed', {
    className,
    id: 'LoadingPhotoFailed'
  });
};

export const toastNoPhotosError = () => {
  toast.error('There are no photos', {
    className,
    id: 'NoPhotosError'
  });
};

export const toastPhotoFileSizeError = () => {
  toast.error('File size is too large', {
    className,
    id: 'PhotoFileSizeError'
  });
};

export const toastGetAddressFailed = () => {
  toast.error('Failed to get address', {
    className,
    id: 'toastGetAddressFailed'
  });
};
