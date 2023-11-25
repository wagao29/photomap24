import Compressor from 'compressorjs';
import { memo, useCallback, useState } from 'react';
import { MapRef } from 'react-map-gl';
import { createPhoto } from '../../apis/createPhoto';
import { fetchAddress } from '../../apis/fetchAddress';
import iconPhoto from '../../assets/icon_photo.svg';
import {
  CLOSE_BUTTON_WHITE,
  GEO_SOURCE_CURRENT_LOCATION,
  GEO_SOURCE_EXIF_GEO_INFO,
  MAX_PHOTO_FILE_SIZE,
  MAX_ZOOM,
  PLACEHOLDER_SIZE
} from '../../constants';
import { useModalContext } from '../../providers/ModalProvider';
import { Coordinates, GeoSource } from '../../types';
import { generateThumbnail } from '../../utils/generateThumbnail';
import { getCurrentPosition } from '../../utils/getCurrentPosition';
import { getExifCoords } from '../../utils/getExifCoords';
import {
  toastExifGPSInfoFailed,
  toastGetAddressFailed,
  toastGetCurrentPosFailed,
  toastLoadingPhotoFailed,
  toastPhotoFileSizeError,
  toastUploadPhotoFailed,
  toastUploadPhotoSuccess
} from '../../utils/toastMessages';
import CloseButton from '../buttons/CloseButton';
import UploadButton from '../buttons/UploadButton';
import Spinner from '../Spinner';
import FileInput from '../templates/FileInput';
import GeoSourceSelector from '../templates/GeoSourceSelector';
import { Modal } from '../templates/Modal';
import Note from '../templates/Note';
import { PhotoModal } from './PhotoModal';
import { PrivacyModal } from './PrivacyModal';
import { TermsModal } from './TermsModal';

type Props = {
  mapRef: React.RefObject<MapRef>;
  onClose: () => void;
};

export const UploadModal = memo(function UploadModal({ mapRef, onClose }: Props) {
  const [imgUrl, setImgUrl] = useState<string>();
  const [position, setPosition] = useState<Coordinates>();
  const [address, setAddress] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<File>();
  const [geoSource, setGeoSource] = useState<GeoSource>(GEO_SOURCE_CURRENT_LOCATION);

  const { openModal, closeModal } = useModalContext();

  const onClickTerms = useCallback(() => openModal(<TermsModal onClose={closeModal} />), []);
  const onClickPrivacy = useCallback(() => openModal(<PrivacyModal onClose={closeModal} />), []);

  const onOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeoSource(e.target.value as GeoSource);
  };

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setIsLoading(true);

        let pos;
        if (geoSource === GEO_SOURCE_CURRENT_LOCATION) {
          pos = await getCurrentPosition().catch((err) => {
            console.warn(err);
            toastGetCurrentPosFailed();
            setIsLoading(false);
            (e.target.value as unknown) = null;
          });
        } else if (geoSource === GEO_SOURCE_EXIF_GEO_INFO) {
          pos = await getExifCoords(e.target.files[0]).catch((err) => {
            console.warn(err);
            toastExifGPSInfoFailed();
            setIsLoading(false);
            (e.target.value as unknown) = null;
          });
        }

        if (!pos) return;
        const addr = await fetchAddress(pos.latitude, pos.longitude).catch((err) => {
          console.warn(err);
          toastGetAddressFailed();
          setIsLoading(false);
          (e.target.value as unknown) = null;
        });

        if (!addr) return;
        setPosition(pos);
        setAddress(addr);
        mapRef.current?.jumpTo({
          center: [pos.longitude, pos.latitude],
          zoom: MAX_ZOOM
        });

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
            console.log(err.message);
            toastLoadingPhotoFailed();
            setIsLoading(false);
          }
        });
      }
    },
    [geoSource]
  );

  const uploadPhoto = useCallback(async () => {
    if (!photoFile || !position || !address) return;

    try {
      setIsLoading(true);
      const thumbnailBlob = await generateThumbnail(photoFile);
      const photoId = await createPhoto(photoFile, thumbnailBlob, position, address);
      toastUploadPhotoSuccess();
      setIsLoading(false);
      openModal(
        <PhotoModal
          mapPhotos={[{ id: photoId, pos: position, addr: address, date: new Date() }]}
          mapRef={mapRef}
          onClose={onClose}
        />
      );
    } catch (error) {
      console.warn(error);
      toastUploadPhotoFailed();
      onClose();
      setIsLoading(false);
    }
  }, [photoFile, position, address]);

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
              {address}
            </p>
            <img src={imgUrl} className='absolute inset-0 m-auto max-h-full py-10' />
            <UploadButton className='absolute inset-x-20 bottom-12' onClick={uploadPhoto} />
            <Note
              onClickTerms={onClickTerms}
              onClickPrivacy={onClickPrivacy}
              className='absolute bottom-2 px-2'
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
            <GeoSourceSelector
              geoSource={geoSource}
              onChange={onOptionChange}
              className='absolute bottom-28 left-1/2 transform -translate-x-1/2'
            />
            <FileInput onChange={onFileChange} className='absolute inset-x-20 bottom-12' />
          </>
        )}
      </div>
    </Modal>
  );
});
