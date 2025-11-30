'use client';

import { useTranslations } from 'next-intl';

const AppButton = () => {
  const t = useTranslations('Components.Layout.Footer');

  const appContent = [
    {
      id: 1,
      icon: 'icon-apple',
      link: 'https://apps.apple.com/app/id6741498793',
      text: t('download_on'),
      market: t('apple_store'),
      colClass: '',
    },
    {
      id: 2,
      icon: 'icon-play-market',
      link: 'https://play.google.com/store/apps/?hl=en&gl=US',
      text: t('get_in_on'),
      market: t('google_play'),
      colClass: 'mt-20',
    },
  ];

  return (
    <>
      {appContent.map((item) => (
        <div
          className={`d-flex items-center px-20 py-10 rounded-4 border-light ${item.colClass}`}
          key={item.id}
        >
          <i className={`${item.icon} text-24`} />
          <a href={item.link} className="ml-20 d-block">
            <div className="text-14 text-light-1">{item.text}</div>
            <div className="text-15 lh-1 fw-500">{item.market}</div>
          </a>
        </div>
      ))}
    </>
  );
};

export default AppButton;
