'use client';

import { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PricingSummary from './sidebar/PricingSummary';
import PaymentSchedule from './sidebar/PaymentSchedule';
import PromoCode from './sidebar/PromoCode';
import RatingInfo from './RatingInfo';
import { useTranslations } from 'next-intl';

const PaymentInfo = () => {
  const t = useTranslations('BookingPage.payment_info');
  const [itemsTabs, setItemsTabs] = useState(1);
  const cardTabs = [
    { id: 1, name: t('credit_debit') },
    { id: 2, name: t('diefical_payment') },
  ];

  return (
    <>
      <div className="col-xl-7 col-lg-8">
        <RatingInfo />
        <div className="mt-40">
          <h3 className="text-22 fw-500 mb-20">{t('how_to_pay')}</h3>
          <Tabs>
            <TabList className="row y-gap-20 x-gap-20">
              {cardTabs.map((item) => (
                <Tab
                  className="col-auto"
                  onClick={() => setItemsTabs(item.id)}
                  key={item.id}
                >
                  <button
                    className={
                      itemsTabs === item.id
                        ? 'button -dark-1 bg-blue-1 text-white px-20 py-15'
                        : 'button -blue-1 bg-light-2 px-20 py-15'
                    }
                  >
                    {item.name}
                  </button>
                </Tab>
              ))}
            </TabList>
            {/* End tablist */}

            <TabPanel>
              <div className="row x-gap-20 y-gap-20 pt-20">
                <div className="col-12">
                  <div className="form-input ">
                    <input type="text" required />
                    <label className="lh-1 text-16 text-light-1">
                      {t('select_payment')}
                    </label>
                  </div>
                </div>
                {/* End col */}

                <div className="col-md-6">
                  <div className="form-input ">
                    <input type="text" required />
                    <label className="lh-1 text-16 text-light-1">
                      {t('card_holder')}
                    </label>
                  </div>

                  <div className="form-input mt-20">
                    <input type="text" required />
                    <label className="lh-1 text-16 text-light-1">
                      {t('card_number')}
                    </label>
                  </div>

                  <div className="row x-gap-20 y-gap-20 pt-20">
                    <div className="col-md-6">
                      <div className="form-input ">
                        <input type="text" required />
                        <label className="lh-1 text-16 text-light-1">
                          {t('expiry_date')}
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-input ">
                        <input type="text" required />
                        <label className="lh-1 text-16 text-light-1">
                          {t('cvc')}
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* End .row */}
                </div>
                {/* End col */}
                <div className="col-md-6">
                  <img
                    src="/img/booking-pages/card.png"
                    alt="image"
                    className="h-full"
                  />
                </div>
                {/* End col */}
              </div>
              {/* End .row */}
            </TabPanel>
            {/* credit debit info */}

            <TabPanel>
              <div className="mt-60 md:mt-32">
                <div className="mt-20">
                  <div className="form-input ">
                    <input type="text" required />
                    <label className="lh-1 text-16 text-light-1">
                      {t('select_payment')}
                    </label>
                  </div>
                </div>
                <div className="mt-20">
                  <ul className="list-disc y-gap-4 text-15 text-light-1">
                    <li>{t('paypal_message')}</li>
                    <li>{t('total_amount')}: $2,338.01</li>
                  </ul>
                </div>
              </div>
              {/* End mt60 */}
            </TabPanel>
            {/* End diefical payment */}
          </Tabs>
        </div>
        {/* End mt-40 */}

        <div className="w-full h-1 bg-border mt-40 mb-40" />

        <div className="row y-gap-20 items-center justify-between">
          {' '}
          <div className="col-auto">
            <div className="form-checkbox d-flex items-center">
              <input type="checkbox" name="name" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              {/* <div className="text-14 lh-10 text-light-1 ml-10">
                {t('members_only_deals')}
              </div> */}
            </div>
          </div>
          {/* End col-auto */}
        </div>
        {/* End terms and conditons */}
      </div>
      {/* End payment details */}

      <div className="col-xl-5 col-lg-4">
        <div className="booking-sidebar">
          <PricingSummary />
          <PaymentSchedule />
          <PromoCode />
        </div>
      </div>
      {/* payment sidebar info */}
    </>
  );
};

export default PaymentInfo;
