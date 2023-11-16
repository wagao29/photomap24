import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  height?: string;
};

export const Dialog = ({ children, height }: Props) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'gray',
          opacity: '0.5'
        }}
      ></div>
      <div style={{ height, maxHeight: 672 }} className='absolute w-4/5 max-w-sm'>
        {children}
      </div>
    </div>
  );
};
