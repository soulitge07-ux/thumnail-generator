import type { Metadata } from "next";
import { Geist, Geist_Mono, Gugi, Orbit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gugi = Gugi({
  variable: "--font-gugi",
  subsets: ["latin"],
  weight: "400",
});

const orbit = Orbit({
  variable: "--font-orbit",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Nailart AI — YouTube Thumbnail Generator",
  description: "AI-powered YouTube thumbnail generation service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${gugi.variable} ${orbit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
