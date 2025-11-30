import CallToActions from '@/views/common/CallToActions';
import DefaultHeader from '@/views/header/default-header';
import Footer from '@/components/layout/Footer';
import TermsConent from '@/views/common/TermsConent';

export const metadata = {
  title: 'Terms & Conditions || Efica ',
  description: 'Efica ',
};

const Terms = () => {
  return (
    <>
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <DefaultHeader />
      {/* End Header 1 */}

      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="tabs js-tabs">
            <TermsConent />
          </div>
        </div>
      </section>
      {/* End terms section */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <Footer />
      {/* End Call To Actions Section */}
    </>
  );
};

export default Terms;
