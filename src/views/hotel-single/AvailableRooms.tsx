import { Link, usePathname } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { packageTypes } from '@/types/app/packageTypes';
import ViewPrice from '@/components/parts/ViewPrice';
import { useState, useMemo } from 'react';
import CancellationPrivacy from './CancellationPrivacy';
import { FaUtensils, FaStar } from 'react-icons/fa';
import { MdBedroomParent } from 'react-icons/md';
import { IoMdBed } from 'react-icons/io';

interface GroupedPackage {
  key: string;
  packages: packageTypes[];
  lowestPricePackage: packageTypes;
}

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

  const [selectedRoom, setSelectedRoom] = useState<{
    name: string;
    description: string;
  } | null>(null);

  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<packageTypes | null>();
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);

  // Group packages by room type and room name
  const groupedPackages = useMemo(() => {
    if (!hotel?.packages) return [];

    const groupsMap = new Map<string, packageTypes[]>();

    hotel.packages.forEach((pkg) => {
      if (!pkg.rooms || pkg.rooms.length === 0) return;

      // Create a key from all rooms in the package (roomType + roomName)
      const roomKeys = pkg.rooms
        .map((room) => `${room.roomType || ''}-${room.roomName || ''}`)
        .sort()
        .join('|');

      if (!groupsMap.has(roomKeys)) {
        groupsMap.set(roomKeys, []);
      }
      groupsMap.get(roomKeys)?.push(pkg);
    });

    // Convert to array and find lowest price package for each group
    const grouped: GroupedPackage[] = Array.from(groupsMap.entries()).map(
      ([key, packages]) => {
        // Find package with lowest price
        const lowestPricePackage = packages.reduce((lowest, current) => {
          const lowestPrice = lowest.price?.finalPrice || Infinity;
          const currentPrice = current.price?.finalPrice || Infinity;
          return currentPrice < lowestPrice ? current : lowest;
        }, packages[0]);

        return {
          key,
          packages,
          lowestPricePackage,
        };
      },
    );

    return grouped;
  }, [hotel?.packages]);

  // Get packages for selected group key
  const selectedGroupPackages = useMemo(() => {
    if (!selectedGroupKey) return [];
    return (
      groupedPackages.find((group) => group.key === selectedGroupKey)
        ?.packages || []
    );
  }, [selectedGroupKey, groupedPackages]);

  const handleCustomizeRoom = (groupKey: string) => {
    setSelectedGroupKey(groupKey);
    setShowCustomizeDialog(true);
  };

  return (
    <div className="pt-5 pb-5 container-fluid">
      <h2 className="display-6 fw-bold text-center mb-4">
        {t('available_rooms')}
      </h2>
      <div className="row g-4 pt-3">
        {groupedPackages.map((group, groupIndex) => {
          const pkg = group.lowestPricePackage;
          const packageImages =
            pkg.images && pkg.images.length > 0
              ? pkg.images
              : pkg.rooms?.[0]?.images || [];

          return (
            <div key={groupIndex} className="col-md-6 col-lg-4">
              <div
                className="card h-100 position-relative overflow-hidden"
                style={{ borderRadius: '1rem' }}
              >
                {/* Package Images - displayed once at the top */}
                <div className="position-relative">
                  {packageImages.length > 0 ? (
                    <Swiper
                      modules={[Navigation, Pagination]}
                      navigation
                      pagination={{ clickable: true }}
                      className="w-100"
                      style={{ height: '250px' }}
                    >
                      {packageImages.map((image, imgIndex) => (
                        <SwiperSlide key={imgIndex}>
                          <Image
                            width={400}
                            height={250}
                            src={image || '/img/backgrounds/1.png'}
                            alt={`Package image ${imgIndex + 1}`}
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
                      alt="Package"
                      className="w-100"
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                  )}
                </div>

                <div className="card-body p-3 d-flex flex-column grow">
                  {/* Price Display */}
                  <div className="mb-3 border-bottom pb-2">
                    <ViewPrice
                      finalPrice={Number(pkg?.price?.finalPrice || 0)}
                    />
                  </div>

                  {/* All Rooms Display - Accordion */}
                  <div className="mb-3">
                    {pkg?.rooms?.map((room, roomIndex) => {
                      return (
                        <div
                          key={roomIndex}
                          className="border rounded mb-2 overflow-hidden"
                        >
                          <button
                            className={`w-100 btn btn-link text-decoration-none text-start p-2 d-flex justify-content-between
                              transition-all! duration-300! gap-4! ease-in-out!
                              hover:bg-gray-100!
                            
                               align-items-start`}
                            type="button"
                            onClick={() =>
                              setSelectedRoom({
                                name: room.roomName as string,
                                description: room?.descriptions as string,
                              })
                            }
                          >
                            <div className="">
                              <span
                                className="fw-medium text-[14px]! text-black/90!"
                                style={{ fontSize: '14px' }}
                              >
                                {room.roomName}
                              </span>
                              <span
                                className="text-[13px]! text-black/60! ms-2"
                                style={{ fontSize: '13px' }}
                              >
                                {room.roomType}
                              </span>
                            </div>
                            <div className="d-flex align-items-center text-nowrap gap-1.5!">
                              <i className="icon-man fs-6 text-primary"></i>
                              <span className="small text-muted">
                                {room.adultsCount} {t('adults')}
                              </span>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto border-top pt-3">
                    <div className="d-flex gap-2">
                      {!isPreview && (
                        <Link
                          href={`${pathname}/book/${pkg?.packageId}/${pkg?.rooms?.[0]?.id}`}
                          onClick={() => onReserveNow(pkg)}
                          className="flex-fill"
                        >
                          <button className="btn btn-primary rounded-pill w-100">
                            {t('reserve_now')}{' '}
                            <i className="icon-arrow-top-right ms-1 small"></i>
                          </button>
                        </Link>
                      )}
                      {group.packages.length > 1 && (
                        <button
                          className="btn btn-outline-primary rounded-pill flex-fill"
                          onClick={() => handleCustomizeRoom(group.key)}
                        >
                          {t('customize_room')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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

      {/* Customize Room Dialog */}
      {showCustomizeDialog && selectedGroupKey && (
        <div
          className="modal fade show "
          style={{
            display: 'block',
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setShowCustomizeDialog(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable "
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content border-0 shadow-lg max-w-[800px]! mx-auto!"
              style={{ borderRadius: '1rem' }}
            >
              <div className="modal-header bg-primary text-white d-flex align-items-center justify-content-between">
                <h5 className="modal-title fw-bold">{t('customize_room')}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white m-0"
                  onClick={() => setShowCustomizeDialog(false)}
                />
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  {selectedGroupPackages.map((pkg, pkgIndex) => (
                    <div key={pkgIndex} className="col-12">
                      <div className="card border ">
                        <div className="card-body p-3">
                          {/* Package Price and Refund Text */}
                          <div className="d-flex justify-content-between align-items-start mb-2.5! pb-2 border-bottom">
                            <div>
                              <ViewPrice
                                finalPrice={Number(pkg?.price?.finalPrice || 0)}
                              />
                            </div>
                            <div className="text-end">
                              {pkg.refundability === 1 ? (
                                <p className="text-success small mb-0">
                                  {pkg.refundableText}
                                </p>
                              ) : (
                                <p className="text-danger small mb-0">
                                  {pkg.refundableText || t('not_refundable')}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* All Rooms in Package */}
                          <div>
                            <h6 className="fw-bold mb-2">Rooms</h6>
                            <div className="row g-3 ">
                              {pkg?.rooms?.map((room, roomIndex) => (
                                <div key={roomIndex} className="col-12">
                                  <div className="p-2.5! bg-gray-50! border! border-gray-200! rounded">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                      <div>
                                        <p className="font-medium! text-[15px]!  mb-1">
                                          {room.roomName}
                                        </p>
                                      </div>
                                      <div className="text-end">
                                        <div className="d-flex align-items-center">
                                          <i className="icon-man fs-6 text-primary me-1"></i>
                                          <span className="small">
                                            {room.adultsCount} {t('adults')}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                      {room.roomType && (
                                        <span
                                          className="flex items-center justify-center text-[13px] text-black/70
                                         gap-1.5 bg-gray-200 rounded px-2.5 py-0.5 border! border-gray-400"
                                        >
                                          <IoMdBed className="text-[14px]! " />

                                          {room.roomType}
                                        </span>
                                      )}
                                      {room.roomBasis && (
                                        <span
                                          className="flex items-center justify-center text-[13px]
                                         text-white gap-1.5 bg-primary rounded px-2.5 py-0.5 font-normal"
                                        >
                                          <FaUtensils className="text-[12px]" />
                                          {room.roomBasis}
                                        </span>
                                      )}

                                      {room.roomClass && (
                                        <span className="flex items-center justify-center text-[13px] text-white gap-1.5 bg-gray-800 rounded px-2.5 py-0.5 font-normal">
                                          <FaStar className="text-[12px]" />
                                          {room.roomClass}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Reserve Button */}
                          {!isPreview && (
                            <div className="mt-3 pt-3 border-top">
                              <Link
                                href={`${pathname}/book/${pkg?.packageId}/${pkg?.rooms?.[0]?.id}`}
                                onClick={() => {
                                  onReserveNow(pkg);
                                  setShowCustomizeDialog(false);
                                }}
                              >
                                <button className="btn btn-primary rounded-pill w-100">
                                  {t('reserve_now')}{' '}
                                  <i className="icon-arrow-top-right ms-1 small"></i>
                                </button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill"
                  onClick={() => setShowCustomizeDialog(false)}
                >
                  {t('cancellation_modal.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableRooms;
