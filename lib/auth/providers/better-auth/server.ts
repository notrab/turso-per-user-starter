import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthAdapter } from "../../types";
import { getAuth } from "./auth";

async function getSession() {
  // Read headers first: it marks the page as dynamic before anything else
  // runs, so builds never try to prerender signed-in pages.
  const requestHeaders = headers();
  return getAuth().api.getSession({ headers: requestHeaders });
}

export const betterAuthAdapter: AuthAdapter = {
  async getUserId() {
    return (await getSession())?.user.id ?? null;
  },

  async requireUserId() {
    const userId = (await getSession())?.user.id;
    if (!userId) redirect("/sign-in");
    return userId;
  },
};
