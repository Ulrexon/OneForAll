import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BackgroundAnimation from "./components/BackgroundAnimation";

const interFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneForAll Toolkit",
  description: "A modern, premium utility toolkit for everyday developer tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${interFont.variable} antialiased text-white min-h-screen relative`}
      >
        <BackgroundAnimation />
        <main className="relative z-10 p-6 md:p-12 lg:p-24 max-w-7xl mx-auto min-h-screen">
            {children}
        </main>
      </body>
    </html>
  );
}
