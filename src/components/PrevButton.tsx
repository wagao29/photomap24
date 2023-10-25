import iconPrevButton from '../assets/icon_prev_button.svg';
import toast from 'react-hot-toast';
import { memo } from 'react';

type Props = {
  onClick: () => void;
  visible: boolean;
};

const PrevButton = memo(function PrevButtonBase({ onClick, visible }: Props) {
  return (
    <img
      width={30}
      height={30}
      src={iconPrevButton}
      className={`absolute z-10 inset-y-0 my-auto hover:cursor-pointer ${
        visible ? 'visible' : 'invisible'
      }`}
      style={{
        left: -30
      }}
      onClick={() => {
        onClick();
        toast.dismiss();
      }}
      alt='PrevButton'
    />
  );
});

export default PrevButton;
