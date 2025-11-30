import Sidebar from '../common/Sidebar';
import Header from '../../header/dashboard-header';
import Footer from '../common/Footer';
import BookingTable from './components/BookingTable';
import { useTranslations } from 'next-intl';

const UserBooking = () => {
  const t = useTranslations('Profile.booking');

  return (
    <>
      <div className="header-margin"></div>

      <Header />

      <div className="dashboard" style={{ fontSize: '14px' }}>
        <div
          className="dashboard__sidebar bg-white scroll-bar-1"
          style={{ paddingTop: '20px' }}
        >
          <Sidebar />
        </div>

        <div className="dashboard__main">
          <div
            className="dashboard__content bg-light-2"
            style={{ minHeight: '90vh' }}
          >
            <div className="row y-gap-20 justify-between items-end pb-5">
              <div className="col-12">
                <h1 className="text-20 fw-600">{t('booking_history')}</h1>
                <div className="text-12 text-light-1">
                  {t('booking_description')}
                </div>
              </div>
            </div>

            <div className="py-30 px-30 rounded-4 bg-white shadow-3">
              <BookingTable />
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBooking;
