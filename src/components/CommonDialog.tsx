import { memo } from 'react';
import { DIALOG_CONFIRM, DIALOG_CRITICAL, DIALOG_DELETE, DIALOG_ERROR } from '../constants';
import { DialogType } from '../types';
import { Dialog } from './Dialog';

type Props = {
  dialogType: DialogType;
  title: string;
  content: string;
  okBtnText?: string;
  cancelBtnText?: string;
  onOk?: () => void;
  onCancel?: () => void;
};

type DialogButtonsProps = {
  dialogType: DialogType;
  okBtnText?: string;
  cancelBtnText?: string;
  onOk?: () => void;
  onCancel?: () => void;
};

const DialogButtons = memo(function DialogButtonsBase({
  dialogType,
  okBtnText,
  cancelBtnText,
  onOk,
  onCancel
}: DialogButtonsProps) {
  switch (dialogType) {
    case DIALOG_CONFIRM:
      return (
        <div className='flex justify-between gap-4'>
          <button
            onClick={onOk}
            className={
              'text-blue-600 border-blue-600 rounded-lg border-2 text-sm w-24 h-10 active:bg-blue-200'
            }
          >
            {okBtnText}
          </button>
          <button
            onClick={onCancel}
            className='text-gray-600 border-gray-600 rounded-lg border-2 text-sm w-24 h-10 active:bg-gray-200'
          >
            {cancelBtnText}
          </button>
        </div>
      );
    case DIALOG_DELETE:
      return (
        <div className='flex justify-between gap-4'>
          <button
            onClick={onOk}
            className={
              'text-red-600 border-red-600 rounded-lg border-2 text-sm w-24 h-10 active:bg-red-200'
            }
          >
            削除する
          </button>
          <button
            onClick={onCancel}
            className='text-gray-600 border-gray-600 rounded-lg border-2 text-sm w-24 h-10 active:bg-gray-200'
          >
            キャンセル
          </button>
        </div>
      );
    case DIALOG_ERROR:
      return (
        <button
          onClick={onCancel}
          className='text-gray-600 border-gray-600 rounded-lg border-2 text-sm w-24 h-10 active:bg-gray-200'
        >
          閉じる
        </button>
      );
    case DIALOG_CRITICAL:
      return <></>;
  }
});

export const CommonDialog = memo(function CommonDialogBase({
  dialogType,
  title,
  content,
  okBtnText,
  cancelBtnText,
  onOk,
  onCancel
}: Props) {
  const titleStyle = dialogType === DIALOG_CONFIRM ? 'text-yellow-500' : 'text-red-600';

  return (
    <Dialog>
      <div className='flex flex-col items-center font-bold gap-4 py-6'>
        <div className='text-center flex flex-col items-center justify-center gap-2'>
          <h1 className={titleStyle}>{title}</h1>
          <p className='text-gray-600 text-xs text-gray-600'>{content}</p>
        </div>
        <DialogButtons
          dialogType={dialogType}
          okBtnText={okBtnText}
          cancelBtnText={cancelBtnText}
          onOk={onOk}
          onCancel={onCancel}
        />
      </div>
    </Dialog>
  );
});
