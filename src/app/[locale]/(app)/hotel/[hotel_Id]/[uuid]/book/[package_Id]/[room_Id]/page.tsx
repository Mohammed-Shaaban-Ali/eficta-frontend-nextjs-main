import CallToActions from '@/views/common/CallToActions';
import Footer from '@/components/layout/Footer';
import BookingPage from '@/views/booking-page/hotel';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Hotel Booking Page || Efica ',
  description: 'Efica ',
};

type Props = Promise<{
  hotel_Id: string;
  uuid: string;
  package_Id: string;
  room_Id: string;
}>;

export default async function Page({ params }: { params: Props }) {
  const resolvedParams = await params;
  const uuid = resolvedParams?.uuid;
  const hotel_Id = resolvedParams?.hotel_Id;
  const package_Id = resolvedParams?.package_Id;
  const room_Id = resolvedParams?.room_Id;
  return (
    <>
      <section className="pt-40 layout-pb-md">
        <div className="container">
          <BookingPage
            hotelID={hotel_Id}
            packageID={package_Id}
            roomId={room_Id}
            uuid={uuid}
          />
        </div>
      </section>
    </>
  );
}
