import { memo, useCallback, useState } from 'react';
import { CLOSE_BUTTON_WHITE, MAX_ZOOM, PLACEHOLDER_SIZE } from '../../constants';
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
import Spinner from '../Spinner';
import Address from '../Address';

type Props = {
  mapPhotos: MapPhoto[];
  mapRef: React.RefObject<MapRef>;
  onClose: () => void;
};

export const PhotoDialog = memo(function PhotoDialogBase({ mapPhotos, mapRef, onClose }: Props) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(getRemainingTime(mapPhotos[0].date));
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const onClickPrevBtn = useCallback(() => {
    if (currentIdx > 0) {
      setIsLoading(true);
      setIsExpired(false);
      setRemainingTime(getRemainingTime(mapPhotos[currentIdx - 1].date));
      setCurrentIdx(currentIdx - 1);
    }
  }, [currentIdx]);

  const onClickNextBtn = useCallback(() => {
    if (currentIdx < mapPhotos.length - 1) {
      setIsLoading(true);
      setIsExpired(false);
      setRemainingTime(getRemainingTime(mapPhotos[currentIdx + 1].date));
      setCurrentIdx(currentIdx + 1);
    }
  }, [currentIdx]);

  const onExpire = useCallback(() => {
    setIsExpired(true);
  }, []);

  const onClickAddress = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.jumpTo({
        center: [mapPhotos[currentIdx].pos.longitude, mapPhotos[currentIdx].pos.latitude],
        zoom: MAX_ZOOM
      });
      onClose();
    }
  }, [mapRef.current, currentIdx]);

  return (
    <Dialog height='80%'>
      <CloseButton color={CLOSE_BUTTON_WHITE} onClick={onClose} />
      <PrevButton onClick={onClickPrevBtn} visible={!isLoading && currentIdx > 0} />
      <NextButton
        onClick={onClickNextBtn}
        visible={!isLoading && currentIdx < mapPhotos.length - 1}
      />
      <div className='h-full relative overflow-scroll hidden-scrollbar rounded-lg bg-black'>
        {isLoading && (
          <Spinner className='absolute z-10 inset-0 flex items-center justify-center bg-black' />
        )}
        <Timer
          className='absolute z-20 top-2 left-2 text-white'
          initTime={remainingTime}
          onExpire={onExpire}
        />
        {isExpired ? (
          <img
            src={iconPhoto}
            width={PLACEHOLDER_SIZE}
            height={PLACEHOLDER_SIZE}
            className='absolute inset-0 m-auto'
            onLoad={() => {
              setIsLoading(false);
            }}
          />
        ) : (
          <img
            src={getPhotoUrl(mapPhotos[currentIdx].id)}
            onLoad={() => {
              setIsLoading(false);
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              setIsLoading(false);
              e.currentTarget.onerror = null;
              e.currentTarget.src = iconPhoto;
            }}
            className='absolute inset-0 m-auto max-h-full'
          />
        )}
        <Address className='absolute z-20 bottom-5 right-1' onClick={onClickAddress}>
          {mapPhotos[currentIdx].addr}
        </Address>
        <OsmCopyRight className='absolute z-20 bottom-1 right-1' />
      </div>
    </Dialog>
  );
});
