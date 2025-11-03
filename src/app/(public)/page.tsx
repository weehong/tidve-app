import Link from "next/link";

import {
  BellAlertIcon,
  ChartBarIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function Home(): React.ReactNode {
  return (
    <div className="bg-gradient-to-b from-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-4 py-2 text-sm font-semibold text-violet-700">
            <SparklesIcon className="h-4 w-4" />
            Track Your Financial Commitments
          </div>

          {/* Main Heading */}
          <h1 className="font-canela mb-6 text-5xl font-bold leading-tight text-gray-900 sm:text-7xl lg:text-8xl">
            Take Control of Your{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Subscriptions
            </span>
          </h1>

          {/* Subheading */}
          <p className="font-instrument mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Track and understand your monthly commitment based on your preferred
            currency. Gain valuable insights into your spending habits and make
            informed financial decisions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/login"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:w-auto"
            >
              Get Started Free
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="#features"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition-all hover:border-violet-300 hover:bg-violet-50 sm:w-auto"
            >
              Learn More
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-violet-600" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5 text-violet-600" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-violet-600" />
              <span>Free Forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-5xl">
              Why Choose Tidverse?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Everything you need to manage your subscriptions and recurring
              expenses in one beautiful dashboard
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Benefit 1 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-violet-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-3">
                <ChartBarIcon className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Clear Overview
              </h3>
              <p className="text-gray-600">
                Get a comprehensive view of all your monthly commitments at a
                glance. See exactly where your money goes.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-violet-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-3">
                <CurrencyDollarIcon className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Smart Budgeting
              </h3>
              <p className="text-gray-600">
                Make informed decisions about your finances with detailed
                insights and spending analytics.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-violet-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-3">
                <BellAlertIcon className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Never Miss a Payment
              </h3>
              <p className="text-gray-600">
                Stay on top of renewals with timely notifications before your
                subscriptions are charged.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-5xl">
              Powerful Features
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Everything you need to take control of your recurring expenses
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 - Subscription Tracking */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-8 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
              <div className="relative z-10">
                <CreditCardIcon className="mb-4 h-10 w-10" />
                <h3 className="mb-3 text-2xl font-bold">Subscription Tracking</h3>
                <p className="text-violet-100">
                  Track and understand your monthly commitment based on your
                  preferred currency
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white opacity-10"></div>
            </div>

            {/* Feature 2 - Currency Conversion */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-8 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
              <div className="relative z-10">
                <CurrencyDollarIcon className="mb-4 h-10 w-10" />
                <h3 className="mb-3 text-2xl font-bold">Currency Conversion</h3>
                <p className="text-purple-100">
                  Convert the subscription foreign currency to your local
                  currency automatically
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white opacity-10"></div>
            </div>

            {/* Feature 3 - Email Notifications */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl md:col-span-2 lg:col-span-1">
              <div className="relative z-10">
                <BellAlertIcon className="mb-4 h-10 w-10" />
                <h3 className="mb-3 text-2xl font-bold">Email Notifications</h3>
                <p className="text-indigo-100">
                  Get notified before the renewal happens so you&apos;re never
                  caught off guard
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white opacity-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-purple-600 p-12 text-center shadow-2xl sm:p-16">
            {/* Decorative elements */}
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-white opacity-10"></div>
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white opacity-10"></div>

            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="mb-8 text-lg text-violet-100 sm:text-xl">
                Join thousands of users who are taking control of their
                subscriptions today
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-violet-600 shadow-lg transition-all hover:scale-105 hover:bg-violet-50"
              >
                Start Tracking Now
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-16"></div>
    </div>
  );
}
