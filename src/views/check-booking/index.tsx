'use client';
import MainFilterSearchBox from './MainFilterSearchBox';
import { useTranslations } from 'next-intl';

const CheckBooking = () => {
  const t = useTranslations('CheckBooking');

  return (
    <section className="masthead -type-10">
      <div className="container-1500">
        <div className="row">
          <div className="flex-none">
            <div className="masthead__content">
              <h1
                className="text-60 lg:text-40 sm:text-30"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {t('title')}
              </h1>
              <p className="mt-5" data-aos="fade-up" data-aos-delay="200">
                {t('description')}
              </p>
              <div data-aos="fade-up" data-aos-delay="300">
                <MainFilterSearchBox />
              </div>
            </div>
          </div>
        </div>

        <div
          className="masthead__image"
          data-aos="fade-left"
          data-aos-delay="500"
        >
          <div className="row y-gap-30 flex-nowrap">
            <div className="col-auto">
              <img
                src="/img/masthead/10/1.png"
                alt="image"
                className="rounded-16"
              />
            </div>

            <div className="col-auto">
              <img
                src="/img/masthead/10/2.png"
                alt="image"
                className="rounded-16"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckBooking;
