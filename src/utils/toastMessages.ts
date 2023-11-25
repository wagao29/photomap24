import { toast } from 'react-hot-toast';

const className = 'bg-white border-2 border-gray-600 font-bold text-sm';

// Message
export const toastUploadPhotoMessage = () => {
  toast('Upload a photo to your current location', {
    className,
    id: 'UploadPhotoMessage'
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

export const toastGetCurrentPosFailed = () => {
  toast.error('Failed to get current position', {
    className,
    id: 'getCurrentPosFailed'
  });
};

export const toastExifGPSInfoFailed = () => {
  toast.error('Exif GPS info does not exist', {
    className,
    id: 'toastExifGPSInfoFailed'
  });
};

export const toastGetAddressFailed = () => {
  toast.error('Failed to get address', {
    className,
    id: 'toastGetAddressFailed'
  });
};

// Success
export const toastUploadPhotoSuccess = () => {
  toast.success('Upload Success', {
    className,
    id: 'UploadPhotoSuccess'
  });
};
