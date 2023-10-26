import { memo } from 'react';
import iconReload from '../assets/icon_reload.svg';

type Props = {
  onClick: () => void;
};

const ReloadButton = memo(function ReloadButtonBase({ onClick }: Props) {
  return (
    <img
      onClick={onClick}
      width={60}
      height={60}
      src={iconReload}
      className='p-3 bg-black border-2 border-white rounded-full active:bg-red-500 hover:bg-red-500'
      style={{
        position: 'absolute',
        right: '8px',
        bottom: 'calc(95px + env(safe-area-inset-bottom, 20px))',
        zIndex: 10
      }}
      alt='Reload Button'
    />
  );
});

export default ReloadButton;
