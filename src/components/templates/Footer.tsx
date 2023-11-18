import { memo } from 'react';

type Props = {
  onClickHowToUse: () => void;
  onClickTerms: () => void;
  onClickPrivacy: () => void;
};

const buttonStyle = 'text-gray-600 font-bold text-xs underline underline-offset-2';

const Footer = memo(function Footer({ onClickHowToUse, onClickTerms, onClickPrivacy }: Props) {
  return (
    <div
      style={{
        bottom: 'calc(10px + env(safe-area-inset-bottom, 20px))'
      }}
      className='absolute left-1/2 transform -translate-x-1/2 flex gap-3'
    >
      <button onClick={onClickHowToUse} className={buttonStyle}>
        How to use
      </button>
      <button onClick={onClickTerms} className={buttonStyle}>
        Terms
      </button>
      <button onClick={onClickPrivacy} className={buttonStyle}>
        Privacy
      </button>
    </div>
  );
});

export default Footer;
