import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import BackgroundAnimation from "../components/BackgroundAnimation";
import DictionaryProvider from "./DictionaryProvider";
import { getDictionary } from "../../get-dictionary";
import type { Locale } from "../../i18n-config";

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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }> | { lang: string };
}>) {
  const resolvedParams = await Promise.resolve(params);
  const lang = resolvedParams.lang as Locale;
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className="dark">
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
        <DictionaryProvider dictionary={dict}>
          <main className="relative z-10 p-6 md:p-12 lg:p-24 max-w-7xl mx-auto min-h-screen">
            {children}
          </main>
        </DictionaryProvider>
      </body>
    </html>
  );
}
