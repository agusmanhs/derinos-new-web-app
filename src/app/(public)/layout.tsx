import React from 'react';
import { Navbar } from '@/components/public/Layout/Navbar';
import { Footer } from '@/components/public/Layout/Footer';

import { getSiteSettings } from '@/actions/adminLandingActions';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar />
      {children}
      <Footer settings={settings} />
    </>
  );
}
