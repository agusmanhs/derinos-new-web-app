import React from 'react';
import { Navbar } from '@/components/public/Layout/Navbar';
import { Footer } from '@/components/public/Layout/Footer';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
