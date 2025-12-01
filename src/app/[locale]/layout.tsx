import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-cards';
import 'aos/dist/aos.css';
// External CSS libraries moved from SCSS imports
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/index.scss';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Toast from '@/libs/Toast';
import '../../styles/global.css';
import ClientLayoutWraper from './(app)/ClientLayoutWraper';
import ScrollToTop from '@/views/common/ScrollTop';
import SetToken from '../../components/layout/SetToken';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Load Arabic font from local file
const notoKufiArabic = localFont({
  src: '../../../public/fonts/NotoKufiArabic-Medium.ttf',
  variable: '--font-noto-kufi-arabic',
});

export const metadata = {
  title: 'Efica',
  description: 'Efica',
};

type Params = Promise<{
  locale: string;
}>;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    return notFound();
  }

  // Determine which fonts to use based on locale
  const fontClasses =
    locale === 'ar'
      ? `${notoKufiArabic.variable} ${notoKufiArabic.className}`
      : `${geistSans.variable} ${geistMono.variable}`;

  // Fetch will trigger the API route which handles cookie setting
  const res = await fetch(process.env.NEXT_PUBLIC_APP_URL + '/api/app-token', {
    cache: 'no-store',
    credentials: 'include',
  });
  const { token } = await res.json();
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${fontClasses} antialiased`}>
        <main>
          <SetToken token={token} />
          <Toast />
          <NextIntlClientProvider locale={locale}>
            <ClientLayoutWraper>
              <ScrollToTop />
              {children}
            </ClientLayoutWraper>
          </NextIntlClientProvider>
        </main>
      </body>
    </html>
  );
}
