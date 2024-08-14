import { redirect } from "next/navigation";

import { checkDatabaseExists } from "../utils";
import { Header } from "./header";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const databaseExists = await checkDatabaseExists();

  if (!databaseExists) redirect("/welcome");

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-6 py-12">{children}</div>
    </>
  );
}
