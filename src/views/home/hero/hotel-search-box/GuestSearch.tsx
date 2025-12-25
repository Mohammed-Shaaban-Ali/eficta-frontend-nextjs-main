'use client';

import React from 'react';
import usePerfectScrollbar from '@/hooks/usePerfectScrollbar';
import { UseFormReturn } from 'react-hook-form';
import { searchHotelsParams } from '@/types/requests/searchHotelRequestTypes';
import { useTranslations, useLocale } from 'next-intl';
import { RiUserFill } from 'react-icons/ri';

interface Room {
  AdultsCount: number;
  KidsAges: number[];
}

interface RoomCardProps {
  room: Room;
  index: number;
  form: UseFormReturn<searchHotelsParams>;
  onRemove: (index: number) => void;
}

const RoomCard = ({ room, index, form, onRemove }: RoomCardProps) => {
  const { setValue, watch } = form;
  const rooms = watch('rooms');

  const handleAdultChange = (value: number) => {
    const newRooms = [...rooms];
    newRooms[index] = { ...room, AdultsCount: value };
    setValue('rooms', newRooms);
  };

  const handleChildChange = (value: number) => {
    const newKidsAges =
      value > room.KidsAges.length
        ? [...room.KidsAges, 0]
        : room.KidsAges.slice(0, value);

    const newRooms = [...rooms];
    newRooms[index] = { ...room, KidsAges: newKidsAges };
    setValue('rooms', newRooms);
  };

  const handleAgeChange = (childIndex: number, age: number) => {
    const newKidsAges = [...room.KidsAges];
    newKidsAges[childIndex] = age;

    const newRooms = [...rooms];
    newRooms[index] = { ...room, KidsAges: newKidsAges };
    setValue('rooms', newRooms);
  };

  return (
    <div
      className="mb-4 pb-4"
      // style={{
      //   borderBottom: index < rooms.length - 1 ? '1px solid #e5e7eb' : 'none',
      // }}
    >
      <div className="flex justify-between items-center gap-2">
        <h6
          className="mb-1 fw-semibold text-[#636363]!"
          style={{ fontSize: '16px' }}
        >
          Room No. {index + 1}
        </h6>
        {rooms.length > 1 && (
          <button
            type="button"
            className="btn btn-sm text-[14px]! flex items-center justify-center border-0 p-0.5 px-2
          rounded
          hover:bg-red-500/10! cursor-pointer text-red-500!
          "
            onClick={() => onRemove(index)}
          >
            remove room
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className=" w-full flex justify-between items-center gap-2">
          <span
            className="fw-medium text-[#6E7491]!"
            style={{ fontSize: '14px', whiteSpace: 'nowrap' }}
          >
            Adults:
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`btn btn-sm d-flex text-[20px]! font-bold! align-items-center justify-content-center border-0 p-0
                w-7! h-7! text-[#605DEC]!
                ${
                  room.AdultsCount <= 1
                    ? 'bg-gray-50! cursor-not-allowed '
                    : 'bg-gray-100!'
                }
                `}
              onClick={() =>
                handleAdultChange(Math.max(1, room.AdultsCount - 1))
              }
              disabled={room.AdultsCount <= 1}
            >
              −
            </button>
            <span
              className="fw-semibold text-[#6E7491]! d-flex align-items-center justify-content-center"
              style={{
                fontSize: '14px',
              }}
            >
              {room.AdultsCount}
            </span>
            <button
              type="button"
              className={`btn btn-sm text-[20px]! font-bold! d-flex align-items-center justify-content-center border-0 p-0
                w-7! h-7! text-[#605DEC]!
                ${
                  room.AdultsCount <= 1
                    ? 'bg-gray-50! cursor-not-allowed '
                    : 'bg-gray-100!'
                }
                `}
              onClick={() => handleAdultChange(room.AdultsCount + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-2">
          <span
            className="fw-medium text-[#6E7491]!"
            style={{ fontSize: '14px', whiteSpace: 'nowrap' }}
          >
            Children:
          </span>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className={`btn btn-sm text-[20px]! font-bold! d-flex align-items-center justify-content-center border-0 p-0
                w-7! h-7! text-[#605DEC]!
                ${
                  room.KidsAges.length === 0
                    ? 'bg-gray-50! cursor-not-allowed '
                    : 'bg-gray-100!'
                }
                `}
              onClick={() =>
                handleChildChange(Math.max(0, room.KidsAges.length - 1))
              }
              disabled={room.KidsAges.length === 0}
            >
              −
            </button>
            <span
              className="fw-semibold text-[#6E7491]! d-flex align-items-center justify-content-center"
              style={{
                fontSize: '14px',
              }}
            >
              {room.KidsAges.length}
            </span>
            <button
              type="button"
              className={`btn btn-sm text-[20px]! font-bold! d-flex align-items-center justify-content-center border-0 p-0
                w-7! h-7! text-[#605DEC]!
                ${
                  room.KidsAges.length === 0
                    ? 'bg-gray-50! cursor-not-allowed '
                    : 'bg-gray-100!'
                }
                `}
              onClick={() => handleChildChange(room.KidsAges.length + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {room.KidsAges.length > 0 && (
        <div className="row mt-3">
          {room.KidsAges.map((age: number, idx: number) => (
            <div key={idx} className="col-md-6 mb-2">
              <label
                className="form-label text-muted mb-1"
                style={{ fontSize: '13px' }}
              >
                Child {idx + 1} Age
              </label>
              <select
                className="form-select form-select-sm"
                style={{ fontSize: '14px' }}
                value={age}
                onChange={(e) => handleAgeChange(idx, parseInt(e.target.value))}
              >
                {Array.from({ length: 18 }, (_, i) => (
                  <option key={i} value={i}>
                    {i} {i === 1 ? 'year' : 'years'} old
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface GuestSearchProps {
  form: UseFormReturn<searchHotelsParams>;
}

const GuestSearch = ({ form }: GuestSearchProps) => {
  const t = useTranslations('HomePage.hero_section.hotel.guest');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const scrollRef = usePerfectScrollbar({
    suppressScrollX: true,
    wheelPropagation: false,
  });
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { setValue, watch } = form;
  const rooms = watch('rooms');

  const addRoom = () => {
    setValue('rooms', [...rooms, { AdultsCount: 1, KidsAges: [] }]);
  };

  const removeRoom = (index: number) => {
    setValue(
      'rooms',
      rooms.filter((_, idx) => idx !== index),
    );
  };

  const getTotalGuests = () => {
    return rooms.reduce(
      (total, room) => total + room.AdultsCount + room.KidsAges.length,
      0,
    );
  };

  const getTotalAdults = () => {
    return rooms.reduce((total, room) => total + room.AdultsCount, 0);
  };

  const handleApply = () => {
    // Close dropdown by finding the toggle and clicking outside
    const toggle = dropdownRef.current?.querySelector(
      '[data-bs-toggle="dropdown"]',
    ) as HTMLElement;
    if (toggle) {
      // Use Bootstrap dropdown API if available
      const bsDropdown = (window as any).bootstrap?.Dropdown?.getInstance(
        toggle,
      );
      if (bsDropdown) {
        bsDropdown.hide();
      } else {
        // Fallback: trigger click outside by clicking the toggle
        document.body.click();
      }
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="searchMenu-guests col-span-1 js-form-dd
       js-form-counters position-relative"
    >
      <div
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
        data-bs-offset="0,22"
        className="relative flex flex-col items-start justify-center rounded-lg! px-4! h-[64px] transition-all duration-300"
      >
        <div className=" font-semibold!  text-[#737373]! mb-0!">
          Guests and Rooms
        </div>
        <div className="font-bold! text-black! -mt-1! flex items-center gap-1">
          <RiUserFill size={18} className="text-[#737373]" />
          {getTotalAdults()} Adults in {rooms.length} Rooms
        </div>
      </div>

      <div className="shadow-2 dropdown-menu w-full sm:min-w-[500px]! ">
        <div
          className="bg-white p-4 rounded-lg! counter-box"
          style={{
            maxHeight: '500px',
            position: 'relative',
            overflow: 'hidden',
          }}
          ref={scrollRef}
        >
          {/* Room cards */}
          {rooms.map((room, index) => (
            <RoomCard
              key={index}
              room={room}
              index={index}
              form={form}
              onRemove={removeRoom}
            />
          ))}

          {/* Add Room Button - Centered */}
          <div
            className="flex justify-center items-center mx-auto text-[#0E8571]! my-2 border-2 border-[#0E8571]! 
          bg-[#0E8571]/5! hover:bg-[#0E8571]/10! cursor-pointer
          rounded-full! w-10! h-10!"
            onClick={addRoom}
          >
            +
          </div>

          {/* Confirm/Select Button */}
          <button
            type="button"
            className="btn w-100 h-11! mt-2 border-0 text-white fw-semibold
            transition-all duration-300 rounded-3xl!
            bg-[#0E8571]! hover:bg-[#0E8571]/80! cursor-pointer"
            onClick={handleApply}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestSearch;
