import Header1 from '@/components/layout/Header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { redirect } from 'next/navigation';
import Footer from '@/components/layout/Footer';

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

  return (
    <>
      <div className="header-margin"></div>
      <Header1 session={session} />
      {children}
      <Footer />
    </>
  );
}
