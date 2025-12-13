import { FlightPackage } from '@/types/app/fareTypes';
import moment from 'moment';
import React, { useState } from 'react';
import {
  IoIosArrowDown,
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
} from 'react-icons/io';

function FlightCard({ flightData }: { flightData: FlightPackage }) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2  ">
        {/* logo */}
        <div className="min-w-8! h-8!  rounded-full">
          <img
            src={flightData?.legs[0]?.airline_info?.logo || ''}
            alt="airline logo"
            width={32}
            height={32}
          />
        </div>
        <div className="flex flex-col gap-0 w-full!">
          {/* titles */}
          <div className="flex items-center justify-between gap-2 w-full!">
            <h6 className=" text-gray-600!">
              {flightData?.legs[0]?.departure_info?.city_name} to{' '}
              {
                flightData?.legs[flightData?.legs.length - 1]?.arrival_info
                  ?.city_name
              }
            </h6>
            <span className="text-sm text-gray-500">
              {moment(flightData?.legs[0]?.departure_info?.date).format(
                'DD MMM',
              )}
            </span>
          </div>

          {/* time */}
          <div className="flex items-center justify-between gap-2 w-full!">
            <h6 className=" text-lg! font-semibold">
              {moment(flightData?.legs[0]?.departure_info?.date).format(
                'HH:mm',
              )}
            </h6>
            <div className="h-1 w-full! bg-gray-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {flightData?.legs.slice(0, -1).map((leg, index) => (
                  <div
                    key={index}
                    className="h-6 px-2 flex items-center justify-center text-[12px]!  rounded-[2px] bg-white border! border-gray-500  "
                  >
                    {leg?.arrival_info?.airport_code}
                  </div>
                ))}
              </div>
            </div>
            <h6 className=" text-lg! font-semibold">
              {moment(
                flightData?.legs[flightData?.legs.length - 1]?.arrival_info
                  ?.date,
              ).format('HH:mm')}
            </h6>
          </div>

          {/* location */}
          <span className=" text-[13px]! ">
            {flightData?.legs[0]?.airline_info?.carrier_name}
          </span>

          {/* accordion title */}
          <div
            className="flex items-center justify-between gap-2 w-full! text-[12px]! -mt-1 cursor-pointer"
            onClick={toggleAccordion}
          >
            <span>
              {flightData?.legs[0]?.time_info?.flight_time_hour}h{' '}
              {flightData?.legs[0]?.time_info?.flight_time_minute}m
            </span>
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
        <div className="">
          {flightData?.legs.map((leg, index) => (
            <div key={index} className="">
              <div className="flex gap-2 h-[148px]! ">
                {/* left */}
                <div className="flex flex-col gap-2 justify-between  items-center">
                  <div className="flex flex-col">
                    <span className="text-[14px]! font-medium">
                      {moment(leg?.departure_info?.date).format('HH:mm')}
                    </span>
                    <span className="text-[10px]! text-gray-500 -mt-1.5 text-center">
                      {moment(leg?.departure_info?.date).format('DD MMM')}
                    </span>
                  </div>
                  <span className="text-[12px]! text-gray-500 ">
                    {(() => {
                      const totalMinutes = moment(leg?.arrival_info?.date).diff(
                        moment(leg?.departure_info?.date),
                        'minutes',
                      );
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
                    })()}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[14px]! font-medium">
                      {moment(leg?.arrival_info?.date).format('HH:mm')}
                    </span>
                    <span className="text-[10px]! text-gray-500 -mt-1.5 text-center">
                      {moment(leg?.arrival_info?.date).format('DD MMM')}
                    </span>{' '}
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
                      <span className=" text-[13px]!">
                        {leg?.departure_info?.airport_code}
                      </span>{' '}
                      {leg?.departure_info?.airport_name}
                    </div>
                    <span className=" text-[13px]! -mt-1.5">
                      {leg?.departure_info?.city_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-1 rounded-md w-full! bg-gray-100">
                    {/* airline_info */}
                    {/* logo */}
                    <div className="min-w-6! h-6! bg-white rounded-[2px] p-0.5 relative overflow-hidden">
                      <img
                        src={leg?.airline_info?.logo || ''}
                        alt="airline logo"
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                    {/* name */}
                    <span className="text-[12px]! text-gray-500 ">
                      {leg?.airline_info?.carrier_name}
                    </span>
                  </div>

                  <div className="flex flex-col  ">
                    <div className="text-[14px]! font-medium">
                      <span className=" text-[13px]!">
                        {leg?.arrival_info?.airport_code}
                      </span>{' '}
                      {leg?.arrival_info?.airport_name}
                    </div>
                    <span className=" text-[13px]! -mt-1.5">
                      {leg?.arrival_info?.city_name}
                    </span>
                  </div>
                </div>
              </div>

              {/* transfer time */}
              {index !== flightData?.legs.length - 1 && (
                <div className="flex items-center gap-2 my-3 bg-amber-100 p-2 rounded-md">
                  <span className="text-[12px]! text-gray-500">
                    Airport stopover· Duration:{' '}
                    {(() => {
                      const totalMinutes = moment(
                        flightData?.legs[index + 1]?.departure_info?.date,
                      ).diff(moment(leg?.arrival_info?.date), 'minutes');
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
                    })()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Baggage allowance */}
        <div className="flex flex-col gap-2 mt-4! border-t border-gray-300 pt-2!">
          <h6 className="text-[18px]! font-semibold! text-gray-700">
            Baggage allowance
          </h6>
          <div className="flex flex-col gap-2">
            {/* Cabin Baggage */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8! h-8! rounded-md flex items-center justify-center
                   ${
                     flightData?.cabin_baggages_text.toLocaleLowerCase() ==
                     'unavailable'
                       ? 'bg-red-100'
                       : 'bg-green-100'
                   }`}
              >
                {flightData?.cabin_baggages_text.toLocaleLowerCase() !=
                'unavailable' ? (
                  <IoIosCheckmarkCircle className="text-green-500! text-lg!" />
                ) : (
                  <IoIosCloseCircle className="text-red-500! text-lg!" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px]! font-medium! text-gray-600!">
                  Cabin Baggage
                </span>
                <span className="text-[12px]! text-gray-500 -mt-1">
                  {flightData?.cabin_baggages_text}
                </span>
              </div>
            </div>
            {/* Checked Baggage */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8! h-8! rounded-md flex items-center justify-center
                   ${
                     flightData?.baggages_text.toLocaleLowerCase() ==
                     'unavailable'
                       ? 'bg-red-100'
                       : 'bg-green-100'
                   }`}
              >
                {flightData?.baggages_text.toLocaleLowerCase() !=
                'unavailable' ? (
                  <IoIosCheckmarkCircle className="text-green-500! text-lg!" />
                ) : (
                  <IoIosCloseCircle className="text-red-500! text-lg!" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px]! font-medium! text-gray-600!">
                  Checked Baggage
                </span>
                <span className="text-[12px]! text-gray-500 -mt-1">
                  {flightData?.baggages_text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightCard;
