import iconCreate from '../../assets/icon_create.svg';

type Props = {
  onClick: () => void;
};

const CreateButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className='bg-white border border-gray-300 rounded-full active:bg-gray-200 hover:bg-gray-200'
      style={{
        position: 'absolute',
        right: '8px',
        bottom: 'calc(35px + env(safe-area-inset-bottom, 20px))',
        zIndex: 10
      }}
    >
      <img width={50} height={50} src={iconCreate} alt='Create Button' />
    </button>
  );
};

export default CreateButton;
