import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  className: string;
  onClick: () => void;
};

const baseStyle =
  'p-2 font-bold rounded-lg border-2 bg-cyan-500 text-white active:bg-cyan-400 hover:bg-cyan-400';

const UploadButton = memo(function UploadButtonBase({ className, onClick }: Props) {
  return (
    <button className={twMerge(baseStyle, className)} onClick={onClick}>
      Upload
    </button>
  );
});

export default UploadButton;
