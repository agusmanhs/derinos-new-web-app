import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Landing Page Settings - Admin',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '24px' }}>
      {children}
    </div>
  );
}