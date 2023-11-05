import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  onClickTerms: () => void;
  onClickPrivacy: () => void;
  className: string;
};

const baseStyle = 'text-white text-xs text-center';

const Note = memo(function NoteBase({ onClickTerms, onClickPrivacy, className }: Props) {
  return (
    <div className={twMerge(baseStyle, className)}>
      {`By uploading a photo, you agree to PhotoMap24's `}
      <button className='underline underline-offset-2' onClick={onClickTerms}>
        Terms of Service
      </button>
      {` and `}
      <button className='underline underline-offset-2' onClick={onClickPrivacy}>
        Privacy Policy
      </button>
    </div>
  );
});

export default Note;
