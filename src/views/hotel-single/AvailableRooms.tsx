import { Link, usePathname } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { packageTypes } from '@/types/app/packageTypes';
import ViewPrice from '@/components/parts/ViewPrice';
import { useState } from 'react';
import CancellationPrivacy from './CancellationPrivacy';

const AvailableRooms = ({
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
  const handleShowCancellationPolicy = (pkg: packageTypes) => {
    setSelectedPackage(pkg);
    setShowCancellationPolicy(true);
  };
  const [selectedRoom, setSelectedRoom] = useState<{
    name: string;
    description: string;
  } | null>(null);

  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<packageTypes | null>();
  return (
    <div className="pt-5 pb-5 container-fluid">
      <h2 className="display-6 fw-bold text-center mb-4">
        {t('available_rooms')}
      </h2>
      <div className="row g-4 pt-3">
        {hotel?.packages?.map((pkg, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div
              className="card h-100 position-relative overflow-hidden"
              style={{ borderRadius: '1rem' }}
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
                  </div>

                  <div className="card-body p-4 d-flex flex-column flex-grow-1">
                    {/* Main content */}
                    <div className="mb-3 w-full">
                      <h3 className="h5 fw-bold mb-1">{room.roomName}</h3>
                      <div className="w-full d-flex justify-content-between align-items-center">
                        <div className="w-full">
                          <p className="text-muted">{room.roomClass}</p>
                        </div>
                        {room.descriptions && (
                          <div className="w-full">
                            <button
                              className="btn btn-link p-0 text-primary text-decoration-none"
                              onClick={() =>
                                setSelectedRoom({
                                  name: room.roomName as string,
                                  description: room?.descriptions as string,
                                })
                              }
                            >
                              <i className="icon-info-circle me-1"></i>
                              {t('show_more')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-flex align-items-center py-3 border-top">
                      <div className="d-flex align-items-center">
                        <i className="icon-man fs-5 text-primary me-2"></i>
                        <span>
                          {room.adultsCount} {t('adults')}
                        </span>
                      </div>
                      {room.kidsAges && room.kidsAges.length > 0 && (
                        <div className="d-flex align-items-center ms-3">
                          <i className="icon-child fs-5 text-primary me-2"></i>
                          <span>
                            {room.kidsAges.length} {t('children')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Room features badges using Bootstrap badges */}
                    <div className="py-3 d-flex flex-wrap gap-2 border-top">
                      <span className="badge bg-dark fw-normal p-2">
                        <i className="icon-bed me-1"></i> {room.roomType}
                      </span>
                      {room.roomBasis && (
                        <span className="badge bg-primary fw-normal p-2">
                          <i className="icon-food me-1"></i> {room.roomBasis}
                        </span>
                      )}
                    </div>

                    <div className="py-3 border-top">
                      {pkg.refundability === 1 ? (
                        <div className="d-flex align-items-center text-success d-flex justify-content-between">
                          <div>
                            {pkg.refundableText && (
                              <p className="small text-suceess mb-0">
                                {pkg.refundableText}
                              </p>
                            )}
                          </div>
                          <button
                            className="btn btn-link p-0 text-decoration-none text-success"
                            onClick={() => handleShowCancellationPolicy(pkg)}
                          >
                            <span className="small">{t('privacy_policy')}</span>
                            <span className="ms-1 me-0">
                              <i
                                className={`icon-chevron-${pathname.startsWith('/ar') ? 'right' : 'left'} small`}
                              ></i>
                            </span>
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center text-danger d-flex justify-content-between">
                          <p className="text-danger">{t('not_refundable')}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-auto border-top pt-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <ViewPrice
                          finalPrice={Number(room?.price?.finalPrice)}
                        />

                        {!isPreview && (
                          <Link
                            href={`${pathname}/book/${pkg?.packageId}/${pkg?.rooms?.[0]?.id}`}
                            onClick={() => onReserveNow(pkg)}
                          >
                            <button className="btn btn-primary rounded-pill">
                              {t('reserve_now')}{' '}
                              <i className="icon-arrow-top-right ms-1 small"></i>
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for detailed room description */}
      {selectedRoom && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedRoom(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: '1rem' }}
            >
              <div className="modal-header bg-light d-flex align-items-center justify-content-between">
                <h5 className="modal-title fw-bold">{selectedRoom.name}</h5>
                <button
                  type="button"
                  className="btn-close m-0"
                  onClick={() => setSelectedRoom(null)}
                />
              </div>
              <div className="modal-body p-4">
                <div
                  className="description-content"
                  dangerouslySetInnerHTML={{ __html: selectedRoom.description }}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill"
                  onClick={() => setSelectedRoom(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for cancellation policy */}
      {showCancellationPolicy && (
        <CancellationPrivacy
          setShowCancellationPolicy={setShowCancellationPolicy}
          selectedPackage={selectedPackage as packageTypes}
        />
      )}
    </div>
  );
};

export default AvailableRooms;
