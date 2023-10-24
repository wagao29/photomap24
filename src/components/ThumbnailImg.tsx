import { memo } from 'react';
import placeholder from '../assets/placeholder_stamp.svg';
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
        backgroundImage: `url(${placeholder})`,
        backgroundSize: size,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        minWidth: size,
        borderRadius: '0.5rem'
      }}
      onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.style.backgroundImage = 'none';
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
