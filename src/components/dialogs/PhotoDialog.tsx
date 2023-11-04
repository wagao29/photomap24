import { memo, useCallback, useEffect, useState } from 'react';
import { CLOSE_BUTTON_WHITE, MAX_ZOOM } from '../../constants';
import { MapPhoto } from '../../types';
import { getPhotoUrl } from '../../utils/getPhotoUrl';
import { Dialog } from '../templates/Dialog';
import CloseButton from '../buttons/CloseButton';
import NextButton from '../buttons/NextButton';
import PrevButton from '../buttons/PrevButton';
import Timer from '../templates/Timer';
import iconPhoto from '../../assets/icon_photo.svg';
import { getRemainingTime } from '../../utils/getRemainingTime';
import { MapRef } from 'react-map-gl';
import OsmCopyRight from '../OsmCopyRight';

type Props = {
  mapPhotos: MapPhoto[];
  mapRef: React.RefObject<MapRef>;
  onClose: () => void;
};

export const PhotoDialog = memo(function PhotoDialogBase({ mapPhotos, mapRef, onClose }: Props) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsExpired(false);
      setRemainingTime(getRemainingTime(mapPhotos[currentIdx].date));
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

  const onClickAddress = () => {
    if (mapRef.current) {
      mapRef.current.jumpTo({
        center: [mapPhotos[currentIdx].pos.longitude, mapPhotos[currentIdx].pos.latitude],
        zoom: MAX_ZOOM
      });
      onClose();
    }
  };

  return (
    <Dialog height='80%'>
      <CloseButton color={CLOSE_BUTTON_WHITE} onClick={onClose} />
      <PrevButton onClick={onClickPrevBtn} visible={currentIdx > 0} />
      <NextButton onClick={onClickNextBtn} visible={currentIdx < mapPhotos.length - 1} />
      <div className='h-full overflow-scroll hidden-scrollbar rounded-lg bg-black'>
        <div className='relative h-full w-full'>
          <Timer
            className='absolute z-10 top-2 left-2 text-white'
            initTime={remainingTime}
            onExpire={onExpire}
          />
          {isExpired ? (
            <img src={iconPhoto} className='absolute inset-0 m-auto max-h-full' />
          ) : (
            <img
              src={getPhotoUrl(mapPhotos[currentIdx].id)}
              className='absolute inset-0 m-auto max-h-full'
            />
          )}
          <p
            className='absolute z-10 bottom-5 right-1 text-white underline'
            onClick={onClickAddress}
          >
            {mapPhotos[currentIdx].addr}
          </p>
          <OsmCopyRight className='absolute z-10 bottom-1 right-1' />
        </div>
      </div>
    </Dialog>
  );
});
