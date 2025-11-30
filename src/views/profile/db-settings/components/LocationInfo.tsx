import { useTranslations } from 'next-intl';

const LocationInfo = () => {
  const t = useTranslations('Profile.settings.location');

  return (
    <form className="col-xl-9">
      <div className="row x-gap-20 y-gap-20">
        <div className="col-12">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">
              {t('address_line_1')}
            </label>
          </div>
        </div>
        {/* End col-12 */}

        <div className="col-12">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">
              {t('address_line_2')}
            </label>
          </div>
        </div>
        {/* End col-12 */}

        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">{t('city')}</label>
          </div>
        </div>
        {/* End col-6 */}

        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">{t('state')}</label>
          </div>
        </div>
        {/* End col-6 */}

        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">
              {t('select_country')}
            </label>
          </div>
        </div>
        {/* End col-6 */}

        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">{t('zip_code')}</label>
          </div>
        </div>
        {/* End col-6 */}

        <div className="col-12">
          <div className="d-inline-block">
            <button
              type="submit"
              className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
            >
              {t('save_changes')} <div className="icon-arrow-top-right ml-15" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LocationInfo;
