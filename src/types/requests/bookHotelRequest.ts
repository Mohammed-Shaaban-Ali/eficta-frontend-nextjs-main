export interface bookHotelRequest {
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
