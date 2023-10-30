import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  className: string;
};

const OsmCopyRight = memo(function OsmCopyRightBase({ className }: Props) {
  return (
    <a
      href='https://www.openstreetmap.org/copyright'
      target='_blank'
      rel='noopener noreferrer'
      className={twMerge('text-xs text-white', className)}
    >
      © OpenStreetMap
    </a>
  );
});

export default OsmCopyRight;
