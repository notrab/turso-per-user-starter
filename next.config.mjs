/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // New databases are migrated from these files at runtime, so the
    // routes that create databases need them in their deployment bundle.
    outputFileTracingIncludes: {
      "/welcome": ["./db/tenant/migrations/**/*"],
      "/webhooks/clerk": ["./db/tenant/migrations/**/*"],
    },
  },
};

export default nextConfig;
