'use client';
import { memo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  FaPlane,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaSearch,
  FaRedo,
} from 'react-icons/fa';
import { Link } from '@/i18n/navigation';
import { resetFilters } from '@/store/flightFilterSlice';
import { useDispatch } from 'react-redux';

interface NoResultsPageProps {
  error?: any;
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  childrenCount: number;
  infants: number;
  cabinClass: string;
}

const NoResultsPage = memo<NoResultsPageProps>(
  ({
    error,
    fromAirport,
    toAirport,
    departureDate,
    returnDate,
    adults,
    childrenCount,
    infants,
    cabinClass,
  }) => {
    const t = useTranslations('FlightSearch.results');
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const dispatch = useDispatch();

    const handleRetry = () => {
      window.location.reload();
    };

    return (
      <div className="container-fluid px-0" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center py-5">
          <div
            className={`d-inline-flex align-items-center justify-content-center rounded-circle mb-4 ${
              error ? 'bg-danger bg-opacity-10' : 'bg-primary bg-opacity-10'
            }`}
            style={{ width: '80px', height: '80px' }}
          >
            {error ? (
              <FaExclamationTriangle className="text-danger" size={32} />
            ) : (
              <FaSearch className="text-primary" size={32} />
            )}
          </div>

          <h2 className="mb-3 fw-bold text-dark">
            {error ? t('error_message') : t('no_results')}
          </h2>

          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            {error ? t('error_message') : t('no_results_description')}
          </p>

          {/* Search Summary */}
          <div className="card mx-auto mb-4" style={{ maxWidth: '500px' }}>
            <div className="card-header bg-light">
              <h6 className="mb-0 fw-bold">{t('search_details')}</h6>
            </div>
            <div className="card-body p-3">
              <div className="d-flex align-items-center mb-2">
                <div
                  className={`d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle ${isRTL ? 'ms-2' : 'me-2'}`}
                  style={{ width: '24px', height: '24px' }}
                >
                  <FaPlane className="text-primary" size={8} />
                </div>
                <span className="small">
                  <strong>{fromAirport}</strong> → <strong>{toAirport}</strong>
                </span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <div
                  className={`d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle ${isRTL ? 'ms-2' : 'me-2'}`}
                  style={{ width: '24px', height: '24px' }}
                >
                  <FaCalendarAlt className="text-primary" size={8} />
                </div>
                <span className="small">
                  {t('departure_label')}{' '}
                  <strong>
                    {new Date(departureDate).toLocaleDateString()}
                  </strong>
                  {returnDate && (
                    <span>
                      {' '}
                      • {t('return_label')}{' '}
                      <strong>
                        {new Date(returnDate).toLocaleDateString()}
                      </strong>
                    </span>
                  )}
                </span>
              </div>
              <div className="d-flex align-items-center">
                <div
                  className={`d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle ${isRTL ? 'ms-2' : 'me-2'}`}
                  style={{ width: '24px', height: '24px' }}
                >
                  <FaUsers className="text-primary" size={8} />
                </div>
                <span className="small">
                  {adults} {t('adult_label')}
                  {adults > 1 ? 's' : ''}
                  {childrenCount > 0 &&
                    `, ${childrenCount} ${t('child_label')}${childrenCount > 1 ? 'ren' : ''}`}
                  {infants > 0 &&
                    `, ${infants} ${t('infant_label')}${infants > 1 ? 's' : ''}`}
                  {' • '}
                  {cabinClass}
                </span>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {!error && (
            <div className="row g-3 mb-4 mx-auto" style={{ maxWidth: '800px' }}>
              <div className="col-md-4">
                <div className="card h-100 border-primary border-opacity-25">
                  <div className="card-body text-center p-3">
                    <div
                      className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mx-auto mb-2"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <FaCalendarAlt className="text-primary" size={16} />
                    </div>
                    <h6 className="fw-bold mb-2">
                      {t('suggestions.try_different_dates')}
                    </h6>
                    <p className="small text-muted mb-0">
                      {t('suggestions.try_different_dates_desc')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100 border-success border-opacity-25">
                  <div className="card-body text-center p-3">
                    <div
                      className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mx-auto mb-2"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <FaMapMarkerAlt className="text-success" size={16} />
                    </div>
                    <h6 className="fw-bold mb-2">
                      {t('suggestions.check_nearby_airports')}
                    </h6>
                    <p className="small text-muted mb-0">
                      {t('suggestions.check_nearby_airports_desc')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100 border-info border-opacity-25">
                  <div className="card-body text-center p-3">
                    <div
                      className="d-flex align-items-center justify-content-center bg-info bg-opacity-10 rounded-circle mx-auto mb-2"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <FaUsers className="text-info" size={16} />
                    </div>
                    <h6 className="fw-bold mb-2">
                      {t('suggestions.adjust_passenger_count')}
                    </h6>
                    <p className="small text-muted mb-0">
                      {t('suggestions.adjust_passenger_count_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex gap-3 justify-content-center mb-4">
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => dispatch(resetFilters())}
            >
              <FaRedo size={14} />
              {error ? t('actions.try_again') : t('actions.modify_search')}
            </button>

            <Link
              href="/"
              className="btn btn-outline-primary d-flex align-items-center gap-2 text-decoration-none"
            >
              <FaSearch size={14} />
              {t('actions.new_search')}
            </Link>
          </div>

          {error && (
            <div
              className="alert alert-danger mx-auto"
              style={{ maxWidth: '600px' }}
            >
              <small>
                {t('actions.error_details')}{' '}
                {error?.message || t('actions.unexpected_error')}
              </small>
            </div>
          )}
        </div>
      </div>
    );
  },
);

NoResultsPage.displayName = 'NoResultsPage';

export default NoResultsPage;
