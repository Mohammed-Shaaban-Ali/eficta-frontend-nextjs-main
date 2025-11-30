'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: PaginationProps) => {
  const t = useTranslations('Common.pagination');

  const handlePageClick = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPage = (pageNumber: number, isActive = false) => {
    const className = `size-40 flex-center rounded-full cursor-pointer ${
      isActive ? 'bg-dark-1 text-white' : ''
    }`;
    return (
      <div key={pageNumber} className="col-auto">
        <div className={className} onClick={() => handlePageClick(pageNumber)}>
          {pageNumber}
        </div>
      </div>
    );
  };

  const renderPages = () => {
    const pageNumbers = [];
    const maxDisplayPages = 5;

    if (totalPages <= maxDisplayPages) {
      // Show all pages if there are <= maxDisplayPages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis for large number of pages
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1); // Ellipsis
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push(-1); // Ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Middle
        pageNumbers.push(1);
        pageNumbers.push(-1); // Ellipsis
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push(-2); // Ellipsis
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((pageNumber) => {
      if (pageNumber === -1 || pageNumber === -2) {
        return (
          <div key={`ellipsis-${pageNumber}`} className="col-auto">
            <div className="size-40 flex-center rounded-full">...</div>
          </div>
        );
      }
      return renderPage(pageNumber, pageNumber === currentPage);
    });
  };

  return (
    <div className="border-top-light mt-30 pt-30">
      <div className="row x-gap-10 y-gap-20 justify-between md:justify-center">
        <div className="col-auto md:order-1">
          <button
            className={`button -blue-1 size-40 rounded-full border-light ${currentPage <= 1 ? 'opacity-50' : ''}`}
            onClick={handlePrevious}
            disabled={currentPage <= 1}
            aria-label={t('previous_page')}
          >
            <i className="icon-chevron-left text-12" />
          </button>
        </div>

        <div className="col-md-auto md:order-3">
          <div className="row x-gap-20 y-gap-20 items-center md:d-none">
            {renderPages()}
          </div>

          <div className="row x-gap-10 y-gap-20 justify-center items-center d-none md:d-flex">
            {renderPages()}
          </div>
        </div>

        <div className="col-auto md:order-2">
          <button
            className={`button -blue-1 size-40 rounded-full border-light ${currentPage >= totalPages ? 'opacity-50' : ''}`}
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            aria-label={t('next_page')}
          >
            <i className="icon-chevron-right text-12" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
