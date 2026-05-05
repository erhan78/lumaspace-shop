import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@/app/generated/prisma/client";

/**
 * Returns the DB User row for the current Clerk session, or null if signed out.
 * Lazily upserts the row if it doesn't exist yet — safe fallback when the
 * Clerk webhook isn't configured (e.g. local dev without a public tunnel).
 */
export async function getCurrentDbUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existing) return existing;

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;
  if (!clerkUser || !email) return null;

  return prisma.user.upsert({
    where: { clerkId: userId },
    create: { clerkId: userId, email },
    update: { email },
  });
}

export async function requireAdmin(): Promise<User> {
  const user = await getCurrentDbUser();
  if (!user || user.role !== "ADMIN") {
    throw new Response("Forbidden", { status: 403 });
  }
  return user;
}
