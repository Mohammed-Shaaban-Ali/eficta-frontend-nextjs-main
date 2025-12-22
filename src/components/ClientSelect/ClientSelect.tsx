'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useGetClientsQuery, ClientItem } from '@/reactQuery/clients.api';
import useDebounce from '@/hooks/useDebounce';
import { FaSpinner } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';

interface ClientSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
}

const ClientSelect: React.FC<ClientSelectProps> = ({
  form,
  name,
  label,
  required = false,
  error,
}) => {
  const t = useTranslations('BookingPage.customer_info');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { register, setValue, watch } = form;
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);
  const [page, setPage] = useState('1');
  const [allItems, setAllItems] = useState<ClientItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchValue, 500);
  const formValue = watch(name);

  // Fetch clients data
  const { data, isFetching, refetch } = useGetClientsQuery({
    search: debouncedSearch,
    page,
  });

  // Reset page when search changes
  useEffect(() => {
    setPage('1');
    setAllItems([]);
  }, [debouncedSearch]);

  // Update items when data changes
  useEffect(() => {
    if (data?.items) {
      if (page === '1') {
        // Reset items for new search
        setAllItems(data.items);
      } else {
        // Append new items for pagination
        setAllItems((prev) => [...prev, ...data.items]);
      }
    }
  }, [data, page]);

  // Load more when scrolling to bottom
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || !data?.hasMore || isFetching) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        const nextPage = (parseInt(page) + 1).toString();
        setPage(nextPage);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [data?.hasMore, isFetching, page]);

  // Find selected client when form value changes (only sync when dropdown is closed)
  useEffect(() => {
    // Only sync when dropdown is closed to avoid interfering with user input
    if (!isOpen && formValue && allItems.length > 0) {
      const client = allItems.find(
        (item) => item.id.toString() === formValue.toString(),
      );
      if (client && (!selectedClient || selectedClient.id !== client.id)) {
        setSelectedClient(client);
        setSearchValue(client.text);
      }
    } else if (!isOpen && !formValue && selectedClient) {
      // Clear selection only if form value is explicitly cleared and dropdown is closed
      setSelectedClient(null);
      setSearchValue('');
    }
  }, [formValue, allItems, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (client: ClientItem) => {
    setSelectedClient(client);
    setValue(name, client.id, { shouldValidate: true });
    setSearchValue(client.text);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsOpen(true);
    if (!value) {
      setValue(name, '', { shouldValidate: true });
      setSelectedClient(null);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // If there's a selected client, clear selection but keep search value to allow editing
    if (selectedClient) {
      setSearchValue(selectedClient.text);
      setSelectedClient(null);
      setValue(name, '', { shouldValidate: true });
    }
  };

  return (
    <div
      className="form-input"
      ref={dropdownRef}
      style={{ position: 'relative' }}
    >
      <input
        type="hidden"
        {...register(name as any, {
          required: required,
        })}
      />
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        readOnly={!!selectedClient && !isOpen}
        style={{
          minHeight: '70px',
          paddingTop: '25px',
          cursor: selectedClient && !isOpen ? 'pointer' : 'text',
        }}
        className="form-select"
        autoComplete="off"
        placeholder=""
      />
      <label className="lh-1 text-16 text-light-1" style={{ top: '20px' }}>
        {label || 'Client'}
      </label>

      {isOpen && (
        <div
          className="shadow-2 dropdown-menu min-width-400"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            marginTop: '4px',
            maxHeight: '400px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            className="bg-white p-2 rounded-md"
            style={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {isFetching && allItems.length === 0 ? (
              <div className="d-flex justify-content-center align-items-center p-4">
                <FaSpinner
                  className="spinner-border spinner-border-sm"
                  style={{ animation: 'spin 1s linear infinite' }}
                />
              </div>
            ) : allItems.length === 0 ? (
              <div className="text-center p-4 text-light-1">
                No results found
              </div>
            ) : (
              <>
                <div
                  ref={scrollRef}
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    maxHeight: '350px',
                  }}
                >
                  <ul className="y-gap-5 js-results">
                    {allItems.map((item) => (
                      <li
                        key={item.id}
                        className={`-link
                          hover:bg-gray-100!
                          d-block col-12 text-left rounded-4 px-20 py-15 js-search-option mb-1 cursor-pointer transition-all duration-200 hover:bg-blue-1/5 ${
                            selectedClient?.id === item.id ? 'bg-blue-1/10' : ''
                          }`}
                        role="button"
                        onClick={() => handleSelect(item)}
                      >
                        <div className="text-15 lh-12 fw-500">{item.text}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                {isFetching && allItems.length > 0 && (
                  <div className="d-flex justify-content-center align-items-center p-2 border-top">
                    <FaSpinner
                      className="spinner-border spinner-border-sm"
                      style={{ animation: 'spin 1s linear infinite' }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {error && <span className="text-red-1">{error}</span>}
    </div>
  );
};

export default ClientSelect;
