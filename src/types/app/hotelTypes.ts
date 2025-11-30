export enum Currency_ENUM {
  usd = 'USD',
}
export interface hotelSeachTypes {
  id?: number;
  address?: string;
  propertyType?: string;
  displayName?: string;
  defaultImage?: {
    FullSize?: string;
  };
  tripAdvisor?: {
    rating?: number;
    ratingImageUrl?: string;
    reviewsCount?: number;
  };
  location?: {
    latitude?: number;
    longitude?: number;
  };
  reviews?: {
    score?: number;
    scoreDescription?: string;
    scoreScale?: number;
    reviewSource?: string;
    reviewsCount?: number;
    reviewsDistribution?: null;
  };
  starRating?: string;
  price?: number;
  currency?: Currency_ENUM;
  chain?: {
    id?: string;
    text?: string;
    count?: string;
  };
  facilities?: {
    id?: string;
    text?: string;
    count?: string;
  }[];
}
export interface hotelDetailsTypes {
  contractId?: number;
  hotelId?: number;
  packageId?: string;
  price?: {
    currency?: Currency_ENUM;
    finalPrice?: number;
    finalPriceInSupplierCurrency?: number;
    originalPrice?: number;
    originalPriceInSupplierCurrency?: number;
    supplierCurrency?: Currency_ENUM;
  };
  refundability?: number;
  refundableUntil?: Date;
  remarks?: [];
  rooms?: [
    {
      adultsCount?: number;
      availability?: 'Available' | 'UnAvailable';
      id?: string;
      kidsAges?: number[];
      price?: {
        currency?: Currency_ENUM;
        finalPrice?: number;
        finalPriceInSupplierCurrency?: number;
        originalPrice?: number;
        originalPriceInSupplierCurrency?: number;
        supplierCurrency?: Currency_ENUM;
      };
      roomBasis?: string;
      roomClass?: string;
      roomName?: string;
      roomType?: string;
      specialDeals?: [];
      targetRoomKey?: string;
      images?: string[];
      descriptions: string[];
    },
  ];
  simplePrice?: number;
  supplier?: {
    id?: number;
    name?: string;
  };
  images?: string[];
  description?: string;
}
export interface roomTypes {
  Amenities?: string[];
  Descriptions?: string;
  Images?: string[];
  RoomKey?: string;
  RoomName?: string;
  RoomDescription?: string;
}
