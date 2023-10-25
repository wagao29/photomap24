import { memo } from 'react';
import iconCloseButton from '../assets/icon_close_button.svg';

type Props = {
  onClick: () => void;
};

const DialogCloseButton = memo(function DialogCloseButtonBase({ onClick }: Props) {
  return (
    <img
      className='absolute top-3 right-3 hover:cursor-pointer z-10'
      src={iconCloseButton}
      width={17}
      height={17}
      onClick={onClick}
      alt=''
    />
  );
});

export default DialogCloseButton;
