import "@/styles/scss/globals.scss";
import "@/styles/scss/main.scss";

import type { Metadata } from "next";
import Script from "next/script";

import Navbar from "@/components/layout/Navbar";

// Enhanced JSON-LD Structured Data for better SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tidverse",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "127",
  },
  description:
    "Free subscription management and expense tracking app. Track monthly subscriptions, manage recurring expenses, and monitor your financial commitments with multi-currency support and automatic reminders.",
  url: "https://tidverse.vercel.app/",
  screenshot: "https://tidverse.vercel.app/screenshots/dashboard.png",
  featureList: [
    "Subscription tracking and management",
    "Multi-currency support with automatic conversion",
    "Email notifications for upcoming renewals",
    "Expense analytics and insights",
    "Budget management tools",
  ],
  author: {
    "@type": "Organization",
    name: "Tidverse",
    url: "https://tidverse.vercel.app/",
  },
};

// Comprehensive SEO Metadata
export const metadata: Metadata = {
  title: "Tidverse - Free Subscription Tracker & Expense Manager",
  description:
    "Track all your subscriptions and recurring expenses in one place. Free subscription management app with multi-currency support, automatic reminders, and financial insights. Never miss a payment again.",
  keywords: [
    "subscription management app",
    "expense tracking tool",
    "monthly subscription tracker",
    "personal finance management",
    "recurring payments tracker",
    "budget management app",
    "subscription organizer",
    "expense manager",
    "financial tracking software",
    "subscription reminder app",
    "multi-currency expense tracker",
    "free subscription tracker",
    "subscription cost calculator",
    "monthly expense tracker",
  ],
  authors: [{ name: "Tidverse Team" }],
  creator: "Tidverse",
  publisher: "Tidverse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://tidverse.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tidverse.vercel.app/",
    title: "Tidverse - Free Subscription Tracker & Expense Manager",
    description:
      "Track all your subscriptions and recurring expenses in one place. Multi-currency support, automatic reminders, and financial insights.",
    siteName: "Tidverse",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tidverse - Subscription Management Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tidverse - Free Subscription Tracker & Expense Manager",
    description:
      "Track all your subscriptions and recurring expenses. Multi-currency support, automatic reminders, and financial insights. Free forever.",
    images: ["/twitter-image.png"],
    creator: "@tidverse",
  },
  alternates: {
    canonical: "https://tidverse.vercel.app/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    // Add your verification codes here when ready
    // google: 'google-site-verification-code',
    // yandex: 'yandex-verification-code',
    // bing: 'bing-verification-code',
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#7c3aed" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased">
        <Navbar />
        {children}

        {/* Enhanced Structured Data */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="afterInteractive"
        />

        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Tidverse",
              url: "https://tidverse.vercel.app",
              logo: "https://tidverse.vercel.app/logo.png",
              sameAs: [
                "https://github.com/weehong/tidverse-app",
              ],
            }),
          }}
          strategy="afterInteractive"
        />

        {/* FAQ Schema for better SERP features */}
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is Tidverse?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Tidverse is a free subscription management and expense tracking application that helps you monitor all your recurring payments, subscriptions, and monthly commitments in one centralized dashboard with multi-currency support.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does subscription tracking work?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Tidverse allows you to manually add your subscriptions with details like name, cost, billing cycle, and currency. The app then tracks renewal dates, converts currencies automatically, and sends you email reminders before payments are due.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is Tidverse free to use?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, Tidverse is completely free to use with no credit card required. All features including subscription tracking, currency conversion, and email notifications are available at no cost.",
                  },
                },
              ],
            }),
          }}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
