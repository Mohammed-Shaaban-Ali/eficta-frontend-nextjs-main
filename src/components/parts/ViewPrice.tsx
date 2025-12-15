import { useTranslations } from 'next-intl';
import React from 'react';

const ViewPrice = ({
  finalPrice,
  includes_taxes = true,
}: {
  finalPrice: number;
  includes_taxes?: boolean;
}) => {
  const t = useTranslations('HotelSingle');

  return (
    <div>
      <div className="d-flex align-items-center">
        <span className="h4 fw-bold text-primary mb-0 mx-2">
          {finalPrice?.toFixed(2)}
        </span>
        <img
          src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg"
          alt="Currency"
          width={20}
          height={20}
          style={{
            filter:
              'invert(32%) sepia(99%) saturate(1362%) hue-rotate(199deg) brightness(96%) contrast(96%)',
          }}
        />
      </div>
      {includes_taxes && (
        <p className="small text-black/60!">{t('includes_taxes')}</p>
      )}
    </div>
  );
};

export default ViewPrice;
