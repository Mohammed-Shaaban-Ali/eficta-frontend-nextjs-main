'use client';

import Aos from 'aos';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import ScrollTop from '@/views/common/ScrollTop';
import Providers from '@/providers';
import { store } from '@/store/store';

export default function ClientLayoutWraper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize AOS animation
    Aos.init({
      duration: 1200,
      once: true,
    });

    // Load bootstrap only on client side
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap' as any);
    }
  }, []);

  return <Providers>{children}</Providers>;
}
