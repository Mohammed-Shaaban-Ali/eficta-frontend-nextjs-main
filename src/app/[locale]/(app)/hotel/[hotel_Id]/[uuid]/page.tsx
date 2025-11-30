import SingleHotel from '@/views/hotel-single';
import React from 'react';

type Props = Promise<{
  hotel_Id: string;
  uuid: string;
}>;

export default async function Page({ params }: { params: Props }) {
  const resolvedParams = await params;
  const uuid = resolvedParams?.uuid;
  const hotel_Id = resolvedParams?.hotel_Id;
  return <SingleHotel hotelID={hotel_Id} uuid={uuid} />;
}
