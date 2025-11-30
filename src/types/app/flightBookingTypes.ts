export interface FlightBookingTypes {
  id: number;
  traceUuid: string | null;
  auth_user_id: number;
  airline_booking_reference: string | null;
  book_id: string | null;
  booking_number: string;
  booking_reference: string | null;
  flight_mapping: string;
  search: any;
  offer_details: {
    office: {
      office_id: number;
      office_name: string;
    };
    fare_detail: {
      pax_fares: Array<{
        pax_type: string;
        price_info: {
          tax: number;
          base_fare: number;
          supplement: number;
          total_fare: number;
          service_fee: number;
          agency_commission: number;
        };
        currency_code: string;
        number_of_pax: number;
        baggage_allowances: Array<{
          type: string;
          amount: number;
          carrier: string;
          class_code: string;
          flight_number: string;
          arrival_airport: string;
          alternative_type: string;
          departure_airport: string;
        }>;
        cabin_baggage_allowances: Array<{
          type: string;
          amount: number;
          carrier: string;
          class_code: string;
          flight_number: string;
          arrival_airport: string;
          alternative_type: string;
          departure_airport: string;
        }>;
      }>;
      price_info: {
        tax: number;
        base_fare: number;
        supplement: number;
        total_fare: number;
        service_fee: number;
        agency_commission: number;
      };
      currency_code: string;
    };
    multiprovider: boolean;
    fare_detail_key: string;
    flight_informations: Array<{
      provider_key: string;
      pnr_requirements: string[];
      permitted_actions: string[];
    }>;
    return_selected_flight: Array<{
      flight: {
        to: string;
        from: string;
        cabin_type: string;
        class_code: string;
        arrival_time: string;
        flight_number: string;
        departure_time: string;
        operator_airline_code: string;
        marketing_airline_code: string;
      };
    }>;
    departure_selected_flights: Array<{
      flight: {
        to: string;
        from: string;
        cabin_type: string;
        class_code: string;
        arrival_time: string;
        flight_number: string;
        departure_time: string;
        operator_airline_code: string;
        marketing_airline_code: string;
      };
    }>;
  };
  fromLocation: string;
  toLocation: string;
  departureSegments: any;
  returnSegment: any;
  multiSegments: any;
  travellers: any;
  passengers: Array<{
    name: string;
    type: string;
    gender: string;
    lastName: string;
    birthDate: string;
    identityInfo: {
      passport: {
        no: string;
        endDate: string;
        citizenshipCountry: string;
      };
      notTurkishCitizen: boolean;
      notPakistanCitizen: boolean;
    };
  }>;
  api: any;
  adult: number;
  child: number;
  infant: number;
  departure: string;
  return_date: string;
  type: string;
  markup: any;
  stops: any;
  airline: any;
  currency: string;
  original_price: string;
  price: string;
  coupon_code: string | null;
  payment_id: number;
  discount: any;
  cabin_class: string;
  pricing: any;
  contact_info: {
    name: string;
    email: string;
    phone: string;
    country_code: string;
  };
  booking_data: any;
  extra: any;
  tickets: any;
  refund: any;
  status: string;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  company_id: number | null;
}
