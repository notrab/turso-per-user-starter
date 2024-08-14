# Turso Platforms Starter

A Next.js application that demonstrates how to use the [Turso](https://turso.tech) Platforms API to create a database per user.

![Turso Platforms Starter](/app/opengraph-image.png)

## Demo

[https://turso-platforms-starter.vercel.app](https://turso-platforms-starter.vercel.app/)

## Setup

1. Create a new SQLite multi-db schema database with Turso:

```bash
turso db create <database-name> --schema
```

2. Create a new group token:

Create a new token that can access all databases in your group:

```bash
turso group tokens create <group-name>
```

> [!NOTE]
> If you didn't already have one, a new group will be created for you with the name `default`.

2. **Run `cp .env.example .env`**

Add your database name, group token, and Turso organization name to the `.env` file:

```bash
TURSO_SCHEMA_DATABASE_NAME=
TURSO_DATABASE_GROUP_AUTH_TOKEN=
TURSO_ORG_NAME=
```

> [!NOTE]
> The `TURSO_ORG_NAME` can be your personal username, or the name of any organization you have with other users.

3. Migrate the database

Run the following command to create the tables in the database:

```bash
npm run db:migrate
```

> [!NOTE]
> If you make changes to `db/schema.ts`, make sure to run `npm run db:generate` to create the migrations, and `npm run db:migrate` to apply them.

4. **[Sign up to Clerk](https://clerk.com)**

Add your Clerk public key and secret key to the `.env` file:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

5. **Create a new Clerk webhook**

Make sure to use the `user.created` event, and pass it your production or local URL (using ngrok). Append `/webhooks/clerk` to the URL.

5. **Set the webhook secret in the `.env` file:**

```bash
CLERK_WEBHOOK_SECRET=
```

6. **Create a Turso API Token:**

```bash
turso auth api-tokens mint clerk
```

Set the API token in the `.env` file:

```bash
TURSO_USER_API_TOKEN=
```

7. **Install dependencies:**

```bash
npm install
```

8. **Run the development server:**

```bash
npm run dev
```

9. **Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.**

## Deploy to production

When you're ready to deploy to production, make sure to configure Clerk for production, and deploy the app to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnotrab%2Fturso-platforms-starter&env=NEXT_PUBLIC_CLERK_SIGN_IN_URL,NEXT_PUBLIC_CLERK_SIGN_UP_URL,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,CLERK_WEBHOOK_SECRET,TURSO_USER_API_TOKEN,TURSO_ORG_NAME,TURSO_SCHEMA_DATABASE_NAME,TURSO_DATABASE_GROUP_AUTH_TOKEN)

## Tech Stack

- [Turso](https://turso.tech)
- [Drizzle ORM/Kit](https://orm.drizzle.team)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Clerk](https://clerk.com)
- [Vercel](https://vercel.com)

## Need help?

[Join us on Discord](https://tur.so/discord)
