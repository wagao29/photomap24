import Compressor from 'compressorjs';
import { memo, useCallback, useState } from 'react';
import { Coordinates } from '../types';
import { Dialog } from './Dialog';
import CloseButton from './CloseButton';
import ImageInput from './ImageInput';
import { generateThumbnail } from '../utils/generateThumbnail';
import { fetchAddress } from '../apis/fetchAddress';
import { createPhoto } from '../apis/createPhoto';
import Spinner from './Spinner';
import { toastUploadPhotoFailed, toastUploadPhotoSuccess } from '../utils/toastMessages';
import iconPhoto from '../assets/icon_photo.svg';
import UploadButton from './UploadButton';

type Props = {
  currentPos: Coordinates;
  onClose: () => void;
};

export const UploadDialog = memo(function UploadDialogBase({ currentPos, onClose }: Props) {
  const [imgUrl, setImgUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<File>();

  const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (reader.result) {
          setImgUrl(reader.result.toString());
        }
      });
      new Compressor(e.target.files[0], {
        quality: 0.6,
        convertTypes: 'image/jpeg',
        maxWidth: 480,
        success(result) {
          reader.readAsDataURL(result);
          setPhotoFile(result as File);
        },
        error(err) {
          console.log(err.message);
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
      await createPhoto(photoFile, thumbnailBlob, currentPos, address);
      toastUploadPhotoSuccess();
    } catch (error) {
      console.error(error);
      toastUploadPhotoFailed();
    } finally {
      setIsLoading(false);
      onClose();
    }
  }, [currentPos, photoFile]);

  return (
    <Dialog height='80%'>
      {isLoading ? (
        <Spinner className={'absolute inset-0 flex items-center justify-center'} />
      ) : (
        <div className='h-full overflow-scroll hidden-scrollbar rounded-lg bg-black'>
          <CloseButton onClick={onClose} />
          {imgUrl ? (
            <>
              <img src={imgUrl} className='absolute inset-0 m-auto max-h-full' />
              <UploadButton className='absolute inset-x-20 bottom-5' onClick={uploadPhoto} />
            </>
          ) : (
            <>
              <img src={iconPhoto} width={150} height={150} className='absolute inset-0 m-auto' />
              <ImageInput className='absolute inset-x-20 bottom-5' onFileChange={onFileChange} />
            </>
          )}
        </div>
      )}
    </Dialog>
  );
});
