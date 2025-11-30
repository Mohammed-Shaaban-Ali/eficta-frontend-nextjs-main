import { authOptions } from '@/libs/auth';
import MainHome from '@/views/home';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Efica - Travel & Tour',
  description: 'Efica ',
};

export default async function Home({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  // Await params before using it
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/${locale}/auth/login`);
  }
  return <MainHome />;
}
