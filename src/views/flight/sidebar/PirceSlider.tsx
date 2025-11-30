'use client';

import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useFlightUtils } from '@/hooks/useFlightUtils';
import { setPriceRange } from '@/store/flightFilterSlice';
import { RootState } from '@/store/store';

const PirceSlider = ({
  minPrice = 0,
  maxPrice = 10000,
}: {
  minPrice?: number;
  maxPrice?: number;
}) => {
  const t = useTranslations('FlightSearch.filters');
  const { formatPrice } = useFlightUtils();

  const dispatch = useDispatch();
  const priceRange = useSelector(
    (state: RootState) => state.flightFilter.priceRange,
  );

  // Local state to prevent excessive Redux updates
  const [localValue, setLocalValue] = useState({
    min: priceRange.min,
    max: priceRange.max,
  });

  // Initialize local state with API values when component mounts
  useEffect(() => {
    if (minPrice !== undefined && maxPrice !== undefined) {
      const initialRange = {
        min: Math.max(minPrice, priceRange.min),
        max: Math.min(maxPrice, priceRange.max),
      };
      setLocalValue(initialRange);
      // Set initial Redux state if not already set
      if (priceRange.min === 0 && priceRange.max === 5000) {
        dispatch(
          setPriceRange({
            min: minPrice,
            max: maxPrice,
          }),
        );
      }
    }
  }, [minPrice, maxPrice, dispatch, priceRange.min, priceRange.max]);

  // Update local state when Redux state changes
  useEffect(() => {
    setLocalValue({
      min: priceRange.min,
      max: priceRange.max,
    });
  }, [priceRange.min, priceRange.max]);

  // Use API values for slider bounds
  const validMinValue = minPrice || 0;
  const validMaxValue = maxPrice || 10000;

  // Handle range change with immediate UI update
  const handleRangeChange = (newValue: { min: number; max: number }) => {
    setLocalValue(newValue);
  };

  // Only update Redux when the slider interaction ends
  const handleRangeChangeComplete = (value: { min: number; max: number }) => {
    if (value.min !== priceRange.min || value.max !== priceRange.max) {
      dispatch(
        setPriceRange({
          min: value.min,
          max: value.max,
        }),
      );
    }
  };
  return (
    <div className="js-price-rangeSlider">
      <div className="text-14 fw-500 mb-2">{t('price_range')}</div>

      <div className="d-flex justify-between mb-20">
        <div className="text-15 text-dark-1">
          <span className="js-lower mx-1">{formatPrice(localValue.min)}</span>-
          <span className="js-upper mx-1">{formatPrice(localValue.max)}</span>
        </div>
      </div>

      <div className="px-5">
        <InputRange
          minValue={validMinValue}
          maxValue={validMaxValue}
          step={10}
          value={localValue}
          onChange={(value) =>
            typeof value !== 'number' && handleRangeChange(value)
          }
          onChangeComplete={(value) =>
            typeof value !== 'number' && handleRangeChangeComplete(value)
          }
        />
      </div>
    </div>
  );
};

export default PirceSlider;
