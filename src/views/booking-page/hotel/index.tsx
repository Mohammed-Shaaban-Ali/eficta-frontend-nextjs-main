'use client';

import { useForm } from 'react-hook-form';
import CustomerInfo from './CustomerInfo';
import React, { useEffect, useState } from 'react';
import {
  useHotelBookMutation,
  useHotelConfirmBookMutation,
  useHotelQuotationMutation,
} from '@/reactQuery/hotels.api';
import { bookHotelRequest } from '@/types/requests/bookHotelRequest';
import { toast } from 'react-hot-toast';
import { getError } from '@/utils/getError';
import { generateRandomUUID } from '@/utils/generateRandomUUID';
import { getSearchParamsData } from '@/utils/getSearchParams';
import { useRouter } from '@/i18n/navigation';

interface Props {
  hotelID: string;
  uuid: string;
  packageID: string;
  roomId: string;
}
const BookingPage = ({ hotelID, uuid, packageID, roomId }: Props) => {
  console.log('hotelID', hotelID);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [membersCount, setMembersCount] = useState<number>(0);
  const router = useRouter();
  const form = useForm<bookHotelRequest>({
    defaultValues: {
      title: '',
      client_type: 'client',
      client: 0,
      email: '',
      phone: '',
      adults: 0,
      children: 0,
      infants: 0,
      terms: '',
      notes: '',
      guests: [],
      hotels: [
        {
          checkIn: '',
          checkOut: '',
          hotel_id: 0,
          buy_currency_id: 1,
          buy_price: 0,
          sell_currency_id: 0,
          sell_price: 0,
          rooms: [],
        },
      ],
    },
  });
  const { mutateAsync: Book, isPending: pendingBook } = useHotelBookMutation();
  const { mutateAsync: ConfirmBook, isPending: pendingConfirm } =
    useHotelConfirmBookMutation();
  const { mutateAsync: submitQuotation, isPending: pendingQuotation } =
    useHotelQuotationMutation();

  useEffect(() => {
    const pcakageLocalStorage = localStorage.getItem('package');
    const searchParams = getSearchParamsData();
    if (pcakageLocalStorage) {
      const packageData = JSON.parse(pcakageLocalStorage);
      setSelectedPackage(packageData);
    }
    if (searchParams) {
      // Ensure searchData is an array before using reduce
      if (Array.isArray(searchParams.rooms)) {
        const totalMembers = searchParams.rooms?.reduce(
          (acc: number, room: any) => {
            return acc + room.AdultsCount + room.KidsAges.length;
          },
          0,
        );
        setMembersCount(totalMembers);
      } else {
        setMembersCount(0);
      }

      // Set default values for checkIn and checkOut
      if (searchParams.checkIn) {
        form.setValue('hotels.0.checkIn', searchParams.checkIn);
      }
      if (searchParams.checkOut) {
        form.setValue('hotels.0.checkOut', searchParams.checkOut);
      }
    }
  }, [form]);
  // Calculate total members from rooms data
  const members = selectedPackage?.rooms?.reduce(
    (acc: any, room: any, roomIndex: number) => {
      const adults = Array(room.adultsCount).fill({
        type: 0,
        roomNumber: roomIndex + 1,
        roomId: room.id, // Store room ID with member info
      });
      const children = room.kidsAges.map(() => ({
        type: 1,
        age: 17,
        roomNumber: roomIndex + 1,
        roomId: room.id, // Store room ID with member info
      }));
      return [...acc, ...adults, ...children];
    },
    [] as { type: number; roomNumber: number; roomId: string }[],
  );

  // Calculate total adults and children
  const totalAdults = members?.filter((m: any) => m.type === 0).length || 0;
  const totalChildren = members?.filter((m: any) => m.type === 1).length || 0;

  // Update form values when members or selectedPackage changes
  useEffect(() => {
    if (totalAdults > 0) {
      form.setValue('adults', totalAdults);
    }
    if (totalChildren > 0) {
      form.setValue('children', totalChildren);
    }
  }, [totalAdults, totalChildren, form]);

  // Update hotel data when selectedPackage is loaded
  useEffect(() => {
    if (selectedPackage) {
      // Set hotel_id
      if (hotelID) {
        form.setValue('hotels.0.hotel_id', parseInt(hotelID));
      } else if (selectedPackage.hotelId) {
        form.setValue('hotels.0.hotel_id', selectedPackage.hotelId);
      }

      // Set buy_currency_id to 1 (fixed value)
      form.setValue('hotels.0.buy_currency_id', 1);

      // Set buy_price
      if (selectedPackage.price?.finalPrice) {
        form.setValue('hotels.0.buy_price', selectedPackage.price.finalPrice);
      }
    }
  }, [selectedPackage, hotelID, form]);

  // Helper function to format date to YYYY-MM-DD
  const formatDateToString = (
    date: string | Date | null | undefined,
  ): string => {
    if (!date) return '';

    // If it's already a string in YYYY-MM-DD format, return it
    if (typeof date === 'string') {
      // Check if it's already in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      // If it's an ISO string, extract the date part
      if (date.includes('T')) {
        return date.split('T')[0];
      }
      return date;
    }

    // If it's a Date object, format it
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return '';
  };

  const onSubmit = async (data: bookHotelRequest) => {
    try {
      // console.log('data', data);

      // Check if any guest has been filled (excluding type as it's set by default)
      const hasAnyGuestFilled =
        data.guests?.some((guest) => {
          return (
            guest.name ||
            guest.passport_number ||
            guest.passport_country ||
            guest.nationality ||
            guest.issue_date ||
            guest.expiry_date ||
            guest.birth_date
          );
        }) || false;

      // If any guest is filled, check if all guests are completely filled
      let finalGuests: any[] = [];
      if (hasAnyGuestFilled && data.guests) {
        const allGuestsFilled = data.guests.every((guest) => {
          return (
            guest.name &&
            guest.type &&
            guest.passport_number &&
            guest.passport_country &&
            guest.nationality &&
            guest.issue_date &&
            guest.expiry_date &&
            guest.birth_date
          );
        });

        if (!allGuestsFilled) {
          toast.error(
            'Please fill all guest information or leave all guests empty',
          );
          return;
        }

        // All guests are filled, include them
        finalGuests = data.guests.map((guest) => ({
          name: guest.name,
          type: guest.type,
          passport_number: guest.passport_number,
          passport_country: guest.passport_country,
          nationality: guest.nationality,
          issue_date: guest.issue_date,
          expiry_date: guest.expiry_date,
          birth_date: guest.birth_date,
        }));
      }
      // If no guest is filled, finalGuests remains empty array

      // Prepare the booking data in the new format
      const bookingData: bookHotelRequest = {
        title: data.title,
        client_type: data.client_type || 'client',
        client: data.client,
        email: data.email,
        phone: data.phone,
        adults: data.adults || totalAdults,
        children: data.children || totalChildren,
        infants: data.infants || 0,
        terms: data.terms || '',
        notes: data.notes || '',
        ...(finalGuests.length > 0 && { guests: finalGuests }),
        hotels: data.hotels.map((hotel) => ({
          checkIn: formatDateToString(hotel.checkIn),
          checkOut: formatDateToString(hotel.checkOut),
          hotel_id: hotel.hotel_id || parseInt(hotelID) || undefined,
          buy_currency_id: 1,
          buy_price: hotel.buy_price || selectedPackage?.price?.finalPrice || 0,
          sell_currency_id: hotel.sell_currency_id,
          sell_price: hotel.sell_price,
          supplier_id: undefined,
          rooms: hotel.rooms.map((room) => ({
            room_pax: room.room_pax,
            room_board: room.room_board,
            adult: room.adult,
            child: room.child || 0,
          })),
        })),
      };

      // Submit to quotations API
      const response = await submitQuotation(bookingData);

      toast.success('Booking submitted successfully!');
      router.push(`/`);
      form.reset();
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error(getError(error));
    }
  };
  return (
    <>
      <div className="row">
        <CustomerInfo
          form={form}
          onSubmit={onSubmit}
          members={members || []}
          isPending={pendingBook || pendingConfirm || pendingQuotation}
          selectedPackage={selectedPackage}
        />
      </div>
    </>
  );
};

export default BookingPage;
