import { memo } from 'react';
import { Dialog } from '../templates/Dialog';
import CloseButton from '../buttons/CloseButton';
import { CLOSE_BUTTON_BLACK } from '../../constants';

type Props = {
  onClose: () => void;
};

export const PrivacyDialog = memo(function PrivacyDialogBase({ onClose }: Props) {
  return (
    <Dialog height='80%'>
      <CloseButton color={CLOSE_BUTTON_BLACK} onClick={onClose} />
      <div className='flex flex-col items-center h-full pb-4 bg-white rounded-lg border-2 border-gray-600'>
        <h1 className='text-lg pt-6 font-bold'>Privacy Policy</h1>
        <div className='overflow-scroll hidden-scrollbar p-4'>
          <ul className='space-y-4 list-inside'>
            <p className='text-sm'>
              The Privacy Policy sets forth our privacy information handling principles. You or
              users are deemed to have agreed with the Policy if you use our services.
            </p>
            <li>
              <span className='font-bold'>User Uploaded Photo</span>
              <div className='text-sm'>
                Photos uploaded to this site may be viewed by an unspecified number of users. Please
                do not upload personal or confidential information. Additionally, any metadata
                contained in photos is removed locally and not sent to the server.
              </div>
            </li>
            <li>
              <span className='font-bold'>Use of Google Analytics</span>
              <div className='text-sm'>
                This website uses Google Analytics for access analysis. Google Analytics uses
                cookies to collect data, but does not identify individuals. You can opt out of
                tracking by Google Analytics by disabling cookies. For more information, please see
                the{' '}
                <a
                  href='https://marketingplatform.google.com/about/analytics/terms/us/'
                  rel='noopener noreferrer'
                  target='_blank'
                  className='underline'
                >
                  Google Analytics Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href='https://policies.google.com/'
                  rel='noopener noreferrer'
                  target='_blank'
                  className='underline'
                >
                  Google Privacy & Terms
                </a>
                .
              </div>
            </li>
            <li>
              <span className='font-bold'>Change of Privacy Policy</span>
              <div className='text-sm'>
                This Privacy Policy is subject to changes without notice to users. The changed
                Privacy Policy will take effect when it is placed on this website unless otherwise
                specified by us.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Dialog>
  );
});
