import Map from '../../../components/parts/Map';
import RatingsFilter from '../sidebar/RatingsFilter';
import PirceSlider from '../sidebar/PirceSlider';
import ChainFilter from '../sidebar/ChainFilter';
import FacilityFilter from '../sidebar/FacilityFilter';
import PropertyTypeFilter from '../sidebar/PropertyTypeFilter';
import { hotelSeachTypes } from '@/types/app/hotelTypes';
import { useHotelFilterRedux } from '@/hooks/useHotelFilterRedux';
import SearchBox from '../sidebar/SearchBox';
import { useTranslations } from 'next-intl';
// import DealsFilter from '../sidebar/DealsFilter';
// import SearchBox from '../sidebar/SearchBox';
// import PopularFilters from '../sidebar/PopularFilters';
// import AminitesFilter from '../sidebar/AminitesFilter';
// import GuestRatingFilters from '../sidebar/GuestRatingFilters';
// import StyleFilter from '../sidebar/StyleFilter';
// import NeighborhoddFilter from '../sidebar/NeighborhoddFilter';
import { MdOutlineFilterAltOff } from 'react-icons/md';

const Sidebar = ({
  hotels,
  chains,
  facilities,
  propertyTypes,
  displayedHotels,
}: {
  hotels: hotelSeachTypes[];
  chains?: { id: string; text: string; count: string }[];
  facilities?: { id: string; text: string; count: string }[];
  propertyTypes?: { id: string; text: string; count: string }[];
  displayedHotels: hotelSeachTypes[]; // Added displayedHotels prop
}) => {
  const t = useTranslations('HotelList.sidebar');
  const {
    resetFilters,
    selectedRating,
    selectedChains,
    selectedPropertyTypes,
    selectedFacilities,
    hotelName,
    priceRange,
  } = useHotelFilterRedux();

  // Check if any filters are actively applied
  const filtersAreApplied =
    selectedRating !== null ||
    selectedChains.length > 0 ||
    selectedPropertyTypes.length > 0 ||
    selectedFacilities.length > 0 ||
    hotelName !== '' ||
    priceRange.min !== 0 ||
    priceRange.max !== 500;

  return (
    <>
      <div className="sidebar__item -no-border">
        <div className="sidebar__item -no-border position-relative pb-20">
          <Map hotels={displayedHotels} autoFocus={true} />
        </div>
        <div className="px-20 py-20 bg-light-2 rounded-4">
          <h5 className="text-18 fw-500 mb-10">{t('search_hotel')}</h5>

          <div className="row y-gap-20">
            <SearchBox />
          </div>
        </div>
      </div>

      {/* <div className="sidebar__item -no-border">
        <h5 className="text-18 fw-500 mb-10">Search by property name</h5>
        <SearchBox />
      </div> */}

      {chains && chains.length > 0 && (
        <div className="sidebar__item">
          <h5 className="text-18 fw-500 mb-10">{t('hotel_chain')}</h5>
          <div className="sidebar-checkbox">
            <ChainFilter chains={chains} />
          </div>
        </div>
      )}

      {propertyTypes && propertyTypes.length > 0 && (
        <div className="sidebar__item">
          <h5 className="text-18 fw-500 mb-10">{t('property_type')}</h5>
          <div className="sidebar-checkbox">
            <PropertyTypeFilter propertyTypes={propertyTypes} />
          </div>
        </div>
      )}
      {/*
      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">Deals</h5>
        <div className="sidebar-checkbox">
          <div className="row y-gap-5 items-center">
            <DealsFilter />
          </div>
        </div>
      </div>

      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">Popular Filters</h5>
        <div className="sidebar-checkbox">
          <PopularFilters />
        </div>
      </div> */}

      <div className="sidebar__item pb-30">
        <h5 className="text-18 fw-500 mb-10">{t('nightly_price')}</h5>
        <div className="row x-gap-10 y-gap-30">
          <div className="col-12">
            <PirceSlider />
          </div>
        </div>
      </div>

      {/* <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">Amenities</h5>
        <div className="sidebar-checkbox">
          <AminitesFilter />
        </div>
      </div> */}

      {facilities && facilities.length > 0 && (
        <div className="sidebar__item">
          <h5 className="text-18 fw-500 mb-10">{t('facilities')}</h5>
          <div className="sidebar-checkbox">
            <FacilityFilter facilities={facilities} />
          </div>
        </div>
      )}

      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">{t('star_rating')}</h5>
        <div className="row x-gap-10 y-gap-10 pt-10">
          <RatingsFilter />
        </div>
      </div>

      {/* <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">Guest Rating</h5>
        <div className="sidebar-checkbox">
          <GuestRatingFilters />
        </div>
      </div>

      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">Style</h5>
        <div className="sidebar-checkbox">
          <StyleFilter />
        </div>
      </div>

      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">Neighborhood</h5>
        <div className="sidebar-checkbox">
          <NeighborhoddFilter />
        </div>
      </div> */}
    </>
  );
};

export default Sidebar;
