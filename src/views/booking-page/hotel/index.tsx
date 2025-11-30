'use client';

import { useForm } from 'react-hook-form';
import CustomerInfo from './CustomerInfo';
import React, { useEffect, useState } from 'react';
import {
  useHotelBookMutation,
  useHotelConfirmBookMutation,
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
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [membersCount, setMembersCount] = useState<number>(0);
  const router = useRouter();
  const form = useForm<bookHotelRequest>({
    defaultValues: {
      passengers: [
        {
          PersonDetails: {
            Name: { NamePrefix: 'Mr' },
          },
        },
      ],
    },
  });
  const { mutateAsync: Book, isPending: pendingBook } = useHotelBookMutation();
  const { mutateAsync: ConfirmBook, isPending: pendingConfirm } =
    useHotelConfirmBookMutation();

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
    }
  }, []);
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

  const onSubmit = async (data: bookHotelRequest) => {
    try {
      // Check if all members data is filled
      const isAllMembersFilled = data.passengers.length === membersCount;
      if (!isAllMembersFilled) {
        toast.error('Please fill all members information');
        return;
      }

      const leadPaxId = generateRandomUUID();
      console.log(data.passengers);
      // Map passengers and ensure Type is properly converted to number
      const passengers = data.passengers.map((item, index) => {
        const personDetails: any = {
          Name: {
            GivenName: item.PersonDetails.Name.GivenName,
            Surname: item.PersonDetails.Name.Surname,
            NamePrefix: item.PersonDetails.Name.NamePrefix,
          },
          Type: Number(item.PersonDetails.Type),
        };

        // Only add Age if it's a valid number
        const age = Number(item.PersonDetails.Age);
        if (!isNaN(age) && age !== null && age !== undefined) {
          personDetails.Age = age;
        }

        return {
          ...item,
          Id: index === 0 ? leadPaxId : generateRandomUUID(),
          PersonDetails: personDetails,
        };
      });

      const bookData = await Book({
        uuid,
        hotelID,
        packageID,
        leadPaxID: leadPaxId, // Use the same ID for leadPaxID
        leadPaxAllocation: data.passengers[0].Allocation,
        bookingPrice: selectedPackage.price.finalPrice,
        passengers: passengers,
      });

      const dataBook = (await ConfirmBook({
        bookingId: bookData?.bookingId.toString(),
        paymentId: bookData?.paymentId.toString(),
      })) as any;

      localStorage.setItem('success-book', JSON.stringify(dataBook.data));
      localStorage.setItem(
        'success-book-user',
        JSON.stringify(data.passengers[0]),
      );

      form.reset();
      router.push(`/success/hotel/${dataBook?.provider_reference}`);
    } catch (error) {
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
          isPending={pendingBook || pendingConfirm}
        />
      </div>
    </>
  );
};

export default BookingPage;
