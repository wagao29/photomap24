import Compressor from 'compressorjs';
import { memo, useCallback, useState } from 'react';
import { GeolocateErrorEvent, MapRef } from 'react-map-gl';
import { createPhoto } from '../../apis/createPhoto';
import { fetchAddress } from '../../apis/fetchAddress';
import iconPhoto from '../../assets/icon_photo.svg';
import {
  CLOSE_BUTTON_WHITE,
  MAX_PHOTO_FILE_SIZE,
  MAX_ZOOM,
  PLACEHOLDER_SIZE
} from '../../constants';
import { useModalContext } from '../../providers/ModalProvider';
import { Coordinates } from '../../types';
import { generateThumbnail } from '../../utils/generateThumbnail';
import { getCurrentPosition } from '../../utils/getCurrentPosition';
import { getExifCoords } from '../../utils/getExifCoords';
import {
  toastGetAddressFailed,
  toastLoadingPhotoFailed,
  toastPhotoFileSizeError,
  toastUploadPhotoFailed,
  toastUploadPhotoSuccess
} from '../../utils/toastMessages';
import CloseButton from '../buttons/CloseButton';
import UploadButton from '../buttons/UploadButton';
import Spinner from '../Spinner';
import ExifCheckBox from '../templates/ExifCheckBox';
import FileInput from '../templates/FileInput';
import { Modal } from '../templates/Modal';
import Note from '../templates/Note';
import { PhotoModal } from './PhotoModal';
import { PrivacyModal } from './PrivacyModal';
import { TermsModal } from './TermsModal';

type Props = {
  mapRef: React.RefObject<MapRef>;
  onGeolocateError: (err: GeolocateErrorEvent) => void;
  onClose: () => void;
};

type PosInfo = {
  coords: Coordinates;
  address: string;
};

export const UploadModal = memo(function UploadModal({ mapRef, onGeolocateError, onClose }: Props) {
  const [imgUrl, setImgUrl] = useState<string>();
  const [currentPosInfo, setCurrentPosInfo] = useState<PosInfo | null>(null);
  const [exifPosInfo, setExifPosInfo] = useState<PosInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<File>();
  const [useExif, setUseExif] = useState<boolean>(false);

  const { openModal, closeModal } = useModalContext();

  const onClickTerms = useCallback(() => openModal(<TermsModal onClose={closeModal} />), []);
  const onClickPrivacy = useCallback(() => openModal(<PrivacyModal onClose={closeModal} />), []);

  const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsLoading(true);

      const currentCoords = await getCurrentPosition().catch((err) => {
        console.warn(err);
        onGeolocateError(err);
        setIsLoading(false);
      });

      if (!currentCoords) return;

      const currentAddress = await fetchAddress(
        currentCoords.latitude,
        currentCoords.longitude
      ).catch((err) => {
        console.warn(err);
        toastGetAddressFailed();
        setIsLoading(false);
        (e.target.value as unknown) = null;
      });

      if (!currentAddress) return;

      setCurrentPosInfo({ coords: currentCoords, address: currentAddress });

      mapRef.current?.jumpTo({
        center: [currentCoords.longitude, currentCoords.latitude],
        zoom: MAX_ZOOM
      });

      try {
        const exifCoords = await getExifCoords(e.target.files[0]);
        if (exifCoords) {
          const exifAddress = await fetchAddress(exifCoords.latitude, exifCoords.longitude);
          if (exifAddress) {
            setExifPosInfo({ coords: exifCoords, address: exifAddress });
          }
        }
      } catch (err) {
        console.warn(err);
      }

      new Compressor(e.target.files[0], {
        quality: 0.8,
        convertTypes: 'image/jpeg',
        maxHeight: 1080,
        maxWidth: 1080,
        success(pos) {
          if (pos.size > MAX_PHOTO_FILE_SIZE) {
            toastPhotoFileSizeError();
          } else {
            setImgUrl(window.URL.createObjectURL(pos));
            setPhotoFile(pos as File);
          }
          setIsLoading(false);
        },
        error(err) {
          console.warn(err);
          toastLoadingPhotoFailed();
          setIsLoading(false);
          (e.target.value as unknown) = null;
        }
      });
    }
  }, []);

  const onCheckBoxChange = useCallback(() => {
    if (useExif && currentPosInfo) {
      mapRef.current?.jumpTo({
        center: [currentPosInfo?.coords.longitude, currentPosInfo.coords.latitude],
        zoom: MAX_ZOOM
      });
    } else if (exifPosInfo) {
      mapRef.current?.jumpTo({
        center: [exifPosInfo.coords.longitude, exifPosInfo.coords.latitude],
        zoom: MAX_ZOOM
      });
    }
    setUseExif(!useExif);
  }, [useExif, currentPosInfo, exifPosInfo]);

  const uploadPhoto = useCallback(async () => {
    if (!photoFile || !currentPosInfo) return;
    try {
      setIsLoading(true);
      const thumbnailBlob = await generateThumbnail(photoFile);
      const posInfo = useExif && exifPosInfo ? exifPosInfo : currentPosInfo;
      const photoId = await createPhoto(photoFile, thumbnailBlob, posInfo.coords, posInfo.address);
      toastUploadPhotoSuccess();
      setIsLoading(false);
      openModal(
        <PhotoModal
          mapPhotos={[
            { id: photoId, pos: posInfo.coords, addr: posInfo.address, date: new Date() }
          ]}
          mapRef={mapRef}
          onClose={onClose}
        />
      );
    } catch (err) {
      console.warn(err);
      toastUploadPhotoFailed();
      onClose();
      setIsLoading(false);
    }
  }, [photoFile, useExif, currentPosInfo, exifPosInfo]);

  return (
    <Modal height='80%'>
      <CloseButton color={CLOSE_BUTTON_WHITE} onClick={onClose} />
      <div className='h-full relative overflow-scroll hidden-scrollbar rounded-lg bg-black'>
        {isLoading && (
          <Spinner className='absolute z-20 inset-0 flex items-center justify-center bg-black' />
        )}
        {imgUrl ? (
          <>
            <p className='absolute left-1/2 transform -translate-x-1/2 top-3 text-white'>
              {useExif ? exifPosInfo?.address : currentPosInfo?.address}
            </p>
            <ExifCheckBox
              disabled={exifPosInfo === null}
              onChange={onCheckBoxChange}
              className='absolute top-12 right-0 z-10'
            />
            <img src={imgUrl} className='absolute inset-0 m-auto max-h-full py-10' />
            <UploadButton className='absolute inset-x-20 bottom-12 z-10' onClick={uploadPhoto} />
            <Note
              onClickTerms={onClickTerms}
              onClickPrivacy={onClickPrivacy}
              className='absolute bottom-2 px-2 z-10'
            />
          </>
        ) : (
          <>
            <img
              src={iconPhoto}
              width={PLACEHOLDER_SIZE}
              height={PLACEHOLDER_SIZE}
              className='absolute inset-0 m-auto'
            />
            <FileInput onChange={onFileChange} className='absolute inset-x-20 bottom-12 z-10' />
          </>
        )}
      </div>
    </Modal>
  );
});
