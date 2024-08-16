# Turso Platforms Starter

A Next.js application that demonstrates how to use the [Turso](https://turso.tech) Platforms API to create a database per user.

![Turso Platforms Starter](/app/opengraph-image.png)

## Demo

[https://turso-platforms-starter.vercel.app](https://turso-platforms-starter.vercel.app/)

## Prerequisites

- [Vercel](https://vercel.com) account
- [Clerk](https://clerk.com) account
- [Turso](https://turso.tech) account & [CLI](https://docs.turso.tech/cli/installation)
- [ngrok.io](https://ngrok.io) account (for local development) + CLI

## Local Development

<details>
<summary>1. Install dependencies and initialize new `.env` file</summary>

Run the following:

```bash
cp .env.example .env
npm install
```

</details>

<details>
<summary>2. Create a new SQLite multi-db schema database with Turso</summary>

Follow the instructions to install the [Turso CLI](https://docs.turso.tech/cli/installation), and then run the following:

```bash
turso db create <database-name> --schema
```

> Alternatively, you can [sign up](https://app.turso.tech) on the web, and create a new schema database from there.

</details>

<details>
<summary>3. Create a new group token</summary>

Run the following:

```bash
turso db create <database-name> --schema
```

> If you didn't already have one, a new group will be created for you with the name `default`.

</details>

<details>
<summary>4. Configure Turso</summary>

Add your database name, group token, and Turso organization name to the `.env` file:

```bash
TURSO_SCHEMA_DATABASE_NAME=
TURSO_DATABASE_GROUP_AUTH_TOKEN=
TURSO_ORG_NAME=
```

We'll finish configuring the `.env` file across the next few steps.

> The `TURSO_ORG_NAME` can be your personal username, or the name of any organization you have with other users.

</details>

<details>
<summary>5. Run database migrations</summary>

Run the following:

```bash
npm run db:migrate
```

> If you make changes to `db/schema.ts`, make sure to run `npm run db:generate` to create the migrations, and `npm run db:migrate` to apply them.

</details>

<details>
<summary>6. Configure Clerk</summary>

[Sign up to Clerk](https://clerk.com) and create a new application.

Add your Clerk public key and secret key to the `.env` file:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

</details>

<details>
<summary>7. Create a new Clerk webhook</summary>

During development we will use [ngrok.io](https://ngrok.io) to expose our local server to the internet so Clerk can send webhooks to it.

Run the following:

```bash
ngrok http 3000
```

> Make sure to change `3000` to the port your Next.js application is running on.

Inside Clerk, go to Webhooks > Add Endpoint and enter the URL provided by ngrok + `/webhooks/clerk`, and select `user.created` as the event:

![Clerk add endpoint](/public/add-webhook-endpoint.png)

Next click on the webhook you just created and copy the signing secret:

![Clerk signing secret](/public/copy-webhook-signing-secret.png)

Add this signing secret to `.env`:

```bash
CLERK_WEBHOOK_SECRET=
```

</details>

<details>
<summary>8. Create a new Turso API Token</summary>

Run the following:

```bash
turso auth api-tokens mint clerk
```

Set the API token in the `.env` file:

```bash
TURSO_USER_API_TOKEN=
```

</details>

<details>
<summary>9. Run the application locally</summary>

Run the following:

```bash
npm run dev
```

Now open [http://localhost:3000](http://localhost:3000) with your browser to try out the app!

</details>

## Deploy to Production

When you're ready to deploy to production, click the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnotrab%2Fturso-platforms-starter&env=NEXT_PUBLIC_CLERK_SIGN_IN_URL,NEXT_PUBLIC_CLERK_SIGN_UP_URL,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,CLERK_WEBHOOK_SECRET,TURSO_USER_API_TOKEN,TURSO_ORG_NAME,TURSO_SCHEMA_DATABASE_NAME,TURSO_DATABASE_GROUP_AUTH_TOKEN)

Then follow the steps for local development to configure the environment variables.

Once your deployment has completed, go to Clerk > Webhooks (step 6) and set the webhook URL to your Vercel deployment URL + `/webhooks/clerk`.

## Tech Stack

- [Turso](https://turso.tech)
- [Drizzle](https://orm.drizzle.team)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Clerk](https://clerk.com)
- [Vercel](https://vercel.com)

## Need help?

[Join us on Discord](https://tur.so/discord)
