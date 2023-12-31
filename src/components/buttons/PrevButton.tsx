import { memo } from 'react';
import iconPrevButton from '../../assets/icon_prev_button.svg';

type Props = {
  onClick: () => void;
  visible: boolean;
};

const PrevButton = memo(function PrevButton({ onClick, visible }: Props) {
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
      onClick={onClick}
      alt='previous'
    />
  );
});

export default PrevButton;
