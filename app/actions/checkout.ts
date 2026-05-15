"use server";

import { getCart } from "@/lib/cart";
import { getCurrentDbUser } from "@/lib/auth";
import { createPendingOrder } from "@/lib/orders";

export async function createCheckoutSessionAction(formData: FormData) {
  // 1. Cart Items holen
  const cartItems = await getCart();
  
  if (cartItems.length === 0) {
    throw new Error("Cart ist leer.");
  }

  // 2. User oder Guest Email holen, bestimmen wer kauft.
  const user = await getCurrentDbUser();
  const guestEmailRaw = formData.get("guestEmail");
  const guestEmail =
    typeof guestEmailRaw === "string" && guestEmailRaw ? guestEmailRaw : null;

  if (!user && !guestEmail) {
    throw new Error("Bitte einloggen oder Email angeben.");
  }

  // 3. Pending Order erstellen mit Cart Items, User oder Guest Email.
  const order = await createPendingOrder({
    userId: user?.id ?? null,
    guestEmail: user ? null : guestEmail,
    items: cartItems.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      priceSnapshot: item.product.price.toString(),
    })),
  });


}

