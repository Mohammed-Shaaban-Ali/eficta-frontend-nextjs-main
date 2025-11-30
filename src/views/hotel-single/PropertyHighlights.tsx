'use client';

import { useTranslations } from 'next-intl';

const PropertyHighlights2 = () => {
  const t = useTranslations('HotelSingle');

  const highlightsContent = [
    {
      id: 1,
      icon: 'icon-city',
      text: t('highlights.city_center', { defaultValue: 'In City Centre' }),
    },
    {
      id: 2,
      icon: 'icon-airplane',
      text: t('highlights.airport_transfer', {
        defaultValue: 'Airport transfer',
      }),
    },
    {
      id: 3,
      icon: 'icon-bell-ring',
      text: t('highlights.front_desk', {
        defaultValue: 'Front desk [24-hour]',
      }),
    },
    {
      id: 4,
      icon: 'icon-tv',
      text: t('highlights.tv_channels', {
        defaultValue: 'Premium TV channels',
      }),
    },
  ];

  return (
    <div className="row y-gap-20 pt-30">
      {highlightsContent.map((item) => (
        <div className="col-lg-3 col-6" key={item.id}>
          <div className="text-center">
            <i className={`${item.icon} text-24 text-blue-1`} />
            <div className="text-15 lh-1 mt-10">{item.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyHighlights2;
