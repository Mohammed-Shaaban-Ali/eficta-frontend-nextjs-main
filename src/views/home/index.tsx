'use client';
import BlockGuide from '@/views/block/BlockGuide';
import Hero1 from '@/views/home/hero';
import Blog from '@/views/blog/Blog3';
import Hotels from '@/views/hotels/Hotels';
import AddBanner from '@/views/add-banner/AddBanner';
import CallToActions from '@/views/common/CallToActions';
import Destinations from '@/views/home/Destinations';
import Testimonial from '@/views/home/Testimonial';
import TestimonialLeftCol from '@/views/home/TestimonialLeftCol';
import SelectFilter from '@/views/hotels/filter-tabs/SelectFilter';
import { useTranslations } from 'next-intl';
import Lastsearched from './NewHome/Lastsearched';
import OurPackages from './NewHome/OurPackages';
import RecommendedHotel from './NewHome/RecommendedHotel';
import PopularDestinations from './NewHome/PopularDestinations';

export const metadata = {
  title: 'Efica',
  description: 'Efica',
};

const Home = () => {
  const t = useTranslations('HomePage');
  const tPopular = useTranslations('HomePage.popular_destinations');
  const tRecommended = useTranslations('HomePage.recommended');
  const tTestimonial = useTranslations('HomePage.testimonial');
  const tDestinations = useTranslations('HomePage.destinations');

  return (
    <>
      <Hero1 />
      {/* End Hero 1 */}

      {/* new home page */}
      <section className="bg-[#FFFDF5]">
        <div className="container">
          <Lastsearched />
          <PopularDestinations />
          <RecommendedHotel />
          <OurPackages />
        </div>
      </section>

      {/* <section className="layout-pt-lg layout-pb-md" data-aos="fade-up">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{tPopular('title')}</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {tPopular('description')}
                </p>
              </div>
            </div>

            <div className="col-auto md:d-none">
              <a
                href="#"
                className="button -md -blue-1 bg-blue-1-05 text-blue-1"
              >
                {tPopular('view_all')}
                <div className="icon-arrow-top-right ml-15" />
              </a>
            </div>
          </div>

          <div className="relative pt-40 sm:pt-20">
            <PopularDestinations />
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20">
            <AddBanner />
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-10 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{tRecommended('title')}</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {tRecommended('description')}
                </p>
              </div>
            </div>
            <div className="col-sm-auto">
              <SelectFilter />
            </div>
          </div>

          <div className="relative overflow-hidden pt-40 sm:pt-20 js-section-slider item_gap-x30">
            <Hotels />
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-20 justify-between">
            <BlockGuide />
          </div>
        </div>
      </section>

      <section className="layout-pt-lg layout-pb-lg bg-blue-2">
        <div className="container">
          <div className="row y-gap-40 justify-between">
            <div className="col-xl-5 col-lg-6" data-aos="fade-up">
              <TestimonialLeftCol />
            </div>

            <div className="col-lg-6">
              <div
                className="overflow-hidden js-testimonials-slider-3"
                data-aos="fade-up"
                data-aos-delay="50"
              >
                <Testimonial />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  {tTestimonial('inspiration')}
                </h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {tTestimonial('description')}
                </p>
              </div>
            </div>
          </div>
          <div className="row y-gap-30 pt-40">
            <Blog />
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  {tDestinations('title')}
                </h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {tDestinations('description')}
                </p>
              </div>
            </div>
          </div>

          <div className="tabs -pills pt-40 js-tabs">
            <Destinations />
          </div>
        </div>
      </section> */}

      {/* <CallToActions /> */}
    </>
  );
};

export default Home;
