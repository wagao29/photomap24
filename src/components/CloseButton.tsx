import { memo } from 'react';
import iconCloseWhite from '../assets/icon_close_white.svg';
import iconCloseBlack from '../assets/icon_close_black.svg';
import { CLOSE_BUTTON_BLACK, CLOSE_BUTTON_WHITE } from '../constants';

type Props = {
  color: typeof CLOSE_BUTTON_WHITE | typeof CLOSE_BUTTON_BLACK;
  onClick: () => void;
};

const CloseButton = memo(function CloseButtonBase({ color, onClick }: Props) {
  return (
    <img
      className='absolute z-10 top-3 right-3 hover:cursor-pointer'
      src={color === CLOSE_BUTTON_WHITE ? iconCloseWhite : iconCloseBlack}
      width={20}
      height={20}
      onClick={onClick}
      alt='CloseButton'
    />
  );
});

export default CloseButton;
