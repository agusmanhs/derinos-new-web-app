import React from 'react';
import { 
  Plus_Jakarta_Sans, 
  Outfit, 
  Manrope, 
  Urbanist,
  Inter 
} from 'next/font/google';
import { FontPreviewClient } from './FontPreviewClient';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-outfit',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
});

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-urbanist',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter-preview',
});

export const metadata = {
  title: 'Rekomendasi Font Non-Serif - Derinos Group',
  description: 'Komparasi interaktif font non-serif untuk identitas visual Derinos Group',
};

export default function FontPreviewPage() {
  return (
    <div className={`${plusJakartaSans.variable} ${outfit.variable} ${manrope.variable} ${urbanist.variable} ${inter.variable}`}>
      <FontPreviewClient />
    </div>
  );
}
