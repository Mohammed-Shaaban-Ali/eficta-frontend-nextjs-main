import Image from 'next/image';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import ViewPrice from '@/components/parts/ViewPrice';
import { FaStar } from 'react-icons/fa';
import ViewRating from '@/components/parts/ViewRating';

const BookingDetails = () => {
  const t = useTranslations('BookingPage.booking_sidebar');
  const [selectRoom, setSelectRoom] = useState<any>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [searchValues, setSearchValues] = useState<any>(null);

  useEffect(() => {
    const room = localStorage.getItem('package');
    const searchLocalStorage = localStorage.getItem('search') as string;
    const hotelLocalStorage = localStorage.getItem('hotel') as string;
    if (room) {
      const roomData = JSON.parse(room);
      setSelectRoom(roomData);
    }
    if (searchLocalStorage) {
      const search = JSON.parse(searchLocalStorage);
      setSearchValues(search);
    }
    if (hotelLocalStorage) {
      const search = JSON.parse(hotelLocalStorage);
      setSelectedHotel(search);
    }
  }, []);

  const getTotalGuests = () => {
    return searchValues?.rooms?.reduce(
      (total: any, room: any) =>
        total + room.AdultsCount + room.KidsAges.length,
      0,
    );
  };
  const checkIn = moment(searchValues?.checkIn);
  const checkOut = moment(searchValues?.checkOut);
  const nights = checkOut.diff(checkIn, 'days');

  return (
    <div className="px-30 py-30 border-light rounded-4">
      <div className="text-20 fw-500 mb-30">{t('your_booking_details')}</div>
      <div className="row x-gap-15 y-gap-20">
        <div className="w-full">
          {selectRoom?.images[0] && (
            <Image
              width={300}
              height={300}
              src={selectRoom?.images[0]}
              alt="image"
              className="w-full rounded-4 object-cover"
            />
          )}
        </div>
        {/* End .col */}
        <div className="col">
          <ViewRating selectedHotel={selectedHotel} />
          <div className="lh-17 fw-500">{selectedHotel?.displayName}</div>
          <div className="text-14 lh-15 mt-5">{selectedHotel?.address}</div>
          <ViewPrice finalPrice={Number(selectRoom?.price?.finalPrice)} />

          <div className="mb-3">
            {selectRoom?.refundability === 1 && (
              <div className="d-flex align-items-center text-success">
                <div>
                  {selectRoom?.refundableText && (
                    <p className="small text-danger mb-0">
                      {selectRoom?.refundableText}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          {/*
          <div className="row x-gap-10 y-gap-10 items-center pt-10">
            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="size-30 flex-center bg-blue-1 rounded-4">
                  <div className="text-12 fw-600 text-white">
                    {selectedHotel?.reviews?.score}
                  </div>
                </div>
                <div className="text-14 fw-500 ml-10">
                  {' '}
                  {selectedHotel?.reviews?.reviewSource}
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="text-14">
                {' '}
                {selectedHotel?.reviews?.reviewsCount} reviews
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div className="border-top-light mt-30 mb-20" />

      <div className="text-18 fw-500 mb-15">{t('room_details')}</div>
      {selectRoom?.rooms?.map((room: any) => (
        <div key={room.id} className="px-20 py-15 bg-blue-1-05 rounded-4 mt-15">
          <div className="d-flex items-center">
            <i className="icon-bed text-22 text-blue-1 mr-15"></i>
            <div>
              <div className="text-16 fw-500">{room.roomName}</div>
              <div className="text-14 text-light-1 mt-5 capitalize">
                {room.roomType?.toLowerCase()}
              </div>
            </div>
          </div>

          <div className="row x-gap-10 y-gap-10 items-center pt-15">
            {room.boardType && (
              <div className="col-auto">
                <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
                  {room.boardType}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="border-top-light mt-30 mb-20" />

      <div className="row y-gap-20 justify-between">
        <div className="col-auto">
          <div className="text-15">Check-in</div>
          <div className="fw-500">{checkIn.format('LL')}</div>
          {/* <div className="text-15 text-light-1">15:00 – 23:00</div> */}
        </div>
        <div className="col-auto md:d-none">
          <div className="h-full w-1 bg-border" />
        </div>
        <div className="col-auto text-right md:text-left">
          <div className="text-15">Check-out</div>
          <div className="fw-500"> {checkOut.format('LL')}</div>
          {/* <div className="text-15 text-light-1">01:00 – 11:00</div> */}
        </div>
      </div>

      <div className="border-top-light mt-30 mb-20" />
      <div>
        <div className="text-15">{t('total_length_stay')}:</div>
        <div className="fw-500">
          {nights} {nights !== 1 ? t('nights') : t('night')}
        </div>
        <a href="#" className="text-15 text-blue-1 underline">
          {t('traveling_different_dates')}
        </a>
      </div>

      <div className="border-top-light mt-30 mb-20" />
      <div className="row y-gap-20 justify-between items-center">
        <div className="col-auto">
          {/* <div className="text-15">{t('you_selected')}:</div>
          <div className="fw-500">Superior Double Studio</div> */}
          <a href="#" className="text-15 text-blue-1 underline">
            {t('change_selection')}
          </a>
        </div>
        <div className="col-auto">
          <div className="text-15">
            {getTotalGuests()} {t('guests')} - {searchValues?.rooms.length}{' '}
            {t('rooms')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
