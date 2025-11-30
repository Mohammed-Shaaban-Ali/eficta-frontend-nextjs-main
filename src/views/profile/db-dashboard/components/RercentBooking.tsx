import { useTranslations } from 'next-intl';

const RercentBooking = () => {
  const t = useTranslations('Profile.dashboard.recent_booking');

  const data = [
    {
      item: t('item.new_york'),
      description: t('description.discover_america'),
      total: '$130',
      paid: '$0',
      status: {
        color: 'yellow-4',
        text: 'yellow-3',
        label: t('status.pending'),
      },
      createdAt: '04/04/2022 08:16',
    },
    {
      item: t('item.new_york'),
      description: t('description.discover_america'),
      total: '$130',
      paid: '$0',
      status: {
        color: 'blue-1-05',
        text: 'blue-1',
        label: t('status.confirmed'),
      },
      createdAt: '04/04/2022 08:16',
    },
    {
      item: t('item.new_york'),
      description: t('description.discover_america'),
      total: '$130',
      paid: '$0',
      status: { color: 'red-3', text: 'red-2', label: t('status.rejected') },
      createdAt: '04/04/2022 08:16',
    },
    {
      item: t('item.new_york'),
      description: t('description.discover_america'),
      total: '$130',
      paid: '$0',
      status: {
        color: 'blue-1-05',
        text: 'blue-1',
        label: t('status.confirmed'),
      },
      createdAt: '04/04/2022 08:16',
    },
    {
      item: t('item.new_york'),
      description: t('description.discover_america'),
      total: '$130',
      paid: '$0',
      status: {
        color: 'blue-1-05',
        text: 'blue-1',
        label: t('status.confirmed'),
      },
      createdAt: '04/04/2022 08:16',
    },
  ];
  return (
    <div className="overflow-scroll scroll-bar-1 pt-30">
      <table className="table-2 col-12">
        <thead>
          <tr>
            <th>#</th>
            <th>{t('table.item')}</th>
            <th>{t('table.total')}</th>
            <th>{t('table.paid')}</th>
            <th>{t('table.status')}</th>
            <th>{t('table.created_at')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {row.item}
                <br /> {row.description}
              </td>
              <td className="fw-500">{row.total}</td>
              <td>{row.paid}</td>
              <td>
                <div
                  className={`rounded-100 py-4 text-center col-12 text-14 fw-500 bg-${row.status.color} text-${row.status.text}`}
                >
                  {row.status.label}
                </div>
              </td>
              <td>{row.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RercentBooking;
