import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Workroots — Global Job Encyclopedia",
    template: "%s · Workroots",
  },
  description:
    "Explore work across history: how old a job is, how it evolved, and how roles connect across eras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased">
        <SiteHeader />
        <main className="mx-auto max-w-6xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">
          Workroots — historical archive &amp; encyclopedia
        </footer>
      </body>
    </html>
  );
}