'use client';

import { useState } from 'react';
import Pagination from '../../common/Pagination';
import Properties from './Properties';
import { useTranslations } from 'next-intl';

const WishlistTable = () => {
  const t = useTranslations('Profile.wishlist');
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const tabItems = [
    t('hotel'),
    t('tour'),
    t('activity'),
    t('holiday_rental'),
    t('cars'),
    t('cruiser'),
  ];

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
          {tabItems.map((item, index) => (
            <div className="col-auto" key={index}>
              <button
                className={`tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button ${
                  activeTab === index ? 'is-tab-el-active' : ''
                }`}
                onClick={() => handleTabClick(index)}
              >
                {item}
              </button>
            </div>
          ))}
        </div>
        {/* End tabs */}

        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            <div className="row y-gap-20">
              <Properties />
            </div>
          </div>
        </div>
      </div>
      <Pagination
        onPageChange={(page) => console.log(page)}
        currentPage={1}
        totalPages={10}
      />
    </>
  );
};

export default WishlistTable;
