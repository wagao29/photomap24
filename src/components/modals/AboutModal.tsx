import { memo } from 'react';
import appScreen from '../../assets/app_screen.png';
import githubLogo from '../../assets/github_logo.svg';
import { CLOSE_BUTTON_BLACK } from '../../constants';
import CloseButton from '../buttons/CloseButton';
import { Modal } from '../templates/Modal';

type Props = {
  onClose: () => void;
};

export const AboutModal = memo(function AboutModal({ onClose }: Props) {
  return (
    <Modal height='80%'>
      <CloseButton color={CLOSE_BUTTON_BLACK} onClick={onClose} />
      <div className='flex flex-col items-center h-full pb-4 bg-white rounded-lg border-2 border-gray-600'>
        <h1 className='text-lg pt-6 font-bold'>About this service</h1>
        <div className='overflow-scroll hidden-scrollbar p-4 text-sm'>
          <p>
            PhotoMap24 is a location-based photo sharing service that can be viewed for 24 hours
            only. This service can be used without sign in. Feel free to upload your daily photos
            and enjoy photos uploaded from various places.
          </p>
          <img src={appScreen} width={368} height={675} alt='app screen' className='my-4' />
          <div className='flex flex-col items-center gap-2'>
            <p>
              {'contact: '}
              <a href='mailto:photomap24@gmail.com' className='underline'>
                photomap24@gmail.com
              </a>
            </p>
            <p>build-number: {import.meta.env.VITE_BUILD_NUMBER}</p>
            <div className='flex gap-2'>
              <p>
                {'© 2023 '}
                <a
                  href='https://twitter.com/_wagao_'
                  target='_blank'
                  rel='noreferrer'
                  className='underline'
                >
                  wagao
                </a>
              </p>
              <a href='https://github.com/wagao29/photomap24' target='_blank' rel='noreferrer'>
                <img src={githubLogo} width={20} height={20} alt='github' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
});
