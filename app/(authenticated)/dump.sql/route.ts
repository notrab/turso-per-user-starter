import { requireUserId } from "@/lib/auth";
import { dumpUserDatabase } from "@/lib/tenancy";

export async function GET() {
  await requireUserId();

  try {
    const dump = await dumpUserDatabase();

    if (dump.status === "unsupported") {
      return new Response("Export isn't supported by this database provider", {
        status: 501,
      });
    }

    return new Response(dump.sql ?? "No data yet");
  } catch (err) {
    console.log("Could not download dump");
    return new Response("Could not download dump", { status: 500 });
  }
}

export const revalidate = 0;
