import iconPhoto from '../../assets/icon_photo.svg';
import { MAX_MAP_PHOTO_COUNT, THUMBNAIL_DISPLAY_SIZE } from '../../constants';
import { getThumbnailUrl } from '../../utils/getThumbnailUrl';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  points: any[];
};

const photoNumberStyle =
  'font-bold text-base absolute flex items-center justify-center rounded-full border bg-white border-gray-300';

const baseStyle = {
  width: 30,
  height: 30,
  top: -10,
  right: -10
};

const Thumbnail = ({ points }: Props) => {
  points.sort((pointA, pointB) => {
    return pointA.properties.date > pointB.properties.date ? -1 : 1;
  });
  const displayMapPhoto = points[0].properties;

  return (
    <div className='bg-white rounded-full hover:cursor-pointer'>
      {points.length >= MAX_MAP_PHOTO_COUNT ? (
        <span className={photoNumberStyle} style={baseStyle}>
          <span className='text-sm'>99</span>
          <span className='text-sm mb-1'>+</span>
        </span>
      ) : (
        <span className={photoNumberStyle} style={baseStyle}>
          {points.length}
        </span>
      )}
      <img
        src={getThumbnailUrl(displayMapPhoto.id)}
        width={THUMBNAIL_DISPLAY_SIZE}
        height={THUMBNAIL_DISPLAY_SIZE}
        className='bg-black rounded-lg'
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
