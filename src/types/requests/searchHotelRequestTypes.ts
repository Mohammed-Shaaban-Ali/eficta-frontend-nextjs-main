export interface searchHotelsParams {
  country: string;
  checkIn: string;
  checkOut: string;
  location: {
    latitude: number;
    longitude: number;
  };
  radiusInMeters: number;
  rooms: {
    AdultsCount: number;
    KidsAges: number[];
  }[];
}
