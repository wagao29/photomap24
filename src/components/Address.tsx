import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  className: string;
};

const baseStyle = 'text-white underline max-w-full pl-2 truncate hover:cursor-pointer';

const Address = memo(function Address({ children, onClick, className }: Props) {
  return (
    <p className={twMerge(baseStyle, className)} onClick={onClick}>
      {children}
    </p>
  );
});

export default Address;
