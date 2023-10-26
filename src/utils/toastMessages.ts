import { toast } from 'react-hot-toast';

const className = 'border-2 border-gray-600 text-gray-600 font-bold';

export const toastCurrentPosError = () => {
  toast.error('Unable to obtain current location', {
    className,
    id: 'CurrentPosError'
  });
};

export const toastUploadPhotoMessage = () => {
  toast('Upload a photo to your current location', {
    className,
    id: 'UploadPhotoMessage'
  });
};

export const toastUploadPhotoSuccess = () => {
  toast.success('Upload Success', {
    className,
    id: 'UploadPhotoSuccess'
  });
};

export const toastUploadPhotoFailed = () => {
  toast.error('Upload Failed', {
    className,
    id: 'UploadPhotoFailed'
  });
};

export const toastReloadMessage = () => {
  toast.loading('Reload', {
    className,
    id: 'ReloadMessage'
  });
};
