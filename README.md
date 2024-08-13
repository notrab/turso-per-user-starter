# Turso Platforms Starter

A Next.js application that demonstrates how to use the [Turso](https://turso.tech) Platforms API to create a database per user.

![Turso Platforms Starter](/app/opengraph-image.png)

## Demo

[https://turso-platforms-starter.vercel.app](https://turso-platforms-starter.vercel.app/)

## Setup

1. **Create a parent schema database with Turso:**

[![Create Database](https://sqlite.new/button)](https://sqlite.new?dump=https%3A%2F%2Fraw.githubusercontent.com%2Fnotrab%2Fturso-platforms-starter%2Fmain%2Fdump.sql&type=schema)

2. **Run `cp .env.example .env.local`, add your Turso username (GitHub or custom) and database name to it:**

```bash
TURSO_SCHEMA_DATABASE_NAME=
```

3. **[Sign up to Clerk](https://clerk.com)**

Add your Clerk public key and secret key to the `.env.local` file:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

4. **Create a new Clerk webhook**

Make sure to use the `user.created` event, and pass it your production or local URL (using ngrok). Append `/webhooks/clerk` to the URL.

5. **Set the webhook secret in the `.env.local` file:**

```bash
CLERK_WEBHOOK_SECRET=
```

6. **Create a new group token with Turso**

You can use the Turso Dashboard, or [install the Turso CLI](https://docs.turso.tech/cli/installation) and run:

```bash
turso group tokens create <group-name>
```

Set the group token in the `.env.local` file:

```bash
TURSO_DATABASE_GROUP_AUTH_TOKEN=
```

7. **Create a Turso API Token using the Dashboard, or CLI:**

```bash
turso auth api-tokens mint clerk
```

Set the API token in the `.env.local` file:

```bash
TURSO_USER_API_TOKEN=
```

8. **Install dependencies:**

```bash
npm install
```

9. **Run the development server:**

```bash
npm run dev
```

10. **Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.**

## Deploy to production

When you're ready to deploy to production, make sure to configure Clerk for production, and deploy the app to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnotrab%2Fturso-platforms-starter&env=NEXT_PUBLIC_CLERK_SIGN_IN_URL,NEXT_PUBLIC_CLERK_SIGN_UP_URL,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,CLERK_WEBHOOK_SECRET,TURSO_USER_API_TOKEN,TURSO_ORG_NAME,TURSO_SCHEMA_DATABASE_NAME,TURSO_DATABASE_GROUP_AUTH_TOKEN)

## Tech Stack

- [Turso](https://turso.tech)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Clerk](https://clerk.com)
- [Vercel](https://vercel.com)

## Need help?

[Join us on Discord](https://tur.so/discord)
