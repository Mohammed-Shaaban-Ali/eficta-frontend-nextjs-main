import { Link, usePathname } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { packageTypes } from '@/types/app/packageTypes';
import { useRef } from 'react';

const AvailableRooms2 = ({
  hotel,
  isPreview = false,
}: {
  hotel: { packages: packageTypes[] };
  isPreview?: boolean;
}) => {
  const t = useTranslations('HotelSingle');
  const onReserveNow = (pkg: packageTypes) => {
    localStorage.setItem('package', JSON.stringify(pkg));
  };
  const pathname = usePathname();
  const formatRefundableDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const packagesSwiperRef = useRef<any>(null);

  return (
    <div className="pt-5 pb-5 container-fluid mb-4">
      <h2 className="display-6 fw-bold text-center mb-4">
        {t('available_rooms')}
      </h2>

      <div className="position-relative package-swiper-container mt-4 mb-5">
        <Swiper
          onBeforeInit={(swiper) => {
            packagesSwiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination, EffectCoverflow]}
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ clickable: true, dynamicBullets: true }}
          loop={hotel?.packages?.length > 3}
          centeredSlides={true}
          effect={'coverflow'}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
          }}
          className="package-swiper py-5"
        >
          {hotel?.packages?.map((pkg, index) => (
            <SwiperSlide key={index}>
              <div
                className="card h-100 position-relative overflow-hidden shadow-sm"
                style={{ borderRadius: '1.25rem', transition: 'all 0.3s ease' }}
              >
                {pkg?.rooms?.map((room, roomIndex) => (
                  <div key={roomIndex} className="d-flex flex-column h-100">
                    <div className="position-relative">
                      {room.images && room.images.length > 0 ? (
                        <Swiper
                          modules={[Navigation, Pagination]}
                          navigation
                          pagination={{ clickable: true }}
                          className="w-100"
                          style={{ height: '250px' }}
                        >
                          {room.images.map((image, imgIndex) => (
                            <SwiperSlide key={imgIndex}>
                              <Image
                                width={400}
                                height={250}
                                src={image || '/img/backgrounds/1.png'}
                                alt={`${room.roomName} - image ${imgIndex + 1}`}
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        <Image
                          width={400}
                          height={250}
                          src="/img/backgrounds/1.png"
                          alt={room.roomName as string}
                          className="w-100"
                          style={{ height: '250px', objectFit: 'cover' }}
                        />
                      )}

                      {/* Room features badges */}
                      <div className="position-absolute bottom-0 start-0 p-3 d-flex flex-wrap gap-2">
                        <span className="badge bg-dark fw-normal p-2">
                          <i className="icon-bed me-1"></i> {room.roomType}
                        </span>
                        {room.roomBasis && (
                          <span className="badge bg-primary fw-normal p-2">
                            <i className="icon-food me-1"></i> {room.roomBasis}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card body content remains mostly the same */}
                    <div className="card-body p-4 d-flex flex-column flex-grow-1">
                      {/* Main content */}
                      <div className="mb-3">
                        <h3 className="h5 fw-bold mb-1">{room.roomName}</h3>
                        <p className="text-muted mb-2">{room.roomClass}</p>
                      </div>

                      <div className="d-flex align-items-center mb-3 py-3 border-top border-bottom">
                        <div className="d-flex align-items-center">
                          <i className="icon-man fs-5 text-primary me-2"></i>
                          <span>
                            {room.adultsCount} {t('adults')}
                          </span>
                        </div>
                        {room.kidsAges && room.kidsAges.length > 0 && (
                          <div className="d-flex align-items-center">
                            <i className="icon-child fs-5 text-primary me-2"></i>
                            <span>
                              {room.kidsAges.length} {t('children')}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <div className="mb-3">
                          {pkg.refundability === 1 && (
                            <div className="d-flex align-items-center text-success">
                              <div>
                                {pkg.refundableText && (
                                  <p className="small text-danger mb-0">
                                    {pkg.refundableText}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <div className="d-flex align-items-center">
                              <span className="h4 fw-bold text-primary mb-0 mx-2">
                                {room?.price?.finalPrice?.toFixed(2)}
                              </span>
                              <img
                                src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg"
                                alt="Currency"
                                width={20}
                                height={20}
                              />
                            </div>
                            <p className="small text-muted">
                              {t('includes_taxes')}
                            </p>
                          </div>

                          {!isPreview && (
                            <Link
                              href={`${pathname}/book/${pkg?.packageId}/${pkg?.rooms?.[0]?.id}`}
                              onClick={() => onReserveNow(pkg)}
                            >
                              <button className="btn btn-primary rounded-pill">
                                {t('reserve_now')}{' '}
                                <i className="icon-arrow-top-right ms-1"></i>
                              </button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom navigation buttons */}
      <div className="d-flex justify-content-center gap-4 mt-4">
        <button
          className="btn btn-outline-primary rounded-circle p-3"
          onClick={() => packagesSwiperRef.current?.slidePrev()}
        >
          <i className="icon-arrow-left fs-5"></i>
        </button>
        <button
          className="btn btn-outline-primary rounded-circle p-3"
          onClick={() => packagesSwiperRef.current?.slideNext()}
        >
          <i className="icon-arrow-right fs-5"></i>
        </button>
      </div>
    </div>
  );
};

export default AvailableRooms2;
