'use client';
import { useHotelFilterRedux } from '@/hooks/useHotelFilterRedux';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

type FacilityType = {
  id: string;
  text: string;
  count: string;
};

type Props = {
  facilities: FacilityType[];
};

const FacilityFilter = (props: Props) => {
  const { facilities } = props;
  const { selectedFacilities, toggleFacility } = useHotelFilterRedux();
  const [showAll, setShowAll] = useState(false);

  // Initial number of items to show
  const initialVisibleCount = 5;

  // Show all items or just the initial count
  const visibleFacilities = showAll
    ? facilities
    : facilities?.slice(0, initialVisibleCount);

  return (
    <div className="d-flex flex-column gap-2">
      {visibleFacilities?.map((facility) => {
        const isSelected = selectedFacilities.includes(facility.id);
        return (
          <label
            key={facility.id}
            className="form-checkbox d-flex items-center justify-between cursor-pointer"
          >
            <div className="d-flex items-center">
              <input
                type="checkbox"
                name={facility.id}
                checked={isSelected}
                onChange={() => toggleFacility(facility.id)}
              />
              <div
                className={`form-checkbox__mark ${isSelected ? 'active' : ''}`}
              >
                <div
                  className={`form-checkbox__icon icon-check ${
                    isSelected ? 'active' : ''
                  }`}
                />
              </div>
              <div className="px-10">{facility.text}</div>
            </div>
            <div className="ml-10">{facility.count}</div>
          </label>
        );
      })}

      {facilities && facilities.length > initialVisibleCount && (
        <button
          className="d-flex items-center text-15 text-blue-1 mt-10"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <span>Show Less</span>
              <FiChevronUp className="ml-10" />
            </>
          ) : (
            <>
              <span>Show More</span>
              <FiChevronDown className="ml-10" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default FacilityFilter;
