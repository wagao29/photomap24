import { memo } from 'react';
import { CLOSE_BUTTON_BLACK } from '../../constants';
import CloseButton from '../buttons/CloseButton';
import { Modal } from '../templates/Modal';

type Props = {
  onClose: () => void;
};

export const TermsModal = memo(function TermsModal({ onClose }: Props) {
  return (
    <Modal height='80%'>
      <CloseButton color={CLOSE_BUTTON_BLACK} onClick={onClose} />
      <div className='flex flex-col items-center h-full pb-4 bg-white rounded-lg border-2 border-gray-600'>
        <h1 className='text-lg pt-6 font-bold'>Terms of Service</h1>
        <div className='overflow-scroll hidden-scrollbar p-4'>
          <ul className='space-y-4 list-inside'>
            <p className='text-sm'>
              By accessing this website, you agree to be bound by these website terms and all
              applicable laws and regulations. If you do not agree to any of these terms and
              conditions, you are prohibited from using or accessing this site.
            </p>
            <li>
              <span className='font-bold'>1. Disclaimer</span>
              <div className='text-sm'>
                The operator of this service is not responsible for any damage caused to users due
                to this service. We are also not responsible for the content of images uploaded by
                users. In addition, users are responsible for managing the copyright and other
                rights of uploaded images.
              </div>
            </li>
            <li>
              <span className='font-bold'>2. Changes to the Terms of Service</span>
              <div className='text-sm'>
                The operator of this service may change the terms at any time without notifying
                users if it deems it necessary. If the User starts using the Service after these
                terms have been changed, the User will be deemed to have agreed to the changed
                terms.
              </div>
            </li>
            <li>
              <span className='font-bold'>
                3. Change or suspension of the provision of the Service
              </span>
              <div className='text-sm'>
                The content of this service may change without prior notice to users. In addition,
                we may suspend or cancel all or part of the services we provide without prior
                notice.
              </div>
            </li>
            <li>
              <span className='font-bold'>4. Governing Law and Jurisdiction</span>
              <div className='text-sm'>
                These terms shall be governed by and construed in accordance with Japanese law. In
                the event of a dispute regarding this service, the court with jurisdiction over the
                location of the operator shall have exclusive jurisdiction.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
});
