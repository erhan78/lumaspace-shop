import { getCart } from "@/lib/cart";


export default async function CartPage() {
  const items = await getCart();

  //Berechnet Gesamtpreis aller Cart-Items.
  let total = 0;
  for (const item of items) {
    const price = Number(item.product.price);
    const quantity = item.quantity;

    total += price * quantity;
  }

  return <main></main>
}
