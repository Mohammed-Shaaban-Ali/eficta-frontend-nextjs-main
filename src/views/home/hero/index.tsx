'use client';
import { useState } from 'react';
import { useTranslations } from 'use-intl';
import HotelSearchBox from './hotel-search-box';
import FlightSearchBox from './flight-search-box';
import {
  RiFlightTakeoffFill,
  RiHotelBedFill,
  RiHotelFill,
} from 'react-icons/ri';
import Image from 'next/image';
import { BsCreditCard2FrontFill } from 'react-icons/bs';

const Index = () => {
  const t = useTranslations('HomePage.hero_section');
  const tabs = [
    {
      id: 1,
      name: 'Hotel',
      label: t('tabs.hotel'),
      Icon: <RiHotelBedFill className="size-4! sm:size-6!  " />,
    },
    {
      id: 2,
      name: 'Flight',
      label: t('tabs.flight'),
      Icon: <RiFlightTakeoffFill className="size-4! sm:size-6!  " />,
    },
    {
      id: 3,
      name: 'Tour',
      label: 'International License',
      Icon: <BsCreditCard2FrontFill className="size-4! sm:size-6!  " />,
    },
  ];
  const [currentTab, setCurrentTab] = useState('Hotel');

  return (
    <section className="relative min-h-screen ">
      <Image src="/homeherro.jpg" alt="hero" fill className="object-cover" />
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/20"></div>
      <div
        className="container w-full!  
       z-10 absolute bottom-36 sm:bottom-14 left-1/2 -translate-x-1/2 "
      >
        <div className="flex flex-col items-center justify-between h-full gap-20 w-full">
          <div className="text-center">
            <h1
              className="text-60 lg:text-40 md:text-30 text-white"
              data-aos="fade-up"
            >
              {t('Find_Next_Place')}
            </h1>
          </div>

          <div className="w-full" data-aos="fade-up" data-aos-delay="200">
            <div
              className="flex gap-2 justify-start 
              
             bg-[#EAF0F0] backdrop-blur-sm p-2! sm:p-3.5! py-3! sm:py-5! rounded-t-2xl w-full sm:w-fit overflow-hidden"
            >
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  className={`
                      h-9 sm:h-11 px-3! sm:px-6! flex items-center justify-center gap-2 font-semibold text-[12px]! sm:text-lg!
                       rounded-[30px]! transition-all duration-300
                      ${tab?.name === currentTab ? 'bg-[#0E8571]! text-white ' : ' text-black hover:bg-[#0E8571]/20!'}`}
                  onClick={() => setCurrentTab(tab?.name)}
                >
                  {tab?.Icon}
                  {tab?.label}
                </button>
              ))}
            </div>

            {currentTab === 'Hotel' ? <HotelSearchBox /> : <FlightSearchBox />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
