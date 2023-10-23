import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  className: string;
};

const ImageInput = memo(function ImageInputBase({ onFileChange, className }: Props) {
  return (
    <label
      className={twMerge(
        'text-xs text-gray-600 py-1 px-3 font-bold rounded-lg border-2 border-gray-600 active:bg-gray-200 hover:cursor-pointer',
        className
      )}
    >
      Select Photo
      <input type='file' accept='image/*' onChange={onFileChange} style={{ display: 'none' }} />
    </label>
  );
});

export default ImageInput;
