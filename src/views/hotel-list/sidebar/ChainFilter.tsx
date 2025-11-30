'use client';
import { useHotelFilterRedux } from '@/hooks/useHotelFilterRedux';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

type ChainType = {
  id: string;
  text: string;
  count: string;
};

type Props = {
  chains: ChainType[];
};

const ChainFilter = (props: Props) => {
  const { chains } = props;
  const { selectedChains, toggleChain } = useHotelFilterRedux();
  const [showAll, setShowAll] = useState(false);

  // Initial number of items to show
  const initialVisibleCount = 5;

  // Show all items or just the initial count
  const visibleChains = showAll
    ? chains
    : chains?.slice(0, initialVisibleCount);

  return (
    <div className="d-flex flex-column gap-2">
      {visibleChains?.map((chain) => {
        const isSelected = selectedChains.includes(chain.id);
        return (
          <label
            key={chain.id}
            className="form-checkbox d-flex items-center justify-between cursor-pointer"
          >
            <div className="d-flex items-center">
              <input
                type="checkbox"
                name={chain.id}
                checked={isSelected}
                onChange={() => toggleChain(chain.id)}
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
              <div className="px-10">{chain.text}</div>
            </div>
            <div className="ml-10">{chain.count}</div>
          </label>
        );
      })}

      {/* Show more/less button */}
      {chains?.length > initialVisibleCount && (
        <button
          className="d-flex items-center gap-2 text-blue-1 fw-500 mt-10"
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

export default ChainFilter;
