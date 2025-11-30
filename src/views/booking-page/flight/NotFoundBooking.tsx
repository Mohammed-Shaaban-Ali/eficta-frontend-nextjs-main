import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const NotFoundBooking = () => {
  const t = useTranslations('BookingPage.not_found');
  const data = {
    imageSrc: '/img/general/not-found-booking.png',
    title: t('title'),
    description: t('description'),
    buttonLabel: t('new_search'),
    buttonUrl: '/',
  };

  return (
    <section className="layout-pt-lg layout-pb-lg">
      <div className="container">
        <div className="row y-gap-30 justify-between items-center">
          <div className="col-12 col-sm-12 col-lg-5">
            <img
              src={data.imageSrc}
              alt="booking not found"
              className="img-fluid w-100"
            />
          </div>
          <div className="col-lg-5">
            <div className="no-page">
              <div className="no-page__title">
                <span className="text-blue-1">!</span>
              </div>
              <h2 className="text-30 fw-600">{data.title}</h2>
              <div className="pr-30 mt-5">{data.description}</div>
              <div className="d-inline-block mt-40 md:mt-20">
                <Link
                  href={data.buttonUrl}
                  className="button -md -dark-1 bg-blue-1 text-white"
                >
                  {data.buttonLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundBooking;
