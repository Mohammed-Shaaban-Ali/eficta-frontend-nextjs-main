import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import {
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaRegCalendarCheck,
} from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const HotelCard = ({ hotel, Uuid }: any) => {
  const t = useTranslations('HotelList.hotel_card');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  const OnSeaAvailability = () => {
    localStorage.setItem('hotel', JSON.stringify(hotel));
  };

  return (
    <div className="col-12 mb-4" key={hotel?.id}>
      <div className="card border-top-light mb-10 overflow-hidden">
        <div className="row g-0">
          {/* Hotel Image Section */}
          <div className="col-md-4 position-relative p-0">
            <div className="h-100" style={{ minHeight: '240px' }}>
              <Image
                width={500}
                height={350}
                className="img-fluid h-100 w-100 object-fit-cover"
                src={
                  hotel?.defaultImage?.FullSize || '/img/hotels/placeholder.jpg'
                }
                alt={hotel?.displayName}
                priority
              />

              <button
                className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 w-20 shadow-sm"
                onClick={handleFavoriteClick}
                aria-label="Add to favorites"
              >
                <FaHeart
                  className={isFavorite ? 'text-danger' : 'text-secondary'}
                />
              </button>

              {hotel?.propertyType && (
                <span className="badge bg-info position-absolute bottom-0 start-0 m-3">
                  {hotel?.propertyType}
                </span>
              )}
            </div>
          </div>

          {/* Hotel Details Section */}
          <div className="col-md-8 p-0">
            <div className="card-body h-100 d-flex flex-column">
              <div className="row">
                <div className="col">
                  <h5 className="card-title fw-bold text-truncate mb-1">
                    {hotel?.displayName}
                  </h5>
                  <div className="">
                    {hotel?.starRating && Number(hotel?.starRating) > 0
                      ? [
                          ...Array(
                            Math.min(5, Math.floor(Number(hotel?.starRating))),
                          ),
                        ].map((_, i) => (
                          <FaStar key={i} className="text-warning me-1" />
                        ))
                      : null}
                  </div>
                </div>
                {hotel?.reviews?.score && (
                  <div className="col-auto">
                    <div className="d-flex flex-column align-items-end">
                      <div className="bg-primary text-white fw-bold rounded px-2 py-1">
                        {hotel?.reviews?.score}
                      </div>
                      <small className="text-muted">
                        {hotel?.reviews?.reviewsCount} {t('reviews')}
                      </small>
                    </div>
                  </div>
                )}
              </div>

              <div className="d-flex align-items-start mb-3">
                <FaMapMarkerAlt className="text-danger mt-1 me-2 flex-shrink-0" />
                <div className="w-100">
                  <div
                    className="card-text mb-1"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {hotel?.address}
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <Link
                      href={`https://www.google.com/maps?q=${hotel?.location?.latitude},${hotel?.location?.longitude}`}
                      className="text-primary small text-decoration-none d-inline-block text-start"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('show_on_map')} →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Facilities Section */}
              {hotel?.facilities?.length > 0 && (
                <div className="">
                  <div className="d-flex flex-wrap gap-1">
                    {hotel?.facilities
                      ?.slice(0, 5)
                      .map((facility: any, index: number) => (
                        <div key={index} className="d-flex align-items-center">
                          <img
                            src={facility?.icon}
                            alt={facility?.name}
                            className="img-fluid me-1"
                            style={{ width: '16px', height: '16px' }}
                          />
                          <small className="text-muted p-2">
                            {facility?.name}
                          </small>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Optional Badges */}
              <div className="d-flex flex-wrap gap-2">
                {hotel?.freeCancellation && (
                  <span className="badge bg-success-subtle text-success">
                    <FaRegCalendarCheck className="me-1" />
                    {t('free_cancellation')}
                  </span>
                )}
              </div>

              <div className="mt-auto px-10">
                <div className="d-flex justify-content-between align-items-center border-top pt-2">
                  <div>
                    <small className="text-muted d-block">
                      {t('price_starts_from')}
                    </small>
                    <div className="d-flex align-items-center">
                      <span className="fs-4 fw-bold text-primary">
                        {hotel?.price}
                      </span>
                      <img
                        src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg"
                        alt="Currency"
                        width={16}
                        height={16}
                        className="me-1"
                        style={{
                          filter:
                            'invert(32%) sepia(99%) saturate(1362%) hue-rotate(199deg) brightness(96%) contrast(96%)',
                        }}
                      />
                    </div>
                  </div>
                  <Link
                    href={`/hotel/${hotel.id}/${Uuid}`}
                    onClick={OnSeaAvailability}
                    className="btn btn-primary px-20"
                  >
                    {t('see_availability')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
