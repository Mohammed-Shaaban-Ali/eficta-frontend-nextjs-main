import React from 'react';
import DashboardPage from '@/views/profile/db-dashboard';

export const metadata = {
  title: 'Dashboard || Efica ',
  description: 'Efica ',
};

export default function page() {
  return (
    <>
      <DashboardPage />
    </>
  );
}
