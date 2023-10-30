import { memo } from 'react';

type Props = {
  onClickHowToUse: () => void;
  onClickTerms: () => void;
  onClickPrivacy: () => void;
};

const Footer = memo(function FooterBase({ onClickHowToUse, onClickTerms, onClickPrivacy }: Props) {
  return (
    <div
      style={{
        bottom: 'calc(10px + env(safe-area-inset-bottom, 20px))'
      }}
      className='absolute left-1/2 transform -translate-x-1/2 flex gap-3'
    >
      <button
        onClick={onClickHowToUse}
        className='text-gray-600 font-bold text-xs underline underline-offset-2'
      >
        How to use
      </button>
      <button
        onClick={onClickTerms}
        className='text-gray-600 font-bold text-xs underline underline-offset-2'
      >
        Terms
      </button>
      <button
        onClick={onClickPrivacy}
        className='text-gray-600 font-bold text-xs underline underline-offset-2'
      >
        Privacy
      </button>
    </div>
  );
});

export default Footer;
