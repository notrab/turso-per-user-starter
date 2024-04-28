import { auth } from "@clerk/nextjs/server";

import { getDumpUrl } from "@/app/utils";

export async function GET() {
  auth().protect();

  const url = getDumpUrl();

  if (!url) return null;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TURSO_DATABASE_GROUP_AUTH_TOKEN}`,
      },
    });

    if (response.ok) {
      const text = await response.text();

      return new Response(text);
    }
  } catch (err) {
    console.log("Could not download dump");
    return new Response("Could not download dump", { status: 500 });
  }
}
