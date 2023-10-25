import Compressor from 'compressorjs';
import { useCallback, useState } from 'react';
import { createPhoto } from '../apis/createPhoto';
import { fetchAddress } from '../apis/fetchAddress';
import CommonButton from '../components/CommonButton';
import DialogCloseButton from '../components/CloseButton';
import ImageInput from '../components/ImageInput';
import Spinner from '../components/Spinner';
import { Coordinates } from '../types';
import { generateThumbnail } from '../utils/generateThumbnail';

type Props = {
  currentPos?: Coordinates;
};

const useUploadModal = () => {
  const [show, setShow] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<File>();

  const openUploadModal = useCallback(() => {
    setShow(true);
  }, []);

  const closeUploadModal = useCallback(() => {
    setShow(false);
  }, []);

  const UploadModal = ({ currentPos }: Props) => {
    if (!show || !currentPos) return null;

    const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setIsLoading(true);
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          if (reader.result) {
            setIsLoading(false);
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
      try {
        if (!photoFile) return;
        setIsLoading(true);
        const thumbnailBlob = await generateThumbnail(photoFile);
        const address = await fetchAddress(currentPos.latitude, currentPos.longitude);
        await createPhoto(photoFile, thumbnailBlob, currentPos, address);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, [currentPos, photoFile]);

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'gray',
            opacity: '0.5'
          }}
        ></div>
        {isLoading ? (
          <Spinner className={'absolute inset-0 flex items-center justify-center'} />
        ) : (
          <div className='absolute bg-white w-3/4 h-3/4 max-w-sm rounded'>
            <DialogCloseButton onClick={closeUploadModal} />
            <div className='flex flex-col items-center'>
              <img src={imgUrl} />
              <ImageInput onFileChange={onFileChange} className='mt-2' />
              <CommonButton
                color='gray'
                className='absolute inset-x-20 bottom-5'
                onClick={uploadPhoto}
              >
                Upload
              </CommonButton>
            </div>
          </div>
        )}
      </div>
    );
  };

  return { UploadModal, openUploadModal };
};

export default useUploadModal;
