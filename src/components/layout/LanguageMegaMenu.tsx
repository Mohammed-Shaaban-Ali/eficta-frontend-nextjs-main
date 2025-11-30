'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const LanguageMegaMenu = ({ textClass }: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Define the language content (only keep enabled ones)
  const languageContent = [
    {
      id: 1,
      language: 'English',
      country: 'United States',
      code: 'en',
    },
    {
      id: 2,
      language: 'Arabic',
      country: 'Egypt',
      code: 'ar',
    },
  ];

  // Determine the current language from URL pathname
  const getCurrentLanguageCode = () => {
    const firstSegment = pathname?.split('/')[1];
    return firstSegment === 'ar' ? 'ar' : 'en';
  };

  // Initialize with the current language or English as default
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const currentCode = getCurrentLanguageCode();
    return (
      languageContent.find((lang) => lang.code === currentCode) ||
      languageContent[0]
    );
  });

  // Update selected language when pathname changes
  useEffect(() => {
    const currentCode = getCurrentLanguageCode();
    const currentLang = languageContent.find(
      (lang) => lang.code === currentCode,
    );
    if (currentLang && currentLang.id !== selectedLanguage.id) {
      setSelectedLanguage(currentLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Get the alternate language (the one that's not selected)
  const getAlternateLanguage = () => {
    return (
      languageContent.find((lang) => lang.id !== selectedLanguage.id) ||
      languageContent[0]
    );
  };

  // Generate the URL for the alternate language while preserving the current page and search params
  const getAlternateLanguageUrl = () => {
    const alternateLanguage = getAlternateLanguage();
    const currentCode = getCurrentLanguageCode();

    // Remove current language code from pathname if it exists
    let cleanPath = pathname;
    if (pathname.startsWith(`/${currentCode}`)) {
      cleanPath = pathname.substring(`/${currentCode}`.length) || '';
    }

    // If the path is empty or just '/', make it empty for the new language
    if (cleanPath === '' || cleanPath === '/') {
      cleanPath = '';
    }

    // Ensure cleanPath starts with '/' if it's not empty
    if (cleanPath && !cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }

    // Preserve search parameters
    const queryString = searchParams.toString();
    const searchQuery = queryString ? `?${queryString}` : '';

    return `/${alternateLanguage.code}${cleanPath}${searchQuery}`;
  };

  const alternateLanguage = getAlternateLanguage();

  return (
    <div className="col-auto">
      <Link
        href={getAlternateLanguageUrl()}
        className={`d-flex items-center text-14 ${textClass}`}
        aria-label="Change language"
      >
        <Image
          width={30}
          height={50}
          src={`/img/general/${alternateLanguage.code}.png`}
          alt={`${selectedLanguage.country} flag`}
          style={{ margin: '0 10px 0 10px', maxHeight: '20px' }}
        />
        <span className="js-language-mainTitle">
          {alternateLanguage.language}
        </span>
      </Link>
    </div>
  );
};

export default LanguageMegaMenu;
