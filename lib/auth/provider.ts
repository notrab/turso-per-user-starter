export const authProviders = ["clerk", "better-auth"] as const;
export type AuthProviderName = (typeof authProviders)[number];

/** The auth provider named by AUTH_PROVIDER. Defaults to clerk. */
export function authProviderName(): AuthProviderName {
  const name = process.env.AUTH_PROVIDER || "clerk";

  if (!(authProviders as readonly string[]).includes(name)) {
    throw new Error(
      `Unknown AUTH_PROVIDER "${name}". Supported: ${authProviders.join(", ")}`,
    );
  }
  return name as AuthProviderName;
}
