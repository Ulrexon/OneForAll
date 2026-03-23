import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BackgroundAnimation from "./components/BackgroundAnimation";

const interFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AllForWeb Toolkit",
  description: "A modern, premium utility toolkit for everyday developer tasks.",
  verification: {
    google: "kWc-_brHOYY1Q9sHm4Pb-eHd3q-NhEiMJzDzMU1-CAw",
  },
  other: {
    "google-adsense-account": "ca-pub-1141041890300704",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1141041890300704"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${interFont.variable} antialiased text-white min-h-screen relative pb-32`}
      >
        <BackgroundAnimation />
        <main className="relative z-10 p-6 md:p-12 lg:p-24 max-w-7xl mx-auto min-h-screen">
            {children}
        </main>
      </body>
    </html>
  );
}
