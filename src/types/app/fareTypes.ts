interface PriceInfo {
  total_fare: number;
  base_fare: number;
  service_fee: number;
  agency_commission: number;
  tax: number;
  supplement: number;
}

interface BaggageAllowance {
  amount: number;
  type: string;
  alternative_type: string;
  class_code: string;
  departure_airport: string;
  arrival_airport: string;
  carrier: string;
  flight_number: string;
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

interface OfferDetail {
  name: string;
  descriptions: string[];
}

interface OfferLeg {
  from: string;
  to: string;
  departure_time: string;
  arrival_time: string;
  flight_number: string;
  flight_class: string;
  operator_airline_code: string;
  marketing_airline_code: string;
}

export interface Service {
  service_id: string;
  service_type: string;
  description: string;
  chargeable_type: string;
  offer_legs: OfferLeg[];
  supplier_code: string;
}

interface ChangeRule {
  type: string;
  before_departure_status: string;
  after_departure_status: string;
}

interface BookingClass {
  departure_airport: string;
  arrival_airport: string;
  carrier: string;
  flight_number: string;
  class_code: string;
}

export interface FlightOffer {
  offer_key: string;
  offer_details: OfferDetail[];
  fares: PaxFare[];
  services: Service[];
  total_price: number;
  currency_code: string;
  fare_type: string;
  non_refundable: boolean;
  can_book: boolean;
  can_rezerve: boolean;
  last_ticket_date: string;
  change_rules: ChangeRule[];
  offer_type: string;
  default_offer: boolean;
  booking_classes: BookingClass[];
  baggages_text: string[];
  cabin_baggages_text: string[];
  minimum_offer_price: number;
}

interface FlightInfo {
  from: string;
  to: string;
  departure_time: string;
  arrival_time: string;
  flight_number: string;
  operator_airline_code: string;
  marketing_airline_code: string;
  class_code: string;
  cabin_type: string;
}

interface SelectedFlight {
  flight: FlightInfo;
  change_rules: ChangeRule[];
}

interface ProviderWarning {
  description: string;
}

interface FlightInformation {
  provider_key: string;
  provider_warnings: ProviderWarning[];
  permitted_actions: string[];
  pnr_requirements: string[];
}

interface Office {
  office_id: number;
  office_name: string;
}

export interface FlightFareResponse {
  success: boolean;
  message: string;
  data: {
    fare_detail_key: string;
    fare_detail: FareDetail;
    offers: FlightOffer[];
    departure_selected_flights: SelectedFlight[];
    return_selected_flight: SelectedFlight[];
    flight_informations: FlightInformation[];
    office: Office;
    multiprovider: boolean;
  };
}
