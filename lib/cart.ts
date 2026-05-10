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

//Erstellt neuen Cart-Scope für eingeloggte oder anonyme Nutzer.
async function writeCartScope(): Promise<CartScope> {
  //Prüft ob nutzer eingeloggt ist.
  const { userId } = await auth();
  if (userId) {
    const user = await getCurrentDbUser();
    if (user) return { userId: user.id };
  }

  //Wenn nicht eingeloggt, dann erstelle oder nutze Session-Cookie.
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(CART_COOKIE)?.value;
  //Wenn kein Session-Cookie existiert, dann erstelle neues SessionId und setze Cookie.
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set(CART_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }
  return { sessionId };
}

//Was noch fehlt denke:
//GetCart: Gibt alle Cart-Items für aktuellen Scope zurück.
//AddToCart: Fügt Produkt zum Cart hinzu oder erhöht Menge, wenn schon vorhanden.
//RemoveFromCart: Entfernt Item aus Cart.
//SetCartItemQuantity: Setzt Menge eines Cart-Items oder entfernt es, wenn Menge 0 ist.
//MergeGuestCartIntoUser: Wenn sich ein Gast-Nutzer einloggt, werden seine Cart-Items mit seinem Nutzerkonto verbunden.


//In DB suchen, was für Cart-Items zum aktuellen Scope gehören.
export async function getCart() {
  const scope = await readCartScope();
  if (!scope) return [];
  return prisma.cartItem.findMany({
    where: scope,
    include: { product: true, variant: true },
    orderBy: { id: "asc" },
  });
}

//Produkt zum Cart hinzufügen oder Menge erhöhen, wenn schon vorhanden.
export async function addToCart({
  productId,
  variantId,
  quantity,
}: {
  productId: string;
  variantId: string | null;
  quantity: number;
}) {
  const scope = await writeCartScope();

  //Prüft, ob Item mit gleichem Produkt und Variante schon im Cart ist.
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      ...scope,
      productId,
      variantId,
    },
  });

  if (existingItem) {
    //Wenn ja, dann erhöhe die Menge.
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    //Wenn nein, dann erstelle neues Cart-Item.
    await prisma.cartItem.create({
      data: {
        ...scope,
        productId,
        variantId,
        quantity,
      },
    });
  }
}
