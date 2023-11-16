import { memo } from 'react';
import iconLogo from '../../assets/title_logo.svg';

type Props = {
  onClick: () => void;
};

const Header = memo(function HeaderBase({ onClick }: Props) {
  return (
    <img
      src={iconLogo}
      width={170}
      height={170}
      onClick={onClick}
      className='absolute z-10 top-1 left-1 hover:cursor-pointer'
    />
  );
});

export default Header;
