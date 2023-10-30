import iconExplore from '../assets/icon_explore.svg';

type Props = {
  onClick: () => void;
};

const ExploreButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className='bg-white border border-gray-300 rounded-full active:bg-gray-200 hover:bg-gray-200'
      style={{
        position: 'absolute',
        right: '8px',
        bottom: 'calc(105px + env(safe-area-inset-bottom, 20px))',
        zIndex: 10
      }}
    >
      <img width={56} height={56} src={iconExplore} alt='' />
    </button>
  );
};

export default ExploreButton;
