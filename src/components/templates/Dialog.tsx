import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  height?: string;
};

export const Dialog = ({ children, height }: Props) => {
  return (
    <div className='fixed inset-0 flex justify-center items-center z-50'>
      <div className='fixed inset-0 bg-gray-500 opacity-50' />
      <div style={{ height, maxHeight: 672 }} className='absolute w-4/5 max-w-sm'>
        {children}
      </div>
    </div>
  );
};
