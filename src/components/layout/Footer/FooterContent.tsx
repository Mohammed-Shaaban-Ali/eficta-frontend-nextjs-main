'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const FooterContentPage = () => {
  const t = useTranslations('Components.Layout.Footer');

  const footerContent = [
    {
      id: 1,
      title: t('company'),
      menuList: [
        { name: t('about_us'), routerPath: '/' },
        { name: t('careers'), routerPath: '/' },
        { name: t('blog'), routerPath: '/' },
        { name: t('press'), routerPath: '/' },
        { name: t('gift_cards'), routerPath: '/' },
      ],
    },
    {
      id: 2,
      title: t('support'),
      menuList: [
        { name: t('contact'), routerPath: '/' },
        { name: t('legal_notice'), routerPath: '/' },
        { name: t('privacy_policy'), routerPath: '/' },
        { name: t('terms_conditions'), routerPath: '/' },
        { name: t('sitemap'), routerPath: '/' },
      ],
    },
    {
      id: 3,
      title: t('other_services'),
      menuList: [
        { name: t('car_hire'), routerPath: '/' },
        { name: t('activity_finder'), routerPath: '/' },
        { name: t('tour_list'), routerPath: '/' },
        { name: t('flight_finder'), routerPath: '/' },
        { name: t('cruise_ticket'), routerPath: '/' },
        { name: t('holiday_rental'), routerPath: '/' },
        { name: t('travel_agents'), routerPath: '/' },
      ],
    },
  ];

  return (
    <>
      {footerContent.map((item) => (
        <div className="col-xl-2 col-lg-4 col-sm-6" key={item.id}>
          <h5 className="text-16 fw-500 mb-30">{item.title}</h5>
          <div className="d-flex y-gap-10 flex-column">
            {item.menuList.map((menu, i) => (
              <Link href={menu.routerPath} key={i}>
                {menu.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default FooterContentPage;
