import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
};

const ExifCheckBox = memo(function ExifCheckBox({ disabled, onChange, className }: Props) {
  return (
    <div className={twMerge(className, 'flex items-center bg-gray-500 p-1.5 rounded-l')}>
      <input
        type='checkbox'
        id='exif-pos-check'
        disabled={disabled}
        className='w-4 h-4 mr-1.5 accent-yellow-500 rounded hover:cursor-pointer disabled:bg-gray-400'
        onChange={onChange}
      />
      <label
        htmlFor='exif-pos-check'
        className={twMerge(
          'text-xs hover:cursor-pointer',
          disabled ? 'text-gray-400' : 'text-white'
        )}
      >
        Use Exif GPS data
      </label>
    </div>
  );
});

export default ExifCheckBox;
