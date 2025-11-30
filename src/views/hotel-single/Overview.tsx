import { useTranslations } from 'next-intl';

const Overview = ({
  descriptions,
}: {
  descriptions?: {
    title: string;
    description: string;
    language: string;
    line: number;
  }[];
}) => {
  const t = useTranslations('HotelSingle');

  return (
    <>
      <h3 className="text-22 fw-500 pt-40 border-top-light">{t('overview')}</h3>
      <div className="container">
        {descriptions?.map((des) => (
          <div key={des.line} className="row align-items-center mb-2">
            <div className="col-auto">
              <i className="icon-check text-15" />
            </div>
            <div className="col px-0">
              <div className="text-15">{des.description}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Overview;
