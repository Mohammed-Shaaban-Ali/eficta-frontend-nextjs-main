'use client';

import { useTranslations } from 'next-intl';

const Amenities = () => {
  const t = useTranslations('RentalSingle.amenities');

  const amenitiesContent = [
    { id: 1, icon: 'icon-no-smoke', name: t('non_smoking') },
    { id: 2, icon: 'icon-wifi', name: t('wifi') },
    { id: 3, icon: 'icon-parking', name: t('parking') },
    { id: 4, icon: 'icon-kitchen', name: t('kitchen') },
    { id: 5, icon: 'icon-living-room', name: t('living_area') },
    { id: 6, icon: 'icon-shield', name: t('safety') },
    { id: 7, icon: 'icon-tv', name: t('media') },
    { id: 8, icon: 'icon-food', name: t('food') },
    { id: 9, icon: 'icon-bell-ring', name: t('reception') },
    { id: 10, icon: 'icon-washing-machine', name: t('cleaning') },
  ];
  return (
    <>
      <div className="row y-gap-15 pt-15">
        {amenitiesContent.map((item) => (
          <div className="col-sm-5" key={item.id}>
            <div className="d-flex items-center">
              <i className={`${item.icon} text-20 mr-10`} />
              <div className="text-15">{item.name}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Amenities;
