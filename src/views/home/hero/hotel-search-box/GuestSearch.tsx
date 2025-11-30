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
            className="btn btn-sm btn-outline-danger"
            onClick={() => onRemove(index)}
          >
            {t('remove_room')}
          </button>
        )}
      </div>

      <div className="row y-gap-10 justify-between items-center">
        <div className="col-auto">
          <div className="text-15 lh-12 fw-500">{t('adults')}</div>
          <div className="text-14 lh-12 text-light-1 mt-5">
            {t('adults_description')}
          </div>
        </div>
        <div className="col-auto">
          <div className="d-flex items-center js-counter">
            <button
              type="button"
              className="button -outline-blue-1 text-blue-1 size-38 rounded-4"
              onClick={() =>
                handleAdultChange(Math.max(1, room.AdultsCount - 1))
              }
            >
              <i className="icon-minus text-12" />
            </button>
            <div
              className={`flex-center size-20 ${isRTL ? 'mr-15 ml-15' : 'ml-15 mr-15'}`}
            >
              <div className="text-15">{room.AdultsCount}</div>
            </div>
            <button
              type="button"
              className="button -outline-blue-1 text-blue-1 size-38 rounded-4"
              onClick={() => handleAdultChange(room.AdultsCount + 1)}
            >
              <i className="icon-plus text-12" />
            </button>
          </div>
        </div>
      </div>

      <div className="row y-gap-10 justify-between items-center mt-3">
        <div className="col-auto">
          <div className="text-15 lh-12 fw-500">{t('children')}</div>
          <div className="text-14 lh-12 text-light-1 mt-5">
            {t('children_description')}
          </div>
        </div>
        <div className="col-auto">
          <div className="d-flex items-center js-counter">
            <button
              type="button"
              className="button -outline-blue-1 text-blue-1 size-38 rounded-4"
              onClick={() =>
                handleChildChange(Math.max(0, room.KidsAges.length - 1))
              }
            >
              <i className="icon-minus text-12" />
            </button>
            <div
              className={`flex-center size-20 ${isRTL ? 'mr-15 ml-15' : 'ml-15 mr-15'}`}
            >
              <div className="text-15">{room.KidsAges.length}</div>
            </div>
            <button
              type="button"
              className="button -outline-blue-1 text-blue-1 size-38 rounded-4"
              onClick={() => handleChildChange(room.KidsAges.length + 1)}
            >
              <i className="icon-plus text-12" />
            </button>
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

  return (
    <div className="searchMenu-guests px-30 lg:py-20 lg:px-0 js-form-dd js-form-counters position-relative">
      <div
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
        data-bs-offset="0,22"
      >
        <div className="text-15 text-light-1 ls-2 lh-16">
          {getTotalGuests()} {t('guests')} - {rooms.length} {t('rooms')}
        </div>
      </div>

      <div className="shadow-2 dropdown-menu min-width-400">
        <div
          className="bg-white px-30 py-30 rounded-4 counter-box"
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
          <button
            type="button"
            className="btn btn-primary w-100 mt-3"
            onClick={addRoom}
          >
            {t('add_room')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestSearch;
