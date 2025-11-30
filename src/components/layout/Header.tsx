'use client';
import '@/styles/header.css';
import { useEffect, useState } from 'react';
import MainMenu from './MainMenu';
import LanguageMegaMenu from './LanguageMegaMenu';

import MobileMenu from '../../views/header/MobileMenu';
import { Link } from '@/i18n/navigation';
import { Session } from 'next-auth';
import { signOut } from '@/utils/auth';
import {
  FiHome,
  FiCalendar,
  FiHeart,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

const Header1 = ({ session }: { session: Session | null }) => {
  const t = useTranslations('Components.Layout.Header');
  const locale = useLocale();
  const isRTL = locale === 'ar'; // Add other RTL languages as needed
  const [navbar, setNavbar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', changeBackground);
    return () => {
      window.removeEventListener('scroll', changeBackground);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownElement = document.getElementById('profileDropdown');
      if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Apply RTL-specific classes and styles
  const directionClasses = isRTL ? 'rtl-direction' : '';

  return (
    <>
      <header
        className={`header bg-dark-3 d-flex justify-content-between px-20 ${navbar ? 'is-sticky' : ''} ${directionClasses}`}
      >
        <div className="row justify-between items-center">
          <div className="col-auto d-flex items-center">
            <Link
              href="/"
              className={`header-logo ${isRTL ? 'ml-20' : 'mr-20'}`}
            >
              <img
                src="/img/logo/eficta_white.png"
                alt="logo icon"
                style={{ width: '70px' }}
              />
            </Link>

            <div className="header-menu">
              <div className="header-menu__content">
                <MainMenu style="text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-auto">
          <div className="d-flex items-center">
            <div className="row x-gap-20 items-center">
              <div className="col-auto">
                <div className="w-1 h-20 bg-white-20" />
              </div>

              <LanguageMegaMenu textClass="text-white" />
            </div>

            {/* Start btn-group */}
            {!session ? (
              <div
                className={`d-flex items-center ${isRTL ? 'mr-20' : 'ml-20'} is-menu-opened-hide md:d-none`}
              >
                <Link
                  href="/auth/login"
                  className={`button px-30 fw-400 text-14 border-white -outline-white h-50 text-white ${isRTL ? 'mr-20' : 'ml-20'}`}
                >
                  {t('sign_in_register')}
                </Link>
              </div>
            ) : (
              <div
                className={`d-flex items-center ${isRTL ? 'mr-20' : 'ml-20'} is-menu-opened-hide md:d-none`}
              >
                <div id="profileDropdown" className="profile-dropdown-wrapper">
                  <div
                    className="profile-trigger d-flex items-center"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <div className="profile-avatar">
                      <img
                        src={
                          session.user?.image ||
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHfd3PPulVSp4ZbuBFNkePoUR_fLJQe474Ag&s'
                        }
                        alt="Profile"
                        className="profile-img"
                      />
                    </div>
                    <span
                      className={`profile-name ${isRTL ? 'mr-10' : 'ml-10'} text-white`}
                    >
                      {session.user?.name?.split(' ')[0]}
                    </span>
                    <i
                      className={`icon-chevron-sm-down ${isRTL ? 'mr-10' : 'ml-10'} profile-arrow ${showProfileMenu ? 'rotate-180' : ''}`}
                    ></i>
                  </div>

                  {showProfileMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '60px',
                        [isRTL ? 'left' : 'right']: 0,
                        width: '280px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: '0 5px 25px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        overflow: 'hidden',
                        animation: 'fadeIn 0.3s ease',
                      }}
                    >
                      <div className="profile-dropdown-header">
                        <div className="d-flex items-center">
                          <div className="profile-avatar-lg">
                            <img
                              src={
                                session.user?.image ||
                                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHfd3PPulVSp4ZbuBFNkePoUR_fLJQe474Ag&s'
                              }
                              alt="Profile"
                            />
                          </div>
                          <div className={isRTL ? 'mr-15' : 'ml-15'}>
                            <h5 className="text-16 fw-500 text-white">
                              {session.user?.name}
                            </h5>
                            <p className="text-12 text-light-1">
                              {session.user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="profile-dropdown-body"></div>
                      <Link href="/profile/overview" className="dropdown-item">
                        <FiHome className={isRTL ? 'ml-10' : 'mr-10'} />
                        {t('profile')}
                      </Link>
                      <Link href="/profile/bookings" className="dropdown-item">
                        <FiCalendar className={isRTL ? 'ml-10' : 'mr-10'} />
                        {t('my_bookings')}
                      </Link>

                      <Link href="/profile/settings" className="dropdown-item">
                        <FiSettings className={isRTL ? 'ml-10' : 'mr-10'} />
                        {t('account_settings')}
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button
                        onClick={() => signOut({ callbackUrl: '/auth/login' })}
                        className="dropdown-item text-red-1"
                      >
                        <FiLogOut className={isRTL ? 'ml-10' : 'mr-10'} />
                        {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div
              className={`d-none xl:d-flex x-gap-20 items-center ${isRTL ? 'pr-30' : 'pl-30'} text-white`}
            >
              <div>
                <Link
                  href="/login"
                  className="d-flex items-center icon-user text-inherit text-22"
                />
              </div>
              <div>
                <button
                  className="d-flex items-center icon-menu text-inherit text-20"
                  data-bs-toggle="offcanvas"
                  aria-controls="mobile-sidebar_menu"
                  data-bs-target="#mobile-sidebar_menu"
                />

                <div
                  className={`offcanvas ${isRTL ? 'offcanvas-end' : 'offcanvas-start'} mobile_menu-contnet`}
                  tabIndex={1}
                  id="mobile-sidebar_menu"
                  aria-labelledby="offcanvasMenuLabel"
                  data-bs-scroll="true"
                >
                  <MobileMenu />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header1;
