'use client';

import { useHotelFilterRedux } from '@/hooks/useHotelFilterRedux';
import { AiFillStar } from 'react-icons/ai';
import { useEffect, useState } from 'react';

const ratings = [5, 4, 3, 2, 1];

const RatingsFilter = () => {
  const { hotels, selectedRating, setSelectedRating } = useHotelFilterRedux();
  const [ratingCounts, setRatingCounts] = useState<Record<number, number>>({});

  // Calculate rating counts once when hotels are loaded
  useEffect(() => {
    if (hotels && hotels.length > 0) {
      const counts: Record<number, number> = {};

      // Initialize counts for all ratings
      ratings.forEach((rating) => {
        counts[rating] = 0;
      });

      // Count hotels by rating
      hotels.forEach((hotel) => {
        if (hotel && hotel.starRating) {
          // Make sure to convert to number for consistent comparison
          const ratingAsNumber = Number(hotel.starRating);
          if (
            !isNaN(ratingAsNumber) &&
            ratingAsNumber >= 1 &&
            ratingAsNumber <= 5
          ) {
            counts[ratingAsNumber] = (counts[ratingAsNumber] || 0) + 1;
          }
        }
      });

      setRatingCounts(counts);
    }
  }, [hotels]);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating === selectedRating ? null : (rating));
  };

  return (
    <div className="d-flex flex-column gap-2">
      {ratings.map((rating) => {
        const ratingCount = ratingCounts[rating] || 0;
        const isSelected = selectedRating === rating;
        return (
          <label
            key={rating}
            className="form-checkbox d-flex items-center justify-between cursor-pointer"
          >
            <div className="d-flex items-center">
              <input
                type="checkbox"
                name="rating"
                checked={isSelected}
                onChange={() => handleRatingClick(rating)}
              />
              <div
                className={`form-checkbox__mark ${isSelected ? 'active' : ''}`}
              >
                <div
                  className={`form-checkbox__icon icon-check ${isSelected ? 'active' : ''}`}
                />
              </div>
              <div className="d-flex align-items-center px-5 group">
                {[...Array(rating)].map((_, index) => (
                  <AiFillStar
                    key={index}
                    className={`text-warning fs-5 transition-opacity duration-200 opacity-50 group-hover:opacity-100 ${
                      selectedRating === rating ? 'opacity-100' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
            <p>{ratingCount}</p>
          </label>
        );
      })}
    </div>
  );
};

export default RatingsFilter;
