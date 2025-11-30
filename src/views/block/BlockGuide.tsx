'use client';

import { useTranslations } from 'next-intl';

const BlockGuide = () => {
  const t = useTranslations('Components.BlockGuide');

  const blockContent = [
    {
      id: 1,
      icon: '/img/featureIcons/1/1.svg',
      title: t('best_price_guarantee'),
      text: t('best_price_text'),
      delayAnim: '100',
    },
    {
      id: 2,
      icon: '/img/featureIcons/1/2.svg',
      title: t('easy_booking'),
      text: t('easy_booking_text'),
      delayAnim: '200',
    },
    {
      id: 3,
      icon: '/img/featureIcons/1/3.svg',
      title: t('customer_care'),
      text: t('customer_care_text'),
      delayAnim: '300',
    },
  ];

  return (
    <>
      {blockContent.map((item) => (
        <div
          className="col-lg-3 col-sm-6"
          data-aos="fade"
          data-aos-delay={item.delayAnim}
          key={item.id}
        >
          <div className="featureIcon -type-1 ">
            <div className="d-flex justify-center">
              <img src={item.icon} alt={item.title} className="js-lazy" />
            </div>
            <div className="text-center mt-30">
              <h4 className="text-18 fw-500">{item.title}</h4>
              <p className="text-15 mt-10">{item.text}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlockGuide;
