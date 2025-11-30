'use client';

import { hotelSeachTypes } from '@/types/app/hotelTypes';
import HotelCard from './HotelCard';
import Pagination from '../common/Pagination';
import NoHotelsFound from './NoHotelsFound';

const HotelProperties = ({
  filteredHotels,
  uuid,
  displayedHotels,
  handlePageChange,
  itemsPerPage,
  isFetching,
}: {
  filteredHotels: hotelSeachTypes[];
  uuid: string;
  displayedHotels: hotelSeachTypes[];
  handlePageChange: (page: number) => void;
  itemsPerPage: number;
  isFetching: boolean;
}) => {
  return (
    <div className="container py-4">
      {/* Show loading indicator when fetching */}
      {isFetching && filteredHotels.length === 0 ? (
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading hotels...</p>
          </div>
        </div>
      ) : filteredHotels.length > 0 ? (
        <>
          <div className="row">
            {displayedHotels.map((item) => (
              <div className="col-12" key={item?.id}>
                <HotelCard hotel={item} Uuid={uuid} />
              </div>
            ))}
          </div>
          {filteredHotels && filteredHotels.length > 0 && (
            <Pagination
              totalItems={filteredHotels.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="row">
          <div className="col-12">
            <NoHotelsFound />
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelProperties;
