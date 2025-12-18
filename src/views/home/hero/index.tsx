'use client';
import { useState } from 'react';
import { useTranslations } from 'use-intl';
import HotelSearchBox from './hotel-search-box';
import FlightSearchBox from './flight-search-box';
import { RiFlightTakeoffFill, RiHotelFill } from 'react-icons/ri';

const Index = () => {
  const t = useTranslations('HomePage.hero_section');
  const tabs = [
    {
      id: 1,
      name: 'Hotel',
      label: t('tabs.hotel'),
      Icon: RiHotelFill as React.ElementType,
    },
    {
      id: 2,
      name: 'Flight',
      label: t('tabs.flight'),
      Icon: RiFlightTakeoffFill as React.ElementType,
    },
  ];
  const [currentTab, setCurrentTab] = useState('Hotel');

  return (
    <section className="masthead -type-1 z-5">
      <div className="masthead__bg">
        <img alt="image" src="/img/masthead/1/bg.webp" className="js-lazy" />
      </div>
      <div className="container w-full! max-w-[1200px]! mx-auto!">
        <div className="">
          <div className="col-auto">
            {/* <div className="text-center">
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
            </div> */}

            <div className="" data-aos="fade-up" data-aos-delay="200">
              <div className="flex gap-2 justify-center border! border-white/10 bg-white/25 backdrop-blur-sm w-fit mx-auto p-1.5 rounded-[30px] overflow-hidden">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    className={`
                      h-12 px-6! flex items-center justify-center gap-1.5 font-semibold text-lg rounded-[30px]! transition-all duration-300
                      ${tab?.name === currentTab ? 'bg-white text-black ' : ' text-white hover:bg-white/20!'}`}
                    onClick={() => setCurrentTab(tab?.name)}
                  >
                    {tab?.name === 'Hotel' ? (
                      <RiHotelFill
                        size={24}
                        className={`
                        ${tab?.name === currentTab ? 'text-primary' : 'text-white'}
                        `}
                      />
                    ) : (
                      <RiFlightTakeoffFill
                        size={20}
                        className={`
                        ${tab?.name === currentTab ? 'text-primary' : 'text-white'}
                        `}
                      />
                    )}
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
