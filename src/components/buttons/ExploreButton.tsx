import { memo } from 'react';
import iconExplore from '../../assets/icon_explore.svg';

type Props = {
  onClick: () => void;
};

const ExploreButton = memo(function ExploreButtonBase({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className='bg-white border border-gray-300 rounded-full active:bg-gray-100 hover:bg-gray-100'
      style={{
        position: 'absolute',
        right: '8px',
        bottom: 'calc(95px + env(safe-area-inset-bottom, 20px))',
        zIndex: 10
      }}
    >
      <img width={50} height={50} src={iconExplore} alt='Explore Button' />
    </button>
  );
});

export default ExploreButton;
