"use server";

import { getCart } from "@/lib/cart";

export async function createCheckoutSessionAction(formData: FormData) {
  const cartItems = await getCart();
  
  if (cartItems.length === 0) {
    throw new Error("Cart ist leer.");


}
}
