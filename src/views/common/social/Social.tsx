'use client';

import { useTranslations } from 'next-intl';

const Social = () => {
  const t = useTranslations('Components.Social');

  const socialContent = [
    {
      id: 1,
      icon: 'icon-facebook',
      link: 'https://facebok.com/',
      name: t('facebook'),
    },
    {
      id: 2,
      icon: 'icon-twitter',
      link: 'https://twitter.com/',
      name: t('twitter'),
    },
    {
      id: 3,
      icon: 'icon-instagram',
      link: 'https://instagram.com/',
      name: t('instagram'),
    },
    {
      id: 4,
      icon: 'icon-linkedin',
      link: 'https://linkedin.com/',
      name: t('linkedin'),
    },
  ];

  return (
    <>
      {socialContent.map((item) => (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          key={item.id}
          aria-label={item.name}
        >
          <i className={`${item.icon} text-14`} />
        </a>
      ))}
    </>
  );
};

export default Social;
