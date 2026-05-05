import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated": {
      const { id, email_addresses, primary_email_address_id } = evt.data;
      const email =
        email_addresses.find((e) => e.id === primary_email_address_id)
          ?.email_address ?? email_addresses[0]?.email_address;

      if (!email) {
        return new Response("User has no email", { status: 400 });
      }

      await prisma.user.upsert({
        where: { clerkId: id },
        create: { clerkId: id, email },
        update: { email },
      });
      break;
    }
    case "user.deleted": {
      if (evt.data.id) {
        await prisma.user
          .delete({ where: { clerkId: evt.data.id } })
          .catch(() => {});
      }
      break;
    }
  }

  return new Response("ok", { status: 200 });
}
