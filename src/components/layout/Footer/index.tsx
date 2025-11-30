'use client';

import { useTranslations } from 'next-intl';
import AppButton from './AppButton';
import ContactInfo from './ContactInfo';
import Copyright from './Copyright';
import FooterContent from './FooterContent';

const Footer = () => {
  const t = useTranslations('Components.Layout.Footer');

  return (
    <footer className="footer -type-1">
      <div className="container">
        <div className="pt-60 pb-60">
          <div className="row y-gap-40 justify-between xl:justify-start">
            <div className="col-xl-2 col-lg-4 col-sm-6">
              <h5 className="text-16 fw-500 mb-30">{t('contact_us')}</h5>
              <ContactInfo />
            </div>

            <FooterContent />

            <div className="col-xl-2 col-lg-4 col-sm-6">
              <h5 className="text-16 fw-500 mb-30">{t('mobile')}</h5>
              <AppButton />
            </div>
          </div>
        </div>

        <div className="py-20 border-top-light">
          <Copyright />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
