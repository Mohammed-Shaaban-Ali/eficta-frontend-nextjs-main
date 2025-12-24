'use client';

import React, { useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import HeaderShared from './HeaderShared';
import { FaHeart, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

type Props = Record<string, never>;

function RecommendedHotel({}: Props) {
  const swiperRef = useRef<any>(null);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});

  const handleFavoriteClick = (index: number) => {
    setFavorites((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="pt-14 md:pt-16!">
      {/* titles */}
      <HeaderShared
        title="Most recommended"
        subtitle="Hotel"
        onClickNext={() => swiperRef.current?.slideNext()}
        onClickPrev={() => swiperRef.current?.slidePrev()}
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
            slidesPerView: 3.7,
            spaceBetween: 16,
          },
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <SwiperSlide key={index}>
            <div
              className="bg-[#F8F4E8] rounded-3xl p-2.5 mb-1
             flex flex-col gap-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)]
             group
             hover:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] transition-all duration-300
             hover:bg-[#fdf6df] hover:-translate-y-1.5
             "
            >
              <div className="w-full h-[240px] rounded-2xl bg-[#0E8571] overflow-hidden relative">
                <Image
                  src={
                    index % 2 === 0
                      ? '/img/recommended1.jpg'
                      : '/img/recommended2.jpg'
                  }
                  alt="hotel"
                  className="w-full h-full object-cover"
                  width={280}
                  height={250}
                />
                <button
                  onClick={() => handleFavoriteClick(index)}
                  className={`
                    absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full
                   bg-white/90 hover:bg-white transition-all duration-300 
                `}
                  aria-label="Add to favorites"
                >
                  <FaHeart
                    className={`w-5 h-5 ${
                      favorites[index]
                        ? 'text-red-500 fill-current'
                        : 'text-white  stroke-red-500! stroke-2!'
                    }`}
                  />
                </button>
              </div>
              <div className="flex flex-col gap-1.5 p-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px]! font-extrabold!">
                    Culpa Est Similique
                  </h3>
                  <div className="flex items-center gap-1">
                    <FaStar className="w-4 h-4 text-[#B79017]! fill-current" />
                    <span className="text-[14px]! font-medium!">4.92</span>
                  </div>
                </div>
                <p className="text-[14px]! text-gray-400! font-normal leading-relaxed">
                  Voluptatibus Nemo Amet Voluptatem Quia Ipsa Eum. Est Ut
                  Voluptas.
                </p>
                <div
                  className="flex items-center justify-between mt-1 
                border-t! border-gray-400! pt-1
                border-dashed!
                "
                >
                  <div>
                    <span className="text-[18px]  font-extrabold">$139.00</span>
                    <span className="text-[14px]! text-gray-500! font-normal! ml-1">
                      Night
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                    <span className="text-[14px] text-gray-600 font-normal">
                      India
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default RecommendedHotel;
