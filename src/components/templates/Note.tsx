import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  onClickTerms: () => void;
  onClickPrivacy: () => void;
  className: string;
};

const baseStyle = 'text-white text-xs text-center';
const buttonStyle = 'underline underline-offset-2';

const Note = memo(function Note({ onClickTerms, onClickPrivacy, className }: Props) {
  return (
    <div className={twMerge(baseStyle, className)}>
      {`By uploading a photo, you agree to PhotoMap24's `}
      <button className={buttonStyle} onClick={onClickTerms}>
        Terms of Service
      </button>
      {` and `}
      <button className={buttonStyle} onClick={onClickPrivacy}>
        Privacy Policy
      </button>
    </div>
  );
});

export default Note;
