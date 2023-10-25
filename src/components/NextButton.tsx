import iconNextButton from '../assets/icon_next_button.svg';
import toast from 'react-hot-toast';
import { memo } from 'react';

type Props = {
  onClick: () => void;
  visible: boolean;
};

const NextButton = memo(function NextButtonBase({ onClick, visible }: Props) {
  return (
    <img
      width={30}
      height={30}
      src={iconNextButton}
      className={`absolute z-10 inset-y-0 my-auto hover:cursor-pointer ${
        visible ? 'visible' : 'invisible'
      }`}
      style={{
        right: -30
      }}
      onClick={() => {
        onClick();
        toast.dismiss();
      }}
      alt='NextButton'
    />
  );
});

export default NextButton;
