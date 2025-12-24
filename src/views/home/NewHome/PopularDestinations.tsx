'use client';

import React, { useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import HeaderShared from './HeaderShared';
import { FaHeart, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { GoArrowRight } from 'react-icons/go';

type Props = Record<string, never>;

function PopularDestinations({}: Props) {
  return (
    <div className="py-5! ">
      {/* titles */}
      <HeaderShared title="Most popular" subtitle="Destinations" />
      <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className={`relative
             w-full  h-[300px]! rounded-2xl! overflow-hidden! group
              ${index === 0 ? 'col-span-1 md:col-span-2 ms-auto' : 'col-span-1'} `}
          >
            <Image
              src={
                index % 2 === 0
                  ? '/img/recommended1.jpg'
                  : '/img/recommended2.jpg'
              }
              alt="destination"
              className="object-cover w-full h-full group-hover:scale-[1.03] transition-all duration-300"
              width={500}
              height={500}
            />
            {/* content */}
            <div
              className={`absolute bottom-2.5 
            w-full max-w-[calc(min(94%,320px))]! h-fit rounded-xl! bg-white/85 group-hover:bg-white transition-all
            duration-300 group-hover:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)]
            p-2.5 
             ${index === 0 ? ' md:left-2.5 md:translate-x-0 left-1/2 -translate-x-1/2 ' : 'left-1/2 -translate-x-1/2 '}`}
            >
              <h3 className="text-[18px]! font-bold!">Western Europe</h3>
              <div className="flex items-center gap-1.5 justify-between ">
                <p className="text-[14px]! text-gray-500! font-normal! ">
                  356 Tours, 248 Activities
                </p>
                <button
                  className="w-8 h-8 bg-white! group-hover:bg-gray-200! flex items-center justify-center rounded-full text-black! 
                  transition-all duration-300  hover:text-black! cursor-pointer
                  "
                >
                  <GoArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default PopularDestinations;
