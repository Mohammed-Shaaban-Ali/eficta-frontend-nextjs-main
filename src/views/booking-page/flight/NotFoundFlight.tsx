import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { FaPlane, FaSearch, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const NotFoundFlight = () => {
  const t = useTranslations('BookingPage.not_found');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <section className="py-5">
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="text-center">
              {/* Modern Icon Design */}
              <div className="mb-4">
                <div
                  className="position-relative mx-auto mb-3"
                  style={{ width: '120px', height: '120px' }}
                >
                  <div className="position-absolute w-100 h-100 bg-light rounded-circle d-flex align-items-center justify-content-center">
                    <div className="position-relative">
                      <FaPlane
                        className="text-muted opacity-25"
                        size={40}
                        style={{
                          transform: isRTL ? 'scaleX(1)' : 'scaleX(-1)',
                        }}
                      />
                      <div
                        className="position-absolute bg-white rounded-circle d-flex align-items-center justify-content-center border border-2 border-primary"
                        style={{
                          width: '32px',
                          height: '32px',
                          top: '-8px',
                          [isRTL ? 'left' : 'right']: '-8px',
                        }}
                      >
                        <FaSearch className="text-primary" size={14} />
                      </div>
                    </div>
                  </div>
                  {/* Subtle Animation Circles */}
                  <div
                    className="position-absolute w-100 h-100 border border-2 border-primary border-opacity-20 rounded-circle"
                    style={{
                      animation: 'pulse 2s infinite',
                      transform: 'scale(1.1)',
                    }}
                  />
                  <div
                    className="position-absolute w-100 h-100 border border-1 border-primary border-opacity-10 rounded-circle"
                    style={{
                      animation: 'pulse 2s infinite 0.5s',
                      transform: 'scale(1.2)',
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h3 className="h4 fw-bold text-dark mb-3">{t('title')}</h3>
                <p className="text-muted mb-0 lead">{t('description')}</p>
              </div>

              {/* Suggestions */}
              <div className="mb-4">
                <div className="bg-light rounded-3 p-4">
                  <h6 className="fw-semibold text-dark mb-3">
                    {t('suggestions_title')}
                  </h6>
                  <div
                    className={`row g-3 ${isRTL ? 'text-end' : 'text-start'}`}
                  >
                    <div className="col-12">
                      <div
                        className={`d-flex align-items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 flex-shrink-0 mt-1">
                          <FaCalendarAlt className="text-primary" size={12} />
                        </div>
                        <div className="flex-grow-1">
                          <div className="small fw-semibold text-dark">
                            {t('suggestion_dates')}
                          </div>
                          <div className="small text-muted">
                            {t('suggestion_dates_desc')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div
                        className={`d-flex align-items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <div className="bg-success bg-opacity-10 rounded-circle p-2 flex-shrink-0 mt-1">
                          <FaSearch className="text-success" size={12} />
                        </div>
                        <div className="flex-grow-1">
                          <div className="small fw-semibold text-dark">
                            {t('suggestion_destination')}
                          </div>
                          <div className="small text-muted">
                            {t('suggestion_destination_desc')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div
                        className={`d-flex align-items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <div className="bg-warning bg-opacity-10 rounded-circle p-2 flex-shrink-0 mt-1">
                          <FaPlane className="text-warning" size={12} />
                        </div>
                        <div className="flex-grow-1">
                          <div className="small fw-semibold text-dark">
                            {t('suggestion_flexible')}
                          </div>
                          <div className="small text-muted">
                            {t('suggestion_flexible_desc')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Link
                  href="/"
                  className="btn btn-primary rounded-3 px-4 py-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <FaSearch size={14} />
                  <span>{t('new_search')}</span>
                </Link>
                <Link
                  href="/bookings"
                  className="btn btn-outline-secondary rounded-3 px-4 py-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <span>{t('view_bookings')}</span>
                  <FaArrowRight
                    size={14}
                    style={{ transform: isRTL ? 'scaleX(-1)' : 'scaleX(1)' }}
                  />
                </Link>
              </div>

              {/* Help Text */}
              <div className="mt-4">
                <p className="small text-muted mb-0">
                  {t('help_text')}
                  <Link
                    href="/contact"
                    className={`text-primary text-decoration-none ${isRTL ? 'me-1' : 'ms-1'}`}
                  >
                    {t('contact_support')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundFlight;
