import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  color: 'gray' | 'blue';
  children: React.ReactNode;
  className: string;
  onClick: () => void;
};

const baseStyle = 'p-2 font-bold rounded-lg border-2 bg-white';
const grayStyle = 'text-gray-600 border-gray-600 active:bg-gray-200';
const blueStyle = 'text-blue-600 border-blue-600 active:bg-blue-200';

const getStyle = (color: 'gray' | 'blue') => {
  switch (color) {
    case 'gray': {
      return grayStyle;
    }
    case 'blue': {
      return blueStyle;
    }
  }
};

const CommonButton = memo(function CommonButtonBase({
  color,
  children,
  className,
  onClick
}: Props) {
  return (
    <button className={twMerge(baseStyle, getStyle(color), className)} onClick={onClick}>
      {children}
    </button>
  );
});

export default CommonButton;
