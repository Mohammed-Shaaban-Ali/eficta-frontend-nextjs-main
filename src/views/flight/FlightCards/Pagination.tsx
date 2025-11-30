'use client';
import { memo } from 'react';
import { useTranslations, useLocale } from 'next-intl';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  resultsPerPage: number;
}

const Pagination = memo<PaginationProps>(
  ({ currentPage, totalPages, onPageChange, totalResults, resultsPerPage }) => {
    const t = useTranslations('FlightSearch.pagination');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    if (totalPages <= 1) return null;

    const startResult = (currentPage - 1) * resultsPerPage + 1;
    const endResult = Math.min(currentPage * resultsPerPage, totalResults);

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center py-4">
        <div className="mb-3 mb-md-0">
          <span className="text-muted">
            {t('showing_results', {
              from: startResult,
              to: endResult,
              total: totalResults,
            })}
          </span>
        </div>

        <nav aria-label="Flight results pagination">
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label={t('previous')}
              >
                {t('previous')}
              </button>
            </li>

            {getVisiblePages().map((page, index) => (
              <li
                key={index}
                className={`page-item ${
                  page === currentPage ? 'active' : ''
                } ${page === '...' ? 'disabled' : ''}`}
              >
                {page === '...' ? (
                  <span className="page-link">...</span>
                ) : (
                  <button
                    className="page-link"
                    onClick={() => onPageChange(page as number)}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )}
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? 'disabled' : ''
              }`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label={t('next')}
              >
                {t('next')}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  },
);

Pagination.displayName = 'Pagination';

export default Pagination;
