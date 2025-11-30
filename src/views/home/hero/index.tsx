'use client';
import { useState } from 'react';
import { useTranslations } from 'use-intl';
import HotelSearchBox from './hotel-search-box';
import FlightSearchBox from './flight-search-box';

const Index = () => {
  const t = useTranslations('HomePage.hero_section');
  const tabs = [
    { id: 1, name: 'Hotel', label: t('tabs.hotel') },
    { id: 2, name: 'Flight', label: t('tabs.flight') },
  ];
  const [currentTab, setCurrentTab] = useState('Hotel');

  return (
    <section className="masthead -type-1 z-5">
      <div className="masthead__bg">
        <img alt="image" src="/img/masthead/1/bg.webp" className="js-lazy" />
      </div>
      <div className="container">
        <div className="row justify-center">
          <div className="col-auto">
            <div className="text-center">
              <h1
                className="text-60 lg:text-40 md:text-30 text-white"
                data-aos="fade-up"
              >
                {t('Find_Next_Place')}
              </h1>
              <p
                className="text-white mt-6 md:mt-10"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {t('Discover_Places')}
              </p>
            </div>

            <div
              className="tabs -underline mt-60 js-tabs"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="tabs__controls d-flex x-gap-30 y-gap-20 justify-center sm:justify-start js-tabs-controls">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    className={`tabs__button text-15 fw-500 text-white pb-4 js-tabs-button ${
                      tab?.name === currentTab ? 'is-tab-el-active' : ''
                    }`}
                    onClick={() => setCurrentTab(tab?.name)}
                  >
                    {tab?.label}
                  </button>
                ))}
              </div>
              {currentTab === 'Hotel' ? (
                <HotelSearchBox />
              ) : (
                <FlightSearchBox />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
