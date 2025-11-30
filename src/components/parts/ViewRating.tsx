import { hotelSeachTypes } from '@/types/app/hotelTypes';
import React from 'react';
import { FaStar } from 'react-icons/fa';

const ViewRating = ({ selectedHotel }: { selectedHotel: hotelSeachTypes }) => {
  return (
    <div className="col-auto">
      {selectedHotel?.starRating && Number(selectedHotel?.starRating) > 0
        ? [
            ...Array(
              Math.min(5, Math.floor(Number(selectedHotel?.starRating))),
            ),
          ].map((_, i) => <FaStar key={i} className="text-warning me-1" />)
        : null}
    </div>
  );
};

export default ViewRating;
