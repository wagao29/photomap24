import { memo } from 'react';
import { twMerge } from 'tailwind-merge';
import { GEO_SOURCE_CURRENT_LOCATION, GEO_SOURCE_EXIF_GEO_INFO } from '../../constants';
import { GeoSource } from '../../types';

type Props = {
  geoSource: GeoSource;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
};

const GeoSourceSelector = memo(function Header({ geoSource, onChange, className }: Props) {
  return (
    <div className={twMerge(className, 'flex flex-col')}>
      <div className='flex items-center'>
        <input
          type='radio'
          checked={geoSource === GEO_SOURCE_EXIF_GEO_INFO}
          value={GEO_SOURCE_EXIF_GEO_INFO}
          className='w-4 h-4 m-1.5 accent-yellow-500 hover:cursor-pointer'
          onChange={onChange}
        />
        <label className='text-white text-sm font-bold'>Exif GeoInfo</label>
      </div>
      <div className='flex items-center'>
        <input
          type='radio'
          checked={geoSource === GEO_SOURCE_CURRENT_LOCATION}
          value={GEO_SOURCE_CURRENT_LOCATION}
          className='w-4 h-4 m-1.5 accent-yellow-500 hover:cursor-pointer'
          onChange={onChange}
        />
        <label className='text-white text-sm font-bold'>Current Location</label>
      </div>
    </div>
  );
});

export default GeoSourceSelector;
