"use server";

import { getCart } from "@/lib/cart";
import { getCurrentDbUser } from "@/lib/auth";

export async function createCheckoutSessionAction(formData: FormData) {
  const cartItems = await getCart();
  
  if (cartItems.length === 0) {
    throw new Error("Cart ist leer.");

  
  const user = await getCurrentDbUser();
  const guestEmailRaw = formData.get("guestEmail");
  const guestEmail =
    typeof guestEmailRaw === "string" && guestEmailRaw ? guestEmailRaw : null;

  if (!user && !guestEmail) {
    throw new Error("Bitte einloggen oder Email angeben.");
  }
  
}
}
