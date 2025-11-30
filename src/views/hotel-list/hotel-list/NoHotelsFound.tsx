'use client';
import { useHotelFilterRedux } from '@/hooks/useHotelFilterRedux';
import Image from 'next/image';
import { MdOutlineFilterAltOff } from 'react-icons/md';
import { useTranslations } from 'next-intl';

const NoHotelsFound = () => {
  const t = useTranslations('HotelList.no_hotels');
  const { resetFilters } = useHotelFilterRedux();

  return (
    <div className="d-flex flex-column items-center justify-center py-50">
      <Image
        src="/img/general/no-results.svg"
        alt="No results"
        width={200}
        height={200}
        className="mb-20"
      />
      <h3 className="text-18 fw-500 mb-10">{t('title')}</h3>
      <p className="text-15 text-center">{t('description')}</p>
      <button
        onClick={resetFilters}
        className="button -blue-1 bg-blue-1 text-white mt-20 px-30 py-15 rounded-100 d-flex items-center"
      >
        <MdOutlineFilterAltOff className="mr-10" size={20} />
        {t('try_again')}
      </button>
    </div>
  );
};

export default NoHotelsFound;
