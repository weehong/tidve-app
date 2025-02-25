import "@/styles/scss/globals.scss";
import "@/styles/scss/main.scss";

import type { Metadata } from "next";
import Script from "next/script";

import Navbar from "@/components/layout/Navbar";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tidve App",
  description:
    "Track and understand your monthly commitment based on your preferred currency",
  url: "https://tidve.vercel.app/",
};

export const metadata: Metadata = {
  title: "Tidve App",
  description:
    "Track and understand your monthly commitment based on your preferred currency",
  openGraph: {
    title: "Tidve App",
    description:
      "Track and understand your monthly commitment based on your preferred currency",
    url: "https://tidve.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tidve App",
    description:
      "Track and understand your monthly commitment based on your preferred currency",
  },
  alternates: {
    canonical: "https://tidve.vercel.app/",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-video-preview": 1000,
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  themeColor: "#4f39f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
        <Script
          id="json-ld"
          key="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
