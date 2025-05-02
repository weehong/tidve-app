# Tidve App

<div style="display: flex; justify-content: space-between; gap: 10px; margin-bottom: 20px;">
    <img src="screenshots/home.png" alt="Home" style="width: 32%;">
    <img src="screenshots/dashboard.png" alt="Dashboard" style="width: 32%;">
    <img src="screenshots/subscription.png" alt="Subscription" style="width: 32%;">
</div>

This Tidve App is a small module of a finance management application. It serves as a helpful tool for users to track and analyze their monthly expenses, including but not limited to subscriptions, installments, fixed expenses, and more.

By providing a comprehensive overview, the app allows users to gain valuable insights into their spending habits from month to month at a glance.

This helps users understand their expenses better and make informed decisions about their finances.

## Features

- [x] Login with Auth0
- [x] Dashboard
- [x] Subscription Management
- [x] Subscription Renewal Email Reminder
- [x] Exchange Rate Management
- [ ] Installment Management

## Tech Stack

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Auth0](https://auth0.com)
- [Prisma](https://prisma.io)
- [PostgreSQL](https://postgresql.org)
- [Vercel](https://vercel.com)
- [Resend](https://resend.com)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or later)
- npm (v9 or later)
- PostgreSQL (v14 or later)
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tidve-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tidve?schema=public"

# Auth0
AUTH0_SECRET="your-auth0-secret"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://your-tenant.region.auth0.com"
AUTH0_CLIENT_ID="your-client-id"
AUTH0_CLIENT_SECRET="your-client-secret"

# Resend (for email notifications)
RESEND_API_KEY="your-resend-api-key"
```

### 4. Database Setup

1. Create a PostgreSQL database named `tidve`
2. Run Prisma migrations:
```bash
npx prisma migrate dev
```

### 5. Seed Exchange Rates

The application uses exchange rates for currency conversion. To seed the initial rates:
*This is a crucial step, as the entire application depends on the initial seeding to run properly.*
```bash
npm run seed
```

This will fetch the latest exchange rates from the API and store them in your database.

### 6. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed exchange rates into the database
- `npm run email` - Start the email development server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
