'use client';

import { useForm } from 'react-hook-form';
import CustomerInfo from './CustomerInfo';
import React, { useState } from 'react';
import { FlightBookingRequest } from '@/types/requests/flightBookingRequest';
import { toast } from 'react-hot-toast';
import { getError } from '@/utils/getError';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'use-intl';
import {
  useFlightBookMutation,
  useFlightFareQuery,
} from '@/reactQuery/flight.api';
import FareDetails from './fare-details-sidebar';
import LoadingScreen from '@/components/parts/LoadingScreen';
import NotFoundFlight from './NotFoundFlight';
import { FlightFareResponse } from '@/types/app/fareTypes';

const FlightBooking: React.FC = () => {
  const t = useTranslations('FlightBooking');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();
  const form = useForm<FlightBookingRequest>();
  const searchqueries = useSearchParams();

  // Get search parameters from URL
  const departureFareKey = searchqueries.get('departureFareKey') || '';
  const returnFareKey = searchqueries.get('returnFareKey');
  const adults = parseInt(searchqueries.get('adults') || '1', 10);
  const children = parseInt(searchqueries.get('children') || '0', 10);
  const infants = parseInt(searchqueries.get('infants') || '0', 10);
  const cabinClass = searchqueries.get('cabinClass') || 'ECONOMY';
  const returnDate = searchqueries.get('returnDate') || '';
  const offerKey = searchqueries.get('offerKey') || null;
  const provider = searchqueries.get('provider') || 'iati';

  // State for selected offer
  const [selectedOfferName, setSelectedOfferName] = useState<string | null>(
    null,
  );

  // Create passenger array based on search parameters
  const members = [
    ...Array(adults).fill({ type: 'ADULT' }),
    ...Array(children).fill({ type: 'CHILD' }),
    ...Array(infants).fill({ type: 'INFANT' }),
  ];

  // Get flight data with fare information
  const {
    data: flightFareData,
    isError,
    isFetching,
  } = useFlightFareQuery({
    adults,
    children,
    departureFareKey,
    infants,
    provider: provider as 'iati' | 'sabre',
    ...(returnFareKey && { returnFareKey }),
  });

  // Book flight mutation
  const { mutateAsync: Book, isPending } = useFlightBookMutation();

  // Handle offer selection
  const handleOfferSelect = (offerName: string) => {
    setSelectedOfferName(offerName);
  };

  const onSubmit = async (data: FlightBookingRequest) => {
    try {
      // Prepare booking data with required parameters
      const bookingData: FlightBookingRequest = {
        departureFareKey,
        ...(returnFareKey && { returnFareKey }),
        paymentGateway: 'balance',
        contact_info: {
          phone: data.contact_info.phone,
          email: data.contact_info.email,
          name: `${data.contact_info.firstname?.trim()} ${data.contact_info.lastname?.trim()}`,
          country_code: data.contact_info.country_code.replace('+', ''),
        },
        offer: offerKey || null,
        paxList: data.paxList.map((passenger) => ({
          ...passenger,
          // Ensure all fields match API expectations
          gender: passenger.gender.toUpperCase() as 'MALE' | 'FEMALE',
          type: passenger.type.toUpperCase() as 'ADULT' | 'CHILD' | 'INFANT',
          identityInfo: {
            passport: {
              citizenshipCountry:
                passenger.identityInfo.passport.citizenshipCountry,
              endDate: passenger.identityInfo.passport.endDate,
              no: passenger.identityInfo.passport.no,
            },
            notTurkishCitizen:
              passenger.identityInfo.notTurkishCitizen || false,
            notPakistanCitizen:
              passenger.identityInfo.notPakistanCitizen || false,
          },
        })),
      };

      // Add offers if present
      if (data.offers && data.offers.length > 0) {
        bookingData.offers = data.offers;
      }

      // Make booking API call
      const bookData = await Book(bookingData);

      // Reset form after successful booking
      form.reset();

      // Navigate to success page
      if (bookData) {
        toast.success('Booking completed successfully!');
        // window.location.href = bookData.redirectUrl;
        router.push(`/success/flight/${bookData.bookingId}`);
      }
    } catch (error) {
      toast.error(getError(error));
    }
  };
  if (isFetching) return <LoadingScreen />;
  if (isError || !flightFareData) return <NotFoundFlight />;
  return (
    <section className="pt-40 layout-pb-md">
      <div className="container max-w-[1000px]! mx-auto">
        {/* <div className="row">
          <div className="col-xl-7 col-lg-8 mt-30 select-none ">
            <CustomerInfo
              form={form}
              onSubmit={onSubmit}
              members={members}
              isPending={isPending}
            />
          </div> */}
        {/* <div className="col-xl-5 col-lg-4 mt-30 "> */}
        <div className="booking-sidebar">
          <FareDetails
            flightData={flightFareData as FlightFareResponse}
            members={members}
            cabinClass={cabinClass}
            returnDate={returnDate}
            onOfferSelect={handleOfferSelect}
            defaultOfferKey={offerKey}
          />
        </div>
      </div>
      {/* </div> */}
      {/*  </div> */}
    </section>
  );
};

export default FlightBooking;
