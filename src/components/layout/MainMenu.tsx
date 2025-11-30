import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const MainMenu = ({ style = '' }) => {
  const pathname = usePathname();
  const t = useTranslations('Components.Layout.Header.MainMenu');

  return (
    <nav className="menu js-navList">
      <ul className={`menu__nav ${style} -is-active`}>
        <li className={pathname === '/contact' ? 'current' : ''}>
          <Link href="/contact">{t('contact')}</Link>
        </li>
        <li className={pathname === '/check-booking' ? 'current' : ''}>
          <Link href="/check-booking">{t('check_booking')}</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainMenu;
