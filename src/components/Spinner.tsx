import { memo } from 'react';

type Props = {
  className: string;
};

const Spinner = memo(function SpinnerBase({ className }: Props) {
  return (
    <div className={className}>
      <div className='animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent'></div>
    </div>
  );
});

export default Spinner;
