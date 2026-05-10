import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/auth";

//Cookie für Cart, 30 Tage gültig.
const CART_COOKIE = "cart_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

//Cart wird für User oder Session gespeeichert.
type CartScope = { userId: string } | { sessionId: string };


async function readCartScope(): Promise<CartScope | null> {
  //Prüft ob nutzer eingeloggt ist.
  const { userId } = await auth();
  
  //Wenn ja, dann nutze userId als Scope.
  if (userId) {
    const user = await getCurrentDbUser();
    if (user) return { userId: user.id };
  }
  //Wenn nein, dann prüfe nach Session-Cookie.
  const sessionId = (await cookies()).get(CART_COOKIE)?.value;
  if (sessionId) return { sessionId };

  //Wenn beides nd geht wird null gegeben.
  return null;
}
