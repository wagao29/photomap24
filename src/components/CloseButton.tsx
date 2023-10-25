import { memo } from 'react';
import iconCloseButton from '../assets/icon_close_button.svg';

type Props = {
  onClick: () => void;
};

const CloseButton = memo(function CloseButtonBase({ onClick }: Props) {
  return (
    <img
      className='absolute z-10 top-3 right-3 hover:cursor-pointer'
      src={iconCloseButton}
      width={20}
      height={20}
      onClick={onClick}
      alt='CloseButton'
    />
  );
});

export default CloseButton;
