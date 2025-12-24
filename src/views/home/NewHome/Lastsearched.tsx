'use client';

import React, { useRef } from 'react';
import { FaArrowRight, FaStar, FaUser } from 'react-icons/fa';
import { BsFillCalendar2DateFill } from 'react-icons/bs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import HeaderShared from './HeaderShared';
import { GoArrowRight } from 'react-icons/go';
type Props = Record<string, never>;

function Lastsearched({}: Props) {
  const swiperRef = useRef<any>(null);

  return (
    <div className="py-14 md:py-16!">
      {/* titles */}
      <HeaderShared
        title="Last searched"
        onClickPrev={() => swiperRef.current?.slidePrev()}
        onClickNext={() => swiperRef.current?.slideNext()}
      />
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={4}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 14,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <SwiperSlide key={index}>
            <div
              className="bg-[#FAFBFB] rounded-2xl p-2.5 border border-[#E4E6E8]  
             flex items-center gap-2 justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-14 h-14 rounded-full bg-[#0E8571] overflow-hidden">
                  <Image
                    src={'/img/lastsearched.png'}
                    alt="lastsearched"
                    className="w-full h-full object-cover"
                    width={56}
                    height={56}
                  />
                </div>
                <div className="flex flex-col gap-0">
                  <h3 className="text-[18px]! font-bold">Amsterdam</h3>
                  <div className="flex items-center gap-2 text-[12px]! text-gray-500 font-bold">
                    <FaUser className="text-gray-300" />2 adults, 2 children
                  </div>
                  <div className="flex items-center gap-2 text-[12px]! text-gray-500 font-bold">
                    <BsFillCalendar2DateFill className="text-gray-300" />
                    02 January 2024
                  </div>
                </div>
              </div>

              <button
                className="w-8 h-8 bg-gray-200/80! flex items-center justify-center rounded-full text-gray-400 
          transition-all duration-300 hover:bg-gray-300! cursor-pointer
          "
              >
                <GoArrowRight className="w-4 h-4" />
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Lastsearched;
