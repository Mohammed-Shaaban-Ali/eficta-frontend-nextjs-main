import { useTranslations } from 'next-intl';

const DashboardCard = () => {
  const t = useTranslations('Profile.dashboard.cards');

  const data = [
    {
      title: t('pending.title'),
      amount: '$12,800',
      description: t('pending.description'),
      icon: '/img/dashboard/icons/1.svg',
    },
    {
      title: t('earnings.title'),
      amount: '$14,200',
      description: t('earnings.description'),
      icon: '/img/dashboard/icons/2.svg',
    },
    {
      title: t('bookings.title'),
      amount: '$8,100',
      description: t('bookings.description'),
      icon: '/img/dashboard/icons/3.svg',
    },
    {
      title: t('services.title'),
      amount: '22,786',
      description: t('services.description'),
      icon: '/img/dashboard/icons/4.svg',
    },
  ];

  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-3 col-md-6">
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div className="row y-gap-20 justify-between items-center">
              <div className="col-auto">
                <div className="fw-500 lh-14">{item.title}</div>
                <div className="text-26 lh-16 fw-600 mt-5">{item.amount}</div>
                <div className="text-15 lh-14 text-light-1 mt-5">
                  {item.description}
                </div>
              </div>
              <div className="col-auto">
                <img src={item.icon} alt="icon" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;
