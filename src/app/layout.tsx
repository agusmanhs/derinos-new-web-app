import type { Metadata } from "next";
import { Urbanist, Inter } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Derinos Group - Property Developer",
  description: "High quality modern residences in harmony with nature.",
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
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
      <body className={`${urbanist.variable} ${inter.variable}`}>
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
