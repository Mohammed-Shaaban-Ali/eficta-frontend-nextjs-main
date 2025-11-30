import { useEffect, useState } from 'react';
import { searchHotelsParams } from '@/types/requests/searchHotelRequestTypes';
import { useTranslations } from 'next-intl';

const FilterBox = () => {
  const t = useTranslations('HotelSingle.filter');
  const [searchData, setSearchData] = useState<searchHotelsParams>();

  useEffect(() => {
    const localStorageData = localStorage.getItem('search') as string;
    if (localStorageData) {
      const searchValues = JSON.parse(localStorageData) as searchHotelsParams;
      setSearchData(searchValues);
    }
  }, []);

  const getTotalGuests = () => {
    return searchData?.rooms.reduce(
      (total, room) => total + room.AdultsCount + room.KidsAges.length,
      0,
    );
  };

  return (
    <>
      <div className="col-12">
        <div className="searchMenu-date px-20 py-10 border-light rounded-4 -right">
          <div>
            <h4 className="text-15 fw-500 ls-2 lh-16">{t('check_in_out')}</h4>
            {searchData?.checkIn && searchData?.checkOut && (
              <div className="d-flex align-items-center text-14">
                <span>
                  {new Date(searchData.checkIn).toLocaleDateString()} -{' '}
                  {new Date(searchData.checkOut).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="searchMenu-guests px-20 py-10 border-light rounded-4 js-form-dd js-form-counters">
          <div
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
            data-bs-offset="0,22"
          >
            {getTotalGuests()}
            {`${t('guests')} - ${searchData?.rooms.length} ${t('rooms')}`}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterBox;
