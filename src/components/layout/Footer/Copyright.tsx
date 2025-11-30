'use client';

import { useTranslations } from 'next-intl';

const Copyright = () => {
  const t = useTranslations('Components.Layout.Footer');
  const year = new Date().getFullYear();

  return (
    <div className="py-20 border-top-light">
      <div className="row justify-between items-center y-gap-10">
        <div className="col-auto">
          <div className="row x-gap-30 y-gap-10">
            <div className="col-auto">
              <div className="d-flex items-center">
                © {year} {t('copyright', { year })}
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex x-gap-15">
                <a href="#" className="text-15 text-dark-1">
                  {t('privacy')}
                </a>
                <a href="#" className="text-15 text-dark-1">
                  {t('terms')}
                </a>
                <a href="#" className="text-15 text-dark-1">
                  {t('site_map')}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-auto">
          <div className="d-flex items-center">
            <div className="text-dark-1">
              <div className="fw-500">{t('language')}</div>
            </div>
            <div className="text-dark-1 ms-20">
              <div className="fw-500">{t('currency')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
