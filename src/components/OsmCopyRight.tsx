import { memo } from 'react';

const OsmCopyRight = memo(function OsmCopyRightBase() {
  return (
    <a
      href='https://www.openstreetmap.org/copyright'
      target='_blank'
      rel='noopener noreferrer'
      className='text-xs text-gray-600'
    >
      © OpenStreetMap
    </a>
  );
});

export default OsmCopyRight;
