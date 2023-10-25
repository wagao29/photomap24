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
      <div className='h-full overflow-scroll hidden-scrollbar rounded-lg bg-black'>
        <div className='relative h-full w-full'>
          <img src={getPhotoUrl(photoId)} className='absolute inset-0 m-auto max-h-full' />
          <p className='absolute bottom-2 left-2 text-white'>{photo.address}</p>
          <p className='absolute bottom-2 right-2 text-white'>{`views: ${photo.views}`}</p>
        </div>
      </div>
    </Dialog>
  );
});
