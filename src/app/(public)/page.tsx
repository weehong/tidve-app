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
      {/* Hero Section - Primary keyword targeting */}
      <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-4 py-2 text-sm font-semibold text-violet-700">
            <SparklesIcon className="h-4 w-4" />
            Free Subscription Management & Expense Tracking
          </div>

          {/* H1 - Main SEO Title with primary keywords */}
          <h1 className="font-canela mb-6 text-5xl font-bold leading-tight text-gray-900 sm:text-7xl lg:text-8xl">
            Track Your{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Subscriptions & Expenses
            </span>{" "}
            Effortlessly
          </h1>

          {/* Subheading with secondary keywords */}
          <p className="font-instrument mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl">
            The best free subscription tracker and personal finance management
            tool. Monitor all your monthly subscriptions, recurring payments,
            and expenses with multi-currency support. Get automatic renewal
            reminders and never miss a payment again.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/login"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:w-auto"
              aria-label="Start tracking subscriptions for free"
            >
              Get Started Free
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
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
              aria-label="Learn more about subscription tracking features"
            >
              Learn More
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-violet-600" aria-hidden="true" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5 text-violet-600" aria-hidden="true" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-violet-600" aria-hidden="true" />
              <span>Free Forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - H2 with keyword variation */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-5xl">
              Why Choose Tidverse for Subscription Management?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              The complete solution for tracking subscriptions, managing
              recurring expenses, and controlling your monthly budget in one
              powerful dashboard
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Benefit 1 - Expense Overview */}
            <article className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-violet-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-3">
                <ChartBarIcon className="h-8 w-8 text-violet-600" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Comprehensive Expense Overview
              </h3>
              <p className="text-gray-600">
                Get a complete view of all your monthly commitments, recurring
                payments, and subscription costs at a glance. See exactly where
                your money goes with detailed expense analytics.
              </p>
            </article>

            {/* Benefit 2 - Budget Management */}
            <article className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-violet-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-3">
                <CurrencyDollarIcon className="h-8 w-8 text-violet-600" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Smart Budget Planning
              </h3>
              <p className="text-gray-600">
                Make informed financial decisions with detailed spending
                insights and budget management tools. Track your personal
                finances and optimize your monthly expenses.
              </p>
            </article>

            {/* Benefit 3 - Payment Reminders */}
            <article className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-violet-300 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-3">
                <BellAlertIcon className="h-8 w-8 text-violet-600" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Automatic Payment Reminders
              </h3>
              <p className="text-gray-600">
                Stay on top of all renewal dates with timely email
                notifications before subscriptions are charged. Never miss a
                payment or renewal deadline again.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Features Section - H2 with keyword optimization */}
      <section id="features" className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-5xl">
              Powerful Features for Expense Tracking
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Everything you need in a subscription management app and expense
              tracker to take control of your recurring expenses
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 - Subscription Tracking */}
            <article className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-8 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
              <div className="relative z-10">
                <CreditCardIcon className="mb-4 h-10 w-10" aria-hidden="true" />
                <h3 className="mb-3 text-2xl font-bold">
                  Advanced Subscription Tracking
                </h3>
                <p className="text-violet-100">
                  Track unlimited subscriptions and recurring payments. Monitor
                  daily, monthly, quarterly, and annual subscriptions with
                  custom billing cycles based on your preferred currency.
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white opacity-10"></div>
            </article>

            {/* Feature 2 - Multi-Currency Support */}
            <article className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-8 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
              <div className="relative z-10">
                <CurrencyDollarIcon className="mb-4 h-10 w-10" aria-hidden="true" />
                <h3 className="mb-3 text-2xl font-bold">
                  Multi-Currency Expense Tracking
                </h3>
                <p className="text-purple-100">
                  Automatically convert foreign currency subscriptions to your
                  local currency. Track expenses in multiple currencies with
                  real-time exchange rate updates.
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white opacity-10"></div>
            </article>

            {/* Feature 3 - Email Notifications */}
            <article className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl md:col-span-2 lg:col-span-1">
              <div className="relative z-10">
                <BellAlertIcon className="mb-4 h-10 w-10" aria-hidden="true" />
                <h3 className="mb-3 text-2xl font-bold">
                  Smart Email Notifications
                </h3>
                <p className="text-indigo-100">
                  Get notified 7 and 3 days before subscription renewals.
                  Automatic payment reminders ensure you&apos;re never caught
                  off guard by unexpected charges.
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white opacity-10"></div>
            </article>
          </div>
        </div>
      </section>

      {/* How It Works Section - H2 for additional content */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              How to Track Your Subscriptions with Tidverse
            </h2>
            <p className="text-lg text-gray-600">
              Start managing your expenses in three simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-2xl font-bold text-violet-600">
                1
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Sign Up Free
              </h3>
              <p className="text-gray-600">
                Create your free account in seconds. No credit card or payment
                required to start tracking.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-2xl font-bold text-violet-600">
                2
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Add Subscriptions
              </h3>
              <p className="text-gray-600">
                Input your recurring payments, subscriptions, and monthly
                expenses. Set billing cycles and currencies.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-2xl font-bold text-violet-600">
                3
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Track & Save
              </h3>
              <p className="text-gray-600">
                Monitor your spending, get renewal alerts, and optimize your
                budget with financial insights.
              </p>
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
                Start Managing Your Subscriptions Today
              </h2>
              <p className="mb-8 text-lg text-violet-100 sm:text-xl">
                Join thousands of users who are taking control of their monthly
                expenses and saving money with smart subscription management
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-violet-600 shadow-lg transition-all hover:scale-105 hover:bg-violet-50"
                aria-label="Start tracking your subscriptions and expenses now"
              >
                Start Tracking Now - Free Forever
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
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
