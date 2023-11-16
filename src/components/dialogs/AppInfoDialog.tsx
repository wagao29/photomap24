import { memo } from 'react';
import { CLOSE_BUTTON_BLACK } from '../../constants';
import CloseButton from '../buttons/CloseButton';
import { Dialog } from '../templates/Dialog';

type Props = {
  onClose: () => void;
};

export const AppInfoDialog = memo(function AppInfoDialogBase({ onClose }: Props) {
  return (
    <Dialog>
      <CloseButton color={CLOSE_BUTTON_BLACK} onClick={onClose} />
      <div className='rounded-lg bg-white p-5 border-2 border-gray-600 flex flex-col items-center justify-center text-center gap-2'>
        <h1 className='text-lg'>App Info</h1>
        <p className='text-sm'>build-number: {import.meta.env.VITE_BUILD_NUMBER}</p>
        <p className='text-sm'>
          © 2023{' '}
          <a
            href={'https://twitter.com/_wagao_'}
            target='_blank'
            rel='noreferrer'
            className='underline'
          >
            wagao
          </a>
        </p>
      </div>
    </Dialog>
  );
});
