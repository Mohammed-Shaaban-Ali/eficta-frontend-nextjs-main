interface Description {
  title: string;
  description: string;
  language: string;
  line: number;
}

interface Facility {
  facility: string;
  facilityType: 'HotelFacility' | 'RoomFacility';
}

interface Name {
  GivenName: string;
  Surname: string;
  NamePrefix: string;
}

interface PersonDetails {
  Name: Name;
  Type: number;
  Age?: number;
}

interface Email {
  Value: string;
}

interface Telephone {
  PhoneNumber: string;
}

interface Passenger {
  PersonDetails: PersonDetails;
  Allocation: string;
  Email: Email;
  Telephone: Telephone;
  Id: string;
}

interface Price {
  currency: string;
  finalPrice: number;
  finalPriceInSupplierCurrency: number;
  originalPrice: number;
  originalPriceInSupplierCurrency: number;
  supplierCurrency: string;
}

interface Room {
  adultsCount: number;
  availability: string;
  id: string;
  kidsAges: number[];
  price: Price;
  roomBasis: string;
  roomClass: string;
  roomName: string;
  roomType: string;
  specialDeals: any[];
  targetRoomKey: string;
  images: string[];
  descriptions: string[];
}

interface Supplier {
  id: number;
  name: string;
}

interface Package {
  contractId: number;
  hotelId: number;
  packageId: string;
  price: Price;
  refundability: number;
  refundableUntil: string;
  remarks: any[];
  rooms: Room[];
  simplePrice: number;
  supplier: Supplier;
  images: string[];
  description: string;
}

interface BookingDetail {
  bookingID: string;
  bookingReference: string;
  bookingRemarks: string[];
  segmentId: number;
  orderId: number;
  status: string;
  totalPrice: Price;
}

interface HotelContent {
  descriptions: Description[];
  facilities: Facility[];
  images: string[];
}

export interface bookingTypes {
  id: number;
  hotel_id: string;
  hotel_content: HotelContent;
  amount: string;
  status: string;
  payment_id: string;
  payment_status: string;
  adults: number;
  children: number;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  passengers: Passenger[];
  failure_reason: string | null;
  provider_reference: string | null;
  package: Package;
  booking: BookingDetail[];
}
