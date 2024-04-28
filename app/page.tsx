import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Page() {
  const { userId } = auth();

  if (userId) return redirect("/dashboard");

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-3">
      <h1 className="text-5xl font-black text-center tracking-tight text-white">
        Turso Platforms Starter
      </h1>
      <p className="text-lg text-white/60">
        <Link href="/sign-in" className="underline text-[#4FF8D2]">
          Sign in
        </Link>{" "}
        or{" "}
        <Link href="/sign-up" className="underline text-[#4FF8D2]">
          register
        </Link>{" "}
        to get your own account and database
      </p>
    </div>
  );
}
