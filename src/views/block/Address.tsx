'use client';

import { useTranslations } from 'next-intl';

const Address = () => {
  const t = useTranslations('Components.Address');

  const addressContent = [
    {
      id: 1,
      colClass: 'col-lg-3',
      title: t('address'),
      content: <>{t('address_content')}</>,
    },
    {
      id: 2,
      colClass: 'col-auto',
      title: t('toll_free'),
      content: (
        <>
          <a href="tel:+4733378901">{t('phone_number')}</a>
        </>
      ),
    },
    {
      id: 3,
      colClass: 'col-auto',
      title: t('live_support'),
      content: (
        <>
          <a href="mailto:hi@gotrip.com">{t('email_address')}</a>
        </>
      ),
    },
  ];

  return (
    <>
      {addressContent.map((item) => (
        <div className={`${item.colClass}`} key={item.id}>
          <div className="text-14 text-light-1">{item.title}</div>
          <div className="text-18 fw-500 mt-10">{item.content}</div>
        </div>
      ))}
    </>
  );
};

export default Address;
