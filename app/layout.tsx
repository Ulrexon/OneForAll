import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BackgroundAnimation from "./components/BackgroundAnimation";
import Script from "next/script";
import AdBanner from "./components/AdBanner";

const interFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AllForWeb Toolkit",
  description: "A modern, premium utility toolkit for everyday developer tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1141041890300704"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${interFont.variable} antialiased text-white min-h-screen relative pb-32`}
      >
        <BackgroundAnimation />
        <main className="relative z-10 p-6 md:p-12 lg:p-24 max-w-7xl mx-auto min-h-screen">
            {children}
        </main>
        <AdBanner />
      </body>
    </html>
  );
}
