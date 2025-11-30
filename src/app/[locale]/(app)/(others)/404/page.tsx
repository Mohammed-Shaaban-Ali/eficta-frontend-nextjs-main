import CallToActions from '@/views/common/CallToActions';
import DefaultHeader from '@/views/header/default-header';
import Footer from '@/components/layout/Footer';
import NotFound from '@/views/common/NotFound';

export const metadata = {
  title: '404 || Efica ',
  description: 'Efica ',
};

const Index = () => {
  return (
    <>
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <DefaultHeader />
      {/* End Header 1 */}

      <NotFound />
      {/* End 404 section */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <Footer />
      {/* End Call To Actions Section */}
    </>
  );
};

export default Index;
