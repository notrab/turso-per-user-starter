import { requireUserId } from "@/lib/auth";
import { canDumpDatabases, dumpUserDatabase } from "@/lib/tenancy";

export async function GET() {
  await requireUserId();

  if (!canDumpDatabases()) {
    return new Response("Export isn't supported by this database provider", {
      status: 501,
    });
  }

  try {
    const dump = await dumpUserDatabase();

    return new Response(dump ?? "No data yet");
  } catch (err) {
    console.log("Could not download dump");
    return new Response("Could not download dump", { status: 500 });
  }
}

export const revalidate = 0;
