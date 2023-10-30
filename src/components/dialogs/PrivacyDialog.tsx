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
      <div className='flex flex-col items-center h-full pb-4 bg-white rounded border border-gray-300'>
        <h1 className='text-lg pt-6 font-bold'>Privacy Policy</h1>
        <div className='overflow-scroll hidden-scrollbar p-4'>
          <ul className='space-y-4 list-inside'>
            <p className='text-xs'>
              このプライバシーポリシー（以下、「本ポリシー」といいます。）は、本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における、
              ユーザーの個人情報の取扱いを定めるものです。
            </p>
            <li>
              <span className='text-sm'>第1条（個人情報）</span>
              <div className='text-xs'>
                「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、
                当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、
                及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
              </div>
            </li>
            <li>
              <span className='text-sm'>第2条（個人情報の利用目的）</span>
              <ol className='space-y-1 text-xs list-decimal list-inside'>
                当社が個人情報を収集・利用する目的は、以下のとおりです。
                <li>当社サービスの提供・運営のため</li>
                <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
                <li>
                  ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当社が提供する他のサービスの案内のメールを送付するため
                </li>
                <li>
                  利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
                </li>
                <li>上記の利用目的に付随する目的</li>
              </ol>
            </li>
            <li>
              <span className='text-sm'>第3条（個人情報の収集）</span>
              <div className='text-xs'>
                Googleアカウントを使用したログイン時に、Gmailアドレスを取得いたします。
              </div>
            </li>
            <li>
              <span className='text-sm'>第4条（利用目的の変更）</span>
              <div className='text-xs'>
                当社は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。
                利用目的の変更を行った場合には、変更後の目的について、当社所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。
              </div>
            </li>
            <li>
              <span className='text-sm'>第5条（個人情報の第三者提供）</span>
              <div className='text-xs'>
                当社は、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
              </div>
            </li>
            <li>
              <span className='text-sm'>第6条（Googleアナリティクスの使用）</span>
              <div className='text-xs'>
                本サービスでは、サービス向上のため、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。
                このGoogleアナリティクスはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
                この機能はCookieを無効にすることで収集を拒否することができますので、お使いのブラウザの設定をご確認ください。
                この規約に関しての詳細は
                <a
                  href='https://marketingplatform.google.com/about/analytics/terms/jp/'
                  rel='noopener noreferrer'
                  target='_blank'
                  className='underline'
                >
                  Googleアナリティクスサービス利用規約
                </a>
                のページや
                <a
                  href='https://policies.google.com/technologies/ads?hl=ja'
                  rel='noopener noreferrer'
                  target='_blank'
                  className='underline'
                >
                  Googleポリシーと規約
                </a>
                ページをご覧ください。
              </div>
            </li>
            <li>
              <span className='text-sm'>第7条（プライバシーポリシーの変更）</span>
              <div className='text-xs'>
                本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。
                当社が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Dialog>
  );
});
