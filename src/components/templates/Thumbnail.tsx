import iconPhoto from '../../assets/icon_photo.svg';
import { MAX_MAP_PHOTO_COUNT, THUMBNAIL_DISPLAY_SIZE } from '../../constants';
import { getThumbnailUrl } from '../../utils/getThumbnailUrl';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  points: any[];
};

const photoNumberClassName =
  'font-bold text-base absolute flex items-center justify-center rounded-full border bg-white border-gray-300';

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

const Thumbnail = ({ points }: Props) => {
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
      <img
        src={pointCount < MAX_MAP_PHOTO_COUNT ? getThumbnailUrl(mapPhoto.id) : iconPhoto}
        width={THUMBNAIL_DISPLAY_SIZE}
        height={THUMBNAIL_DISPLAY_SIZE}
        style={{
          backgroundColor: 'black',
          borderRadius: '0.5rem'
        }}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = iconPhoto;
        }}
        alt='thumbnail'
      />
    </div>
  );
};

export default Thumbnail;
