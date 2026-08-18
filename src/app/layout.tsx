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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${libreCaslonText.variable}`}>
        {children}
      </body>
    </html>
  );
}
