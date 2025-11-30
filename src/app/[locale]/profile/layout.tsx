import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { redirect } from 'next/navigation';

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

  return <>{children}</>;
}
