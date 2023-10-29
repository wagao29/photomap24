import { memo, useCallback, useEffect, useState } from 'react';
import { fetchPhoto } from '../apis/fetchPhoto';
import { viewPhoto } from '../apis/viewPhoto';
import { FETCH_ERROR_NOT_EXISTS, FETCH_ERROR_OTHERS } from '../constants';
import { Coordinates, Photo } from '../types';
import { getPhotoUrl } from '../utils/getPhotoUrl';
import { Dialog } from './Dialog';
import CloseButton from './CloseButton';
import NextButton from './NextButton';
import PrevButton from './PrevButton';
import Timer from './Timer';
import iconPhoto from '../assets/icon_photo.svg';
import { getRemainingTime } from '../utils/getRemainingTime';

type Props = {
  photoIds: string[];
  setMapPos: (pos: Coordinates) => void;
  onClose: () => void;
};

export const PhotoDialog = memo(function PhotoDialogBase({ photoIds, setMapPos, onClose }: Props) {
  const [photo, setPhoto] = useState<Photo>();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsExpired(false);
      const result = await fetchPhoto(photoIds[currentIdx]);
      if (result === FETCH_ERROR_NOT_EXISTS) {
        onClose();
      } else if (result === FETCH_ERROR_OTHERS) {
        onClose();
      } else {
        setPhoto({ ...result, views: result.views + 1 });
        setMapPos(result.pos);
        setRemainingTime(getRemainingTime(result.expireAt.getTime()));
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

  const onExpire = useCallback(() => {
    setIsExpired(true);
  }, []);

  if (!photo) return null;

  return (
    <Dialog height='80%'>
      <CloseButton onClick={onClose} />
      <PrevButton onClick={onClickPrevBtn} visible={currentIdx > 0} />
      <NextButton onClick={onClickNextBtn} visible={currentIdx < photoIds.length - 1} />
      <div className='h-full overflow-scroll hidden-scrollbar rounded-lg bg-black'>
        <div className='relative h-full w-full'>
          <Timer
            className='absolute top-2 left-2 text-white'
            initTime={remainingTime}
            onExpire={onExpire}
          />
          {isExpired ? (
            <img src={iconPhoto} className='absolute inset-0 m-auto max-h-full' />
          ) : (
            <img
              src={getPhotoUrl(photoIds[currentIdx])}
              className='absolute inset-0 m-auto max-h-full'
            />
          )}
          <p className='absolute bottom-2 left-2 text-white'>{photo.address}</p>
          <p className='absolute bottom-2 right-2 text-white'>{`views: ${photo.views}`}</p>
        </div>
      </div>
    </Dialog>
  );
});
