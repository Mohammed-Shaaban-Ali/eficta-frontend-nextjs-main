export interface packageTypes {
  contractId?: number;
  hotelId?: number;
  packageId?: string;
  price?: {
    currency?: string;
    finalPrice?: number;
    finalPriceInSupplierCurrency?: number;
    originalPrice?: number;
    originalPriceInSupplierCurrency?: number;
    supplierCurrency?: string;
  };
  refundability?: 0 | 1;
  refundableUntil?: string;
  refundableText?: string;
  remarks?: any[];
  rooms?: roomTypes[];
  simplePrice?: number;
  supplier?: {
    id?: number;
    name?: string;
  };
  images?: string[];
  description?: string;
}

export interface roomTypes {
  id?: string;
  roomName?: string;
  roomType?: string;
  roomClass?: string;
  roomBasis?: string;
  images?: string[];
  descriptions?: string;
  adultsCount?: number;
  kidsAges?: number[];
  availability?: string;
  targetRoomKey?: string;
  specialDeals?: any[];
  price?: {
    currency?: string;
    finalPrice?: number;
    finalPriceInSupplierCurrency?: number;
    originalPrice?: number;
    originalPriceInSupplierCurrency?: number;
    supplierCurrency?: string;
  };
}
