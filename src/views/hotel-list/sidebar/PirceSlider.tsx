'use client';

import { useHotelFilterRedux } from '@/hooks/useHotelFilterRedux';
import { useState } from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

const PriceRangeSlider = () => {
  const { priceRange, setPriceRange } = useHotelFilterRedux();
  const [localValue, setLocalValue] = useState({
    min: priceRange.min,
    max: priceRange.max,
  });

  // Handle range change with debouncing to prevent excessive Redux updates
  const handleRangeChange = (newValue: { min: number; max: number }) => {
    setLocalValue(newValue);
  };

  // Only update Redux when the slider interaction ends
  const handleRangeChangeComplete = (value: { min: number; max: number }) => {
    setPriceRange({
      min: value.min,
      max: value.max,
    });
  };

  return (
    <div>
      <div className="js-price-rangeSlider mt-30">
        <InputRange
          maxValue={15000}
          minValue={0}
          step={10}
          value={localValue}
          onChange={(value) =>
            typeof value !== 'number' && handleRangeChange(value)
          }
          onChangeComplete={(value) =>
            typeof value !== 'number' && handleRangeChangeComplete(value)
          }
          formatLabel={(value) => `$${value}`}
        />
      </div>

      <div className="d-flex justify-between mt-20">
        <div className="">
          <span className="fw-500">Min:</span>
          <span className="js-lower fw-500 text-blue-1 ml-10">
            ${localValue.min}
          </span>
        </div>

        <div className="">
          <span className="fw-500">Max:</span>
          <span className="js-upper fw-500 text-blue-1 ml-10">
            ${localValue.max}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
