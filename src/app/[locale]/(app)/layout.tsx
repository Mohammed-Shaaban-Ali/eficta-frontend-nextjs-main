import Header1 from '@/components/layout/Header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { redirect } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import { headers } from 'next/headers';
import Navbar from '@/views/home/NewHome/Navbar';
import NewFooter from '@/views/home/NewHome/Footer';
export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await params before using it
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  // Get the pathname from headers
  const headersList = await headers();
  const pathname =
    headersList.get('x-pathname') || headersList.get('referer') || '';

  // Check if pathname is exactly "/ar" or "/en"
  const shouldHideHeader = pathname.endsWith(`/${locale}`);

  return (
    <>
      {shouldHideHeader ? <Navbar /> : <Header1 session={session} />}
      {children}
      {shouldHideHeader ? <NewFooter /> : <Footer />}
    </>
  );
}
