'use client';

import { useState, useEffect, useRef } from 'react';
import { useHotelFilterRedux } from '@/hooks/useHotelFilterRedux';

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { setHotelNameFilter, hotelName } = useHotelFilterRedux();
  const prevHotelNameRef = useRef(hotelName);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Set up a callback to update the filter after user stops typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set a new timer to update the filter after debounce period
    timerRef.current = setTimeout(() => {
      // Only update if the value is different from what's in Redux
      if (newValue !== hotelName) {
        setHotelNameFilter(newValue);
      }
    }, 500);
  };

  // Handle form submission
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Cancel any pending debounce
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Only update if needed
    if (searchQuery !== hotelName) {
      setHotelNameFilter(searchQuery);
    }
  };

  // Keep local state in sync with Redux when external changes happen
  useEffect(() => {
    // Skip synchronization if the input has focus (user is typing)
    const inputElement = document.querySelector('input[type="text"]');
    const isInputFocused = document.activeElement === inputElement;

    // Only update the input if Redux state changed externally
    // and the input doesn't have focus (to avoid interrupting typing)
    if (hotelName !== prevHotelNameRef.current && !isInputFocused) {
      setSearchQuery(hotelName || '');
    }

    // Update ref to track changes
    prevHotelNameRef.current = hotelName;

    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [hotelName]);

  return (
    <form onSubmit={handleSearch}>
      <div className="single-field relative d-flex items-center py-10">
        <input
          className="pl-50 border-light text-dark-1 h-50 rounded-8"
          type="text"
          placeholder="e.g. Best Western"
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button type="submit" className="absolute d-flex items-center h-full">
          <i className="icon-search text-20 px-15 text-dark-1" />
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
