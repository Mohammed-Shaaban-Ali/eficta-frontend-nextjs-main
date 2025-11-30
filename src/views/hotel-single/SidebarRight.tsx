import ViewPrice from '@/components/parts/ViewPrice';
import FilterBox from '@/views/hotel-single/SelectDataSearch';
import { useTranslations } from 'next-intl';

const SidebarRight = ({ hotel }: any) => {
  const t = useTranslations('HotelSingle.sidebar');

  return (
    <aside className="ml-50 lg:ml-0">
      <div className="px-30 py-30 border-light rounded-4 shadow-4">
        <div className="d-flex items-center justify-between">
          <ViewPrice finalPrice={Number(hotel?.price)} />

          <div className="d-flex items-center">
            {/* <div className="text-14 text-right mr-10">
              <div className="lh-15 fw-500">
                {hotel?.reviews?.scoreDescription}
              </div>
              <div className="lh-15 text-light-1">
                {hotel?.reviews?.reviewsCount} {t('guest_rating')}
              </div>
            </div> */}
            {/* <div className="size-40 flex-center bg-blue-1 rounded-4">
              <div className="text-14 fw-600 text-white">
                {hotel?.reviews?.score}
              </div>
            </div> */}
          </div>
        </div>

        <div className="row y-gap-20 pt-30">
          <FilterBox />
        </div>
      </div>
    </aside>
  );
};

export default SidebarRight;
