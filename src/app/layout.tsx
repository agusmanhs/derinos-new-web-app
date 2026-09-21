import type { Metadata } from "next";
import { Inter, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const libreCaslonText = Libre_Caslon_Text({
  weight: ["400", "700"],
  variable: "--font-libre-caslon-text",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Derinos Group - Property Developer",
  description: "High quality modern residences in harmony with nature.",
};

import NextTopLoader from 'nextjs-toploader';
import { Suspense } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${libreCaslonText.variable}`}>
        <Suspense fallback={null}>
          <NextTopLoader
            color="var(--color-primary)"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px var(--color-primary),0 0 5px var(--color-primary)"
          />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
