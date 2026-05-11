import { getCart } from "@/lib/cart";
import Link from "next/link";

export default async function CartPage() {
  const items = await getCart();

  //Berechnet Gesamtpreis aller Cart-Items.
  let total = 0;
  for (const item of items) {
    const price = Number(item.product.price);
    const quantity = item.quantity;

    total += price * quantity;
  }

  return (
  <main>
    <a href="/">← Zurück</a>
    
    <h1>Warenkorb</h1>

    //Wenn warenkorb leer ist.
    {items.length === 0 && (
        <p>
          Dein Warenkorb ist leer.{" "}
          <Link href="/">Produkte ansehen</Link>.
        </p>
      )}



  </main>);
}
