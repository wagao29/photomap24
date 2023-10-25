import { memo, useEffect, useState } from 'react';
import { fetchPhoto } from '../apis/fetchPhoto';
import { viewPhoto } from '../apis/viewPhoto';
import { FETCH_ERROR_NOT_EXISTS, FETCH_ERROR_OTHERS } from '../constants';
import { Photo } from '../types';
import { getPhotoUrl } from '../utils/getPhotoUrl';
import { Dialog } from './Dialog';
import DialogCloseButton from './DialogCloseButton';

type Props = {
  photoId: string;
  onClose: () => void;
};

export const PhotoDialog = memo(function PhotoDialogBase({ photoId, onClose }: Props) {
  const [photo, setPhoto] = useState<Photo>();

  useEffect(() => {
    (async () => {
      const result = await fetchPhoto(photoId);
      if (result === FETCH_ERROR_NOT_EXISTS) {
        onClose();
      } else if (result === FETCH_ERROR_OTHERS) {
        onClose();
      } else {
        setPhoto({ ...result, views: result.views + 1 });
        viewPhoto(photoId);
      }
    })();
  }, [photoId]);

  if (!photo) return null;

  return (
    <Dialog height='80%'>
      <DialogCloseButton onClick={onClose} />
      <div className='max-h-full overflow-scroll hidden-scrollbar rounded-lg border-2 border-gray-500 bg-white'>
        <img src={getPhotoUrl(photoId)} />
        <div className='flex justify-between p-2'>
          <p>{photo.address}</p>
          <p>{`views: ${photo.views}`}</p>
        </div>
      </div>
    </Dialog>
  );
});
