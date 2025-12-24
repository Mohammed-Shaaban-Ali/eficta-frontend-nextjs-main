// New booking request structure
export interface bookHotelRequest {
  title: string;
  client_type: string; // default: 'client'
  client: number; // integer from select2
  email: string;
  phone: string;
  adults: number;
  children: number;
  infants: number; // default: 0, hidden
  terms: string;
  notes?: string;
  guests?: GuestType[];
  hotels: HotelBookingType[];
}

export interface GuestType {
  name?: string;
  type?: 'adult' | 'child' | 'infant';
  passport_number?: string;
  passport_country?: string;
  nationality?: string;
  issue_date?: string; // date
  expiry_date?: string; // date
  birth_date?: string; // date
}

export interface HotelBookingType {
  checkIn: string; // date, required
  checkOut: string; // date, required
  hotel_id?: number; // nullable numeric
  buy_currency_id: number; // required, from hotel
  buy_price: number; // required, from hotel
  sell_currency_id: number; // required, from select2
  sell_price: number; // required, float
  supplier_id?: number; // optional, removed from form
  rooms: RoomBookingType[];
}

export interface RoomBookingType {
  room_pax: string; // required, roomClass
  room_board?: string; // optional, roomBasisCode
  adult: number; // required, integer, min:1
  child?: number; // nullable, integer, min:0
}

// Old structure (kept for backward compatibility if needed)
export interface bookHotelRequestOld {
  uuid: string;
  hotelID: string;
  packageID: string;
  bookingPrice: number;
  leadPaxID: string;
  leadPaxAllocation: string;
  passengers: passengerTypes[];
}

export interface passengerTypes {
  Allocation: string;
  id: string;
  Email: {
    Value: string;
  };
  Telephone: {
    PhoneNumber: string;
  };
  PersonDetails: {
    Name: {
      GivenName: string;
      Surname: string;
      NamePrefix: string;
    };
    Type: number;
    Age: number;
  };
}
