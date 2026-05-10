"use server";

// Server Actions für den Warenkorb:
// Diese Datei stellt serverseitige Action-Funktionen bereit, die von Formularen
// im Frontend aufgerufen werden. Sie lesen FormData, validieren Eingaben,
// rufen die eigentliche Cart-Business-Logik (lib/cart) auf und sorgen danach
// mit revalidatePath für ein Neurendern der Cart-Seite bzw. mit redirect
// für Navigation. Keine DB oder Cookie-Logik hier, nur Steuerung.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addToCart,
  removeFromCart,
  setCartItemQuantity,
} from "@/lib/cart";

//Produkt zum Cart hinzufügen oder Menge erhöhen, wenn schon vorhanden.
export async function addToCartAction(formData: FormData) {
  const productId = formData.get("productId");
  const variantId = formData.get("variantId");
  const quantityRaw = formData.get("quantity");


  if (typeof productId !== "string" || !productId) {
    throw new Error("Missing productId");
  }

  //Menge validieren, mindestens 1.
  const quantity = Math.max(1, Number(quantityRaw) || 1);

  //
  await addToCart({
    productId,
    //variantId ist optional, wenn Produkt keine Varianten hat.
    variantId: typeof variantId === "string" && variantId ? variantId : null,
    quantity,
  });

  //Nach dem Hinzufügen, Cart setie neu rendern.
  revalidatePath("/cart");
  redirect("/cart");
}

//fehlend: removeFromCartAction, setCartItemQuantityAction