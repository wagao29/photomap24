import { memo } from 'react';
import { CLOSE_BUTTON_BLACK } from '../../constants';
import CloseButton from '../buttons/CloseButton';
import { Dialog } from '../templates/Dialog';

type Props = {
  title: string;
  content: string;
  onClose: () => void;
};

export const ErrorDialog = memo(function ErrorDialogBase({ title, content, onClose }: Props) {
  return (
    <Dialog>
      <CloseButton color={CLOSE_BUTTON_BLACK} onClick={onClose} />
      <div className='rounded-lg bg-white p-5 border border-gray-300 flex flex-col items-center justify-center text-center gap-2'>
        <h1 className='text-red-600 font-bold'>{title}</h1>
        <p className='text-sm'>{content}</p>
      </div>
    </Dialog>
  );
});
