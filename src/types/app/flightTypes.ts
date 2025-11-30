interface AirportInfo {
  airport_code: string;
  date: string;
  airport_name: string;
  city_name: string;
  terminal_no: string;
}

interface TimeInfo {
  number_of_stops: string;
  leg_duration_time_minute: number;
  wait_time_in_minute_before_next_leg: number;
  flight_time_hour: number;
  flight_time_minute: number;
  layover_time_in_minutes: number;
  day_cross: boolean;
}

interface AirlineInfo {
  carrier_code: string;
  carrier_name: string;
  operator_code: string;
  operator_name: string;
  validating_carrier_code: string;
  operating_airline_code: string;
}

interface BaggageInfo {
  amount: number;
  type: string;
  alternative_type: string;
  class_code: string;
  passenger_type: string;
}

interface BaggageAllowance extends BaggageInfo {
  departure_airport: string;
  arrival_airport: string;
  carrier: string;
  flight_number: string;
}

interface Leg {
  flight_number: string;
  aircraft: string;
  departure_info: AirportInfo;
  arrival_info: AirportInfo;
  time_info: TimeInfo;
  airline_info: AirlineInfo;
  baggages: BaggageInfo[];
  cabin_baggages: BaggageInfo[];
}

interface PriceInfo {
  total_fare: number;
  base_fare: number;
  service_fee: number;
  agency_commission: number;
  tax: number;
  supplement: number;
}

interface PaxFare {
  currency_code: string;
  price_info: PriceInfo;
  pax_type: string;
  number_of_pax: number;
  baggage_allowances: BaggageAllowance[];
  cabin_baggage_allowances: BaggageAllowance[];
}

interface FareDetail {
  currency_code: string;
  price_info: PriceInfo;
  pax_fares: PaxFare[];
}

interface FareInfo {
  class_codes: string[];
  cabin_types: string[];
  fare_detail: FareDetail;
  free_seats: number;
}

interface DefaultOffer {
  name: string;
  descriptions: string[];
}

interface Fare {
  fare_key: string;
  fare_info: FareInfo;
  default_offer: DefaultOffer;
}

interface PackageInfo {
  packaged: boolean;
  package_key: string;
}

interface Office {
  office_id: number;
  office_name: string;
}

interface FlightDirection {
  provider_key: string;
  package_info: PackageInfo;
  legs: Leg[];
  fares: Fare[];
  office: Office;
  book_type: string;
  charter: boolean;
}

export interface FlightFilteringOptions {
  minPrice: number;
  maxPrice: number;
  airline: {
    id?: string;
    count?: string;
    text?: string;
  }[];
  stops: {
    id: number;
    text: string;
    count: number;
  }[];
}

export interface flightTypes {
  departure_flights: FlightDirection[];
  return_flights: FlightDirection[];
}
