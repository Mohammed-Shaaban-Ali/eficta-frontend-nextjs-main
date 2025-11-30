'use client';

import { Gallery, Item } from 'react-photoswipe-gallery';
import { Link } from '@/i18n/navigation';
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import ViewRating from '@/components/parts/ViewRating';
import ViewPrice from '@/components/parts/ViewPrice';

export default function GalleryOne({ hotel }: any) {
  const [isOpen, setOpen] = useState(false);
  const t = useTranslations('HotelSingle');
  const tSidebar = useTranslations('HotelSingle.sidebar');

  const limitedGallery = hotel?.gallery?.slice(0, 5) || [];
  const allImages = hotel?.gallery || [];

  return (
    <>
      <section className="pt-40">
        <div className="container">
          {/* Hotel Header */}
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="row x-gap-20 items-center d-flex justify-between">
                <div className="col-auto">
                  <h1 className="text-30 sm:text-25 fw-600">
                    {hotel?.displayName}
                  </h1>
                </div>
                <ViewRating selectedHotel={hotel} />
              </div>

              <div className="row x-gap-20 y-gap-20 items-center">
                <div className="col-auto">
                  <div className="d-flex items-center text-15 text-light-1">
                    <i className="icon-location-2 text-16 mr-5" />
                    {hotel?.address}
                  </div>
                </div>
                {/* <div className="col-auto">
                  <Link
                    href={`https://www.google.com/maps?q=${hotel?.location?.latitude},${hotel?.location?.longitude}`}
                    className="btn btn-link btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tSidebar('show_on_map')}
                  </Link>
                </div> */}
                {/* {hotel?.reviews && (
                  <div className="col-auto">
                    <div className="d-flex items-center">
                      <div className="text-14 text-dark-1">
                        <span className="fw-500">{hotel.reviews.score}</span>{' '}
                        {hotel.reviews.scoreDescription}
                      </div>
                      <div className="text-14 text-light-1 ml-10">
                        ({hotel.reviews.reviewsCount} {tSidebar('guest_rating')}
                        )
                      </div>
                    </div>
                  </div>
                )} */}
              </div>
            </div>

            <div className="col-auto">
              <div className="row x-gap-15 y-gap-15 items-center">
                <div className="col-auto">
                <ViewPrice finalPrice={hotel?.price}/>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <Gallery>
            <div className="galleryGrid -type-1 pt-30">
              {limitedGallery.map((image: string, index: number) => (
                <div
                  key={index}
                  className={`galleryGrid__item${index === 0 ? ' relative d-flex' : ''}`}
                >
                  <Item
                    original={allImages[index]}
                    thumbnail={allImages[index]}
                    width={index === 0 ? 660 : 450}
                    height={index === 0 ? 660 : 375}
                  >
                    {({ ref, open }) => (
                      <>
                        {/* See All Photos ABOVE the first image */}
                        {index === 0 && (
                          <div className="absolute bottom-0 right-0 z-10 p-2">
                            <Item
                              original={allImages[0]}
                              thumbnail={allImages[0]}
                              width={660}
                              height={660}
                            >
                              {({ open: openGallery }) => (
                                <button
                                  onClick={open}
                                  className="button -blue-1 px-24 py-15 bg-white text-dark-1"
                                  role="button"
                                >
                                  {t('gallery.see_all_photos')}
                                </button>
                              )}
                            </Item>
                          </div>
                        )}

                        <img
                          src={image}
                          ref={ref}
                          onClick={open}
                          alt={`Hotel image ${index + 1}`}
                          role="button"
                          className="rounded-4"
                        />
                      </>
                    )}
                  </Item>
                </div>
              ))}
            </div>
          </Gallery>
        </div>
      </section>
    </>
  );
}
