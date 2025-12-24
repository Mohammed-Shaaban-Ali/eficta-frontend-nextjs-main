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

function OurPackages({}: Props) {
  const swiperRef = useRef<any>(null);

  return (
    <div className="py-14 md:py-16!">
      {/* titles */}
      <HeaderShared
        title="Our"
        subtitle="Packages"
        description="Enjoy the best offers and packages"
        ViewMore
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
              className="bg-white rounded-3xl p-2.5 border border-[#E4E6E8]  
             flex flex-col gap-2
             group
             hover:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] transition-all duration-300
             hover:-translate-y-1
             "
            >
              <div className="w-full h-[200px] rounded-2xl bg-[#0E8571] overflow-hidden">
                <Image
                  src={'/img/lastsearched.png'}
                  alt="lastsearched"
                  className="w-full h-full object-cover"
                  width={280}
                  height={200}
                />
              </div>
              <div className="flex flex-col gap-1.5 p-1.5">
                <h3 className="text-[16px]! text-gray-500! font-normal! ">
                  Package Name
                </h3>
                <h4 className="text-[18px]! text-[#0E8571]! font-extrabold! ">
                  200.00$
                </h4>
                <div className="flex items-center gap-1.5 justify-between -mt-1">
                  <p className="text-[14px]! text-gray-500! font-normal! ">
                    356 Tours, 248 Activities
                  </p>
                  <button
                    className="w-8 h-8 bg-[#0E8571]/30! flex items-center justify-center rounded-full text-black! 
                  transition-all duration-300 hover:bg-[#0E8571]/80! hover:text-white! cursor-pointer
                  "
                  >
                    <GoArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default OurPackages;
