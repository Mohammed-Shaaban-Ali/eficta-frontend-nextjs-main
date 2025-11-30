'use client';

import { SessionProvider, useSession } from 'next-auth/react';

export function NextAuthProvider({
  children,
  basePath,
}: {
  children: React.ReactNode;
  basePath?: string;
}) {
  return <SessionProvider basePath={basePath}>{children}</SessionProvider>;
}
