import Compressor from 'compressorjs';
import { memo, useCallback, useState } from 'react';
import { MapRef } from 'react-map-gl';
import { createPhoto } from '../../apis/createPhoto';
import { fetchAddress } from '../../apis/fetchAddress';
import iconPhoto from '../../assets/icon_photo.svg';
import { CLOSE_BUTTON_WHITE, MAX_PHOTO_FILE_SIZE, PLACEHOLDER_SIZE } from '../../constants';
import { useModalContext } from '../../providers/ModalProvider';
import { Coordinates } from '../../types';
import { generateThumbnail } from '../../utils/generateThumbnail';
import {
  toastLoadingPhotoFailed,
  toastPhotoFileSizeError,
  toastUploadPhotoFailed,
  toastUploadPhotoSuccess
} from '../../utils/toastMessages';
import CloseButton from '../buttons/CloseButton';
import InputButton from '../buttons/InputButton';
import UploadButton from '../buttons/UploadButton';
import Spinner from '../Spinner';
import { Modal } from '../templates/Modal';
import Note from '../templates/Note';
import { PhotoModal } from './PhotoModal';
import { PrivacyModal } from './PrivacyModal';
import { TermsModal } from './TermsModal';

type Props = {
  currentPos: Coordinates;
  mapRef: React.RefObject<MapRef>;
  onClose: () => void;
};

export const UploadModal = memo(function UploadModal({ currentPos, mapRef, onClose }: Props) {
  const [imgUrl, setImgUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<File>();

  const { openModal, closeModal } = useModalContext();

  const onClickTerms = useCallback(() => openModal(<TermsModal onClose={closeModal} />), []);
  const onClickPrivacy = useCallback(() => openModal(<PrivacyModal onClose={closeModal} />), []);

  const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsLoading(true);
      new Compressor(e.target.files[0], {
        quality: 0.8,
        convertTypes: 'image/jpeg',
        maxHeight: 1080,
        maxWidth: 1080,
        success(result) {
          if (result.size > MAX_PHOTO_FILE_SIZE) {
            toastPhotoFileSizeError();
          } else {
            setImgUrl(window.URL.createObjectURL(result));
            setPhotoFile(result as File);
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
  }, []);

  const uploadPhoto = useCallback(async () => {
    if (!photoFile) return;

    try {
      setIsLoading(true);
      const thumbnailBlob = await generateThumbnail(photoFile);
      const address = await fetchAddress(currentPos.latitude, currentPos.longitude);
      const photoId = await createPhoto(photoFile, thumbnailBlob, currentPos, address);
      toastUploadPhotoSuccess();
      setIsLoading(false);
      openModal(
        <PhotoModal
          mapPhotos={[{ id: photoId, pos: currentPos, addr: address, date: new Date() }]}
          mapRef={mapRef}
          onClose={onClose}
        />
      );
    } catch (error) {
      console.error(error);
      toastUploadPhotoFailed();
      onClose();
      setIsLoading(false);
    }
  }, [currentPos, photoFile]);

  return (
    <Modal height='80%'>
      <CloseButton color={CLOSE_BUTTON_WHITE} onClick={onClose} />
      <div className='h-full relative overflow-scroll hidden-scrollbar rounded-lg bg-black'>
        {isLoading && (
          <Spinner className='absolute z-20 inset-0 flex items-center justify-center bg-black' />
        )}
        {imgUrl ? (
          <>
            <img src={imgUrl} className='absolute inset-0 m-auto max-h-full py-10' />
            <Note
              onClickTerms={onClickTerms}
              onClickPrivacy={onClickPrivacy}
              className='absolute bottom-2 px-2'
            />
            <UploadButton className='absolute inset-x-20 bottom-12' onClick={uploadPhoto} />
          </>
        ) : (
          <>
            <img
              src={iconPhoto}
              width={PLACEHOLDER_SIZE}
              height={PLACEHOLDER_SIZE}
              className='absolute inset-0 m-auto'
            />
            <InputButton className='absolute inset-x-20 bottom-12' onFileChange={onFileChange} />
          </>
        )}
      </div>
    </Modal>
  );
});
