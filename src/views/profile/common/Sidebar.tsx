'use client';

import Image from 'next/image';
import { Link, usePathname } from '@/i18n/navigation';
import { isActiveLink } from '@/utils/linkActiveChecker';
import { useTranslations } from 'next-intl';

const Sidebar = () => {
  const pathname = usePathname();
  const t = useTranslations('Profile.sidebar');
  const rtl = pathname.includes('/ar');
  console.log(rtl);
  const sidebarContent = [
    {
      id: 1,
      icon: '/img/dashboard/sidebar/compass.svg',
      name: t('dashboard'),
      routePath: '/profile/overview',
    },
    {
      id: 2,
      icon: '/img/dashboard/sidebar/booking.svg',
      name: t('bookings'),
      routePath: '/profile/bookings',
    },
    {
      id: 4,
      icon: '/img/dashboard/sidebar/gear.svg',
      name: t('settings'),
      routePath: '/profile/settings',
    },
    {
      id: 5,
      icon: '/img/dashboard/sidebar/log-out.svg',
      name: t('logout'),
      routePath: '/login',
    },
  ];

  return (
    <div className="sidebar -dashboard">
      {sidebarContent.map((item) => (
        <div className="sidebar__item" key={item.id}>
          <div
            className={`${
              isActiveLink(item.routePath, pathname) ? '-is-active' : ''
            } sidebar__button `}
          >
            <Link
              href={item.routePath}
              className="d-flex items-center text-15 lh-1 fw-500"
            >
              <Image
                width={20}
                height={20}
                src={item.icon}
                alt="image"
                style={{
                  margin: '15px',
                }}
              />
              {item.name}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
