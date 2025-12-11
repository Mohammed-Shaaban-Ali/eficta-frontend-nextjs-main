import React, { useState } from 'react';
import {
  IoIosArrowDown,
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
} from 'react-icons/io';
type Props = Record<string, never>;

function TestDesign(_props: Props) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2  ">
        {/* logo */}
        <div className="min-w-8! h-8! bg-blue-100 rounded-full"></div>
        <div className="flex flex-col gap-0 w-full!">
          {/* titles */}
          <div className="flex items-center justify-between gap-2 w-full!">
            <h6 className=" text-gray-600!">Jeddah to Riyadh</h6>
            <span className="text-sm text-gray-500">Mon, 1 Jun</span>
          </div>

          {/* time */}
          <div className="flex items-center justify-between gap-2 w-full!">
            <h6 className=" text-lg! font-semibold">13:00</h6>
            <div className="h-1 w-full! bg-gray-500"></div>
            <h6 className=" text-lg! font-semibold">14:00</h6>
          </div>

          {/* location */}
          <span className=" text-[13px]! ">Saudia · Economy</span>

          {/* accordion title */}
          <div
            className="flex items-center justify-between gap-2 w-full! text-[12px]! -mt-1 cursor-pointer"
            onClick={toggleAccordion}
          >
            <span>1h 50m</span>
            <IoIosArrowDown
              className={`text-gray-500! text-sm! cursor-pointer transition-transform duration-500! ${
                isAccordionOpen ? 'rotate-180! ' : ''
              }`}
            />
          </div>
        </div>
      </div>{' '}
      {/* accordion content */}
      <div
        className={`flex flex-col overflow-hidden transition-all duration-500! ease-in-out! ${
          isAccordionOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* time */}
        <div className="flex gap-2 h-[165px]! ">
          {/* left */}
          <div className="flex flex-col gap-2 justify-between  items-center">
            <div className="flex flex-col">
              <span className="text-[14px]! font-medium">13:00</span>
              <span className="text-[10px]! text-gray-500 -mt-1.5 text-center">
                01 Jun
              </span>
            </div>
            <span className="text-[12px]! text-gray-500 ">1h 50m</span>
            <div className="flex flex-col">
              <span className="text-[14px]! font-medium">15:00</span>
              <span className="text-[10px]! text-gray-500 -mt-1.5 text-center">
                01 Jun
              </span>{' '}
              <span className="text-[12px]! text-gray-500 -mt-1">.</span>
            </div>
          </div>
          {/* center */}
          <div className="flex flex-col items-center">
            <div className="w-3.5! h-3.5! bg-white border-2! border-blue-500 rounded-full"></div>
            <div className="h-24 w-0.5! bg-blue-500"></div>

            <div className="w-3.5! h-3.5! bg-blue-500 rounded-full"></div>
          </div>
          {/* right */}
          <div className="flex flex-col gap-2 justify-between">
            <div className="flex flex-col  ">
              <div className="text-[14px]! font-medium">
                <span className=" text-[13px]!">JED</span> King Abdulaziz
                International Airport
              </div>
              <span className=" text-[13px]! -mt-1.5">
                Jeddah, Saudi Arabia
              </span>
              <span className=" text-[12px]! text-gray-500 -mt-1.5">
                Terminal 1
              </span>
            </div>

            <div className="flex flex-col  ">
              <div className="text-[14px]! font-medium">
                <span className=" text-[13px]!">RUH</span> King Khaled
                International Airport
              </div>
              <span className=" text-[13px]! -mt-1.5">
                Riyadh, Saudi Arabia
              </span>
              <span className=" text-[12px]! text-gray-500 -mt-1.5">
                Terminal 4
              </span>
            </div>
          </div>
        </div>
        {/* Baggage allowance */}
        <div className="flex flex-col gap-2 mt-4 border-t border-gray-300 pt-2!">
          <h6 className="text-[18px]! font-semibold! text-gray-700">
            Baggage allowance
          </h6>
          <div className="flex flex-col gap-2">
            {/* Cabin Baggage */}
            <div className="flex items-center gap-2">
              <div className="w-8! h-8! bg-green-100 rounded-md flex items-center justify-center">
                <IoIosCheckmarkCircle className="text-green-500! text-lg!" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px]! font-medium! text-gray-600!">
                  Cabin Baggage
                </span>
                <span className="text-[12px]! text-gray-500 -mt-1">
                  7 KG / 1 piece
                </span>
              </div>
            </div>
            {/* Checked Baggage */}
            <div className="flex items-center gap-2">
              <div className="w-8! h-8! bg-red-100 rounded-md flex items-center justify-center">
                <IoIosCloseCircle className="text-red-500! text-lg!" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px]! font-medium! text-gray-600!">
                  Checked Baggage
                </span>
                <span className="text-[12px]! text-gray-500 -mt-1">
                  Not included
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestDesign;
