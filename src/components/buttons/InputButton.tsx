import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  className: string;
};

const baseStyle =
  'p-2 border-2 border-gray-300 bg-white rounded-lg font-bold text-center active:bg-gray-300 hover:bg-gray-300 hover:cursor-pointer';

const InputButton = memo(function ImageInputBase({ onFileChange, className }: Props) {
  return (
    <label className={twMerge(baseStyle, className)}>
      Select Photo
      <input type='file' accept='image/*' onChange={onFileChange} style={{ display: 'none' }} />
    </label>
  );
});

export default InputButton;
