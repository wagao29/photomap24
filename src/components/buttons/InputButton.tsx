import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  className: string;
};

const baseStyle = `p-2 border-2 border-white rounded-lg font-bold text-center text-white 
active:bg-white active:text-black hover:bg-white hover:text-black hover:cursor-pointer`;

const InputButton = memo(function ImageInputBase({ onFileChange, className }: Props) {
  return (
    <label className={twMerge(baseStyle, className)}>
      Select Photo
      <input type='file' accept='image/*' onChange={onFileChange} style={{ display: 'none' }} />
    </label>
  );
});

export default InputButton;
