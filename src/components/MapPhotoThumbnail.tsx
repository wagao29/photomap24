import iconStampLogo from '../assets/icon_stamp_logo.png';
import { MAX_MAP_PHOTO_COUNT, THUMBNAIL_SIZE } from '../constants';
import { getThumbnailUrl } from '../utils/getThumbnailUrl';
import ThumbnailImg from './ThumbnailImg';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  points: any[];
};

const photoNumberClassName =
  'font-bold text-lg absolute flex items-center justify-center rounded-full border-2 bg-white border-gray-600 text-gray-600';

const baseStyle = {
  width: 30,
  height: 30,
  top: -10,
  right: -10
};

const PhotoNumber = ({ points }: Props) => {
  const pointCount = points.length;

  if (pointCount >= MAX_MAP_PHOTO_COUNT) {
    return (
      <span className={photoNumberClassName} style={baseStyle}>
        <span className='text-sm'>99</span>
        <span className='text-sm mb-1'>+</span>
      </span>
    );
  } else {
    return (
      <span className={photoNumberClassName} style={baseStyle}>
        {pointCount}
      </span>
    );
  }
};

const MapPhotoThumbnail = ({ points }: Props) => {
  const pointCount = points.length;
  if (pointCount < MAX_MAP_PHOTO_COUNT) {
    points.sort((pointA, pointB) => {
      return pointA.properties.date > pointB.properties.date ? -1 : 1;
    });
  }
  const mapPhoto = points[0].properties;

  return (
    <div className='bg-white rounded-full hover:cursor-pointer hover:bg-gray-100'>
      <PhotoNumber points={points} />
      <ThumbnailImg
        src={pointCount < MAX_MAP_PHOTO_COUNT ? getThumbnailUrl(mapPhoto.id) : iconStampLogo}
        size={THUMBNAIL_SIZE}
        className=''
      />
    </div>
  );
};

export default MapPhotoThumbnail;
