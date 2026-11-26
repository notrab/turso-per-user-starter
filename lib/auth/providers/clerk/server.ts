import { auth } from "@clerk/nextjs/server";

import type { AuthAdapter } from "../../types";

export const clerkAuth: AuthAdapter = {
  async getUserId() {
    return auth().userId ?? null;
  },

  async requireUserId() {
    return auth().protect().userId;
  },
};
