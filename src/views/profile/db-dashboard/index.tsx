import DashboardCard from './components/DashboardCard';
import Sidebar from '../common/Sidebar';
import Header from '../../header/dashboard-header';
import ChartSelect from './components/ChartSelect';
import ChartMain from './components/ChartMain';
import { Link } from '@/i18n/navigation';
import RecentBooking from './components/RercentBooking';
import Footer from '../common/Footer';
import { useTranslations } from 'next-intl';

const Dashboard = () => {
  const t = useTranslations('Profile.dashboard');

  return (
    <>
      <div className="header-margin"></div>

      <Header />

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
              <div className="col-12">
                <h1 className="text-30 lh-14 fw-600">{t('dashboard')}</h1>
                <div className="text-15 text-light-1">
                  {t('dashboard_description')}
                </div>
              </div>
            </div>

            <DashboardCard />

            <div className="row y-gap-30 pt-20 chart_responsive">
              <div className="col-xl-7 col-md-6">
                <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                  <div className="d-flex justify-between items-center">
                    <h2 className="text-18 lh-1 fw-500">
                      {t('earning_statistics')}
                    </h2>
                    <ChartSelect />
                  </div>

                  <div className="pt-30">
                    <ChartMain />
                  </div>
                </div>
              </div>

              <div className="col-xl-5 col-md-6">
                <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                  <div className="d-flex justify-between items-center">
                    <h2 className="text-18 lh-1 fw-500">
                      {t('recent_bookings')}
                    </h2>
                    <div>
                      <Link
                        href="#"
                        className="text-14 text-blue-1 fw-500 underline"
                      >
                        {t('view_all')}
                      </Link>
                    </div>
                  </div>
                  <RecentBooking />
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
