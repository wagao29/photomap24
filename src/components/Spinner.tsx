import { memo } from 'react';

type Props = {
  className: string;
};

const Spinner = memo(function SpinnerBase({ className }: Props) {
  return (
    <div className={className}>
      <div className='animate-spin h-10 w-10 border-4 border-cyan-400 rounded-full border-t-transparent' />
    </div>
  );
});

export default Spinner;
