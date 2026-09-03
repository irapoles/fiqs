import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

import "./globals.css";

/**
 * Geist carries everything. The brand guide specifies Google Sans, which has
 * no public web licence — Geist is the closest geometric-humanist match and
 * holds the guide's −3.5% display tracking without the counters closing up.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Three weights, no italics.
  display: "swap",
});

/** Reserved for attestation hashes — strings compared character by character. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FIQS — The digital operating system for responsible gold supply chains",
    template: "%s · FIQS",
  },
  description:
    "FIQS centralises mine records, supplier onboarding, due diligence workflows, sanctions screening, chain of custody, gold transactions and financial reporting in one secure platform.",
  openGraph: {
    title: "FIQS — The digital operating system for responsible gold supply chains",
    description:
      "Centralise mine records, supplier onboarding, due diligence, screening, chain of custody and reporting in one secure platform.",
    type: "website",
    locale: "en_GB",
  },
};

export const viewport: Viewport = {
  themeColor: "#0C0D0F",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-100 focus:rounded-sm focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-graphite"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
