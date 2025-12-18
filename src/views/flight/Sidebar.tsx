import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Airlines from './sidebar/Airlines';
import PirceSlider from './sidebar/PirceSlider';
import Stops from './sidebar/Stops';

import { setAvailableAirlines } from '@/store/flightFilterSlice';
import Providers from './sidebar/Providers';
import SortingOptions from './sidebar/SortingOptions';

interface SidebarProps {
  availableAirlines?: { id?: string; count?: string; text?: string }[];
  availableAlliances?: string[];
  stops?: { id: number; text: string; count: number }[];
  availableDepartureAirports?: { code: string; name: string; count?: number }[];
  availableArrivalAirports?: { code: string; name: string; count?: number }[];
  priceRange?: { min: number; max: number };
  flightCount?: number;
  providers?: { id: string; text: string; count: number }[];
  sortingOptions?: { id: 'price' | 'duration'; text: string }[];
  flightType?: 'departure' | 'return';
}

const Sidebar: React.FC<SidebarProps> = ({
  availableAirlines = [],
  availableAlliances = [],
  stops = [],
  availableDepartureAirports = [],
  availableArrivalAirports = [],
  priceRange = { min: 0, max: 5000 },
  flightCount = 0,
  providers = [],
  sortingOptions = [],
  flightType = 'departure',
}) => {
  const t = useTranslations('FlightSearch.filters');
  const dispatch = useDispatch();

  // Update available options when props change
  useEffect(() => {
    if (availableAirlines.length > 0) {
      dispatch(setAvailableAirlines(availableAirlines as any));
    }
  }, [dispatch, availableAirlines]);

  // Handle Apply button click - scroll to top
  const handleApplyClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="sidebar__item -no-border">
        <h5 className="text-18 fw-500 mb-10">Providers</h5>
        <div className="sidebar-checkbox">
          <Providers providers={providers} flightType={flightType} />
        </div>
      </div>
      <div className="sidebar__item no-border">
        <h5 className="text-18 fw-500 mb-10">{t('stops')}</h5>
        <div className="sidebar-checkbox">
          <Stops stops={stops} flightType={flightType} />
        </div>
      </div>
      <div className="sidebar__item no-border">
        <h5 className="text-18 fw-500 mb-10">Sort By</h5>
        <div className="sidebar-checkbox">
          <SortingOptions
            sortingOptions={sortingOptions}
            flightType={flightType}
          />
        </div>
      </div>

      {/* <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">{t('cabin_class')}</h5>
        <div className="sidebar-checkbox">
          <Cabin />
        </div>
      </div> */}

      <div className="sidebar__item pb-30">
        <h5 className="text-18 fw-500 mb-10">{t('price_range')}</h5>
        <div className="row x-gap-10 y-gap-30">
          <div className="col-12">
            <PirceSlider
              minPrice={priceRange?.min}
              maxPrice={priceRange?.max}
              flightType={flightType}
            />
          </div>
        </div>
      </div>

      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">{t('airlines')}</h5>
        <div className="sidebar-checkbox">
          <Airlines flightType={flightType} />
        </div>
      </div>

      {/* <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">{t('alliance')}</h5>
        <div className="sidebar-checkbox">
          <Alliance />
        </div>
      </div>

      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">{t('departing_from')}</h5>
        <div className="sidebar-checkbox">
          <DepartingFrom />
        </div>
      </div>

      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">{t('arriving_at')}</h5>
        <div className="sidebar-checkbox">
          <ArrivingAt />
        </div>
      </div>

      {flightCount > 0 && (
        <div className="sidebar__item">
          <div className="text-14 text-light-1">
            {flightCount} flights found
          </div>
        </div>
      )} */}

      <div className="sidebar__item pt-20">
        <button
          onClick={handleApplyClick}
          className="button -blue-1 h-50 px-30 rounded-100 bg-blue-1 text-15 text-white w-100"
        >
          Apply
        </button>
      </div>
    </>
  );
};

export default Sidebar;
