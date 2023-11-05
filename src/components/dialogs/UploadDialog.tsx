import Compressor from 'compressorjs';
import { memo, useCallback, useState } from 'react';
import { Coordinates } from '../../types';
import { Dialog } from '../templates/Dialog';
import CloseButton from '../buttons/CloseButton';
import { generateThumbnail } from '../../utils/generateThumbnail';
import { fetchAddress } from '../../apis/fetchAddress';
import { createPhoto } from '../../apis/createPhoto';
import Spinner from '../Spinner';
import {
  toastLoadingPhotoFailed,
  toastPhotoFileSizeError,
  toastUploadPhotoFailed,
  toastUploadPhotoSuccess
} from '../../utils/toastMessages';
import iconPhoto from '../../assets/icon_photo.svg';
import UploadButton from '../buttons/UploadButton';
import { MapRef } from 'react-map-gl';
import { useDialogContext } from '../../providers/DialogProvider';
import { PhotoDialog } from './PhotoDialog';
import { TermsDialog } from './TermsDialog';
import { PrivacyDialog } from './PrivacyDialog';
import { CLOSE_BUTTON_WHITE, MAX_PHOTO_FILE_SIZE } from '../../constants';
import InputButton from '../buttons/InputButton';

type Props = {
  currentPos: Coordinates;
  mapRef: React.RefObject<MapRef>;
  onClose: () => void;
};

export const UploadDialog = memo(function UploadDialogBase({ currentPos, mapRef, onClose }: Props) {
  const [imgUrl, setImgUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<File>();

  const { openDialog, closeDialog } = useDialogContext();

  const openTermsDialog = () => openDialog(<TermsDialog onClose={closeDialog} />);
  const openPrivacyDialog = () => openDialog(<PrivacyDialog onClose={closeDialog} />);

  const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsLoading(true);
      new Compressor(e.target.files[0], {
        quality: 0.2,
        convertTypes: 'image/jpeg',
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
      openDialog(
        <PhotoDialog
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
    <Dialog height='80%'>
      <CloseButton color={CLOSE_BUTTON_WHITE} onClick={onClose} />
      <div className='h-full relative overflow-scroll hidden-scrollbar rounded-lg bg-black'>
        {isLoading && (
          <Spinner className='absolute z-10 inset-0 flex items-center justify-center bg-black' />
        )}
        {imgUrl ? (
          <>
            <img src={imgUrl} className='absolute inset-0 m-auto max-h-full' />
            <p className='absolute absolute bottom-2 text-white text-xs px-2 text-center'>
              {`By uploading a photo, you agree to PhotoMap24's `}
              <button className='underline underline-offset-2' onClick={openTermsDialog}>
                Terms of Service
              </button>
              {` and `}
              <button className='underline underline-offset-2' onClick={openPrivacyDialog}>
                Privacy Policy
              </button>
            </p>
            <UploadButton className='absolute inset-x-20 bottom-12' onClick={uploadPhoto} />
          </>
        ) : (
          <>
            <img src={iconPhoto} width={150} height={150} className='absolute inset-0 m-auto' />
            <InputButton className='absolute inset-x-20 bottom-12' onFileChange={onFileChange} />
          </>
        )}
      </div>
    </Dialog>
  );
});
