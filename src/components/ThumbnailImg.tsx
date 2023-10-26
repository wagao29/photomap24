import { memo } from 'react';
import iconStampLogo from '../assets/icon_stamp_logo.png';

type Props = {
  src: string;
  size: number;
  onClick?: () => void;
  className: string;
};

// TODO: iconStampLogo 差し替え
const ThumbnailImg = memo(function StampImageBase({ src, size, onClick, className }: Props) {
  return (
    <img
      src={src}
      width={size}
      height={size}
      className={className}
      style={{
        backgroundColor: 'black',
        borderRadius: '0.5rem'
      }}
      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = iconStampLogo;
      }}
      onClick={onClick}
      alt='thumbnail'
    />
  );
});

export default ThumbnailImg;
