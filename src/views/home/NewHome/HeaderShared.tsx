import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { IoArrowForward } from 'react-icons/io5';

type Props = Record<string, never>;

function HeaderShared({
  title,
  subtitle,
  onClickPrev,
  onClickNext,
  ViewMore,
  description,
}: {
  title: string;
  subtitle?: string;
  onClickPrev?: () => void;
  onClickNext?: () => void;
  ViewMore?: boolean;
  description?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-2.5 mb-5! flex-wrap ">
      <div className="flex flex-col gap-1">
        <h2 className="text-[28px]! md:text-[36px]! font-bold flex items-center gap-2 ">
          {title}
          {subtitle && <span className="text-[#0E8571]">{subtitle}</span>}
        </h2>
        {description && (
          <p className="text-[16px]! text-gray-500! font-medium! ">
            {description}
          </p>
        )}
      </div>

      {onClickPrev && onClickNext && (
        <div className="flex items-center gap-2.5 ms-auto">
          <button
            onClick={onClickPrev}
            className="w-10 h-10 border border-[#0E8571]! flex items-center justify-center rounded-full text-[#0E8571] 
          transition-all duration-300 hover:bg-[#0E8571]! hover:text-white cursor-pointer
          "
          >
            <IoIosArrowBack className="w-6 h-6" />
          </button>
          <button
            onClick={onClickNext}
            className="w-10 h-10 bg-[#0E8571]! flex items-center justify-center rounded-full text-white 
          transition-all duration-300 hover:bg-[#0E8571]/80! cursor-pointer
          "
          >
            <IoIosArrowForward className="w-6 h-6" />
          </button>
        </div>
      )}
      {ViewMore && (
        <button
          onClick={onClickNext}
          className="ms-auto  px-3 h-11 bg-[#0E8571]! flex items-center justify-center gap-2 font-bold!  rounded-3xl! text-white 
          transition-all duration-300 hover:bg-[#0E8571]/80! cursor-pointer
          "
        >
          View More
          <IoArrowForward className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default HeaderShared;
