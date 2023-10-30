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
        bottom: 'calc(95px + env(safe-area-inset-bottom, 20px))',
        zIndex: 10
      }}
    >
      <img width={50} height={50} src={iconExplore} alt='Explore Button' />
    </button>
  );
};

export default ExploreButton;
