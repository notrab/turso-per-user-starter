# Turso Platforms Starter

A Next.js application that demonstrates how to use the [Turso](https://turso.tech) Platforms API to create a database per user.

## Demo

[https://turso-platforms-starter.vercel.app](https://turso-platforms-starter.vercel.app/)

## Quickstart

1. Create a parent schema database with Turso:

[![Create Database](https://sqlite.new/button)](https://sqlite.new?dump=https%3A%2F%2Fraw.githubusercontent.com%2Fnotrab%2Fturso-platforms-starter%2Fmain%2Fdump.sql&type=schema)

2. `cp .env.example .env.local` and configure the environment variables:

```bash
# Sign up to Clerk

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Create a new Clerk webhook (user.created event) with your app URL
# and append /webhooks/clerk
#
# Set the webhook secret below provided by Clerk
CLERK_WEBHOOK_SECRET=

# turso auth api-tokens mint clerk
TURSO_USER_API_TOKEN=

# your personal or organization name
TURSO_ORG_NAME=

# database name from step 1
TURSO_SCHEMA_DATABASE_NAME=

# turso group tokens create <group-name>
TURSO_DATABASE_GROUP_AUTH_TOKEN=
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

## Tech Stack

- [Turso](https://turso.tech)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Clerk](https://clerk.com)
- [Vercel](https://vercel.com)
