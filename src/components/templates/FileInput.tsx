import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  className: string;
};

const baseStyle =
  'p-2.5 bg-white rounded-lg font-bold text-center active:bg-gray-300 hover:bg-gray-300 hover:cursor-pointer';

const FileInput = memo(function ImageInput({ onChange, className }: Props) {
  return (
    <label className={twMerge(baseStyle, className)}>
      Select Photo
      <input type='file' accept='image/*' onChange={onChange} className='hidden' />
    </label>
  );
});

export default FileInput;
