import { authMiddleware } from "@/lib/auth/middleware";

export default authMiddleware;

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
