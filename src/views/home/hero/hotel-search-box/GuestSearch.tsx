'use client';

import React from 'react';
import usePerfectScrollbar from '@/hooks/usePerfectScrollbar';
import { UseFormReturn } from 'react-hook-form';
import { searchHotelsParams } from '@/types/requests/searchHotelRequestTypes';
import { useTranslations, useLocale } from 'next-intl';

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
  const t = useTranslations('HomePage.hero_section.hotel.guest');
  const locale = useLocale();
  const isRTL = locale === 'ar';
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
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          {t('room')} {index + 1}
        </h5>
        {index > 0 && (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger hover:text-white!"
            onClick={() => onRemove(index)}
          >
            {t('remove_room')}
          </button>
        )}
      </div>

      <div className="row g-3 mb-3">
        {/* Adults Section */}
        <div className="col-6">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <i
                className="icon-man text-gray-500"
                style={{ fontSize: '20px' }}
              />
              <div>
                <div className="text-15 lh-12 fw-500">{t('adults')}</div>
                <div className="text-14 lh-12 text-light-1 mt-1">
                  {t('adults_description')}
                </div>
              </div>
            </div>
            <div className="d-flex items-center gap-1!">
              <button
                type="button"
                className={`d-flex align-items-center justify-content-center ${
                  room.AdultsCount <= 1
                    ? 'bg-secondary hover:opacity-70 text-white'
                    : 'bg-primary hover:opacity-70 text-white'
                } border-0`}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  cursor: room.AdultsCount <= 1 ? 'not-allowed' : 'pointer',
                }}
                onClick={() =>
                  handleAdultChange(Math.max(1, room.AdultsCount - 1))
                }
                disabled={room.AdultsCount <= 1}
              >
                <i className="icon-minus text-12" />
              </button>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ minWidth: '30px' }}
              >
                <div className="text-15 fw-500">{room.AdultsCount}</div>
              </div>
              <button
                type="button"
                className="d-flex 
                hover:opacity-70 
                align-items-center justify-content-center bg-primary text-white border-0"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                }}
                onClick={() => handleAdultChange(room.AdultsCount + 1)}
              >
                <i className="icon-plus text-12" />
              </button>
            </div>
          </div>
        </div>

        {/* Children Section */}
        <div className="col-6">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <i
                className="icon-child text-gray-500"
                style={{ fontSize: '20px' }}
              />
              <div>
                <div className="text-15 lh-12 fw-500">{t('children')}</div>
                <div className="text-14 lh-12 text-light-1 mt-1">
                  {t('children_description')}
                </div>
              </div>
            </div>
            <div className="d-flex items-center gap-1!">
              <button
                type="button"
                className={`d-flex align-items-center justify-content-center ${
                  room.KidsAges.length === 0
                    ? 'bg-secondary hover:opacity-70 text-white'
                    : 'bg-primary hover:opacity-70 text-white'
                } border-0`}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  cursor:
                    room.KidsAges.length === 0 ? 'not-allowed' : 'pointer',
                }}
                onClick={() =>
                  handleChildChange(Math.max(0, room.KidsAges.length - 1))
                }
                disabled={room.KidsAges.length === 0}
              >
                <i className="icon-minus text-12" />
              </button>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ minWidth: '30px' }}
              >
                <div className="text-15 fw-500">{room.KidsAges.length}</div>
              </div>
              <button
                type="button"
                className="d-flex hover:opacity-70 align-items-center justify-content-center bg-primary text-white border-0"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                }}
                onClick={() => handleChildChange(room.KidsAges.length + 1)}
              >
                <i className="icon-plus text-12" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {room.KidsAges.map((age: number, idx: number) => (
          <div key={idx} className="col-md-6 mt-3">
            <label
              className="form-label text-muted"
              style={{ fontSize: '14px' }}
            >
              {t('child_age', { number: idx + 1 })}
            </label>
            <select
              className="form-select"
              style={{ fontSize: '12px' }}
              value={age}
              onChange={(e) => handleAgeChange(idx, parseInt(e.target.value))}
            >
              {Array.from({ length: 18 }, (_, i) => (
                <option key={i} value={i}>
                  {t('years_old', { number: i })}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
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
      className="searchMenu-guests js-form-dd js-form-counters position-relative"
    >
      <div
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
        data-bs-offset="0,22"
        className="relative flex flex-col items-start justify-center border! border-gray-300! rounded-lg! px-4! h-[64px] bg-white!
           hover:border-gray-500! transition-all duration-300"
      >
        <div className="text-[11px]! text-gray-500! ">Guests and Rooms</div>
        <div className="text-[15px]! -mt-1">
          {getTotalAdults()} Adults in {rooms.length} Rooms
        </div>
      </div>

      <div className="shadow-2 dropdown-menu w-full sm:min-w-[500px]! ">
        <div
          className="bg-white p-3 rounded-lg! counter-box"
          style={{
            maxHeight: '500px',
            position: 'relative',
            overflow: 'hidden',
          }}
          ref={scrollRef}
        >
          {rooms.map((room, index) => (
            <RoomCard
              key={index}
              room={room}
              index={index}
              form={form}
              onRemove={removeRoom}
            />
          ))}
          <div className="border-top pt-2 mt-3 d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="d-flex hover:bg-gray-100! rounded-lg! p-2 transition-all duration-300 align-items-center gap-2 btn btn-link text-primary p-0 border-0 text-decoration-none"
              onClick={addRoom}
              style={{ fontSize: '14px' }}
            >
              <div
                className="d-flex align-items-center justify-content-center border border-primary rounded-circle"
                style={{
                  width: '24px',
                  height: '24px',
                }}
              >
                <i
                  className="icon-plus text-primary"
                  style={{ fontSize: '12px' }}
                />
              </div>
              {t('add_room')}
            </button>
            <button
              type="button"
              className="btn btn-link hover:bg-gray-100! rounded-lg! p-2 transition-all duration-300 text-primary p-0 border-0 text-decoration-none"
              onClick={handleApply}
              style={{ fontSize: '14px', fontWeight: '500' }}
            >
              {t('apply') || 'Apply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestSearch;
