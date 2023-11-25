import { memo } from 'react';
import { CLOSE_BUTTON_BLACK } from '../../constants';
import CloseButton from '../buttons/CloseButton';
import { Modal } from '../templates/Modal';

type Props = {
  title: string;
  content: string;
  onClose: () => void;
};

export const ErrorModal = memo(function ErrorModal({ title, content, onClose }: Props) {
  return (
    <Modal>
      <CloseButton color={CLOSE_BUTTON_BLACK} onClick={onClose} />
      <div className='rounded-lg bg-white p-5 border-2 border-gray-600 flex flex-col items-center justify-center text-center gap-2'>
        <h1 className='text-red-600 font-bold text-lg'>{title}</h1>
        <p className='text-sm whitespace-pre-wrap'>{content}</p>
      </div>
    </Modal>
  );
});
