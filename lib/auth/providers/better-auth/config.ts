/** Whether GitHub sign-in is configured. */
export const githubEnabled = () =>
  Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
