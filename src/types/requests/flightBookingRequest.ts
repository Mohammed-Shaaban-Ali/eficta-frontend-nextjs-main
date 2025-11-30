export interface FlightBookingRequest {
  departureFareKey: string;
  returnFareKey?: string;
  paymentGateway: 'myfatoorah' | 'paytabs' | 'payfort' | 'balance';
  offer?: string | null;
  contact_info: {
    email: string;
    phone: string;
    name: string;
    firstname?: string;
    lastname?: string;
    country_code: string;
  };
  paxList: {
    name: string;
    lastName: string;
    birthDate: string;
    type: 'ADULT' | 'CHILD' | 'INFANT';
    gender: 'MALE' | 'FEMALE';
    identityInfo: {
      passport: {
        citizenshipCountry: string;
        endDate: string;
        no: string;
      };
      notTurkishCitizen: boolean;
      notPakistanCitizen: boolean;
    };
  }[];
  offers?: string[];
}
