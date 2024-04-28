# turso-platforms-starter

WIP

## Demo

[https://turso-platforms-starter.vercel.app](https://turso-platforms-starter.vercel.app/)

## Quickstart

Create a `.env.local` file in the root of the project with the following content:

```md
# Sign up to Clerk

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Create a new Clerk webhook (user.created event) with your app URL and append /webhooks/clerk

# Set the webhook secret below provided by Clerk

CLERK_WEBHOOK_SECRET=

# turso auth api-tokens mint clerk

TURSO_USER_API_TOKEN=

# your personal or organization name

TURSO_ORG_NAME=

# turso db create [database-name] --type schema

TURSO_SCHEMA_DATABASE_NAME=

# turso group tokens create <group-name>

TURSO_DATABASE_GROUP_AUTH_TOKEN=
```
