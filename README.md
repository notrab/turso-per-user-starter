# Turso Platforms Starter

A Next.js application that demonstrates how to use the [Turso](https://turso.tech) Platforms API to create a database per user.

![Turso Platforms Starter](/app/opengraph-image.png)

## Demo

Login and manage todos stored in a dedicated database per user.

[https://turso-platforms-starter.vercel.app](https://turso-platforms-starter.vercel.app/)

## Tech Stack

- [Turso](https://turso.tech) for multi-tenant databases
- [Next.js](https://nextjs.org) for powerful full stack apps
- [Tailwind CSS](https://tailwindcss.com) for utility-first CSS
- [Drizzle](https://orm.drizzle.team) for database migrations and ORM
- [Clerk](https://clerk.com) for authentication
- [Vercel](https://vercel.com) for hosting

## Prerequisites

- [Vercel](https://vercel.com) account
- [Clerk](https://clerk.com) account
- [Turso](https://turso.tech) account & [CLI](https://docs.turso.tech/cli/installation)
- [ngrok.io](https://ngrok.io) account (for local development) + CLI

## Get Started

The best way to get started is to clone this repository, run it locally, and start building your Turso powered platform.

1. <details>
   <summary>Clone this repository</summary>

   Begin by cloning this repository to your machine:

   ```bash
   git clone
   ```

   </details>

2. <details>
   <summary>Install dependencies and initialize <code>.env</code></summary>

   Run the following:

   ```bash
   cp .env.example .env
   npm install
   ```

   </details>

3. <details>
   <summary>Create a new SQLite schema database with Turso</summary>

   Follow the instructions to install the [Turso CLI](https://docs.turso.tech/cli/installation), and then run the following:

   ```bash
   turso db create <database-name> --type schema
   ```

   > Alternatively, you can [sign up](https://app.turso.tech) on the web, and create a new schema database from there.

   Now update `.env` to include your organization, and schema database name:

   ```bash
   TURSO_ORG_NAME=
   TURSO_SCHEMA_DATABASE_NAME=
   ```

   > The `TURSO_ORG_NAME` can be your personal username, or the name of any organization you have with other users.

   </details>

4. <details>
   <summary>Create a new group token</summary>

   Run the following:

   ```bash
   turso group tokens create <database-name>
   ```

   Now update `.env` to include the group token:

   ```bash
   TURSO_DATABASE_GROUP_AUTH_TOKEN=
   ```

   > If you didn't already have one, a new group will be created for you with the name `default`.

   </details>

5. <details>
   <summary>Run database migrations</summary>

   Run the following:

   ```bash
   npm run db:migrate
   ```

   > If you make changes to `db/schema.ts`, make sure to run `npm run db:generate` to create the migrations, and `npm run db:migrate` to apply them.

   </details>

6. <details>
   <summary>Create a new Turso API Token</summary>

   Run the following:

   ```bash
   turso auth api-tokens mint clerk
   ```

   Then set the API token in the `.env` file:

   ```bash
   TURSO_USER_API_TOKEN=
   ```

  </details>

7. <details>
   <summary>Configure Clerk</summary>

   [Sign up to Clerk](https://clerk.com) and create a new application.

   Add your Clerk public key and secret key to the `.env` file:

   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   ```

   </details>

8. <details>
   <summary>Run the application</summary>

   Run the following:

   ```bash
   npm run dev
   ```

   Now open [http://localhost:3000](http://localhost:3000) with your browser to try out the app!

    </details>

## Optional: Webhook setup

You can automate the creation of databases per user in the background with webhooks.

[Read the wiki](/wiki/Webhooks) for more information on how to set up webhooks with Clerk during development, and production.

## Deploy to Production

Make sure you have a database setup (following the steps above), the database has been migrated, and you have the environment variables available.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnotrab%2Fturso-platforms-starter&env=NEXT_PUBLIC_CLERK_SIGN_IN_URL,NEXT_PUBLIC_CLERK_SIGN_UP_URL,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,CLERK_WEBHOOK_SECRET,TURSO_USER_API_TOKEN,TURSO_ORG_NAME,TURSO_SCHEMA_DATABASE_NAME,TURSO_DATABASE_GROUP_AUTH_TOKEN)

If you're using webhooks, make sure to update Clerk with the production URL. You will need to know the Vercel production deployment ahead of time, or re-deploy once you have it.

## Tech Stack

- [Turso](https://turso.tech)
- [Drizzle](https://orm.drizzle.team)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Clerk](https://clerk.com)
- [Vercel](https://vercel.com)

## Need help?

[Join us on Discord](https://tur.so/discord)
