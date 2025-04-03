# Turso Per User Starter

A Next.js application that demonstrates how to use the [Turso](https://turso.tech) Platforms API to create a database per user.

![Turso Per User Starter Template](/app/opengraph-image.png)

## Demo

The app below uses a database per user, and is powered by Turso.

[https://turso-per-user-starter.vercel.app](https://turso-per-user-starter.vercel.app)

## Get Started

Deploy your own Turso powered platform in a few easy steps...

- [Create a Database](https://sqlite.new?dump=https%3A%2F%2Fraw.githubusercontent.com%2Fnotrab%2Fturso-per-user-starter%2Fmain%2Fdump.sql)

  - Once the database is created, you'll be presented with details about your database, and **Connect** details
  - Note down the following (you'll need these later):
    - Database name
    - Org name
    - Group Token (**Create Group Token** -> **Create Token**)
    - Platform API Token (**Create Platform API Token** -> **Insert memorable name** -> **Create Token**))

- [Sign up to Clerk](https://clerk.com)
  - Create a new application from the dashboard
  - Note down the following (you'll need these later):
    - Public key
    - Secret key
- [Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnotrab%2Fturso-per-user-starter&env=NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,TURSO_API_TOKEN,TURSO_ORG,TURSO_DATABASE_NAME,TURSO_GROUP_AUTH_TOKEN&demo-title=Turso%20Per%20User%20Starter&demo-description=Create%20a%20database%20per%20user&demo-image=https://raw.githubusercontent.com/notrab/turso-per-user-starter/28373b4c9c74f814e3749525ee3d53b603176834/app/opengraph-image.png&demo-url=https%3A%2F%2Fturso-per-user-starter.vercel.app)
  - Add the following environment variables (from the details you noted down earlier):
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
    - `CLERK_SECRET_KEY` - Clerk secret key
    - `TURSO_API_TOKEN` - Platform API Token
    - `TURSO_ORG` - Org name
    - `TURSO_DATABASE_NAME` - Database name
    - `TURSO_GROUP_AUTH_TOKEN` - Group Token
  - Click **Deploy** and you're done!

_You may optionally set up webhooks to automate the creation of databases in the background &mdash; [learn more](https://github.com/notrab/turso-per-user-starter/wiki/Webhooks#using-webhooks-in-production)._

## Local Development

Start building your Turso powered platform in a few simple steps...

1. <details>
   <summary>Clone this repository</summary>

   Begin by cloning this repository to your machine:

   ```bash
   git clone https://github.com/notrab/turso-per-user-starter.git
   cd turso-per-user-starter
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
   <summary>Create a new Turso database with Turso</summary>

   Follow the instructions to install the [Turso CLI](https://docs.turso.tech/cli/installation), and then run the following:

   ```bash
   turso db create <database-name>
   ```

   > Alternatively, you can [sign up](https://app.turso.tech) on the web, and create a new database from there.

   Now update `.env` to include your organization, and database name:

   ```bash
   TURSO_ORG=
   TURSO_DATABASE_NAME=
   ```

   > The `TURSO_ORG` can be your personal username, or the name of any organization you have with other users.

   </details>

4. <details>
   <summary>Create a new group token</summary>

   Run the following:

   ```bash
   turso group tokens create <database-name>
   ```

   Now update `.env` to include the group token:

   ```bash
   TURSO_GROUP_AUTH_TOKEN=
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
   TURSO_API_TOKEN=
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

[Read the wiki](https://github.com/notrab/turso-per-user-starter/wiki/Webhooks#using-webhooks-locally) for more information on how to set up webhooks with Clerk during development, and production.

## Tech Stack

- [Turso](https://turso.tech) for multi-tenant databases
- [Next.js](https://nextjs.org) for powerful full stack apps
- [Tailwind CSS](https://tailwindcss.com) for utility-first CSS
- [Drizzle](https://orm.drizzle.team) for database migrations and ORM
- [Clerk](https://clerk.com) for authentication
- [Vercel](https://vercel.com) for hosting

## Need help?

1. Open an issue on GitHub
2. Submit a Pull Request to improve this repo
3. [Join us on Discord](https://tur.so/discord)
