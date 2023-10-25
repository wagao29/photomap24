import { memo, useCallback, useEffect, useState } from 'react';
import { fetchPhoto } from '../apis/fetchPhoto';
import { viewPhoto } from '../apis/viewPhoto';
import { FETCH_ERROR_NOT_EXISTS, FETCH_ERROR_OTHERS } from '../constants';
import { Photo } from '../types';
import { getPhotoUrl } from '../utils/getPhotoUrl';
import { Dialog } from './Dialog';
import CloseButton from './CloseButton';
import NextButton from './NextButton';
import PrevButton from './PrevButton';

type Props = {
  photoIds: string[];
  onClose: () => void;
};

export const PhotoDialog = memo(function PhotoDialogBase({ photoIds, onClose }: Props) {
  const [photo, setPhoto] = useState<Photo>();
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const result = await fetchPhoto(photoIds[currentIdx]);
      if (result === FETCH_ERROR_NOT_EXISTS) {
        onClose();
      } else if (result === FETCH_ERROR_OTHERS) {
        onClose();
      } else {
        setPhoto({ ...result, views: result.views + 1 });
        viewPhoto(photoIds[currentIdx]);
      }
    })();
  }, [currentIdx]);

  const onClickPrevBtn = useCallback(() => {
    setCurrentIdx((idx) => idx - 1);
  }, []);

  const onClickNextBtn = useCallback(() => {
    setCurrentIdx((idx) => idx + 1);
  }, []);

  if (!photo) return null;

  return (
    <Dialog height='80%'>
      <CloseButton onClick={onClose} />
      <PrevButton onClick={onClickPrevBtn} visible={currentIdx > 0} />
      <NextButton onClick={onClickNextBtn} visible={currentIdx < photoIds.length - 1} />
      <div className='h-full overflow-scroll hidden-scrollbar rounded-lg bg-black'>
        <div className='relative h-full w-full'>
          <p className='absolute top-2 left-2 text-white'>{photo.id}</p>
          <img
            src={getPhotoUrl(photoIds[currentIdx])}
            className='absolute inset-0 m-auto max-h-full'
          />
          <p className='absolute bottom-2 left-2 text-white'>{photo.address}</p>
          <p className='absolute bottom-2 right-2 text-white'>{`views: ${photo.views}`}</p>
        </div>
      </div>
    </Dialog>
  );
});
