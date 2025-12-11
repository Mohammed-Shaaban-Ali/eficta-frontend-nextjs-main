'use client';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { FlightFareResponse } from '@/types/app/fareTypes';

// Components
import FlightRoute from './FlightRoute';
import PassengerDetails from './PassengerDetails';
import FlightInfo from './FlightInfo';
import OfferSelection from './OfferSelection';
import TotalPrice from './TotalPrice';

interface FareDetailsProps {
  flightData: FlightFareResponse;
  members: any[];
  cabinClass?: string;
  returnDate?: string;
  onOfferSelect?: (offerName: string) => void;
  defaultOfferKey?: string | null;
}

const FareDetails: React.FC<FareDetailsProps> = ({
  flightData,
  members,
  cabinClass = 'ECONOMY',
  returnDate,
  onOfferSelect,
  defaultOfferKey,
}) => {
  const t = useTranslations('BookingPage.booking_sidebar');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // State for offer selection
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const initialOfferSet = useRef(false);

  const formatPrice = (amount: number, currency: string = 'SAR') => {
    if (isRTL) {
      return `${amount.toLocaleString()} ${currency}`;
    }
    return `${currency} ${amount?.toLocaleString() || 0}`;
  };

  // Extract flight data from the response structure
  const departureFlights = flightData?.data?.departure_selected_flights || [];
  const returnFlights = flightData?.data?.return_selected_flight || [];
  const fareDetail = flightData?.data?.fare_detail;
  const offers = useMemo(
    () => flightData?.data?.offers || [],
    [flightData?.data?.offers],
  );
  const hasReturnFlight = returnFlights.length > 0;

  // Set default selected offer when component mounts (only once)
  useEffect(() => {
    if (offers.length > 0 && !initialOfferSet.current) {
      let targetOffer;

      if (defaultOfferKey) {
        // Find offer by name (defaultOfferKey is actually the offer name)
        targetOffer = offers.find(
          (offer) => offer.offer_details?.[0]?.name === defaultOfferKey,
        );
      }

      // If not found or no defaultOfferKey, use first offer
      const offerToSelect = targetOffer || offers[0];
      setSelectedOffer(offerToSelect);
      initialOfferSet.current = true;

      // Call onOfferSelect with the offer name
      if (onOfferSelect) {
        const offerName = offerToSelect.offer_details?.[0]?.name;
        onOfferSelect(offerName);
      }
    }
  }, [offers, defaultOfferKey, onOfferSelect]);

  // Get the selected offer or default price
  const getDisplayPrice = () => {
    if (selectedOffer) {
      return {
        amount: selectedOffer.total_price,
        currency: selectedOffer.currency_code,
      };
    }
    return {
      amount: fareDetail?.price_info?.total_fare || 0,
      currency: fareDetail?.currency_code || 'SAR',
    };
  };

  // Get the selected offer's fare breakdown or default fare detail
  const getPriceBreakdown = () => {
    if (selectedOffer && selectedOffer.fares) {
      return {
        pax_fares: selectedOffer.fares,
        currency_code: selectedOffer.currency_code,
        total_fare: selectedOffer.total_price,
      };
    }
    // Fall back to base fare detail
    if (fareDetail?.pax_fares) {
      return {
        pax_fares: fareDetail.pax_fares,
        currency_code: fareDetail.currency_code || 'SAR',
        total_fare: fareDetail.price_info?.total_fare || 0,
      };
    }
    return null;
  };

  // Handle offer selection
  const handleOfferSelect = (offer: any) => {
    setSelectedOffer(offer);
    if (onOfferSelect) {
      const offerName = offer.offer_details?.[0]?.name;
      onOfferSelect(offerName);
    }
  };

  return (
    <div
      className="w-full p-3  border-light rounded-lg"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* <div className="text-20 fw-500 mb-30">{t('flight_booking_details')}</div> */}

      {/* Flight Route */}
      {flightData?.data && (
        <FlightRoute
          departureFlights={departureFlights}
          returnFlights={returnFlights}
          hasReturnFlight={hasReturnFlight}
        />
      )}

      {/* <div className="border-top-light mt-30 mb-20" /> */}

      {/* Passenger Details */}
      {/* <PassengerDetails members={members} /> */}

      {/* <div className="border-top-light mt-30 mb-20" /> */}

      {/* Flight Info */}
      {/* <FlightInfo cabinClass={cabinClass} hasReturnFlight={hasReturnFlight} /> */}

      {/* Offer Selection */}
      {/* <OfferSelection
        offers={offers}
        selectedOffer={selectedOffer}
        onOfferSelect={handleOfferSelect}
        formatPrice={formatPrice} 
      />*/}

      {/* Total Price */}
      {/* {(fareDetail?.price_info || offers.length > 0) && (
        <TotalPrice
          displayPrice={getDisplayPrice()}
          formatPrice={formatPrice}
          priceBreakdown={getPriceBreakdown() || undefined}
        />
      )} */}
    </div>
  );
};

export default FareDetails;
