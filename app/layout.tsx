import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ScrollToTop from "./components/ScrollToTop";
import BackgroundAnimation from "./components/BackgroundAnimation";

const interFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://allforweb.com"),
  title: "AllForWeb Toolkit",
  description: "A modern, premium utility toolkit for everyday developer tasks.",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-ES": "/es",
      "pt-BR": "/pt",
      "fr-FR": "/fr",
    },
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
        <ScrollToTop />
        <BackgroundAnimation />
        <main className="relative z-10 p-6 md:p-12 lg:px-12 lg:pt-6 lg:pb-24 max-w-7xl mx-auto min-h-screen">
            {children}
        </main>
      </body>
    </html>
  );
}
