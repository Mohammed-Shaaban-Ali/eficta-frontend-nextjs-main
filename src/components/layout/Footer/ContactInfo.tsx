'use client';

import { useTranslations } from 'next-intl';

const ContactInfo = () => {
  const t = useTranslations('Components.Layout.Footer');

  return (
    <>
      <div className="mt-30">
        <div className="text-14 mt-5">{t('address')}</div>
        <div className="text-14 mt-5">
          <a href="tel:123456789">{t('phone')}</a>
        </div>
        <div className="text-14 mt-5">
          <a href="mailto:support@eficta.com">{t('email')}</a>
        </div>
      </div>
    </>
  );
};

export default ContactInfo;
